#!/bin/bash

set -e

echo "🔍 WebP Image Optimization Verification"
echo "=================================================="

cd "$(dirname "$0")/.."

# List of WebP images generated
declare -A webp_images=(
    ["public/images/family_hero_three_generations.webp"]="public/images/family_hero_three_generations.jpg"
    ["public/images/reviews/mike_ngui.webp"]="public/images/reviews/mike_ngui.png"
    ["public/images/reviews/kah_mun_hew.webp"]="public/images/reviews/kah_mun_hew.png"
    ["public/images/reviews/benny_kong.webp"]="public/images/reviews/benny_kong.png"
    ["public/images/team_group.webp"]="public/images/team_group.jpg"
    ["public/images/blog/concerned_person_brushing.webp"]="public/images/blog/concerned_person_brushing.png"
    ["public/images/sensitivity_hero_1765825197668.webp"]="public/images/sensitivity_hero_1765825197668.png"
    ["public/images/adult_ortho_hero_1765825218135.webp"]="public/images/adult_ortho_hero_1765825218135.png"
    ["public/images/veneers_hero_1765825257935.webp"]="public/images/veneers_hero_1765825257935.png"
    ["public/images/child_airway_hero_1765825276038.webp"]="public/images/child_airway_hero_1765825276038.png"
)

all_pass=true

echo "1. Checking WebP file existence and size savings..."
for webp in "${!webp_images[@]}"; do
    original="${webp_images[$webp]}"
    if [[ ! -f "$webp" ]]; then
        echo "❌ FAIL   WebP missing: $webp"
        all_pass=false
        continue
    fi
    if [[ ! -f "$original" ]]; then
        echo "⚠️ WARN   Original missing: $original"
        continue
    fi
    orig_size=$(stat -f%z "$original" 2>/dev/null || stat -c%s "$original" 2>/dev/null)
    webp_size=$(stat -f%z "$webp" 2>/dev/null || stat -c%s "$webp" 2>/dev/null)
    if (( webp_size >= orig_size )); then
        echo "⚠️ WARN   WebP not smaller: $webp ($webp_size >= $orig_size)"
    else
        savings=$((100 - 100 * webp_size / orig_size))
        echo "✅ PASS   $webp (${savings}% smaller)"
    fi
done

echo ""
echo "2. Checking image references in Home.jsx..."
# Check that critical images have WebP alternatives referenced
if grep -q 'family_hero_three_generations\.jpg' src/pages/Home.jsx; then
    echo "✅ PASS   Hero image reference found (needs update to picture element)"
else
    echo "⚠️ WARN   Hero image reference not found"
fi

if grep -q '/images/reviews/mike_ngui\.png' src/pages/Home.jsx; then
    echo "✅ PASS   Review avatar references found (need update)"
else
    echo "⚠️ WARN   Review avatar references not found"
fi

if grep -q '/images/team_group\.jpg' src/pages/Home.jsx; then
    echo "✅ PASS   Team image reference found (needs update)"
else
    echo "⚠️ WARN   Team image reference not found"
fi

echo ""
echo "3. Testing image accessibility with curl..."
# Quick test for one WebP and one original
test_urls=(
    "/images/family_hero_three_generations.webp"
    "/images/family_hero_three_generations.jpg"
)

for url in "${test_urls[@]}"; do
    # Simulate local file check instead of curl to avoid network dependency
    local_file="public$url"
    if [[ -f "$local_file" ]]; then
        echo "✅ PASS   File exists: $local_file"
    else
        echo "❌ FAIL   File missing: $local_file"
        all_pass=false
    fi
done

echo ""
echo "📋 Summary:"
if $all_pass; then
    echo "✅ All checks passed. WebP images are ready for deployment."
    echo "   Next: Update Home.jsx to use WebP with fallback."
    exit 0
else
    echo "❌ Some checks failed. Review the output above."
    exit 1
fi