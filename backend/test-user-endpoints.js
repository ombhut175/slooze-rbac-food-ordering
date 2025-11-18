// Test Backend User Endpoints
const baseUrl = 'http://localhost:6932/api';

async function testUserEndpoints() {
  console.log('\n=== Testing Backend User Endpoints ===\n');

  let adminToken, adminUserId, testUserId, testUserRole, testUserCountry;

  // Test 1: Login as ADMIN user
  console.log('Test 1: Login as ADMIN user (nick@example.com)');
  try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nick@example.com',
        password: 'Password123!'
      })
    });
    const data = await response.json();
    adminToken = data.data.tokens.access_token;
    adminUserId = data.data.user.id;
    console.log('✓ SUCCESS: ADMIN login successful. Token obtained.');
    console.log(`  Admin User ID: ${adminUserId}\n`);
  } catch (error) {
    console.log('✗ FAILED: ADMIN login failed:', error.message);
    process.exit(1);
  }

  // Test 2: Get all users with ADMIN auth
  console.log('Test 2: GET /users with ADMIN auth');
  try {
    const response = await fetch(`${baseUrl}/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    
    if (!response.ok) {
      console.log(`✗ FAILED: GET /users returned status ${response.status}`);
      console.log(`  Error: ${data.message || 'Unknown error'}\n`);
      process.exit(1);
    }
    
    const allUsers = data.data;
    console.log(`✓ SUCCESS: GET /users successful. Retrieved ${allUsers.length} users.`);
    
    // Find thanos user for testing
    const testUser = allUsers.find(u => u.email === 'thanos@example.com');
    testUserId = testUser.id;
    testUserRole = testUser.role;
    testUserCountry = testUser.country;
    console.log(`  Test User: ${testUser.email} (Role: ${testUserRole}, Country: ${testUserCountry})\n`);
  } catch (error) {
    console.log('✗ FAILED: GET /users failed:', error.message);
    process.exit(1);
  }

  // Test 3: Update user role with ADMIN auth
  console.log('Test 3: PATCH /users/:id/role with ADMIN auth');
  const newRole = testUserRole === 'MEMBER' ? 'MANAGER' : 'MEMBER';
  try {
    const response = await fetch(`${baseUrl}/users/${testUserId}/role`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role: newRole })
    });
    const data = await response.json();
    console.log(`✓ SUCCESS: PATCH /users/:id/role successful. Changed role from ${testUserRole} to ${newRole}.`);
    console.log(`  Response: ${data.message}\n`);
  } catch (error) {
    console.log('✗ FAILED: PATCH /users/:id/role failed:', error.message, '\n');
  }

  // Test 4: Update user country with ADMIN auth
  console.log('Test 4: PATCH /users/:id/country with ADMIN auth');
  const newCountry = testUserCountry === 'IN' ? 'US' : 'IN';
  try {
    const response = await fetch(`${baseUrl}/users/${testUserId}/country`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ country: newCountry })
    });
    const data = await response.json();
    console.log(`✓ SUCCESS: PATCH /users/:id/country successful. Changed country from ${testUserCountry} to ${newCountry}.`);
    console.log(`  Response: ${data.message}\n`);
  } catch (error) {
    console.log('✗ FAILED: PATCH /users/:id/country failed:', error.message, '\n');
  }

  // Test 5: Login as MANAGER user
  console.log('Test 5: Login as MANAGER user (captain.marvel@example.com)');
  let managerToken;
  try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'captain.marvel@example.com',
        password: 'Password123!'
      })
    });
    const data = await response.json();
    managerToken = data.data.tokens.access_token;
    console.log('✓ SUCCESS: MANAGER login successful. Token obtained.\n');
  } catch (error) {
    console.log('✗ FAILED: MANAGER login failed:', error.message);
    process.exit(1);
  }

  // Test 6: Try to update user role with MANAGER auth (should fail with 403)
  console.log('Test 6: PATCH /users/:id/role with MANAGER auth (should return 403)');
  try {
    const response = await fetch(`${baseUrl}/users/${testUserId}/role`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${managerToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role: newRole })
    });
    const data = await response.json();
    if (response.status === 403) {
      console.log('✓ SUCCESS: PATCH /users/:id/role correctly returned 403 Forbidden for MANAGER user.\n');
    } else {
      console.log(`✗ FAILED: PATCH /users/:id/role should have returned 403 but got ${response.status}!\n`);
    }
  } catch (error) {
    console.log('✗ FAILED: PATCH /users/:id/role failed:', error.message, '\n');
  }

  // Test 7: Try self-demotion (ADMIN changing own role to MEMBER, should fail with 400)
  console.log('Test 7: PATCH /users/:id/role with self-demotion (should return 400)');
  try {
    const response = await fetch(`${baseUrl}/users/${adminUserId}/role`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role: 'MEMBER' })
    });
    const data = await response.json();
    if (response.status === 400) {
      console.log('✓ SUCCESS: Self-demotion correctly returned 400 Bad Request.');
      console.log(`  Error message: ${data.message}\n`);
    } else {
      console.log(`✗ FAILED: Self-demotion should have returned 400 but got ${response.status}!\n`);
    }
  } catch (error) {
    console.log('✗ FAILED: Self-demotion failed:', error.message, '\n');
  }

  console.log('=== Backend User Endpoints Testing Complete ===');
  console.log('Please check the backend console output for proper logging with operation names.\n');
}

testUserEndpoints().catch(console.error);
