#!/usr/bin/env node

// Test script for Directus backend integration
const DIRECTUS_URL = 'https://db.drawday.app';
const DIRECTUS_PROJECT = ''; // No project path needed

// Test admin credentials
const ADMIN_EMAIL = 'admin@drawday.app';
const ADMIN_PASSWORD = 'Speed4Dayz1!';

// Test user credentials
const TEST_USER = {
  email: 'test@drawday.app',
  password: 'TestPassword123!',
  first_name: 'Test',
  last_name: 'User'
};

// Color output helpers
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

// Test Directus connection
async function testConnection() {
  logInfo('Testing Directus connection...');
  try {
    const response = await fetch(`${DIRECTUS_URL}/server/info`);
    if (response.ok) {
      const data = await response.json();
      logSuccess(`Connected to Directus at ${DIRECTUS_URL}`);
      logInfo(`Project: ${data.data?.project?.project_name || 'Directus'}`);
      return true;
    } else {
      logError(`Failed to connect to Directus: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    logError(`Connection error: ${error.message}`);
    return false;
  }
}

// Test admin login
async function testAdminLogin() {
  logInfo('Testing admin login...');
  try {
    const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      }),
    });

    if (response.ok) {
      const data = await response.json();
      logSuccess(`Admin login successful!`);
      logInfo(`Access token: ${data.data.access_token.substring(0, 20)}...`);
      return data.data.access_token;
    } else {
      const error = await response.json();
      logError(`Admin login failed: ${error.errors?.[0]?.message || response.statusText}`);
      return null;
    }
  } catch (error) {
    logError(`Login error: ${error.message}`);
    return null;
  }
}

// Test creating a user
async function testUserRegistration(adminToken) {
  logInfo('Testing user registration...');
  try {
    // First, check if user already exists and delete if necessary
    const checkResponse = await fetch(`${DIRECTUS_URL}/users?filter[email][_eq]=${TEST_USER.email}`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    });

    if (checkResponse.ok) {
      const checkData = await checkResponse.json();
      if (checkData.data && checkData.data.length > 0) {
        logInfo('Test user already exists, deleting...');
        for (const user of checkData.data) {
          await fetch(`${DIRECTUS_URL}/users/${user.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${adminToken}`,
            },
          });
        }
      }
    }

    // Create new user
    const response = await fetch(`${DIRECTUS_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        ...TEST_USER,
        status: 'active',
        role: '0eb84e15-862a-452f-b3d8-4c82bb349d7f', // Default user role ID (may need adjustment)
      }),
    });

    if (response.ok) {
      const data = await response.json();
      logSuccess(`User registration successful!`);
      logInfo(`User ID: ${data.data.id}`);
      return data.data.id;
    } else {
      const error = await response.json();
      logError(`User registration failed: ${error.errors?.[0]?.message || response.statusText}`);
      return null;
    }
  } catch (error) {
    logError(`Registration error: ${error.message}`);
    return null;
  }
}

// Test user login
async function testUserLogin() {
  logInfo('Testing user login...');
  try {
    const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: TEST_USER.email,
        password: TEST_USER.password
      }),
    });

    if (response.ok) {
      const data = await response.json();
      logSuccess(`User login successful!`);
      return data.data.access_token;
    } else {
      const error = await response.json();
      logError(`User login failed: ${error.errors?.[0]?.message || response.statusText}`);
      return null;
    }
  } catch (error) {
    logError(`Login error: ${error.message}`);
    return null;
  }
}

// Test creating a competition
async function testCreateCompetition(userToken) {
  logInfo('Testing competition creation...');
  try {
    const response = await fetch(`${DIRECTUS_URL}/items/competitions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        name: 'Test Competition',
        participants: [
          { firstName: 'John', lastName: 'Doe', ticketNumber: '001' },
          { firstName: 'Jane', lastName: 'Smith', ticketNumber: '002' },
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      logSuccess(`Competition created successfully!`);
      logInfo(`Competition ID: ${data.data.id}`);
      return data.data.id;
    } else {
      const error = await response.json();
      logError(`Competition creation failed: ${error.errors?.[0]?.message || response.statusText}`);
      return null;
    }
  } catch (error) {
    logError(`Competition error: ${error.message}`);
    return null;
  }
}

// Test getting competitions
async function testGetCompetitions(userToken) {
  logInfo('Testing get competitions...');
  try {
    const response = await fetch(`${DIRECTUS_URL}/items/competitions`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      logSuccess(`Retrieved ${data.data.length} competitions`);
      return true;
    } else {
      const error = await response.json();
      logError(`Failed to get competitions: ${error.errors?.[0]?.message || response.statusText}`);
      return false;
    }
  } catch (error) {
    logError(`Get competitions error: ${error.message}`);
    return false;
  }
}

// Test user settings
async function testUserSettings(userToken, userId) {
  logInfo('Testing user settings...');
  try {
    // Create settings
    const createResponse = await fetch(`${DIRECTUS_URL}/items/user_settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        userId: userId,
        spinner: {
          spinDuration: 'medium',
          decelerationSpeed: 'medium',
        },
        theme: {
          spinnerStyle: {
            nameColor: '#ffffff',
            ticketColor: '#a0a0a0',
          },
        },
      }),
    });

    if (createResponse.ok) {
      logSuccess(`User settings created successfully!`);
      
      // Get settings
      const getResponse = await fetch(`${DIRECTUS_URL}/items/user_settings/${userId}`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });

      if (getResponse.ok) {
        logSuccess(`User settings retrieved successfully!`);
        return true;
      }
    } else {
      const error = await createResponse.json();
      logError(`Settings creation failed: ${error.errors?.[0]?.message || createResponse.statusText}`);
    }
    return false;
  } catch (error) {
    logError(`Settings error: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('\n' + colors.bright + '🧪 Starting Directus Backend Tests' + colors.reset);
  console.log('=' . repeat(50) + '\n');

  let allTestsPassed = true;

  // Test 1: Connection
  const connected = await testConnection();
  if (!connected) {
    logError('Cannot proceed without connection');
    process.exit(1);
  }

  console.log();

  // Test 2: Admin Login
  const adminToken = await testAdminLogin();
  if (!adminToken) {
    logError('Admin login failed - check credentials');
    allTestsPassed = false;
  }

  console.log();

  // Test 3: User Registration (requires admin token)
  let userId = null;
  if (adminToken) {
    userId = await testUserRegistration(adminToken);
    if (!userId) {
      allTestsPassed = false;
    }
  }

  console.log();

  // Test 4: User Login
  const userToken = await testUserLogin();
  if (!userToken) {
    allTestsPassed = false;
  }

  console.log();

  // Test 5: Competition Management
  if (userToken) {
    const competitionId = await testCreateCompetition(userToken);
    if (!competitionId) {
      allTestsPassed = false;
    }

    console.log();

    const gotCompetitions = await testGetCompetitions(userToken);
    if (!gotCompetitions) {
      allTestsPassed = false;
    }

    console.log();

    // Test 6: User Settings
    if (userId) {
      const settingsOk = await testUserSettings(userToken, userId);
      if (!settingsOk) {
        allTestsPassed = false;
      }
    }
  }

  console.log('\n' + '=' . repeat(50));
  if (allTestsPassed) {
    logSuccess('All tests passed! ✨');
  } else {
    logError('Some tests failed. Please check the errors above.');
  }
}

// Run the tests
runTests().catch(error => {
  logError(`Test runner error: ${error.message}`);
  process.exit(1);
});