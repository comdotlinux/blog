#!/usr/bin/env bash
# Guards post changes against CMS serializer damage (plan pre-mortem scenario 1).
# Usage: content-guard.sh [base-sha]. Without a usable base, every post is checked.
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"
base="${1:-}"
failures=0
fail() { echo "FAIL $*"; failures=$((failures + 1)); }

if grep -rn '{%' src/content/posts; then
  fail "Markdoc tags ({%) in src/content/posts"
fi

if [ -n "$base" ] && [ "$base" != "0000000000000000000000000000000000000000" ] && git cat-file -e "$base^{commit}" 2>/dev/null; then
  mapfile -t changed < <(git diff --name-only --diff-filter=AM "$base" HEAD -- 'src/content/posts/*.md' 'src/content/posts/*.mdx')
  diff_text="$(git diff "$base" HEAD -- src/content/posts)"
  while IFS= read -r removed; do
    [ -z "$removed" ] && continue
    grep -qxF "+${removed:1}" <<<"$diff_text" || fail "fence label removed and not re-added: ${removed:1}"
  done < <(grep -E '^-```.*file=' <<<"$diff_text" || true)
else
  mapfile -t changed < <(git ls-files 'src/content/posts/*.md' 'src/content/posts/*.mdx')
fi

for file in "${changed[@]}"; do
  frontmatter="$(awk 'NR==1 && $0!="---" {exit} NR>1 && $0=="---" {exit} NR>1 {print}' "$file")"
  [ -n "$frontmatter" ] || { fail "$file: no frontmatter"; continue; }
  grep -qE '^pubDatetime: ' <<<"$frontmatter" || fail "$file: no pubDatetime"
  grep -qE '^title: ' <<<"$frontmatter" || fail "$file: no title"
  grep -qE '^description: ' <<<"$frontmatter" || fail "$file: no description"
  if grep -nE ":[[:space:]]*(''|\"\")[[:space:]]*$" <<<"$frontmatter"; then
    fail "$file: empty string value in frontmatter"
  fi
done

echo "checked ${#changed[@]} post file(s)"
[ "$failures" -eq 0 ] || { echo "$failures content-guard check(s) failed"; exit 1; }
echo "content-guard passed"
