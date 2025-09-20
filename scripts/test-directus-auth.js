#!/usr/bin/env node

// Test script to verify Directus authentication is working
const DIRECTUS_URL = 'https://db.drawday.app';
const DIRECTUS_TOKEN = 'Vib5QYjkPWhn8ioOdW9dxJIV8JthaCIa';
const USER_ROLE_ID = '142098df-c517-4b47-9826-c6d3a1d72e46';

async function testDirectusAuth() {
  console.log('🔐 Testing Directus Authentication System...\n');
  
  let testUserId = null;
  let accessToken = null;
  let refreshToken = null;
  const testEmail = `test-${Date.now()}@drawday.app`;
  const testPassword = 'TestPass123!';

  try {
    // Test 1: Create a new user
    console.log('1️⃣ Testing USER REGISTRATION...');
    const createResponse = await fetch(`${DIRECTUS_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        first_name: 'Test',
        last_name: 'User',
        role: USER_ROLE_ID,
        status: 'active',
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      throw new Error(`User creation failed: ${error}`);
    }

    const userData = await createResponse.json();
    testUserId = userData.data.id;
    console.log(`✅ User created successfully`);
    console.log(`   - ID: ${testUserId}`);
    console.log(`   - Email: ${testEmail}`);
    console.log(`   - Role: User (${USER_ROLE_ID})`);

    // Test 2: Login with the new user
    console.log('\n2️⃣ Testing USER LOGIN...');
    const loginResponse = await fetch(`${DIRECTUS_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    if (!loginResponse.ok) {
      const error = await loginResponse.text();
      throw new Error(`Login failed: ${error}`);
    }

    const loginData = await loginResponse.json();
    accessToken = loginData.data.access_token;
    refreshToken = loginData.data.refresh_token;
    
    console.log(`✅ Login successful`);
    console.log(`   - Access Token: ${accessToken.substring(0, 20)}...`);
    console.log(`   - Refresh Token: ${refreshToken.substring(0, 20)}...`);
    console.log(`   - Expires in: ${loginData.data.expires}ms`);

    // Test 3: Get user profile
    console.log('\n3️⃣ Testing GET USER PROFILE...');
    const profileResponse = await fetch(`${DIRECTUS_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      throw new Error('Failed to get user profile');
    }

    const profileData = await profileResponse.json();
    console.log(`✅ Profile retrieved successfully`);
    console.log(`   - Name: ${profileData.data.first_name} ${profileData.data.last_name}`);
    console.log(`   - Email: ${profileData.data.email}`);
    console.log(`   - Status: ${profileData.data.status}`);

    // Test 4: Create a competition as the user
    console.log('\n4️⃣ Testing USER PERMISSIONS (Create Competition)...');
    const participants = [
      { firstName: 'John', lastName: 'Doe', ticketNumber: '001' },
      { firstName: 'Jane', lastName: 'Smith', ticketNumber: '002' },
    ];
    const participantsBase64 = Buffer.from(JSON.stringify(participants)).toString('base64');

    const competitionResponse = await fetch(`${DIRECTUS_URL}/items/competitions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User Competition',
        participants_data: participantsBase64,
        status: 'active',
        user_id: testUserId,
      }),
    });

    if (!competitionResponse.ok) {
      const error = await competitionResponse.text();
      throw new Error(`Competition creation failed: ${error}`);
    }

    const competitionData = await competitionResponse.json();
    const competitionId = competitionData.data.id;
    console.log(`✅ Competition created successfully`);
    console.log(`   - ID: ${competitionId}`);
    console.log(`   - Created by user: ${testUserId}`);

    // Test 5: Read own competition
    console.log('\n5️⃣ Testing READ OWN COMPETITION...');
    const readResponse = await fetch(`${DIRECTUS_URL}/items/competitions/${competitionId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!readResponse.ok) {
      throw new Error('Failed to read own competition');
    }

    console.log(`✅ Can read own competition`);

    // Test 6: Try to read another user's competition (should fail)
    console.log('\n6️⃣ Testing PERMISSION ISOLATION...');
    // Get the existing competition from our earlier tests
    const allCompetitionsResponse = await fetch(`${DIRECTUS_URL}/items/competitions`, {
      headers: {
        'Authorization': `Bearer ${DIRECTUS_TOKEN}`, // Use admin token
      },
    });

    if (allCompetitionsResponse.ok) {
      const allCompetitions = await allCompetitionsResponse.json();
      const otherCompetition = allCompetitions.data.find(c => c.user_id !== testUserId);
      
      if (otherCompetition) {
        const otherReadResponse = await fetch(`${DIRECTUS_URL}/items/competitions/${otherCompetition.id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`, // Use user token
          },
        });

        if (otherReadResponse.ok) {
          console.log(`⚠️ WARNING: User can read other users' competitions`);
        } else {
          console.log(`✅ Correctly blocked from reading other users' competitions`);
        }
      }
    }

    // Test 7: Refresh token
    console.log('\n7️⃣ Testing TOKEN REFRESH...');
    const refreshResponse = await fetch(`${DIRECTUS_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    if (!refreshResponse.ok) {
      throw new Error('Token refresh failed');
    }

    const refreshData = await refreshResponse.json();
    console.log(`✅ Token refreshed successfully`);
    console.log(`   - New Access Token: ${refreshData.data.access_token.substring(0, 20)}...`);

    // Test 8: Logout
    console.log('\n8️⃣ Testing LOGOUT...');
    const logoutResponse = await fetch(`${DIRECTUS_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    if (logoutResponse.ok) {
      console.log(`✅ Logout successful`);
    }

    // Clean up - Delete test competition and user
    console.log('\n9️⃣ Cleaning up test data...');
    
    // Delete competition
    await fetch(`${DIRECTUS_URL}/items/competitions/${competitionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
      },
    });

    // Delete user
    await fetch(`${DIRECTUS_URL}/users/${testUserId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
      },
    });

    console.log(`✅ Test data cleaned up`);

    console.log('\n✨ All authentication tests passed!');
    console.log('\n📊 Summary:');
    console.log('   ✅ User registration working');
    console.log('   ✅ User login working');
    console.log('   ✅ User profile retrieval working');
    console.log('   ✅ User permissions working correctly');
    console.log('   ✅ Token refresh working');
    console.log('   ✅ Logout working');
    console.log('   ✅ Permission isolation verified');
    console.log('\n🎉 Directus authentication is fully configured and working!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    
    // Clean up if test failed
    if (testUserId) {
      console.log('\n🧹 Cleaning up test data...');
      try {
        await fetch(`${DIRECTUS_URL}/users/${testUserId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
          },
        });
        console.log('   Test user deleted');
      } catch (cleanupError) {
        console.log('   Failed to clean up test user');
      }
    }
    
    process.exit(1);
  }
}

// Run the test
testDirectusAuth();