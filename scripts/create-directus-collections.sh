#!/bin/bash

DIRECTUS_URL="https://db.drawday.app"
TOKEN="mNjKgq86jnVokcdwBRKkXgrHEoROvR04"

echo "======================================"
echo "Directus Schema Implementation Script"
echo "======================================"

# Function to create a collection
create_collection() {
  local collection=$1
  local icon=$2
  local note=$3

  echo ""
  echo "Creating collection: $collection"

  response=$(curl -s -X POST "$DIRECTUS_URL/collections" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"collection\": \"$collection\",
      \"meta\": {
        \"icon\": \"$icon\",
        \"note\": \"$note\",
        \"accountability\": \"all\",
        \"singleton\": false
      }
    }")

  if echo "$response" | grep -q "errors"; then
    echo "✗ Failed to create collection $collection"
    echo "$response"
  else
    echo "✓ Created collection $collection"
  fi
}

# Function to create a field
create_field() {
  local collection=$1
  local field=$2
  local type=$3
  local interface=$4
  local required=$5
  local note=$6
  local default_value=$7

  echo "  Adding field: $field ($type)"

  request_body="{
    \"field\": \"$field\",
    \"type\": \"$type\",
    \"meta\": {
      \"interface\": \"$interface\",
      \"required\": $required,
      \"note\": \"$note\"
    },
    \"schema\": {"

  if [ -n "$default_value" ]; then
    request_body="$request_body\"default_value\": \"$default_value\""
  fi

  request_body="$request_body}}"

  response=$(curl -s -X POST "$DIRECTUS_URL/fields/$collection" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$request_body")

  if echo "$response" | grep -q "errors"; then
    echo "    ✗ Failed to create field $field"
  else
    echo "    ✓ Created field $field"
  fi
}

# 1. Create spinner_types collection
echo ""
echo "=== Creating spinner_types collection ==="
create_collection "spinner_types" "toys" "Available spinner animation types"

# Add fields to spinner_types
create_field "spinner_types" "id" "integer" "input" "true" "Primary key" ""
create_field "spinner_types" "name" "string" "input" "true" "Display name" ""
create_field "spinner_types" "code" "string" "input" "true" "Internal code (slot_machine, wheel, etc)" ""
create_field "spinner_types" "description" "text" "input-multiline" "false" "Type description" ""
create_field "spinner_types" "default_settings" "json" "input-code" "true" "Default configuration" ""
create_field "spinner_types" "min_participants" "integer" "input" "true" "Minimum participants required" "2"
create_field "spinner_types" "max_participants" "integer" "input" "false" "Maximum participants supported" ""
create_field "spinner_types" "is_active" "boolean" "boolean" "true" "Available for use" "true"
create_field "spinner_types" "is_premium" "boolean" "boolean" "true" "Premium feature flag" "false"
create_field "spinner_types" "sort_order" "integer" "input" "false" "Display order" "0"

# 2. Create column_mappings collection
echo ""
echo "=== Creating column_mappings collection ==="
create_collection "column_mappings" "table_chart" "Saved CSV column mapping configurations"

# Add fields to column_mappings
create_field "column_mappings" "id" "integer" "input" "true" "Primary key" ""
create_field "column_mappings" "user_id" "uuid" "input" "true" "Owner" ""
create_field "column_mappings" "name" "string" "input" "true" "Mapping name" ""
create_field "column_mappings" "description" "text" "input-multiline" "false" "Mapping description" ""
create_field "column_mappings" "mapping_config" "json" "input-code" "true" "Column mapping configuration" ""
create_field "column_mappings" "file_type" "string" "select-dropdown" "false" "csv, xlsx, etc" ""
create_field "column_mappings" "delimiter" "string" "input" "false" "CSV delimiter" ","
create_field "column_mappings" "has_headers" "boolean" "boolean" "true" "File has header row" "true"
create_field "column_mappings" "is_default" "boolean" "boolean" "true" "User's default mapping" "false"
create_field "column_mappings" "usage_count" "integer" "input" "false" "Times used (for sorting)" "0"
create_field "column_mappings" "last_used_at" "timestamp" "datetime" "false" "Last usage timestamp" ""
create_field "column_mappings" "created_at" "timestamp" "datetime" "false" "Creation timestamp" "CURRENT_TIMESTAMP"

