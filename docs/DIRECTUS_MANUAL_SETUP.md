# Directus Manual Setup Instructions

## ⚠️ IMPORTANT: Fix Required for Collections

The collections were incorrectly created as "folder" collections (virtual collections without database tables). They need to be deleted and recreated properly.

## Steps to Fix Collections in Directus Admin

### 1. Access Directus Admin
- Go to https://db.drawday.app/admin
- Log in with your admin credentials

### 2. Delete Incorrectly Created Collections
Navigate to **Settings > Data Model** and delete these collections if they exist:
- spinner_types
- column_mappings
- saved_spinner_configs
- draw_history

### 3. Create Proper Database-Backed Collections

#### Create `spinner_types` Collection
1. Click **"Create Collection"**
2. **Collection Setup**:
   - Collection Name: `spinner_types`
   - Type: **"Create a New Table"** (NOT "Folder")
   - Primary Key Field: `id` (Integer, Auto-Increment)
3. Click **"Continue in Advanced Field Creation Mode"**
4. Add these fields:
   ```
   - name (String, Required, Max Length: 100)
   - code (String, Required, Unique, Max Length: 50)
   - description (Text)
   - default_settings (JSON, Required)
   - min_participants (Integer, Required, Default: 2)
   - max_participants (Integer, Nullable)
   - is_active (Boolean, Required, Default: true)
   - is_premium (Boolean, Required, Default: false)
   - sort_order (Integer, Default: 0)
   ```

#### Create `column_mappings` Collection
1. Click **"Create Collection"**
2. **Collection Setup**:
   - Collection Name: `column_mappings`
   - Type: **"Create a New Table"** (NOT "Folder")
   - Primary Key Field: `id` (Integer, Auto-Increment)
3. Add these fields:
   ```
   - user_id (UUID, Required, Many-to-One to directus_users)
   - name (String, Required, Max Length: 100)
   - description (Text)
   - mapping_config (JSON, Required)
   - file_type (String, Max Length: 20)
   - delimiter (String, Max Length: 5, Default: ',')
   - has_headers (Boolean, Required, Default: true)
   - is_default (Boolean, Required, Default: false)
   - usage_count (Integer, Default: 0)
   - last_used_at (Timestamp)
   - created_at (Timestamp, Default: CURRENT_TIMESTAMP)
   ```

#### Create `saved_spinner_configs` Collection
1. Click **"Create Collection"**
2. **Collection Setup**:
   - Collection Name: `saved_spinner_configs`
   - Type: **"Create a New Table"** (NOT "Folder")
   - Primary Key Field: `id` (Integer, Auto-Increment)
3. Add these fields:
   ```
   - user_id (UUID, Required, Many-to-One to directus_users)
   - name (String, Required, Max Length: 100)
   - spinner_type_id (Integer, Required, Many-to-One to spinner_types)
   - config_data (JSON, Required)
   - is_default (Boolean, Required, Default: false)
   - thumbnail (UUID, Many-to-One to directus_files)
   - created_at (Timestamp, Default: CURRENT_TIMESTAMP)
   - updated_at (Timestamp, Default: CURRENT_TIMESTAMP, Auto-Update)
   ```

#### Create `draw_history` Collection
1. Click **"Create Collection"**
2. **Collection Setup**:
   - Collection Name: `draw_history`
   - Type: **"Create a New Table"** (NOT "Folder")
   - Primary Key Field: `id` (Integer, Auto-Increment)
3. Add these fields:
   ```
   - competition_id (Integer, Required, Many-to-One to competitions)
   - winner_data (JSON, Required)
   - draw_number (Integer, Required)
   - drawn_at (Timestamp, Required, Default: CURRENT_TIMESTAMP)
   - drawn_by (UUID, Required, Many-to-One to directus_users)
   - spinner_config (JSON)
   - notes (Text)
   ```

### 4. Set Up Relationships
After creating all collections, set up these relationships:

1. **column_mappings.user_id → directus_users**
   - Type: Many to One
   - On Delete: CASCADE

