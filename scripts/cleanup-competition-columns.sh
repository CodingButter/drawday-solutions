#!/bin/bash

# Script to remove ALL redundant columns from competitions collection
# We only need banner_image_id for Directus file references

DIRECTUS_URL="https://db.drawday.app"
ADMIN_TOKEN="mNjKgq86jnVokcdwBRKkXgrHEoROvR04"

echo "==================================="
echo "Cleaning up competitions collection"
echo "==================================="
echo ""

# List of redundant fields to remove
FIELDS_TO_REMOVE=(
  "banner_image"
  "logo_image"
  "bannerImageId"
  "bannerImage"
)

# Remove each redundant field
for field in "${FIELDS_TO_REMOVE[@]}"; do
  echo "Attempting to remove field: $field"

  response=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE \
    "${DIRECTUS_URL}/fields/competitions/${field}" \
    -H "Authorization: Bearer ${ADMIN_TOKEN}" \
    -H "Content-Type: application/json")

  if [ "$response" = "204" ] || [ "$response" = "200" ]; then
    echo "  ✅ Successfully removed: $field"
  elif [ "$response" = "404" ]; then
    echo "  ⏭️  Field doesn't exist: $field (skipping)"
  else
    echo "  ❌ Failed to remove: $field (HTTP $response)"
  fi
  echo ""
done

echo "==================================="
echo "Fetching current competition fields..."
echo "==================================="

# Get current fields to verify cleanup
echo ""
echo "Current fields in competitions collection:"
curl -s "${DIRECTUS_URL}/fields/competitions" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" | \
  python3 -m json.tool 2>/dev/null | grep '"field"' | grep -v '"id"' | head -20 || \
  echo "Unable to parse JSON response"

echo ""
echo "==================================="
echo "Cleanup complete!"
echo "==================================="
echo ""
echo "The competitions collection should now only have:"
echo "  ✅ banner_image_id - UUID field for Directus file references"
echo ""
echo "Frontend mapping:"
echo "  - Frontend uses 'bannerImageId' which maps to 'banner_image_id' in the API"
echo "  - Images are accessed via /api/assets/{uuid} proxy for authentication"