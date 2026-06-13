const fs = require("fs");
const path = require("path");

const SRC = "/Users/kevin/Desktop/websites/Chinese font/中文/font-site/src";

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // Remove all dark: prefixed tailwind classes: dark:xxx and dark:xxx/yy
  // Matches patterns like: dark:text-zinc-100, dark:bg-zinc-900/50, dark:hover:bg-zinc-800
  content = content.replace(/\bdark:[a-z][a-z0-9/:-]*\b/g, "");

  // Clean up: remove double spaces and trailing spaces in className strings
  content = content.replace(/ +/g, " ");
  content = content.replace(/ className=" /g, ' className="');
  content = content.replace(/" $/g, '"');
  content = content.replace(/className={\` [ ]*/g, "className={`");
  content = content.replace(/ [ ]*\`}/g, "`}");

  fs.writeFileSync(filePath, content, "utf8");
  console.log("  done");
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".next" && entry.name !== ".git") {
      walkDir(fullPath);
    } else if (entry.isFile() && /\.(tsx|ts|css)$/.test(entry.name)) {
      processFile(fullPath);
    }
  }
}

walkDir(SRC);
console.log("Done!");
