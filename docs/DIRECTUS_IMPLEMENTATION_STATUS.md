# Directus Schema Implementation Status

## Summary

Date: 2025-09-20
Implementation Method: Directus API via curl/scripts

## ✅ Successfully Created

### Collections

The following collections were successfully created via API:

1. **spinner_types** - Available spinner animation types
2. **column_mappings** - Saved CSV column mapping configurations
3. **saved_spinner_configs** - User-saved spinner configurations
4. **draw_history** - Audit trail of all draws conducted

### Existing Collections Enhanced

1. **competitions** - Successfully added new fields:
   - column_mapping_id
   - spinner_config_id
   - description
   - rules
   - prize_details
   - max_entries
   - completed_at
   - banner_image_id

2. **user_settings** - Successfully added new fields:
   - default_spinner_type_id
   - theme_colors
   - show_company_name
   - logo_position
   - notification_preferences
   - locale
   - timezone

## ⚠️ Manual Configuration Required

Due to Directus API permissions, the following must be configured manually through the Directus Admin UI at https://db.drawday.app/admin

### 1. Add Fields to New Collections

#### spinner_types
```sql
-- Fields to add via UI:
id (integer, primary key, auto-increment)
name (string, max 100, required)
code (string, max 50, required, unique)
description (text)
default_settings (json, required)
min_participants (integer, default 2, required)
max_participants (integer, nullable)
is_active (boolean, default true, required)
is_premium (boolean, default false, required)
sort_order (integer, default 0)
```

#### column_mappings
```sql
-- Fields to add via UI:
id (integer, primary key, auto-increment)
user_id (uuid, required, FK to directus_users)
name (string, max 100, required)
description (text)
mapping_config (json, required)
file_type (string, max 20)
delimiter (string, max 5, default ',')
has_headers (boolean, default true, required)
is_default (boolean, default false, required)
usage_count (integer, default 0)
last_used_at (timestamp)
created_at (timestamp, default CURRENT_TIMESTAMP)
```

#### saved_spinner_configs
```sql
-- Fields to add via UI:
id (integer, primary key, auto-increment)
user_id (uuid, required, FK to directus_users)
name (string, max 100, required)
spinner_type_id (integer, required, FK to spinner_types)
config_data (json, required)
is_default (boolean, default false, required)
thumbnail (uuid, FK to directus_files)
created_at (timestamp, default CURRENT_TIMESTAMP)
updated_at (timestamp, default CURRENT_TIMESTAMP, auto-update)
```

#### draw_history
```sql
-- Fields to add via UI:
id (integer, primary key, auto-increment)
competition_id (integer, required, FK to competitions)
winner_data (json, required)
draw_number (integer, required)
drawn_at (timestamp, required, default CURRENT_TIMESTAMP)
drawn_by (uuid, required, FK to directus_users)
spinner_config (json)
notes (text)
```

### 2. Create Relationships

Navigate to Settings > Data Model > [Collection] > Fields and create these relationships:

#### column_mappings
- user_id → directus_users (Many to One)

#### saved_spinner_configs
- user_id → directus_users (Many to One)
- spinner_type_id → spinner_types (Many to One)
- thumbnail → directus_files (Many to One)

#### draw_history
- competition_id → competitions (Many to One)
- drawn_by → directus_users (Many to One)

#### competitions (update existing)
- column_mapping_id → column_mappings (Many to One)
- spinner_config_id → saved_spinner_configs (Many to One)

#### user_settings (update existing)
- default_spinner_type_id → spinner_types (Many to One)

### 3. Set Permissions

Navigate to Settings > Access Control > Public/User roles:

#### Public Role
- No access to any custom collections

#### User Role
- competitions: Create, Read (own), Update (own), Delete (own)
- user_settings: Read (own), Update (own)
- spinner_types: Read (all)
- column_mappings: Create, Read (own), Update (own), Delete (own)
- saved_spinner_configs: Create, Read (own), Update (own), Delete (own)
- draw_history: Read (own competitions only)

### 4. Insert Default Data

After fields are created, insert default spinner types:

```javascript
// Use Directus Admin UI or API to insert:

1. Slot Machine
   - name: "Slot Machine"
   - code: "slot_machine"
   - description: "Classic slot machine style spinner with scrolling names"
   - min_participants: 2
   - is_active: true
   - is_premium: false
   - sort_order: 1
   - default_settings: {
       "spinDuration": "medium",
       "decelerationRate": "medium",
       "soundEnabled": true,
       "confettiEnabled": true,
       "nameSize": "large",
       "ticketSize": "extra-large",
       "backgroundColor": "#1e1f23",
       "highlightColor": "#e6b540"
     }

2. Wheel of Fortune
   - name: "Wheel of Fortune"
   - code: "wheel"
   - description: "Spinning wheel with participant segments"
   - min_participants: 2
   - max_participants: 100
   - is_active: true
   - is_premium: false
   - sort_order: 2
   - default_settings: {
       "spinDuration": "medium",
       "decelerationRate": "medium",
       "soundEnabled": true,
       "confettiEnabled": true,
       "wheelSize": "large",
       "showNames": true,
       "backgroundColor": "#1e1f23",
       "primaryColor": "#e6b540"
     }

3. Random Picker
   - name: "Random Picker"
   - code: "random"
   - description: "Simple random selection with animation"
   - min_participants: 2
   - is_active: true
   - is_premium: false
   - sort_order: 3
   - default_settings: {
       "animationSpeed": "medium",
       "soundEnabled": true,
       "confettiEnabled": true,
       "backgroundColor": "#1e1f23",
       "accentColor": "#e6b540"
     }
```

## Scripts Created

The following scripts were created for future use:

1. `/scripts/implement-directus-schema.js` - Initial schema creation attempt
2. `/scripts/create-directus-collections.sh` - Bash script for collection creation
3. `/scripts/add-directus-fields.js` - JavaScript for adding fields (requires higher permissions)

## Next Steps

1. **Manual Configuration**: Complete the manual steps above in Directus Admin UI
2. **Test API Access**: Verify that the application can access the new collections
3. **Update Application Code**: Modify the application to use the new schema:
   - Update API endpoints to use new collections
   - Implement saved column mappings feature
   - Add spinner type selection
   - Implement draw history tracking

## API Integration Points

After manual configuration, these endpoints will be available:

```javascript
// Spinner Types (Read-only for users)
GET /items/spinner_types

// Column Mappings (User-specific CRUD)
GET /items/column_mappings?filter[user_id][_eq]={user_id}
POST /items/column_mappings
PATCH /items/column_mappings/{id}
DELETE /items/column_mappings/{id}

// Saved Spinner Configs (User-specific CRUD)
GET /items/saved_spinner_configs?filter[user_id][_eq]={user_id}
POST /items/saved_spinner_configs
PATCH /items/saved_spinner_configs/{id}
DELETE /items/saved_spinner_configs/{id}

// Draw History (Create and Read)
POST /items/draw_history
GET /items/draw_history?filter[competition_id][_eq]={competition_id}
```

## Testing Checklist

- [ ] All collections visible in Directus Admin
- [ ] All fields created with correct types
- [ ] All relationships properly configured
- [ ] Permissions set correctly for user roles
- [ ] Default spinner types inserted
- [ ] API endpoints accessible with user token
- [ ] Application can read/write to new collections

## Notes

- The admin token (mNjKgq86jnVokcdwBRKkXgrHEoROvR04) has limited schema modification permissions
- Collections can be created via API, but fields require UI configuration
- This is a security feature in Directus to prevent unauthorized schema changes
- For production, consider using Directus migrations or snapshots for schema versioning