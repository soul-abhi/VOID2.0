#!/usr/bin/env python3
"""Downscale base64-embedded raster images inside an SVG.

SVG <image> elements scale their raster payload to the element box, so
shrinking the payload does not change layout. Uses ffmpeg (no Pillow needed).
"""
import base64
import re
import subprocess
import sys
import tempfile
from pathlib import Path

PATTERN = re.compile(r"data:image/(png|jpe?g);base64,([A-Za-z0-9+/=]+)")


def reencode(raw: bytes, ext: str, max_dim: int) -> bytes:
    with tempfile.TemporaryDirectory() as td:
        src = Path(td) / f"in.{ext}"
        dst = Path(td) / f"out.{ext}"
        src.write_bytes(raw)
        scale = f"scale='min({max_dim},iw)':-2:flags=lanczos"
        args = ["ffmpeg", "-y", "-v", "error", "-i", str(src), "-vf", scale]
        args += ["-compression_level", "100"] if ext == "png" else ["-q:v", "4"]
        subprocess.run(args + [str(dst)], check=True)
        return dst.read_bytes()


def main() -> int:
    if len(sys.argv) != 3:
        print(f"usage: {sys.argv[0]} <svg> <max-dim>", file=sys.stderr)
        return 2

    path, max_dim = Path(sys.argv[1]), int(sys.argv[2])
    if not path.is_file():
        print(f"  skip (missing): {path}")
        return 0

    svg = path.read_text()
    before = len(svg.encode())
    saved = 0

    def replace(match: re.Match) -> str:
        nonlocal saved
        mime, b64 = match.group(1), match.group(2)
        ext = "png" if mime == "png" else "jpg"
        raw = base64.b64decode(b64)
        try:
            new = reencode(raw, ext, max_dim)
        except subprocess.CalledProcessError:
            return match.group(0)
        if len(new) >= len(raw):
            return match.group(0)
        saved += len(raw) - len(new)
        return f"data:image/{mime};base64,{base64.b64encode(new).decode()}"

    out = PATTERN.sub(replace, svg)
    if saved == 0:
        print(f"  {path} {before // 1024}KB (kept, already optimal)")
        return 0

    path.write_text(out)
    print(f"  {path} {before // 1024}KB -> {len(out.encode()) // 1024}KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
