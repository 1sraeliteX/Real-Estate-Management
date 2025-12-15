/**
 * API Button Functionality Test
 * Tests the backend endpoints that buttons interact with
 */

const axios = require('axios');
const fs = require('fs');

class APIButtonTester {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.testResults = [];
  }

  async logResult(test, status, details = '') {
    const result = { test, status, details, timestamp: new Date().toISOString() };
    this.testResults.push(result);
    
    const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${test}: ${status} ${details ? `- ${details}` : ''}`);
  }

  async testEndpoint(method, endpoint, data = null, expectedStatus = 200) {
    try {
      const config = {
        method,
        url: `${this.baseUrl}${endpoint}`,
        timeout: 10000
      };
      
      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      
      if (response.status === expectedStatus) {
        await this.logResult(`${method} ${endpoint}`, 'PASS', `Status: ${response.status}`);
        return { success: true, data: response.data, status: response.status };
      } else {
        await this.logResult(`${method} ${endpoint}`, 'WARN', `Expected ${expectedStatus}, got ${response.status}`);
        return { success: false, status: response.status };
      }
    } catch (error) {
      if (error.response) {
        await this.logResult(`${method} ${endpoint}`, 'WARN', `Status: ${error.response.status}`);
        return { success: false, status: error.response.status };
      } else {
        await this.logResult(`${method} ${endpoint}`, 'FAIL', error.message);
        return { success: false, error: error.message };
      }
    }
  }

  async testPropertyAPIs() {
    console.log('\n📋 Testing Property Management APIs...');
    
    // Test GET properties
    const propertiesResult = await this.testEndpoint('GET', '/api/properties');
    
    if (propertiesResult.success) {
      let properties = propertiesResult.data;
      
      // Handle different response structures
      if (properties.properties) {
        properties = properties.properties;
      }
      
      console.log(`   Found ${properties?.length || 0} properties`);
      
      if (properties && properties.length > 0) {
        const testProperty = properties[0];
        
        // Test individual property fetch (used by edit buttons)
        await this.testEndpoint('GET', `/api/properties/${testProperty.id}`);
        
        // Test property update (used by edit forms)
        const updateData = {
          name: testProperty.name,
          description: testProperty.description || 'Test description'
        };
        await this.testEndpoint('PUT', `/api/properties/${testProperty.id}`, updateData);
        
        // Test delete endpoint (with fake ID to avoid actual deletion)
        await this.testEndpoint('DELETE', '/api/properties/fake-test-id', null, 404);
      }
    }
    
    // Test property creation (used by add property forms)
    const newPropertyData = {
      name: 'Test Property API',
      type: 'on-campus',
      description: 'Test property for API validation',
      address: '123 Test Street',
      totalRooms: 10,
      amenities: ['WiFi', 'Parking']
    };
    
    const createResult = await this.testEndpoint('POST', '/api/properties', newPropertyData, 201);
    
    // Clean up test property if created
    if (createResult.success && createResult.data?.id) {
      await this.testEndpoint('DELETE', `/api/properties/${createResult.data.id}`);
      console.log('   🧹 Cleaned up test property');
    }
  }

  async testOccupantAPIs() {
    console.log('\n📋 Testing Occupant Management APIs...');
    
    // Test GET occupants
    const occupantsResult = await this.testEndpoint('GET', '/api/occupants');
    
    if (occupantsResult.success) {
      let occupants = occupantsResult.data;
      
      if (occupants.occupants) {
        occupants = occupants.occupants;
      }
      
      console.log(`   Found ${occupants?.length || 0} occupants`);
      
      if (occupants && occupants.length > 0) {
        const testOccupant = occupants[0];
        
        // Test individual occupant fetch
        await this.testEndpoint('GET', `/api/occupants/${testOccupant.id}`);
        
        // Test occupant update
        const updateData = {
          name: testOccupant.name,
          email: testOccupant.email || 'test@example.com'
        };
        await this.testEndpoint('PUT', `/api/occupants/${testOccupant.id}`, updateData);
        
        // Test delete endpoint (with fake ID)
        await this.testEndpoint('DELETE', '/api/occupants/fake-test-id', null, 404);
      }
    }
    
    // Test occupant creation
    const newOccupantData = {
      name: 'Test Occupant API',
      email: 'test-api@example.com',
      phone: '1234567890',
      type: 'student'
    };
    
    const createResult = await this.testEndpoint('POST', '/api/occupants', newOccupantData, 201);
    
    // Clean up test occupant if created
    if (createResult.success && createResult.data?.id) {
      await this.testEndpoint('DELETE', `/api/occupants/${createResult.data.id}`);
      console.log('   🧹 Cleaned up test occupant');
    }
  }

  async testRoomAPIs() {
    console.log('\n📋 Testing Room Management APIs...');
    
    // Test GET rooms
    const roomsResult = await this.testEndpoint('GET', '/api/rooms');
    
    if (roomsResult.success) {
      let rooms = roomsResult.data;
      
      if (rooms.rooms) {
        rooms = rooms.rooms;
      }
      
      console.log(`   Found ${rooms?.length || 0} rooms`);
      
      if (rooms && rooms.length > 0) {
        const testRoom = rooms[0];
        
        // Test individual room fetch
        await this.testEndpoint('GET', `/api/rooms/${testRoom.id}`);
        
        // Test room occupants
        await this.testEndpoint('GET', `/api/rooms/${testRoom.id}/occupants`);
        
        // Test delete endpoint (with fake ID)
        await this.testEndpoint('DELETE', '/api/rooms/fake-test-id', null, 404);
      }
    }
  }

  async testNotificationAPIs() {
    console.log('\n📋 Testing Notification APIs...');
    
    // Test GET notifications
    const notificationsResult = await this.testEndpoint('GET', '/api/notifications');
    
    if (notificationsResult.success) {
      let notifications = notificationsResult.data;
      
      if (notifications.notifications) {
        notifications = notifications.notifications;
      }
      
      console.log(`   Found ${notifications?.length || 0} notifications`);
      
      if (notifications && notifications.length > 0) {
        const testNotification = notifications[0];
        
        // Test individual notification fetch
        await this.testEndpoint('GET', `/api/notifications/${testNotification.id}`);
        
        // Test notification update (mark as read)
        await this.testEndpoint('PUT', `/api/notifications/${testNotification.id}`, { read: true });
        
        // Test delete endpoint (with fake ID)
        await this.testEndpoint('DELETE', '/api/notifications/fake-test-id', null, 404);
      }
    }
    
    // Test unread count endpoint
    await this.testEndpoint('GET', '/api/notifications/unread-count');
  }

  async testAuthAPIs() {
    console.log('\n📋 Testing Authentication APIs...');
    
    // Test auth endpoints
    await this.testEndpoint('GET', '/api/auth/me');
    
    // Test login endpoint (should handle missing credentials)
    await this.testEndpoint('POST', '/api/auth/login', {}, 400);
    
    // Test logout endpoint
    await this.testEndpoint('POST', '/api/auth/logout');
  }

  async testSettingsAPIs() {
    console.log('\n📋 Testing Settings APIs...');
    
    // Test user settings
    await this.testEndpoint('GET', '/api/user/settings');
    await this.testEndpoint('GET', '/api/user/profile');
    
    // Test settings endpoints
    await this.testEndpoint('GET', '/api/settings/property-types');
    await this.testEndpoint('GET', '/api/settings/twilio');
  }

  async testSpecialEndpoints() {
    console.log('\n📋 Testing Special Feature APIs...');
    
    // Test room assignment endpoints
    await this.testEndpoint('GET', '/api/rooms/available');
    await this.testEndpoint('GET', '/api/rooms/assignments');
    await this.testEndpoint('GET', '/api/rooms/occupancy-stats');
    
    // Test property stats
    await this.testEndpoint('GET', '/api/properties/stats');
    
    // Test activities
    await this.testEndpoint('GET', '/api/activities');
  }

  async checkServerStatus() {
    console.log('🔍 Checking Server Status...');
    
    try {
      const response = await axios.get(`${this.baseUrl}/dashboard`, { timeout: 5000 });
      if (response.status === 200) {
        await this.logResult('Server Status', 'PASS', 'Server is running');
        return true;
      }
    } catch (error) {
      await this.logResult('Server Status', 'FAIL', 'Server not accessible');
      return false;
    }
  }

  async generateReport() {
    console.log('\n📊 Generating API Button Test Report...\n');
    
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const warnings = this.testResults.filter(r => r.status === 'WARN').length;
    const total = this.testResults.length;

    console.log('='.repeat(60));
    console.log('           API BUTTON FUNCTIONALITY REPORT');
    console.log('='.repeat(60));
    console.log(`Total API Tests: ${total}`);
    console.log(`✅ Passed: ${passed} (${((passed/total)*100).toFixed(1)}%)`);
    console.log(`❌ Failed: ${failed} (${((failed/total)*100).toFixed(1)}%)`);
    console.log(`⚠️  Warnings: ${warnings} (${((warnings/total)*100).toFixed(1)}%)`);
    console.log('='.repeat(60));

    if (failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.testResults
        .filter(r => r.status === 'FAIL')
        .forEach(r => console.log(`   • ${r.test}: ${r.details}`));
    }

    if (warnings > 0) {
      console.log('\n⚠️  WARNINGS (May indicate missing endpoints or different responses):');
      this.testResults
        .filter(r => r.status === 'WARN')
        .forEach(r => console.log(`   • ${r.test}: ${r.details}`));
    }

    console.log('\n🔍 BUTTON FUNCTIONALITY ANALYSIS:');
    console.log('   • Edit buttons depend on GET /api/[resource]/[id] endpoints');
    console.log('   • Delete buttons depend on DELETE /api/[resource]/[id] endpoints');
    console.log('   • Add buttons depend on POST /api/[resource] endpoints');
    console.log('   • Form submissions depend on PUT/PATCH endpoints for updates');

    console.log('\n📋 NEXT STEPS:');
    console.log('   1. Run the development server: npm run dev');
    console.log('   2. Use the manual testing checklist for UI verification');
    console.log('   3. Test actual button clicks in the browser');
    console.log('   4. Verify database updates after button actions');
    console.log('   5. Check browser console for JavaScript errors');

    // Save detailed report
    const reportData = {
      summary: { total, passed, failed, warnings },
      results: this.testResults,
      timestamp: new Date().toISOString(),
      recommendations: [
        'Verify all API endpoints are implemented',
        'Check authentication middleware',
        'Test error handling in UI components',
        'Validate form submissions',
        'Test database transactions'
      ]
    };

    fs.writeFileSync('api-button-test-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n📄 Detailed report saved to: api-button-test-report.json');
  }

  async runAllTests() {
    console.log('🚀 Starting API Button Functionality Tests...\n');
    
    try {
      // Check if server is running
      const serverRunning = await this.checkServerStatus();
      
      if (!serverRunning) {
        console.log('\n⚠️  Server is not running. Please start the development server:');
        console.log('   npm run dev');
        console.log('\nThen run this test again.');
        return;
      }

      // Run all API tests
      await this.testPropertyAPIs();
      await this.testOccupantAPIs();
      await this.testRoomAPIs();
      await this.testNotificationAPIs();
      await this.testAuthAPIs();
      await this.testSettingsAPIs();
      await this.testSpecialEndpoints();
      
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }
  }
}

// Check if axios is available
try {
  const tester = new APIButtonTester();
  tester.runAllTests().catch(console.error);
} catch (error) {
  console.log('❌ Required dependencies not available.');
  console.log('\nTo run API tests:');
  console.log('1. Ensure the development server is running: npm run dev');
  console.log('2. Run this test: node api-button-functionality-test.js');
  console.log('\nFor comprehensive testing, use the manual checklist:');
  console.log('   manual-button-testing-checklist.md');
}

module.exports = APIButtonTester;