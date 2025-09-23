# Directus Competitions Collection - Required Fields

## Current Implementation Requirements

Based on the updated API implementation that stores only metadata (not participant data), the competitions collection needs these fields:

### Required Fields for API Compatibility

| Field Name        | Type         | Required | Description                | Notes                             |
| ----------------- | ------------ | -------- | -------------------------- | --------------------------------- |
| id                | uuid/integer | Yes      | Primary key                | Auto-generated                    |
| name              | string(255)  | Yes      | Competition name           | User-provided                     |
| user_id           | uuid         | Yes      | Owner of competition       | From auth token                   |
| participant_count | integer      | Yes      | Number of participants     | Metadata only                     |
| winners_count     | integer      | Yes      | Number of winners selected | Metadata only                     |
| status            | string(50)   | Yes      | Competition status         | 'active', 'completed', 'archived' |
| date_created      | timestamp    | Yes      | Creation timestamp         | Auto-generated                    |
| date_updated      | timestamp    | Yes      | Last update timestamp      | Auto-generated                    |
| user_created      | uuid         | No       | User who created           | Directus system field             |

### Fields to ADD if Missing

If your Directus competitions collection is missing these fields, add them:

```sql
-- Add participant_count field
ALTER TABLE competitions
ADD COLUMN participant_count INTEGER DEFAULT 0;

-- Add winners_count field
ALTER TABLE competitions
ADD COLUMN winners_count INTEGER DEFAULT 0;
```

### Fields NOT Used by New Implementation

These fields from the original schema are NOT used by the new metadata-only approach:

- `participants_data` (JSON) - Participant data stored locally instead
- `winners_data` (JSON) - Winner data stored locally instead
- `column_mapping_id` - Handled in local storage
- `banner_image_id` - Optional, can be added later
- `spinner_config_id` - Handled locally

## API Endpoint Mapping

The API endpoints expect these field names:

### POST /api/competitions

**Request Body:**

```json
{
  "name": "Competition Name",
  "participantCount": 150
}
```

**Saves to Directus as:**

```json
{
  "name": "Competition Name",
  "participant_count": 150,
  "winners_count": 0,
  "status": "active"
}
```

### PATCH /api/competitions/[id]

**Request Body:**

```json
{
  "name": "Updated Name",
  "participantCount": 200,
  "winnersCount": 5,
  "status": "completed"
}
```

**Updates in Directus:**

- `name` → name
- `participantCount` → participant_count
- `winnersCount` → winners_count
- `status` → status
- Auto-updates `date_updated`

### GET /api/competitions

**Returns:**

```json
{
  "competitions": [
    {
      "id": "123",
      "name": "Competition Name",
      "participantCount": 150,
      "winnersCount": 5,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-02T00:00:00Z",
      "status": "active",
      "userId": "user-uuid"
    }
  ]
}
```

## Directus Admin Panel Setup

1. Navigate to Settings → Data Model → competitions
2. Ensure these fields exist:
   - `participant_count` (Integer)
   - `winners_count` (Integer)
3. Set permissions for authenticated users:
   - Create: Yes
   - Read: Own items only
   - Update: Own items only
   - Delete: Own items only

## Storage Strategy

- **Directus**: Stores competition metadata only (name, counts, status)
- **Local Storage**: Stores full participant data arrays
- **Benefits**:
  - Fast local access to participant data
  - Lightweight database
  - Sync metadata across devices
  - Handle thousands of participants efficiently
