import json, os, glob, shutil

with open("src/data/fonts.json") as f:
    data = json.load(f)

referenced = set(f["fontPath"] for f in data["fonts"])
all_disk = glob.glob("public/fonts/*.ttf")

to_keep = []
to_delete = []

for fp in all_disk:
    basename = os.path.basename(fp)
    if f"fonts/{basename}" in referenced:
        to_keep.append(fp)
    else:
        to_delete.append(fp)

print(f"Referenced (keep): {len(to_keep)}")
print(f"Unreferenced (move to backup): {len(to_delete)}")

backup_dir = "public/fonts-backup"
os.makedirs(backup_dir, exist_ok=True)

for fp in to_delete:
    shutil.move(fp, os.path.join(backup_dir, os.path.basename(fp)))

remaining = len(glob.glob("public/fonts/*.ttf"))
print(f"Remaining in public/fonts: {remaining}")

# Verify no broken references
disk_remaining = set(f"fonts/{os.path.basename(p)}" for p in glob.glob("public/fonts/*.ttf"))
missing = referenced - disk_remaining
print(f"Broken references: {len(missing)}")
if missing:
    for m in list(missing)[:10]:
        print(f"  MISSING: {m}")
