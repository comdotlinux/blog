#!/usr/bin/env bash
# Builds the blog with the Spike 1 fixture and Sveltia's golden new entry as posts,
# then checks that the rendered HTML keeps the blog's Markdown dialect.
# Restores without deleting: added posts are moved to .trash/<timestamp>-cms-compat/.
set -euo pipefail

cms_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
root="$(cd "$cms_dir/.." && pwd)"
posts="$root/src/content/posts"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
declare -A sources=(
  [zz-cms-compat-fixture]="$cms_dir/test/fixtures/compat-post.md"
  [zz-cms-compat-new]="$cms_dir/test/fixtures/golden/spike-compat-new-b.md"
)

for slug in "${!sources[@]}"; do
  if [ -e "$posts/$slug.md" ]; then
    echo "refusing to overwrite $posts/$slug.md" >&2
    exit 1
  fi
done

restore() {
  local trash="$root/.trash/$stamp-cms-compat"
  mkdir -p "$trash"
  for slug in "${!sources[@]}"; do
    if [ -e "$posts/$slug.md" ]; then
      mv "$posts/$slug.md" "$trash/"
      echo "- $stamp: cms compat-check moved src/content/posts/$slug.md to .trash/$stamp-cms-compat/" >> "$root/.trash/MOVED.md"
    fi
  done
}
trap restore EXIT

for slug in "${!sources[@]}"; do cp "${sources[$slug]}" "$posts/$slug.md"; done

(cd "$root" && bun run build)

failures=0
check() {
  local name="$1" actual="$2" op="$3" expected="$4"
  if [ "$actual" "$op" "$expected" ]; then
    echo "ok   $name ($actual)"
  else
    echo "FAIL $name ($actual, expected $op $expected)"
    failures=$((failures + 1))
  fi
}

for slug in "${!sources[@]}"; do
  html="$root/dist/posts/$slug/index.html"
  echo "== $slug"
  check "table" "$(grep -c '<table' "$html" || true)" -ge 1
  check "file label hello.ts" "$(grep -c 'hello.ts' "$html" || true)" -ge 1
  check "callout" "$(grep -o '<div[^>]*class="callout' "$html" | wc -l)" -ge 1
  check "image /assets/20221126/" "$(grep -o '<img[^>]*/assets/20221126/' "$html" | wc -l)" -ge 1
  check "no Markdoc tags" "$(grep -c '{%' "$html" || true)" -eq 0
done

[ "$failures" -eq 0 ] || { echo "$failures compat check(s) failed"; exit 1; }
echo "compat checks passed"
