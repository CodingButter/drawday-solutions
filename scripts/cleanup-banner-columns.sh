#!/bin/bash

# Script to remove redundant banner_image column from competitions collection
# The correct column is banner_image_id (UUID type for file references)

DIRECTUS_URL="https://db.drawday.app"
ADMIN_TOKEN="mNjKgq86jnVokcdwBRKkXgrHEoROvR04"

echo "Cleaning up redundant banner columns in competitions collection..."

# Delete the redundant banner_image field (if it exists)
echo "Removing redundant banner_image field..."
curl -X DELETE \
  "${DIRECTUS_URL}/fields/competitions/banner_image" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json"

echo ""
echo "Cleanup complete. The competitions collection now only uses banner_image_id for banner references."
echo ""
echo "Current structure:"
echo "- banner_image_id: UUID field for Directus file references"
echo "- Frontend uses 'bannerImageId' which maps to 'banner_image_id' in the API"