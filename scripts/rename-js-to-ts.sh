#!/bin/zsh

echo "finding .js files with jsx content..."
jsFilesWithJsx=($(npx eslint-nibble --rule "react/jsx-filename-extension" --no-interactive --format "compact" ./source/**/*.js | awk -F ':' '/\.js/ {print $1}'))

for file in $jsFilesWithJsx; do
    dirname=$(dirname $file)
    filename=$(basename $file)
    nameNoExt=${filename%.*}
    newfile="$dirname/$nameNoExt.tsx"
    echo "js(x): $file -> $newfile"
    mv $file $newfile
done

echo "finding .js files..."
jsFiles=($(find ./source -name "*.js"))

for file in $jsFiles; do
    dirname=$(dirname $file)
    filename=$(basename $file)
    nameNoExt=${filename%.*}
    newfile="$dirname/$nameNoExt.ts"
    echo "js: $file -> $newfile"
    mv $file $newfile
done

echo ""
echo "done"
