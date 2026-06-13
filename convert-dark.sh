#!/bin/bash
set -e

SRC="/Users/kevin/Desktop/websites/Chinese font/中文/font-site/src"

find "$SRC" \( -name '*.tsx' -o -name '*.ts' -o -name '*.css' \) -exec grep -l 'dark:' {} \; | while IFS= read -r f; do
  echo "Processing: $f"

  sed -i '' \
    -e 's/bg-white dark:bg-zinc-900/bg-zinc-900/g' \
    -e 's/bg-white dark:bg-zinc-800/bg-zinc-800/g' \
    -e 's/bg-zinc-50 dark:bg-zinc-900/bg-zinc-900/g' \
    -e 's/bg-zinc-50 dark:bg-zinc-950/bg-zinc-950/g' \
    -e 's/bg-zinc-100 dark:bg-zinc-800/bg-zinc-800/g' \
    -e 's/bg-zinc-200 dark:bg-zinc-700/bg-zinc-700/g' \
    -e 's/bg-zinc-200 dark:bg-zinc-800/bg-zinc-800/g' \
    -e 's/text-white dark:text-zinc-900/text-zinc-900/g' \
    -e 's/text-zinc-900 dark:text-zinc-100/text-zinc-100/g' \
    -e 's/text-zinc-800 dark:text-zinc-200/text-zinc-200/g' \
    -e 's/text-zinc-600 dark:text-zinc-400/text-zinc-400/g' \
    -e 's/text-zinc-500 dark:text-zinc-400/text-zinc-400/g' \
    -e 's/text-zinc-300 dark:text-zinc-600/text-zinc-600/g' \
    -e 's/border-zinc-200 dark:border-zinc-800/border-zinc-800/g' \
    -e 's/border-zinc-300 dark:border-zinc-700/border-zinc-700/g' \
    -e 's/border-zinc-100 dark:border-zinc-700/border-zinc-700/g' \
    -e 's/border-zinc-200 dark:border-zinc-700/border-zinc-700/g' \
    -e 's/divide-zinc-100 dark:divide-zinc-800/divide-zinc-800/g' \
    -e 's/ring-white dark:ring-zinc-900/ring-zinc-900/g' \
    -e 's/hover:bg-zinc-50 dark:hover:bg-zinc-800/hover:bg-zinc-800/g' \
    -e 's/hover:bg-zinc-50 dark:hover:bg-zinc-700/hover:bg-zinc-700/g' \
    -e 's/hover:bg-zinc-100 dark:hover:bg-zinc-800/hover:bg-zinc-800/g' \
    -e 's/hover:bg-zinc-100 dark:hover:bg-zinc-700/hover:bg-zinc-700/g' \
    -e 's/hover:bg-zinc-200 dark:hover:bg-zinc-700/hover:bg-zinc-700/g' \
    -e 's/hover:text-zinc-700 dark:hover:text-zinc-200/hover:text-zinc-200/g' \
    -e 's/hover:text-zinc-800 dark:hover:text-zinc-200/hover:text-zinc-200/g' \
    -e 's/hover:text-zinc-600 dark:hover:text-zinc-300/hover:text-zinc-300/g' \
    -e 's/hover:text-zinc-600 dark:hover:text-zinc-400/hover:text-zinc-400/g' \
    -e 's/hover:border-zinc-300 dark:hover:border-zinc-700/hover:border-zinc-700/g' \
    -e 's/hover:border-zinc-400 dark:hover:border-zinc-500/hover:border-zinc-500/g' \
    -e 's/hover:ring-zinc-200 dark:hover:ring-zinc-700/hover:ring-zinc-700/g' \
    -e 's/focus:border-zinc-400 dark:focus:border-zinc-500/focus:border-zinc-500/g' \
    -e 's/focus:ring-zinc-200 dark:focus:ring-zinc-700/focus:ring-zinc-700/g' \
    -e 's/border-t-zinc-600 dark:border-t-zinc-400/border-t-zinc-400/g' \
    -e 's/border-t-white dark:border-t-zinc-900/border-t-zinc-900/g' \
    -e 's/border-white\/30 dark:border-zinc-900\/30/border-zinc-900\/30/g' \
    -e 's/bg-amber-100 dark:bg-amber-900\/30/bg-amber-900\/30/g' \
    -e 's/text-amber-700 dark:text-amber-400/text-amber-400/g' \
    -e 's/text-green-600 dark:text-green-400/text-green-400/g' \
    -e 's/text-blue-600 dark:text-blue-400/text-blue-400/g' \
    -e 's/hover:bg-zinc-50 dark:hover:bg-zinc-900\/50/hover:bg-zinc-900\/50/g' \
    "$f"

  sed -i '' 's/dark:\([a-z][a-z0-9/-]*\)/\1/g' "$f"
done

echo "Done!"