# 3. Create saved_spinner_configs collection
echo ""
echo "=== Creating saved_spinner_configs collection ==="
create_collection "saved_spinner_configs" "save" "User-saved spinner configurations"

# Add fields to saved_spinner_configs
create_field "saved_spinner_configs" "id" "integer" "input" "true" "Primary key" ""
create_field "saved_spinner_configs" "user_id" "uuid" "input" "true" "Owner" ""
create_field "saved_spinner_configs" "name" "string" "input" "true" "Configuration name" ""
create_field "saved_spinner_configs" "spinner_type_id" "integer" "input" "true" "Spinner type" ""
create_field "saved_spinner_configs" "config_data" "json" "input-code" "true" "Configuration settings" ""
create_field "saved_spinner_configs" "is_default" "boolean" "boolean" "true" "User's default config" "false"
create_field "saved_spinner_configs" "thumbnail" "uuid" "file-image" "false" "Preview thumbnail" ""
create_field "saved_spinner_configs" "created_at" "timestamp" "datetime" "false" "Creation timestamp" "CURRENT_TIMESTAMP"
create_field "saved_spinner_configs" "updated_at" "timestamp" "datetime" "false" "Last update" "CURRENT_TIMESTAMP"

# 4. Create draw_history collection
echo ""
echo "=== Creating draw_history collection ==="
create_collection "draw_history" "history" "Audit trail of all draws conducted"

# Add fields to draw_history
create_field "draw_history" "id" "integer" "input" "true" "Primary key" ""
create_field "draw_history" "competition_id" "integer" "input" "true" "Competition drawn from" ""
create_field "draw_history" "winner_data" "json" "input-code" "true" "Winner details snapshot" ""
create_field "draw_history" "draw_number" "integer" "input" "true" "Sequential draw number" ""
create_field "draw_history" "drawn_at" "timestamp" "datetime" "true" "Draw timestamp" "CURRENT_TIMESTAMP"
create_field "draw_history" "drawn_by" "uuid" "input" "true" "User who conducted draw" ""
create_field "draw_history" "spinner_config" "json" "input-code" "false" "Spinner settings used" ""
create_field "draw_history" "notes" "text" "input-multiline" "false" "Draw notes" ""

# 5. Add missing fields to competitions collection
echo ""
echo "=== Adding fields to competitions collection ==="
create_field "competitions" "column_mapping_id" "integer" "input" "false" "Associated column mapping" ""
create_field "competitions" "spinner_config_id" "integer" "input" "false" "Saved spinner configuration" ""
create_field "competitions" "draw_date" "datetime" "datetime" "false" "Scheduled draw date" ""
create_field "competitions" "description" "text" "input-multiline" "false" "Competition description" ""
create_field "competitions" "rules" "text" "input-rich-text-html" "false" "Competition rules" ""
create_field "competitions" "prize_details" "json" "input-code" "false" "Prize information" ""
create_field "competitions" "max_entries" "integer" "input" "false" "Maximum allowed entries" ""
create_field "competitions" "completed_at" "timestamp" "datetime" "false" "Completion timestamp" ""
create_field "competitions" "banner_image_id" "uuid" "file-image" "false" "Banner image reference" ""

# 6. Add missing fields to user_settings collection
echo ""
echo "=== Adding fields to user_settings collection ==="
create_field "user_settings" "default_spinner_type_id" "integer" "input" "false" "Default spinner type" ""
create_field "user_settings" "theme_colors" "json" "input-code" "false" "Custom theme colors" ""
create_field "user_settings" "show_company_name" "boolean" "boolean" "true" "Display company name flag" "false"
create_field "user_settings" "logo_position" "string" "select-dropdown" "false" "left, center, right" "center"
create_field "user_settings" "notification_preferences" "json" "input-code" "false" "Email/notification settings" ""
create_field "user_settings" "locale" "string" "input" "false" "User locale (en-US, etc)" "en-US"
create_field "user_settings" "timezone" "string" "input" "false" "User timezone" "UTC"

echo ""
echo "======================================"
echo "Schema implementation complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Create relationships through Directus Admin UI"
echo "2. Set up proper permissions for each role"
echo "3. Insert default data for spinner types"