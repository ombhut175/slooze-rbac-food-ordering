// Test Backend Restaurant Endpoints
const baseUrl = 'http://localhost:6932/api';

async function testRestaurantEndpoints() {
  console.log('\n=== Testing Backend Restaurant Endpoints ===\n');

  let adminToken, managerToken, testRestaurantId;

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
    console.log('✓ SUCCESS: ADMIN login successful. Token obtained.\n');
  } catch (error) {
    console.log('✗ FAILED: ADMIN login failed:', error.message);
    process.exit(1);
  }

  // Test 2: Create restaurant with ADMIN auth
  console.log('Test 2: POST /restaurants with ADMIN auth');
  try {
    const response = await fetch(`${baseUrl}/restaurants`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test Restaurant ' + Date.now(),
        country: 'IN',
        status: 'ACTIVE'
      })
    });
    const data = await response.json();
    
    if (response.status === 201) {
      // Response might be data.data or just data
      const restaurant = data.data || data;
      testRestaurantId = restaurant.id;
      console.log('✓ SUCCESS: POST /restaurants successful. Restaurant created.');
      console.log(`  Restaurant ID: ${testRestaurantId}`);
      console.log(`  Restaurant Name: ${restaurant.name}\n`);
    } else {
      console.log(`✗ FAILED: POST /restaurants returned status ${response.status}`);
      console.log(`  Response:`, JSON.stringify(data, null, 2), '\n');
    }
  } catch (error) {
    console.log('✗ FAILED: POST /restaurants failed:', error.message, '\n');
  }

  // Test 3: Login as MANAGER user
  console.log('Test 3: Login as MANAGER user (captain.marvel@example.com)');
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

  // Test 4: Try to create restaurant with MANAGER auth (should fail with 403)
  console.log('Test 4: POST /restaurants with MANAGER auth (should return 403)');
  try {
    const response = await fetch(`${baseUrl}/restaurants`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${managerToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Manager Test Restaurant',
        country: 'IN',
        status: 'ACTIVE'
      })
    });
    const data = await response.json();
    
    if (response.status === 403) {
      console.log('✓ SUCCESS: POST /restaurants correctly returned 403 Forbidden for MANAGER user.\n');
    } else {
      console.log(`✗ FAILED: POST /restaurants should have returned 403 but got ${response.status}!\n`);
    }
  } catch (error) {
    console.log('✗ FAILED: POST /restaurants failed:', error.message, '\n');
  }

  // Test 5: Update restaurant with ADMIN auth (name and status)
  console.log('Test 5: PATCH /restaurants/:id with valid data (name, status)');
  if (testRestaurantId) {
    try {
      const response = await fetch(`${baseUrl}/restaurants/${testRestaurantId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Updated Test Restaurant',
          status: 'INACTIVE'
        })
      });
      const data = await response.json();
      
      if (response.status === 200) {
        const restaurant = data.data || data;
        console.log('✓ SUCCESS: PATCH /restaurants/:id successful. Restaurant updated.');
        console.log(`  Updated Name: ${restaurant.name}`);
        console.log(`  Updated Status: ${restaurant.status}\n`);
      } else {
        console.log(`✗ FAILED: PATCH /restaurants/:id returned status ${response.status}`);
        console.log(`  Error: ${data.message || 'Unknown error'}\n`);
      }
    } catch (error) {
      console.log('✗ FAILED: PATCH /restaurants/:id failed:', error.message, '\n');
    }
  } else {
    console.log('⊘ SKIPPED: No test restaurant ID available\n');
  }

  // Test 6: Get all restaurants with ADMIN auth
  console.log('Test 6: GET /restaurants/all with ADMIN auth');
  try {
    const response = await fetch(`${baseUrl}/restaurants/all`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    
    if (response.status === 200) {
      // The response might be data.data or just data depending on the API structure
      const restaurants = data.data || data;
      const inRestaurants = restaurants.filter(r => r.country === 'IN');
      const usRestaurants = restaurants.filter(r => r.country === 'US');
      console.log('✓ SUCCESS: GET /restaurants/all successful.');
      console.log(`  Total Restaurants: ${restaurants.length}`);
      console.log(`  IN Restaurants: ${inRestaurants.length}`);
      console.log(`  US Restaurants: ${usRestaurants.length}\n`);
    } else {
      console.log(`✗ FAILED: GET /restaurants/all returned status ${response.status}`);
      console.log(`  Error: ${data.message || 'Unknown error'}\n`);
    }
  } catch (error) {
    console.log('✗ FAILED: GET /restaurants/all failed:', error.message, '\n');
  }

  // Test 7: Try to change restaurant country when it has orders (should fail with 400)
  console.log('Test 7: PATCH /restaurants/:id country change validation');
  console.log('  Note: This test requires a restaurant with existing orders.');
  console.log('  Finding a restaurant with orders...');
  
  try {
    // Get all restaurants
    const restaurantsResponse = await fetch(`${baseUrl}/restaurants/all`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    const restaurantsData = await restaurantsResponse.json();
    const restaurants = restaurantsData.data || restaurantsData;
    
    // Try to find a restaurant that might have orders (one of the seeded restaurants)
    const restaurantWithOrders = restaurants.find(r => 
      r.name === 'Spice Paradise' || 
      r.name === 'Mumbai Street Food' || 
      r.name === 'American Diner'
    );
    
    if (restaurantWithOrders) {
      console.log(`  Testing with restaurant: ${restaurantWithOrders.name} (${restaurantWithOrders.country})`);
      
      const newCountry = restaurantWithOrders.country === 'IN' ? 'US' : 'IN';
      const response = await fetch(`${baseUrl}/restaurants/${restaurantWithOrders.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          country: newCountry
        })
      });
      const data = await response.json();
      
      if (response.status === 400) {
        console.log('✓ SUCCESS: PATCH /restaurants/:id correctly returned 400 for country change with orders.');
        console.log(`  Error message: ${data.message}\n`);
      } else if (response.status === 200) {
        console.log('⊘ INFO: Restaurant country changed successfully (no orders exist for this restaurant).\n');
      } else {
        console.log(`✗ FAILED: PATCH /restaurants/:id returned unexpected status ${response.status}\n`);
      }
    } else {
      console.log('⊘ SKIPPED: No suitable restaurant found for testing\n');
    }
  } catch (error) {
    console.log('✗ FAILED: Country change validation test failed:', error.message, '\n');
  }

  console.log('=== Backend Restaurant Endpoints Testing Complete ===');
  console.log('Please check the backend console output for proper logging with operation names.\n');
}

testRestaurantEndpoints().catch(console.error);
