const fs = require("fs");
const path = require("path");

const SRC = "/Users/kevin/Desktop/websites/Chinese font/中文/font-site/src";

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // Clean trailing spaces inside className strings
  content = content.replace(/className="([^"]*?) "/g, 'className="$1"');
  content = content.replace(/className='([^']*?) '/g, "className='$1'");
  // Clean leading spaces
  content = content.replace(/className=" ([^"]*)"/g, 'className="$1"');
  // Clean double spaces inside classNames
  content = content.replace(/"([^"]*?) {2,}([^"]*?)"/g, (m, a, b) => `"${a} ${b}"`);
  // Recursively clean multiple spaces
  while (content.match(/"([^"]*?)  ([^"]*?)"/)) {
    content = content.replace(/"([^"]*?)  ([^"]*?)"/g, '"$1 $2"');
  }

  fs.writeFileSync(filePath, content, "utf8");
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
