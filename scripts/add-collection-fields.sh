#!/bin/bash

TOKEN="mNjKgq86jnVokcdwBRKkXgrHEoROvR04"
DIRECTUS_URL="https://db.drawday.app"

# Function to add a field
add_field() {
  local collection=$1
  local field_json=$2

  echo "Adding field to $collection..."
  curl -X POST "$DIRECTUS_URL/fields/$collection" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$field_json"
  echo ""
}

echo "Adding fields to spinner_types..."

# spinner_types fields
add_field "spinner_types" '{
  "field": "name",
  "type": "string",
  "meta": {"interface": "input", "required": true},
  "schema": {"max_length": 100}
}'

add_field "spinner_types" '{
  "field": "code",
  "type": "string",
  "meta": {"interface": "input", "required": true},
  "schema": {"max_length": 50, "is_unique": true}
}'

add_field "spinner_types" '{
  "field": "description",
  "type": "text",
  "meta": {"interface": "input-multiline"},
  "schema": {}
}'

add_field "spinner_types" '{
  "field": "default_settings",
  "type": "json",
  "meta": {"interface": "input-code", "options": {"language": "json"}, "required": true},
  "schema": {}
}'

add_field "spinner_types" '{
  "field": "min_participants",
  "type": "integer",
  "meta": {"interface": "input", "required": true},
  "schema": {"default_value": 2}
}'

add_field "spinner_types" '{
  "field": "max_participants",
  "type": "integer",
  "meta": {"interface": "input"},
  "schema": {}
}'

add_field "spinner_types" '{
  "field": "is_active",
  "type": "boolean",
  "meta": {"interface": "boolean", "required": true},
  "schema": {"default_value": true}
}'

add_field "spinner_types" '{
  "field": "is_premium",
  "type": "boolean",
  "meta": {"interface": "boolean", "required": true},
  "schema": {"default_value": false}
}'

add_field "spinner_types" '{
  "field": "sort_order",
  "type": "integer",
  "meta": {"interface": "input"},
  "schema": {"default_value": 0}
}'

echo "Adding fields to column_mappings..."

add_field "column_mappings" '{
  "field": "user_id",
  "type": "uuid",
  "meta": {"interface": "select-dropdown-m2o", "required": true},
  "schema": {}
}'

add_field "column_mappings" '{
  "field": "name",
  "type": "string",
  "meta": {"interface": "input", "required": true},
  "schema": {"max_length": 100}
}'

add_field "column_mappings" '{
  "field": "description",
  "type": "text",
  "meta": {"interface": "input-multiline"},
  "schema": {}
}'

add_field "column_mappings" '{
  "field": "mapping_config",
  "type": "json",
  "meta": {"interface": "input-code", "options": {"language": "json"}, "required": true},
  "schema": {}
}'

add_field "column_mappings" '{
  "field": "file_type",
  "type": "string",
  "meta": {"interface": "select-dropdown", "options": {"choices": [{"text": "CSV", "value": "csv"}, {"text": "Excel", "value": "xlsx"}]}},
  "schema": {"max_length": 20}
}'

add_field "column_mappings" '{
  "field": "delimiter",
  "type": "string",
  "meta": {"interface": "input"},
  "schema": {"max_length": 5, "default_value": ","}
}'

add_field "column_mappings" '{
  "field": "has_headers",
  "type": "boolean",
  "meta": {"interface": "boolean", "required": true},
  "schema": {"default_value": true}
}'

add_field "column_mappings" '{
  "field": "is_default",
  "type": "boolean",
  "meta": {"interface": "boolean", "required": true},
  "schema": {"default_value": false}
}'

add_field "column_mappings" '{
  "field": "usage_count",
  "type": "integer",
  "meta": {"interface": "input", "readonly": true},
  "schema": {"default_value": 0}
}'

add_field "column_mappings" '{
  "field": "last_used_at",
  "type": "timestamp",
  "meta": {"interface": "datetime"},
  "schema": {}
}'

add_field "column_mappings" '{
  "field": "created_at",
  "type": "timestamp",
  "meta": {"interface": "datetime", "readonly": true, "special": ["date-created"]},
  "schema": {}
}'

echo "Adding fields to saved_spinner_configs..."

add_field "saved_spinner_configs" '{
  "field": "user_id",
  "type": "uuid",
  "meta": {"interface": "select-dropdown-m2o", "required": true},
  "schema": {}
}'

add_field "saved_spinner_configs" '{
  "field": "name",
  "type": "string",
  "meta": {"interface": "input", "required": true},
  "schema": {"max_length": 100}
}'

add_field "saved_spinner_configs" '{
  "field": "spinner_type_id",
  "type": "integer",
  "meta": {"interface": "select-dropdown-m2o", "required": true},
  "schema": {}
}'

add_field "saved_spinner_configs" '{
  "field": "config_data",
  "type": "json",
  "meta": {"interface": "input-code", "options": {"language": "json"}, "required": true},
  "schema": {}
}'

add_field "saved_spinner_configs" '{
  "field": "is_default",
  "type": "boolean",
  "meta": {"interface": "boolean", "required": true},
  "schema": {"default_value": false}
}'

add_field "saved_spinner_configs" '{
  "field": "thumbnail",
  "type": "uuid",
  "meta": {"interface": "file-image"},
  "schema": {}
}'

add_field "saved_spinner_configs" '{
  "field": "created_at",
  "type": "timestamp",
  "meta": {"interface": "datetime", "readonly": true, "special": ["date-created"]},
  "schema": {}
}'

add_field "saved_spinner_configs" '{
  "field": "updated_at",
  "type": "timestamp",
  "meta": {"interface": "datetime", "readonly": true, "special": ["date-updated"]},
  "schema": {}
}'

echo "Adding fields to draw_history..."

add_field "draw_history" '{
  "field": "competition_id",
  "type": "integer",
  "meta": {"interface": "select-dropdown-m2o", "required": true},
  "schema": {}
}'

add_field "draw_history" '{
  "field": "winner_data",
  "type": "json",
  "meta": {"interface": "input-code", "options": {"language": "json"}, "required": true},
  "schema": {}
}'

add_field "draw_history" '{
  "field": "draw_number",
  "type": "integer",
  "meta": {"interface": "input", "required": true},
  "schema": {}
}'

add_field "draw_history" '{
  "field": "drawn_at",
  "type": "timestamp",
  "meta": {"interface": "datetime", "required": true, "readonly": true, "special": ["date-created"]},
  "schema": {}
}'

add_field "draw_history" '{
  "field": "drawn_by",
  "type": "uuid",
  "meta": {"interface": "select-dropdown-m2o", "required": true},
  "schema": {}
}'

add_field "draw_history" '{
  "field": "spinner_config",
  "type": "json",
  "meta": {"interface": "input-code", "options": {"language": "json"}},
  "schema": {}
}'

add_field "draw_history" '{
  "field": "notes",
  "type": "text",
  "meta": {"interface": "input-multiline"},
  "schema": {}
}'

echo "✅ All fields added successfully!"