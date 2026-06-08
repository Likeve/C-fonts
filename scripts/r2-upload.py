#!/usr/bin/env python3
"""Upload font files to Cloudflare R2 using wrangler."""

import os, glob, subprocess, sys

if len(sys.argv) < 2:
    print("Usage: python3 scripts/r2-upload.py <CLOUDFLARE_API_TOKEN>")
    sys.exit(1)

token = sys.argv[1]
account_id = "91240f4cb86eb18d58e124f1430b9225"
bucket = "chinese-fonts"

print(f"Token loaded ({len(token)} chars)")

fonts_dir = "public/fonts"
files = sorted(glob.glob(f"{fonts_dir}/*.ttf"))
total = len(files)
print(f"Total files: {total}\n")

env = os.environ.copy()
env["CLOUDFLARE_API_TOKEN"] = token
env["CLOUDFLARE_ACCOUNT_ID"] = account_id

success = 0
failed = 0

for i, filepath in enumerate(files, 1):
    filename = os.path.basename(filepath)
    target = f"fonts/{filename}"
    
    result = subprocess.run(
        ["npx", "wrangler", "r2", "object", "put", f"{bucket}/{target}",
         "--file", filepath, "--remote"],
        env=env,
        capture_output=True,
        text=True,
        timeout=120,
    )
    
    if "Upload complete" in result.stdout or "Upload complete" in result.stderr:
        print(f"[{i}/{total}] OK  {filename}")
        success += 1
    else:
        error = result.stderr.strip().split("\n")[-1] if result.stderr else result.stdout[:100]
        print(f"[{i}/{total}] FAIL {filename}  {error}")
        failed += 1

print(f"\nDone! OK: {success}, Failed: {failed}")
