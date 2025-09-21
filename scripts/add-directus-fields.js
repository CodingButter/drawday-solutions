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

// Function to create a field with proper schema
async function createField(collection, fieldDef) {
  console.log(`  Creating field '${fieldDef.field}' in '${collection}'...`);

  // Check if field exists
  const existingField = await directusRequest(`/fields/${collection}/${fieldDef.field}`);
  if (!existingField.error) {
    console.log(`    ✓ Field '${fieldDef.field}' already exists`);
    return true;
  }

  const response = await directusRequest(`/fields/${collection}`, 'POST', fieldDef);

  if (response.error) {
    console.error(`    ✗ Failed to create field '${fieldDef.field}'`);
    console.error(`      ${response.error}`);
    return false;
  }

  console.log(`    ✓ Created field '${fieldDef.field}'`);
  return true;
}

async function addFields() {
  console.log('Starting to add fields to collections...\n');

  // 1. Fields for spinner_types
  console.log('=== Adding fields to spinner_types ===');
  const spinnerTypesFields = [
    {
      field: 'id',
      type: 'integer',
      meta: {
        interface: 'input',
        readonly: true,
        hidden: true,
        required: false
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
        max_length: 50
      }
    },
    {
      field: 'description',
      type: 'text',
      meta: {
        interface: 'input-multiline'
      },
      schema: {}
    },
    {
      field: 'default_settings',
      type: 'json',
      meta: {
        interface: 'input-code',
        options: {
          language: 'json'
        },
        required: true
      },
      schema: {}
    },
    {
      field: 'min_participants',
      type: 'integer',
      meta: {
        interface: 'input',
        required: true
      },
      schema: {
        default_value: 2
      }
    },
    {
      field: 'max_participants',
      type: 'integer',
      meta: {
        interface: 'input'
      },
      schema: {}
    },
    {
      field: 'is_active',
      type: 'boolean',
      meta: {
        interface: 'boolean',
        required: true
      },
      schema: {
        default_value: true
      }
    },
    {
      field: 'is_premium',
      type: 'boolean',
      meta: {
        interface: 'boolean',
        required: true
      },
      schema: {
        default_value: false
      }
    },
    {
      field: 'sort_order',
      type: 'integer',
      meta: {
        interface: 'input'
      },
      schema: {
        default_value: 0
      }
    }
  ];

  for (const field of spinnerTypesFields) {
    await createField('spinner_types', field);
  }

  // 2. Fields for column_mappings
  console.log('\n=== Adding fields to column_mappings ===');
  const columnMappingsFields = [
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
        required: true,
        special: ['m2o']
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
    },
    {
      field: 'description',
      type: 'text',
      meta: {
        interface: 'input-multiline'
      },
      schema: {}
    },
    {
      field: 'mapping_config',
      type: 'json',
      meta: {
        interface: 'input-code',
        options: {
          language: 'json'
        },
        required: true
      },
      schema: {}
    },
    {
      field: 'file_type',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        options: {
          choices: [
            { text: 'CSV', value: 'csv' },
            { text: 'Excel', value: 'xlsx' }
          ]
        }
      },
      schema: {
        max_length: 20
      }
    },
    {
      field: 'delimiter',
      type: 'string',
      meta: {
        interface: 'input'
      },
      schema: {
        max_length: 5,
        default_value: ','
      }
    },
    {
      field: 'has_headers',
      type: 'boolean',
      meta: {
        interface: 'boolean',
        required: true
      },
      schema: {
        default_value: true
      }
    },
    {
      field: 'is_default',
      type: 'boolean',
      meta: {
        interface: 'boolean',
        required: true
      },
      schema: {
        default_value: false
      }
    },
    {
      field: 'usage_count',
      type: 'integer',
      meta: {
        interface: 'input',
        readonly: true
      },
      schema: {
        default_value: 0
      }
    },
    {
      field: 'last_used_at',
      type: 'timestamp',
      meta: {
        interface: 'datetime'
      },
      schema: {}
    },
    {
      field: 'created_at',
      type: 'timestamp',
      meta: {
        interface: 'datetime',
        readonly: true,
        special: ['date-created']
      },
      schema: {}
    }
  ];

  for (const field of columnMappingsFields) {
    await createField('column_mappings', field);
  }

  // 3. Fields for saved_spinner_configs
  console.log('\n=== Adding fields to saved_spinner_configs ===');
  const savedSpinnerConfigsFields = [
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
        required: true,
        special: ['m2o']
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
    },
    {
      field: 'spinner_type_id',
      type: 'integer',
      meta: {
        interface: 'select-dropdown-m2o',
        required: true,
        special: ['m2o']
      },
      schema: {}
    },
    {
      field: 'config_data',
      type: 'json',
      meta: {
        interface: 'input-code',
        options: {
          language: 'json'
        },
        required: true
      },
      schema: {}
    },
    {
      field: 'is_default',
      type: 'boolean',
      meta: {
        interface: 'boolean',
        required: true
      },
      schema: {
        default_value: false
      }
    },
    {
      field: 'thumbnail',
      type: 'uuid',
      meta: {
        interface: 'file-image',
        special: ['file']
      },
      schema: {}
    },
    {
      field: 'created_at',
      type: 'timestamp',
      meta: {
        interface: 'datetime',
        readonly: true,
        special: ['date-created']
      },
      schema: {}
    },
    {
      field: 'updated_at',
      type: 'timestamp',
      meta: {
        interface: 'datetime',
        readonly: true,
        special: ['date-updated']
      },
      schema: {}
    }
  ];

  for (const field of savedSpinnerConfigsFields) {
    await createField('saved_spinner_configs', field);
  }

  // 4. Fields for draw_history
  console.log('\n=== Adding fields to draw_history ===');
  const drawHistoryFields = [
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
        required: true,
        special: ['m2o']
      },
      schema: {}
    },
    {
      field: 'winner_data',
      type: 'json',
      meta: {
        interface: 'input-code',
        options: {
          language: 'json'
        },
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
    },
    {
      field: 'drawn_at',
      type: 'timestamp',
      meta: {
        interface: 'datetime',
        required: true,
        readonly: true,
        special: ['date-created']
      },
      schema: {}
    },
    {
      field: 'drawn_by',
      type: 'uuid',
      meta: {
        interface: 'select-dropdown-m2o',
        required: true,
        special: ['m2o']
      },
      schema: {}
    },
    {
      field: 'spinner_config',
      type: 'json',
      meta: {
        interface: 'input-code',
        options: {
          language: 'json'
        }
      },
      schema: {}
    },
    {
      field: 'notes',
      type: 'text',
      meta: {
        interface: 'input-multiline'
      },
      schema: {}
    }
  ];

  for (const field of drawHistoryFields) {
    await createField('draw_history', field);
  }

  console.log('\n=== Field creation complete ===');
}

