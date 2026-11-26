#!/usr/bin/env bash
# make_transparent.sh
# Usage: ./make_transparent.sh [directory] [fuzz%]
#   directory : path to folder containing PNGs (default: current directory)
#   fuzz%     : color-matching tolerance, 0-100 (default: 10)

set -euo pipefail

DIR="${1:-.}"
FUZZ="${2:-10}"
OUT_DIR="$DIR/transparent"

# Validate directory
if [[ ! -d "$DIR" ]]; then
  echo "Error: '$DIR' is not a directory." >&2
  exit 1
fi

# Check ImageMagick is available
if ! command -v convert &>/dev/null; then
  echo "Error: ImageMagick 'convert' command not found. Please install ImageMagick." >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

shopt -s nullglob
pngs=("$DIR"/*.png)

if [[ ${#pngs[@]} -eq 0 ]]; then
  echo "No PNG files found in '$DIR'."
  exit 0
fi

echo "Processing ${#pngs[@]} PNG file(s) with fuzz=${FUZZ}%..."
echo "Output directory: $OUT_DIR"
echo "---"

for img in "${pngs[@]}"; do
  filename="$(basename "$img")"
  out="$OUT_DIR/$filename"

  echo -n "  $filename ... "
  convert "$img" \
    -fuzz "${FUZZ}%" \
    -transparent white \
    "$out"
  echo "done"
done

echo "---"
echo "All done! Transparent PNGs saved to: $OUT_DIR"
