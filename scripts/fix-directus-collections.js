#!/usr/bin/env node

const DIRECTUS_URL = 'https://db.drawday.app';
const TOKEN = 'mNjKgq86jnVokcdwBRKkXgrHEoROvR04';

// Helper function to make API requests
async function directusRequest(endpoint, method = 'GET', body = null) {
  const url = `${DIRECTUS_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url);
    const text = await response.text();

    if (!response.ok) {
      console.error(`Error ${response.status} for ${endpoint}:`);
      return { error: text, status: response.status };
    }

    try {
      return text ? JSON.parse(text) : {};
    } catch (e) {
      return text;
    }
  } catch (error) {
    console.error(`Request failed for ${endpoint}:`, error.message);
    return { error: error.message };
  }
}

async function fixCollections() {
  console.log('🔧 Fixing Directus Collections\n');
  console.log('=====================================\n');

  // Collections to fix
  const collectionsToFix = [
    'spinner_types',
    'column_mappings',
    'saved_spinner_configs',
    'draw_history'
  ];

  // Step 1: Delete incorrectly created folder collections
  console.log('📁 Step 1: Deleting folder collections...\n');
  for (const collection of collectionsToFix) {
    console.log(`  Deleting ${collection}...`);
    const deleteResult = await directusRequest(`/collections/${collection}`, 'DELETE');
    if (deleteResult.error) {
      console.log(`    ⚠️  Could not delete ${collection} (may not exist as folder)`);
    } else {
      console.log(`    ✅ Deleted ${collection}`);
    }
  }

  console.log('\n📊 Step 2: Creating proper database-backed collections...\n');

  // Create collections with schema (creates actual database tables)
  const collections = [
    {
      collection: 'spinner_types',
      meta: {
        icon: 'toys',
        note: 'Available spinner animation types'
      },
      schema: {
        name: 'spinner_types'
      },
      fields: [
        {
          field: 'id',
          type: 'integer',
          meta: {
            interface: 'input',
            readonly: true,
            hidden: true
          },
          schema: {
            is_primary_key: true,
            has_auto_increment: true
          }
        },
        {
          field: 'name',
          type: 'string',
          meta: {
            interface: 'input',
            required: true
          },
          schema: {
            max_length: 100
          }
        },
        {
          field: 'code',
          type: 'string',
          meta: {
            interface: 'input',
            required: true
          },
          schema: {
            max_length: 50,
            is_unique: true
          }
        }
      ]
    },
    {
      collection: 'column_mappings',
      meta: {
        icon: 'table_chart',
        note: 'Saved CSV column mapping configurations'
      },
      schema: {
        name: 'column_mappings'
      },
      fields: [
        {
          field: 'id',
          type: 'integer',
          meta: {
            interface: 'input',
            readonly: true,
            hidden: true
          },
          schema: {
            is_primary_key: true,
            has_auto_increment: true
          }
        },
        {
          field: 'user_id',
          type: 'uuid',
          meta: {
            interface: 'select-dropdown-m2o',
            required: true
          },
          schema: {}
        },
        {
          field: 'name',
          type: 'string',
          meta: {
            interface: 'input',
            required: true
          },
          schema: {
            max_length: 100
          }
        }
      ]
    },
    {
      collection: 'saved_spinner_configs',
      meta: {
        icon: 'save',
        note: 'User-saved spinner configurations'
      },
      schema: {
        name: 'saved_spinner_configs'
      },
      fields: [
        {
          field: 'id',
          type: 'integer',
          meta: {
            interface: 'input',
            readonly: true,
            hidden: true
          },
          schema: {
            is_primary_key: true,
            has_auto_increment: true
          }
        },
        {
          field: 'user_id',
          type: 'uuid',
          meta: {
            interface: 'select-dropdown-m2o',
            required: true
          },
          schema: {}
        },
        {
          field: 'name',
          type: 'string',
          meta: {
            interface: 'input',
            required: true
          },
          schema: {
            max_length: 100
          }
        }
      ]
    },
    {
      collection: 'draw_history',
      meta: {
        icon: 'history',
        note: 'Audit trail of all draws conducted'
      },
      schema: {
        name: 'draw_history'
      },
      fields: [
        {
          field: 'id',
          type: 'integer',
          meta: {
            interface: 'input',
            readonly: true,
            hidden: true
          },
          schema: {
            is_primary_key: true,
            has_auto_increment: true
          }
        },
        {
          field: 'competition_id',
          type: 'integer',
          meta: {
            interface: 'select-dropdown-m2o',
            required: true
          },
          schema: {}
        },
        {
          field: 'draw_number',
          type: 'integer',
          meta: {
            interface: 'input',
            required: true
          },
          schema: {}
        }
      ]
    }
  ];

  // Create each collection with initial fields
  for (const collectionDef of collections) {
    console.log(`  Creating ${collectionDef.collection}...`);

    // First create the collection with schema
    const createBody = {
      collection: collectionDef.collection,
      meta: collectionDef.meta,
      schema: collectionDef.schema,
      fields: collectionDef.fields
    };

    const createResult = await directusRequest('/collections', 'POST', createBody);

    if (createResult.error) {
      console.log(`    ❌ Failed to create ${collectionDef.collection}`);
      console.log(`       ${createResult.error}`);
    } else {
      console.log(`    ✅ Created ${collectionDef.collection} with database table`);
    }
  }

  console.log('\n✨ Collection fix complete!');
  console.log('\n📝 Next steps:');
  console.log('  1. Go to https://db.drawday.app/admin');
  console.log('  2. Navigate to Settings > Data Model');
  console.log('  3. Add remaining fields to each collection');
  console.log('  4. Set up relationships between collections');
  console.log('  5. Configure permissions for user access');
}

fixCollections().catch(console.error);