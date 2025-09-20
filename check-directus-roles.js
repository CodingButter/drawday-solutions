#!/usr/bin/env node

const DIRECTUS_URL = 'https://db.drawday.app';
const ADMIN_EMAIL = 'admin@drawday.app';
const ADMIN_PASSWORD = 'Speed4Dayz1!';

async function main() {
  // Login as admin
  console.log('Logging in as admin...');
  const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  
  const { data } = await loginRes.json();
  const token = data.access_token;
  console.log('✅ Logged in successfully\n');

  // Get roles
  console.log('Fetching available roles...');
  const rolesRes = await fetch(`${DIRECTUS_URL}/roles`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  const rolesData = await rolesRes.json();
  console.log('Available roles:');
  rolesData.data.forEach(role => {
    console.log(`  - ${role.name}: ${role.id}`);
  });

  // Get collections
  console.log('\nFetching collections...');
  const collectionsRes = await fetch(`${DIRECTUS_URL}/collections`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  const collectionsData = await collectionsRes.json();
  console.log('Available collections:');
  collectionsData.data.forEach(col => {
    if (!col.collection.startsWith('directus_')) {
      console.log(`  - ${col.collection}`);
    }
  });

  // Check if competitions collection exists
  console.log('\nChecking competitions collection...');
  const competitionsRes = await fetch(`${DIRECTUS_URL}/collections/competitions`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  if (competitionsRes.ok) {
    console.log('✅ Competitions collection exists');
  } else {
    console.log('❌ Competitions collection does not exist - need to create it');
  }

  // Check if user_settings collection exists
  console.log('\nChecking user_settings collection...');
  const settingsRes = await fetch(`${DIRECTUS_URL}/collections/user_settings`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  if (settingsRes.ok) {
    console.log('✅ User settings collection exists');
  } else {
    console.log('❌ User settings collection does not exist - need to create it');
  }
}

main().catch(console.error);