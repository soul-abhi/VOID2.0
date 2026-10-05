#!/usr/bin/env bash
# One-off asset optimization. Requires ffmpeg. Safe to re-run (idempotent-ish:
# already-small files are left alone by the size guard in shrink()).
set -euo pipefail
cd "$(dirname "$0")/.."

ff() { ffmpeg -y -v error "$@"; }

# Downscale to max WIDTHxHEIGHT (preserving aspect, never upscaling) and re-encode.
shrink() {
  local src="$1" max="$2" q="${3:-4}"
  [ -f "$src" ] || { echo "skip (missing): $src"; return; }
  local before after tmp ext
  before=$(stat -c%s "$src")
  ext="${src##*.}"
  tmp="$(mktemp --suffix=".$ext")"
  case "$ext" in
    jpg|jpeg) ff -i "$src" -vf "scale='min($max,iw)':-2:flags=lanczos" -q:v "$q" -map_metadata -1 "$tmp" ;;
    png)      ff -i "$src" -vf "scale='min($max,iw)':-2:flags=lanczos" -compression_level 100 "$tmp" ;;
    *)        echo "skip (unsupported): $src"; rm -f "$tmp"; return ;;
  esac
  after=$(stat -c%s "$tmp")
  if [ "$after" -lt "$before" ]; then
    mv "$tmp" "$src"
    printf '  %-46s %6dKB -> %5dKB\n' "$src" $((before/1024)) $((after/1024))
  else
    rm -f "$tmp"
    printf '  %-46s %6dKB (kept, already optimal)\n' "$src" $((before/1024))
  fi
}

echo "== 1. removing unreferenced assets =="
UNUSED=(
  "src/assets/video/distro.mp4"
  "src/assets/Crypto.png"
  "src/assets/Kali_svg.svg"
  "src/assets/react.svg"
  "src/assets/0f9e183a12bee7af6da9f9a175c71d3a.svg"
  "src/assets/e4c3a7bd600393b1420b0ffef056534d.svg"
  "src/assets/O_NET Interest Profiler_ Score Report at My Next Move.pdf"
  "src/assets/fonts/c92e08b531692979-s.p.woff2"
  "src/assets/fonts/e8b276476c0ac6fa-s.p.woff2"
  "logo.png"
)
for f in "${UNUSED[@]}"; do
  if [ -e "$f" ]; then
    printf '  removed %-52s %6dKB\n' "$f" $(( $(stat -c%s "$f") / 1024 ))
    rm -f "$f"
  fi
done
rmdir src/assets/video 2>/dev/null || true

echo "== 2. logo -> webp (rendered at 100px tall; 2000x2000 source was overkill) =="
if [ -f src/assets/logo.png ]; then
  ff -i src/assets/logo.png -vf scale=512:512:flags=lanczos \
     -c:v libwebp -quality 90 -compression_level 6 src/assets/logo.webp
  printf '  src/assets/logo.png %dKB -> src/assets/logo.webp %dKB\n' \
    $(( $(stat -c%s src/assets/logo.png) / 1024 )) \
    $(( $(stat -c%s src/assets/logo.webp) / 1024 ))
  # favicon: index.html requests /logo.png, which Vite serves from public/
  ff -i src/assets/logo.png -vf scale=128:128:flags=lanczos -compression_level 100 public/logo.png
  printf '  public/logo.png (favicon, was missing) %dKB\n' $(( $(stat -c%s public/logo.png) / 1024 ))
  rm -f src/assets/logo.png
fi

echo "== 3. shrinking oversized photos =="
shrink src/assets/Alumni.jpg 1600 4
for f in src/assets/achievements/*.jpg; do shrink "$f" 1280 4; done
for f in src/assets/achievements/*.png; do shrink "$f" 1280; done
for f in src/assets/Members/*.jpg; do shrink "$f" 600 4; done
for f in src/assets/Members/*.png; do shrink "$f" 600; done
shrink src/assets/Pirates.png 600
shrink src/assets/Null.png 600

echo "== 4. re-encoding rasters embedded in web.svg (rendered at max 350px) =="
python3 scripts/shrink-svg-embeds.py src/assets/web.svg 512

echo
echo "== done. src/assets is now: =="
du -sh src/assets
