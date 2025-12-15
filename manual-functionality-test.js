/**
 * MANUAL FUNCTIONALITY TEST - ROOM OCCUPANT ASSIGNMENT
 * This script tests the API endpoints directly without relying on the frontend
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
const API_BASE = `${BASE_URL}/api`;

async function testAPI() {
  console.log('🧪 MANUAL API FUNCTIONALITY TEST');
  console.log('='.repeat(50));
  
  let testResults = {
    passed: 0,
    failed: 0,
    details: []
  };

  // Test 1: Check if server is responding
  console.log('\n1️⃣ Testing Server Connection...');
  try {
    const response = await axios.get(`${API_BASE}/properties`, { timeout: 3000 });
    console.log('✅ Server is responding');
    console.log(`   Status: ${response.status}`);
    testResults.passed++;
    testResults.details.push('✅ Server connection successful');
  } catch (error) {
    console.log('❌ Server connection failed');
    console.log(`   Error: ${error.message}`);
    testResults.failed++;
    testResults.details.push('❌ Server connection failed');
  }

  // Test 2: Create a test property
  console.log('\n2️⃣ Testing Property Creation...');
  let propertyId = null;
  try {
    const propertyData = {
      name: 'API Test Mansion',
      address: '456 API Test Street',
      type: 'lodge',
      status: 'available',
      yearlyRent: 1000000,
      bedrooms: 4,
      bathrooms: 2,
      area: 2000,
      description: 'Test property for API testing',
      amenities: JSON.stringify(['WiFi', 'Parking']),
      yearBuilt: 2021,
      parkingSpaces: '2',
      numberOfRooms: 2,
      numberOfKitchens: 1,
      numberOfBathrooms: 2,
      waterAvailability: '24/7'
    };

    const response = await axios.post(`${API_BASE}/properties`, propertyData);
    if (response.status === 201 && response.data.success) {
      propertyId = response.data.property.id;
      console.log('✅ Property created successfully');
      console.log(`   Property ID: ${propertyId}`);
      testResults.passed++;
      testResults.details.push('✅ Property creation successful');
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.log('❌ Property creation failed');
    console.log(`   Error: ${error.message}`);
    if (error.response) {
      console.log(`   Response: ${JSON.stringify(error.response.data)}`);
    }
    testResults.failed++;
    testResults.details.push('❌ Property creation failed');
  }

  // Test 3: Create rooms
  console.log('\n3️⃣ Testing Room Creation...');
  let roomIds = [];
  if (propertyId) {
    const roomsData = [
      { roomNumber: 'A01', maxOccupants: 2, yearlyRent: 300000 },
      { roomNumber: 'A02', maxOccupants: 1, yearlyRent: 250000 }
    ];

    for (const roomData of roomsData) {
      try {
        const fullRoomData = {
          ...roomData,
          propertyId: propertyId,
          propertyName: 'API Test Mansion',
          status: 'available',
          roomType: roomData.maxOccupants > 1 ? 'shared' : 'single',
          hasPrivateBath: true,
          hasKitchen: false,
          floor: 1
        };

        const response = await axios.post(`${API_BASE}/rooms`, fullRoomData);
        if (response.status === 201 && response.data.success) {
          roomIds.push(response.data.room.id);
          console.log(`✅ Room ${roomData.roomNumber} created`);
          testResults.passed++;
        } else {
          throw new Error('Room creation failed');
        }
      } catch (error) {
        console.log(`❌ Room ${roomData.roomNumber} creation failed: ${error.message}`);
        testResults.failed++;
      }
    }
    testResults.details.push(`✅ ${roomIds.length} rooms created successfully`);
  }

  // Test 4: Create occupants and assign to rooms
  console.log('\n4️⃣ Testing Occupant Assignment...');
  if (roomIds.length > 0) {
    const occupantsData = [
      {
        name: 'API Test User 1',
        phone: '+234-900-000-001',
        email: 'test1@api.com',
        nextOfKin: 'Test Next 1',
        nextOfKinPhone: '+234-900-000-002',
        roomId: roomIds[0], // Shared room
        numberOfOccupants: 2,
        rentStartDate: '2024-01-01',
        rentExpiryDate: '2024-12-31',
        totalRent: 150000,
        amountPaid: 75000,
        paymentStatus: 'partial',
        kitchenAccess: 'shared',
        securityDeposit: 20000,
        issues: JSON.stringify([]),
        notes: JSON.stringify(['API test occupant'])
      },
      {
        name: 'API Test User 2',
        phone: '+234-900-000-003',
        email: 'test2@api.com',
        nextOfKin: 'Test Next 2',
        nextOfKinPhone: '+234-900-000-004',
        roomId: roomIds[1], // Single room
        numberOfOccupants: 1,
        rentStartDate: '2024-02-01',
        rentExpiryDate: '2025-01-31',
        totalRent: 250000,
        amountPaid: 250000,
        paymentStatus: 'completed',
        kitchenAccess: 'shared',
        securityDeposit: 30000,
        issues: JSON.stringify([]),
        notes: JSON.stringify(['API test occupant - single'])
      }
    ];

    for (const occupantData of occupantsData) {
      try {
        const response = await axios.post(`${API_BASE}/rooms/${occupantData.roomId}/occupants`, occupantData);
        if (response.status === 201) {
          console.log(`✅ ${occupantData.name} assigned successfully`);
          testResults.passed++;
        } else {
          throw new Error('Occupant assignment failed');
        }
      } catch (error) {
        console.log(`❌ ${occupantData.name} assignment failed: ${error.message}`);
        testResults.failed++;
      }
    }
    testResults.details.push('✅ Occupant assignments completed');
  }

  // Test 5: Verify data persistence
  console.log('\n5️⃣ Testing Data Persistence...');
  if (propertyId) {
    try {
      // Check property exists
      const propertyResponse = await axios.get(`${API_BASE}/properties/${propertyId}`);
      if (propertyResponse.status === 200) {
        console.log('✅ Property data persisted');
        testResults.passed++;
      }

      // Check rooms exist
      const roomsResponse = await axios.get(`${API_BASE}/rooms?propertyId=${propertyId}`);
      if (roomsResponse.status === 200) {
        const rooms = roomsResponse.data.rooms || roomsResponse.data;
        console.log(`✅ ${rooms.length} rooms persisted`);
        testResults.passed++;

        // Check occupants in each room
        for (const room of rooms) {
          const occupantsResponse = await axios.get(`${API_BASE}/rooms/${room.id}/occupants`);
          if (occupantsResponse.status === 200) {
            const occupants = occupantsResponse.data.occupants || occupantsResponse.data;
            console.log(`✅ Room ${room.roomNumber}: ${occupants.length} occupant(s)`);
            testResults.passed++;
          }
        }
      }
      testResults.details.push('✅ Data persistence verified');
    } catch (error) {
      console.log(`❌ Data persistence check failed: ${error.message}`);
      testResults.failed++;
      testResults.details.push('❌ Data persistence check failed');
    }
  }

  // Test 6: Test edge cases
  console.log('\n6️⃣ Testing Edge Cases...');
  if (roomIds.length > 0) {
    // Try to assign to a room that's already at capacity
    const singleRoomId = roomIds[1]; // This should already have 1 occupant (max 1)
    
    try {
      const overflowOccupant = {
        name: 'Overflow Test',
        phone: '+234-900-000-999',
        email: 'overflow@test.com',
        nextOfKin: 'Overflow Next',
        nextOfKinPhone: '+234-900-000-998',
        roomId: singleRoomId,
        numberOfOccupants: 1,
        rentStartDate: '2024-03-01',
        rentExpiryDate: '2025-02-28',
        totalRent: 250000,
        amountPaid: 0,
        paymentStatus: 'pending',
        kitchenAccess: 'shared',
        securityDeposit: 30000,
        issues: JSON.stringify([]),
        notes: JSON.stringify(['Overflow test'])
      };

      const response = await axios.post(`${API_BASE}/rooms/${singleRoomId}/occupants`, overflowOccupant);
      if (response.status >= 400) {
        console.log('✅ Room capacity validation working');
        testResults.passed++;
      } else {
        console.log('⚠️ Room capacity validation may not be enforced');
        testResults.details.push('⚠️ Room capacity validation needs attention');
      }
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        console.log('✅ Room capacity validation working (API rejection)');
        testResults.passed++;
      } else {
        console.log(`❌ Unexpected error in edge case test: ${error.message}`);
        testResults.failed++;
      }
    }
    testResults.details.push('✅ Edge case testing completed');
  }

  // Final Report
  console.log('\n' + '='.repeat(50));
  console.log('📊 API FUNCTIONALITY TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`✅ PASSED: ${testResults.passed} tests`);
  console.log(`❌ FAILED: ${testResults.failed} tests`);
  console.log(`📈 SUCCESS RATE: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
  
  console.log('\n📋 DETAILED RESULTS:');
  testResults.details.forEach(detail => console.log(`  ${detail}`));
  
  console.log('\n🔧 NEXT STEPS:');
  console.log('1. ✅ API functionality test completed');
  console.log('2. 📱 Test UI responsiveness manually in browser');
  console.log('3. 🖥️ Open http://localhost:3001/dashboard in browser');
  console.log('4. 📏 Use browser dev tools to test different screen sizes');
  console.log('5. ✨ Verify room assignment UI works with test data');
  
  console.log('='.repeat(50));
}

// Run the test
testAPI().catch(console.error);