// Insert default spinner types
async function insertDefaultSpinnerTypes() {
  console.log('\n=== Inserting default spinner types ===');

  const spinnerTypes = [
    {
      name: 'Slot Machine',
      code: 'slot_machine',
      description: 'Classic slot machine style spinner with scrolling names',
      default_settings: {
        spinDuration: 'medium',
        decelerationRate: 'medium',
        soundEnabled: true,
        confettiEnabled: true,
        nameSize: 'large',
        ticketSize: 'extra-large',
        backgroundColor: '#1e1f23',
        highlightColor: '#e6b540'
      },
      min_participants: 2,
      max_participants: null,
      is_active: true,
      is_premium: false,
      sort_order: 1
    },
    {
      name: 'Wheel of Fortune',
      code: 'wheel',
      description: 'Spinning wheel with participant segments',
      default_settings: {
        spinDuration: 'medium',
        decelerationRate: 'medium',
        soundEnabled: true,
        confettiEnabled: true,
        wheelSize: 'large',
        showNames: true,
        backgroundColor: '#1e1f23',
        primaryColor: '#e6b540'
      },
      min_participants: 2,
      max_participants: 100,
      is_active: true,
      is_premium: false,
      sort_order: 2
    },
    {
      name: 'Random Picker',
      code: 'random',
      description: 'Simple random selection with animation',
      default_settings: {
        animationSpeed: 'medium',
        soundEnabled: true,
        confettiEnabled: true,
        backgroundColor: '#1e1f23',
        accentColor: '#e6b540'
      },
      min_participants: 2,
      max_participants: null,
      is_active: true,
      is_premium: false,
      sort_order: 3
    }
  ];

  for (const spinnerType of spinnerTypes) {
    // Check if already exists
    const existing = await directusRequest(`/items/spinner_types?filter[code][_eq]=${spinnerType.code}`);

    if (existing.data && existing.data.length === 0) {
      const response = await directusRequest('/items/spinner_types', 'POST', spinnerType);
      if (response.error) {
        console.error(`  ✗ Failed to create spinner type '${spinnerType.name}'`);
      } else {
        console.log(`  ✓ Created spinner type '${spinnerType.name}'`);
      }
    } else {
      console.log(`  ✓ Spinner type '${spinnerType.name}' already exists`);
    }
  }
}

// Run the implementation
async function main() {
  await addFields();
  await insertDefaultSpinnerTypes();
  console.log('\n✓ Schema implementation complete!');
}

main().catch(console.error);