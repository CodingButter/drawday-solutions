#!/usr/bin/env node

const DIRECTUS_URL = 'https://db.drawday.app';
const ADMIN_TOKEN = 'mNjKgq86jnVokcdwBRKkXgrHEoROvR04';

// Helper function to make API requests
async function directusRequest(endpoint, method = 'GET', body = null) {
  const url = `${DIRECTUS_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${ADMIN_TOKEN}`,
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
      console.error(`Error ${response.status} for ${endpoint}:`, text);
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

// Check if collection exists
async function collectionExists(collection) {
  const response = await directusRequest(`/collections/${collection}`);
  return !response.error;
}

// Create or update collection
async function createCollection(collection, meta = {}) {
  const exists = await collectionExists(collection);

  if (exists) {
    console.log(`✓ Collection '${collection}' already exists`);
    return true;
  }

  console.log(`Creating collection '${collection}'...`);
  const response = await directusRequest('/collections', 'POST', {
    collection,
    meta: {
      ...meta,
      singleton: false,
      archive_field: null,
      archive_value: null,
      sort_field: null,
      accountability: 'all',
      ...meta
    }
  });

  if (response.error) {
    console.error(`✗ Failed to create collection '${collection}'`);
    return false;
  }

  console.log(`✓ Created collection '${collection}'`);
  return true;
}

// Create field in collection
async function createField(collection, field) {
  console.log(`  Creating field '${field.field}' in '${collection}'...`);

  const endpoint = `/fields/${collection}/${field.field}`;

  // Check if field exists
  const existingField = await directusRequest(endpoint);
  if (!existingField.error) {
    console.log(`  ✓ Field '${field.field}' already exists`);
    return true;
  }

  const response = await directusRequest(`/fields/${collection}`, 'POST', field);

  if (response.error) {
    console.error(`  ✗ Failed to create field '${field.field}': ${response.error}`);
    return false;
  }

  console.log(`  ✓ Created field '${field.field}'`);
  return true;
}

// Create relationship
async function createRelationship(collection, field, related, type = 'm2o') {
  console.log(`  Creating ${type} relationship: ${collection}.${field} -> ${related}`);

  const relationData = {
    collection,
    field,
    related_collection: related,
    meta: {
      many_collection: collection,
      many_field: field,
      one_collection: related,
      one_field: null,
      junction_field: null
    }
  };

  if (type === 'o2m') {
    relationData.meta = {
      many_collection: related,
      many_field: field,
      one_collection: collection,
      one_field: 'id',
      junction_field: null
    };
  }

  const response = await directusRequest('/relations', 'POST', relationData);

  if (response.error) {
    console.error(`  ✗ Failed to create relationship: ${response.error}`);
    return false;
  }

  console.log(`  ✓ Created relationship`);
  return true;
}

// Schema Implementation
async function implementSchema() {
  console.log('Starting Directus Schema Implementation...\n');

  // 1. Check if competitions collection exists (it should from previous work)
  console.log('=== Checking existing collections ===');
  const competitionsExists = await collectionExists('competitions');
  if (competitionsExists) {
    console.log('✓ competitions collection exists');
  }

  // 2. Create user_settings collection
  console.log('\n=== Creating user_settings collection ===');
  await createCollection('user_settings', {
    icon: 'settings',
    note: 'User-specific application settings'
  });

  if (await collectionExists('user_settings')) {
    const userSettingsFields = [
      {
        field: 'id',
        type: 'integer',
        meta: { interface: 'input', readonly: true, hidden: true },
        schema: { is_primary_key: true, has_auto_increment: true }
      },
      {
        field: 'user_id',
        type: 'uuid',
        meta: { interface: 'select-dropdown-m2o', required: true },
        schema: {}
      },
      {
        field: 'default_spinner_type_id',
        type: 'integer',
        meta: { interface: 'select-dropdown-m2o' },
        schema: {}
      },
      {
        field: 'theme_colors',
        type: 'json',
        meta: { interface: 'input-code', options: { language: 'json' } },
        schema: {}
      },
      {
        field: 'spinner_settings',
        type: 'json',
        meta: { interface: 'input-code', options: { language: 'json' } },
        schema: {}
      },
      {
        field: 'show_company_name',
        type: 'boolean',
        meta: { interface: 'boolean' },
        schema: { default_value: false }
      },
      {
        field: 'company_name',
        type: 'string',
        meta: { interface: 'input' },
        schema: { max_length: 255 }
      },
      {
        field: 'company_logo_id',
        type: 'uuid',
        meta: { interface: 'file' },
        schema: {}
      },
      {
        field: 'logo_position',
        type: 'string',
        meta: { interface: 'select-dropdown', options: {
          choices: [
            { text: 'Left', value: 'left' },
            { text: 'Center', value: 'center' },
            { text: 'Right', value: 'right' }
          ]
        }},
        schema: { max_length: 20 }
      },
      {
        field: 'created_at',
        type: 'timestamp',
        meta: { interface: 'datetime', readonly: true },
        schema: { default_value: 'CURRENT_TIMESTAMP' }
      },
      {
        field: 'updated_at',
        type: 'timestamp',
        meta: { interface: 'datetime', readonly: true },
        schema: { default_value: 'CURRENT_TIMESTAMP' }
      }
    ];

    for (const field of userSettingsFields) {
      await createField('user_settings', field);
    }
  }

  // 3. Create spinner_types collection
  console.log('\n=== Creating spinner_types collection ===');
  await createCollection('spinner_types', {
    icon: 'toys',
    note: 'Available spinner animation types'
  });

  if (await collectionExists('spinner_types')) {
    const spinnerTypesFields = [
      {
        field: 'id',
        type: 'integer',
        meta: { interface: 'input', readonly: true, hidden: true },
        schema: { is_primary_key: true, has_auto_increment: true }
      },
      {
        field: 'name',
        type: 'string',
        meta: { interface: 'input', required: true },
        schema: { max_length: 100 }
      },
      {
        field: 'code',
        type: 'string',
        meta: { interface: 'input', required: true },
        schema: { max_length: 50 }
      },
      {
        field: 'description',
        type: 'text',
        meta: { interface: 'input-multiline' },
        schema: {}
      },
      {
        field: 'default_settings',
        type: 'json',
        meta: { interface: 'input-code', options: { language: 'json' }, required: true },
        schema: {}
      },
      {
        field: 'min_participants',
        type: 'integer',
        meta: { interface: 'input', required: true },
        schema: { default_value: 2 }
      },
      {
        field: 'max_participants',
        type: 'integer',
        meta: { interface: 'input' },
        schema: {}
      },
      {
        field: 'is_active',
        type: 'boolean',
        meta: { interface: 'boolean', required: true },
        schema: { default_value: true }
      },
      {
        field: 'is_premium',
        type: 'boolean',
        meta: { interface: 'boolean', required: true },
        schema: { default_value: false }
      },
      {
        field: 'sort_order',
        type: 'integer',
        meta: { interface: 'input' },
        schema: { default_value: 0 }
      }
    ];

    for (const field of spinnerTypesFields) {
      await createField('spinner_types', field);
    }
  }

  // 4. Create column_mappings collection
  console.log('\n=== Creating column_mappings collection ===');
  await createCollection('column_mappings', {
    icon: 'table_chart',
    note: 'Saved CSV column mapping configurations'
  });

  if (await collectionExists('column_mappings')) {
    const columnMappingsFields = [
      {
        field: 'id',
        type: 'integer',
        meta: { interface: 'input', readonly: true, hidden: true },
        schema: { is_primary_key: true, has_auto_increment: true }
      },
      {
        field: 'user_id',
        type: 'uuid',
        meta: { interface: 'select-dropdown-m2o', required: true },
        schema: {}
      },
      {
        field: 'name',
        type: 'string',
        meta: { interface: 'input', required: true },
        schema: { max_length: 100 }
      },
      {
        field: 'description',
        type: 'text',
        meta: { interface: 'input-multiline' },
        schema: {}
      },
      {
        field: 'mapping_config',
        type: 'json',
        meta: { interface: 'input-code', options: { language: 'json' }, required: true },
        schema: {}
      },
      {
        field: 'file_type',
        type: 'string',
        meta: { interface: 'select-dropdown', options: {
          choices: [
            { text: 'CSV', value: 'csv' },
            { text: 'Excel', value: 'xlsx' }
          ]
        }},
        schema: { max_length: 20 }
      },
      {
        field: 'delimiter',
        type: 'string',
        meta: { interface: 'input' },
        schema: { max_length: 5 }
      },
      {
        field: 'has_headers',
        type: 'boolean',
        meta: { interface: 'boolean', required: true },
        schema: { default_value: true }
      },
      {
        field: 'is_default',
        type: 'boolean',
        meta: { interface: 'boolean', required: true },
        schema: { default_value: false }
      },
      {
        field: 'usage_count',
        type: 'integer',
        meta: { interface: 'input', readonly: true },
        schema: { default_value: 0 }
      },
      {
        field: 'last_used_at',
        type: 'timestamp',
        meta: { interface: 'datetime' },
        schema: {}
      },
      {
        field: 'created_at',
        type: 'timestamp',
        meta: { interface: 'datetime', readonly: true },
        schema: { default_value: 'CURRENT_TIMESTAMP' }
      }
    ];

    for (const field of columnMappingsFields) {
      await createField('column_mappings', field);
    }
  }

  // 5. Create saved_spinner_configs collection
  console.log('\n=== Creating saved_spinner_configs collection ===');
  await createCollection('saved_spinner_configs', {
    icon: 'save',
    note: 'User-saved spinner configurations'
  });

  if (await collectionExists('saved_spinner_configs')) {
    const savedSpinnerConfigsFields = [
      {
        field: 'id',
        type: 'integer',
        meta: { interface: 'input', readonly: true, hidden: true },
        schema: { is_primary_key: true, has_auto_increment: true }
      },
      {
        field: 'user_id',
        type: 'uuid',
        meta: { interface: 'select-dropdown-m2o', required: true },
        schema: {}
      },
      {
        field: 'name',
        type: 'string',
        meta: { interface: 'input', required: true },
        schema: { max_length: 100 }
      },
      {
        field: 'spinner_type_id',
        type: 'integer',
        meta: { interface: 'select-dropdown-m2o', required: true },
        schema: {}
      },
      {
        field: 'config_data',
        type: 'json',
        meta: { interface: 'input-code', options: { language: 'json' }, required: true },
        schema: {}
      },
      {
        field: 'is_default',
        type: 'boolean',
        meta: { interface: 'boolean', required: true },
        schema: { default_value: false }
      },
      {
        field: 'created_at',
        type: 'timestamp',
        meta: { interface: 'datetime', readonly: true },
        schema: { default_value: 'CURRENT_TIMESTAMP' }
      },
      {
        field: 'updated_at',
        type: 'timestamp',
        meta: { interface: 'datetime', readonly: true },
        schema: { default_value: 'CURRENT_TIMESTAMP' }
      }
    ];

    for (const field of savedSpinnerConfigsFields) {
      await createField('saved_spinner_configs', field);
    }
  }

  // 6. Update competitions collection with new fields
  console.log('\n=== Updating competitions collection ===');
  if (competitionsExists) {
    const competitionFields = [
      {
        field: 'column_mapping_id',
        type: 'integer',
        meta: { interface: 'select-dropdown-m2o' },
        schema: {}
      },
      {
        field: 'spinner_config_id',
        type: 'integer',
        meta: { interface: 'select-dropdown-m2o' },
        schema: {}
      },
      {
        field: 'draw_date',
        type: 'datetime',
        meta: { interface: 'datetime' },
        schema: {}
      },
      {
        field: 'description',
        type: 'text',
        meta: { interface: 'input-multiline' },
        schema: {}
      },
      {
        field: 'rules',
        type: 'text',
        meta: { interface: 'input-rich-text-html' },
        schema: {}
      },
      {
        field: 'prize_details',
        type: 'json',
        meta: { interface: 'input-code', options: { language: 'json' } },
        schema: {}
      },
      {
        field: 'max_entries',
        type: 'integer',
        meta: { interface: 'input' },
        schema: {}
      },
      {
        field: 'completed_at',
        type: 'timestamp',
        meta: { interface: 'datetime', readonly: true },
        schema: {}
      }
    ];

    for (const field of competitionFields) {
      await createField('competitions', field);
    }
  }

  // 7. Create draw_history collection
  console.log('\n=== Creating draw_history collection ===');
  await createCollection('draw_history', {
    icon: 'history',
    note: 'Audit trail of all draws conducted'
  });

  if (await collectionExists('draw_history')) {
    const drawHistoryFields = [
      {
        field: 'id',
        type: 'integer',
        meta: { interface: 'input', readonly: true, hidden: true },
        schema: { is_primary_key: true, has_auto_increment: true }
      },
      {
        field: 'competition_id',
        type: 'integer',
        meta: { interface: 'select-dropdown-m2o', required: true },
        schema: {}
      },
      {
        field: 'winner_data',
        type: 'json',
        meta: { interface: 'input-code', options: { language: 'json' }, required: true },
        schema: {}
      },
      {
        field: 'draw_number',
        type: 'integer',
        meta: { interface: 'input', required: true },
        schema: {}
      },
      {
        field: 'drawn_at',
        type: 'timestamp',
        meta: { interface: 'datetime', required: true, readonly: true },
        schema: { default_value: 'CURRENT_TIMESTAMP' }
      },
      {
        field: 'drawn_by',
        type: 'uuid',
        meta: { interface: 'select-dropdown-m2o', required: true },
        schema: {}
      },
      {
        field: 'spinner_config',
        type: 'json',
        meta: { interface: 'input-code', options: { language: 'json' } },
        schema: {}
      },
      {
        field: 'notes',
        type: 'text',
        meta: { interface: 'input-multiline' },
        schema: {}
      }
    ];

    for (const field of drawHistoryFields) {
      await createField('draw_history', field);
    }
  }

  // 8. Insert default spinner types
  console.log('\n=== Inserting default spinner types ===');
  const defaultSpinnerTypes = [
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
        ticketSize: 'extra-large'
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
        showNames: true
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
        confettiEnabled: true
      },
      min_participants: 2,
      max_participants: null,
      is_active: true,
      is_premium: false,
      sort_order: 3
    }
  ];

  for (const spinnerType of defaultSpinnerTypes) {
    const existing = await directusRequest(`/items/spinner_types?filter[code][_eq]=${spinnerType.code}`);
    if (!existing.error && existing.data && existing.data.length === 0) {
      const response = await directusRequest('/items/spinner_types', 'POST', spinnerType);
      if (response.error) {
        console.error(`✗ Failed to create spinner type '${spinnerType.name}'`);
      } else {
        console.log(`✓ Created spinner type '${spinnerType.name}'`);
      }
    } else {
      console.log(`✓ Spinner type '${spinnerType.name}' already exists`);
    }
  }

  console.log('\n=== Schema Implementation Complete ===');
  console.log('✓ Core collections created/updated');
  console.log('✓ Settings collections created');
  console.log('✓ Default data inserted');
  console.log('\nNote: Relationships should be configured through Directus Admin UI for better control');
}

// Run the implementation
implementSchema().catch(console.error);