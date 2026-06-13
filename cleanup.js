const fs = require("fs");
const path = require("path");

const SRC = "/Users/kevin/Desktop/websites/Chinese font/中文/font-site/src";

// Only remove the most obvious light-mode remnants that became duplicated
const replacements = [
  [/\bbg-white(?:\/90)?\b/g, ""],
  [/ +/g, " "],
  [/ className=" /g, ' className="'],
  [/" $/g, '"'],
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  for (const [pattern, replacement] of replacements) {
    const newContent = content.replace(pattern, replacement);
    if (newContent !== content) {
      modified = true;
      content = newContent;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log("Updated:", filePath);
  }
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".next") {
      walkDir(fullPath);
    } else if (entry.isFile() && /\.(tsx|ts|css)$/.test(entry.name)) {
      processFile(fullPath);
    }
  }
}

walkDir(SRC);
console.log("Done!");