2. **saved_spinner_configs.user_id → directus_users**
   - Type: Many to One
   - On Delete: CASCADE

3. **saved_spinner_configs.spinner_type_id → spinner_types**
   - Type: Many to One
   - On Delete: RESTRICT

4. **draw_history.competition_id → competitions**
   - Type: Many to One
   - On Delete: CASCADE

5. **draw_history.drawn_by → directus_users**
   - Type: Many to One
   - On Delete: SET NULL

### 5. Insert Default Spinner Types
Navigate to **Content > spinner_types** and add these records:

#### Record 1: Slot Machine
```json
{
  "name": "Slot Machine",
  "code": "slot_machine",
  "description": "Classic slot machine style spinner with scrolling names",
  "default_settings": {
    "spinDuration": "medium",
    "decelerationRate": "medium",
    "soundEnabled": true,
    "confettiEnabled": true,
    "nameSize": "large",
    "ticketSize": "extra-large",
    "backgroundColor": "#1e1f23",
    "highlightColor": "#e6b540"
  },
  "min_participants": 2,
  "max_participants": null,
  "is_active": true,
  "is_premium": false,
  "sort_order": 1
}
```

#### Record 2: Wheel of Fortune
```json
{
  "name": "Wheel of Fortune",
  "code": "wheel",
  "description": "Spinning wheel with participant segments",
  "default_settings": {
    "spinDuration": "medium",
    "decelerationRate": "medium",
    "soundEnabled": true,
    "confettiEnabled": true,
    "wheelSize": "large",
    "showNames": true,
    "backgroundColor": "#1e1f23",
    "primaryColor": "#e6b540"
  },
  "min_participants": 2,
  "max_participants": 100,
  "is_active": true,
  "is_premium": false,
  "sort_order": 2
}
```

#### Record 3: Random Picker
```json
{
  "name": "Random Picker",
  "code": "random",
  "description": "Simple random selection with animation",
  "default_settings": {
    "animationSpeed": "medium",
    "soundEnabled": true,
    "confettiEnabled": true,
    "backgroundColor": "#1e1f23",
    "accentColor": "#e6b540"
  },
  "min_participants": 2,
  "max_participants": null,
  "is_active": true,
  "is_premium": false,
  "sort_order": 3
}
```

### 6. Set Permissions
Navigate to **Settings > Roles & Permissions > Public**:

For Public role, ensure:
- ❌ No access to any custom collections

Navigate to **Settings > Roles & Permissions > User** (or your user role):

Set these permissions:
- **competitions**: ✅ Create, Read (own), Update (own), Delete (own)
- **user_settings**: ✅ Read (own), Update (own)
- **spinner_types**: ✅ Read (all)
- **column_mappings**: ✅ Create, Read (own), Update (own), Delete (own)
- **saved_spinner_configs**: ✅ Create, Read (own), Update (own), Delete (own)
- **draw_history**: ✅ Create, Read (filter by competition owner)

### 7. Verify Everything Works
Test the API endpoints to ensure collections are accessible:

```bash
# Test spinner_types (should work)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://db.drawday.app/items/spinner_types

# Test creating a column mapping
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  https://db.drawday.app/items/column_mappings \
  -d '{
    "user_id": "YOUR_USER_ID",
    "name": "Test Mapping",
    "mapping_config": {"firstName": "First Name", "lastName": "Last Name"}
  }'
```

## Common Issues and Solutions

### Issue: Collections appear as folders (no database table)
**Solution**: You must select "Create a New Table" when creating the collection, NOT "Folder"

### Issue: Can't create fields via API
**Solution**: This is a security feature. Fields must be created through the Directus Admin UI

### Issue: Relationships not working
**Solution**: Ensure both collections exist before creating relationships

### Issue: Permissions errors when accessing collections
**Solution**: Check role permissions in Settings > Roles & Permissions

## Next Steps After Setup

1. Test all CRUD operations for each collection
2. Verify relationships are working correctly
3. Test with the application to ensure proper integration
4. Update application code to use the new collections if needed