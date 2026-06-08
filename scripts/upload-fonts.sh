#!/bin/bash
set -e

BUCKET="chinese-fonts"
FONTS_DIR=$(cd "$(dirname "$0")/../public/fonts" && pwd -P)
ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-142c22318d084bc4a2f24b06ca44868b}"

count=0
total=$(ls "$FONTS_DIR" | wc -l | tr -d ' ')

for file in "$FONTS_DIR"/*.ttf; do
  count=$((count + 1))
  filename=$(basename "$file")
  echo "[$count/$total] Uploading: $filename"
  CLOUDFLARE_ACCOUNT_ID="$ACCOUNT_ID" npx wrangler r2 object put "$BUCKET/fonts/$filename" --file "$file" --remote
done

echo "Done! Uploaded $count font files to R2 bucket '$BUCKET'"
