#!/usr/bin/env bash
# Convert oversized RGBA PNG photos to WebP and rewrite the JSX imports.
# WebP is lossy here but keeps the alpha channel, so it is safe regardless of
# whether a given image actually uses transparency.
set -euo pipefail
cd "$(dirname "$0")/.."

THRESHOLD_KB=60
converted=0

for src in src/assets/Members/*.png src/assets/achievements/*.png; do
  [ -f "$src" ] || continue
  before=$(stat -c%s "$src")
  [ $((before / 1024)) -ge "$THRESHOLD_KB" ] || continue

  dst="${src%.png}.webp"
  ffmpeg -y -v error -i "$src" -c:v libwebp -quality 86 -compression_level 6 "$dst"
  after=$(stat -c%s "$dst")

  if [ "$after" -ge "$before" ]; then
    rm -f "$dst"
    printf '  %-46s %6dKB (kept as png)\n' "$src" $((before / 1024))
    continue
  fi

  # Point every importer at the new file, then drop the PNG.
  grep -rIl --exclude-dir=.git -F "$(basename "$src")" src \
    | xargs -r sed -i "s|$(basename "$src")|$(basename "$dst")|g"
  rm -f "$src"
  printf '  %-46s %6dKB -> %5dKB  %s\n' "$src" $((before / 1024)) $((after / 1024)) "$(basename "$dst")"
  converted=$((converted + 1))
done

echo "converted $converted file(s)"
