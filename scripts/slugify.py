import json, re

with open("src/data/fonts.json") as f:
    data = json.load(f)

def slugify(name):
    s = name.lower().strip()
    s = re.sub(r'[^a-z0-9\s-]', '', s)
    s = re.sub(r'[\s]+', '-', s)
    s = re.sub(r'-+', '-', s)
    s = s.strip('-')
    return s

# Check for duplicate slugs
slugs = {}
ids_changed = 0
for font in data["fonts"]:
    slug = slugify(font["englishName"])
    
    if not slug:
        slug = slugify(font.get("name", "")) or font["id"]
    
    # Handle duplicates
    base = slug
    n = 1
    while slug in slugs:
        n += 1
        slug = f"{base}-{n}"
    
    slugs[slug] = font
    old_id = font["id"]
    font["originalId"] = old_id
    font["id"] = slug
    if old_id != slug:
        ids_changed += 1

# Also add to font data
data["totalFonts"] = len(data["fonts"])

with open("src/data/fonts.json", "w") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Updated {ids_changed} / {len(data['fonts'])} font IDs to English slugs")
print("Sample:")
for i, font in enumerate(data["fonts"][:5]):
    print(f"  {font['originalId']} -> {font['id']}")
