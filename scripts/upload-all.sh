#!/bin/bash
set -e

# Read token from .env.local
TOKEN=$(grep CLOUDFLARE_API_TOKEN .env.local | cut -d '=' -f2)
export CLOUDFLARE_API_TOKEN="$TOKEN"
export CLOUDFLARE_ACCOUNT_ID="91240f4cb86eb18d58e124f1430b9225"

BUCKET="chinese-fonts"
FONTS_DIR="public/fonts"

count=0
total=$(ls "$FONTS_DIR"/*.ttf 2>/dev/null | wc -l | tr -d ' ')
failed=0

echo "Total files: $total"
echo ""

for file in "$FONTS_DIR"/*.ttf; do
  [ -f "$file" ] || continue
  count=$((count + 1))
  filename=$(basename "$file")
  target="fonts/$filename"
  
  printf "[%d/%d] %s ... " "$count" "$total" "$filename"
  
  if npx wrangler r2 object put "$BUCKET/$target" --file "$file" --remote 2>&1 | grep -q "Upload complete"; then
    echo "OK"
  else
    echo "FAILED"
    failed=$((failed + 1))
  fi
done

echo ""
echo "Done! Uploaded: $count, Failed: $failed"
