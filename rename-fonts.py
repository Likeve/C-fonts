#!/usr/bin/env python3
"""Rename font files to their Full name (nameID=4) from TTF metadata, and update fonts.json."""

import os, json, glob, re
from fontTools.ttLib import TTFont

FONTS_DIR = "public/fonts"
JSON_PATH = "src/data/fonts.json"

def sanitize_filename(name):
    """Remove characters illegal in filenames."""
    # Replace illegal chars with empty string
    name = re.sub(r'[<>:"/\\|?*]', '', name)
    # Remove leading/trailing whitespace and dots
    name = name.strip('. ')
    return name

def get_ttf_full_name(filepath):
    """Extract nameID=4 (Full name) from a TTF file."""
    try:
        font = TTFont(filepath)
        for record in font['name'].names:
            if record.nameID == 4:
                try:
                    return record.toUnicode()
                except:
                    pass
    except Exception as e:
        print(f"  ERROR reading {os.path.basename(filepath)}: {e}")
    return None

def main():
    # Load fonts.json
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        fonts_data = json.load(f)

    ttf_files = sorted(glob.glob(f'{FONTS_DIR}/*.ttf'))
    print(f"Found {len(ttf_files)} TTF files\n")

    # Build a mapping: old_filename (just basename) -> (current_path, new_name)
    # Also build a mapping from current path to font entry
    font_map = {}
    for font_entry in fonts_data['fonts']:
        # fontPath is like "fonts/WDXL 滑油字 SC.ttf"
        basename = os.path.basename(font_entry['fontPath'])
        font_map[basename] = font_entry

    skip_count = 0
    rename_count = 0
    for ttf_path in ttf_files:
        old_basename = os.path.basename(ttf_path)
        old_stem = os.path.splitext(old_basename)[0]

        full_name = get_ttf_full_name(ttf_path)
        if not full_name:
            print(f"  SKIP: {old_basename} (could not read Full name)")
            skip_count += 1
            continue

        new_basename = sanitize_filename(full_name) + ".ttf"

        if new_basename == old_basename:
            print(f"  OK: {old_basename} (already matches Full name)")
            skip_count += 1
            continue

        new_path = os.path.join(FONTS_DIR, new_basename)

        # Check if target filename already exists
        if os.path.exists(new_path) and new_path != ttf_path:
            print(f"  SKIP: {old_basename} -> {new_basename} (target already exists)")
            skip_count += 1
            continue

        # Rename file
        old_path = ttf_path
        os.rename(old_path, new_path)
        rename_count += 1
        print(f"  RENAME: {old_basename} -> {new_basename}")

        # Update fonts.json entry
        if old_basename in font_map:
            entry = font_map[old_basename]
            entry['fontPath'] = f"fonts/{new_basename}"
        else:
            print(f"    WARNING: {old_basename} not found in fonts.json")

    # Write updated fonts.json
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(fonts_data, f, ensure_ascii=False, indent=2)

    print(f"\nDone! Renamed: {rename_count}, Skipped: {skip_count}")
    print(f"fonts.json updated.")

if __name__ == '__main__':
    main()
