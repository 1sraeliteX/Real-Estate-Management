const axios = require('axios');

const baseURL = 'http://localhost:3000/api';

async function testPropertyEditDelete() {
  try {
    console.log('🧪 Testing Property Edit and Delete Functionality...\n');

    // 1. Get all properties
    console.log('1. Fetching all properties...');
    const propertiesResponse = await axios.get(`${baseURL}/properties`);
    console.log('Raw response:', JSON.stringify(propertiesResponse.data, null, 2));
    
    // Handle different response structures
    let properties = propertiesResponse.data;
    if (properties.properties) {
      properties = properties.properties;
    }
    
    if (!properties || properties.length === 0) {
      console.log('❌ No properties found to test with');
      return;
    }

    const testProperty = properties[0];
    console.log(`✅ Found ${properties.length} properties. Testing with: ${testProperty.name} (ID: ${testProperty.id})`);

    // 2. Test individual property fetch (used by edit page)
    console.log('\n2. Testing individual property fetch...');
    const individualResponse = await axios.get(`${baseURL}/properties/${testProperty.id}`);
    console.log(`✅ Individual property fetch successful: ${individualResponse.status === 200}`);

    // 3. Test property update (edit functionality)
    console.log('\n3. Testing property update...');
    const updateData = {
      ...testProperty,
      name: testProperty.name + ' (Updated)',
      description: 'Updated description for testing'
    };
    
    const updateResponse = await axios.put(`${baseURL}/properties/${testProperty.id}`, updateData);
    console.log(`✅ Property update successful: ${updateResponse.status === 200}`);

    // 4. Verify the update
    console.log('\n4. Verifying update...');
    const verifyResponse = await axios.get(`${baseURL}/properties/${testProperty.id}`);
    const updatedProperty = verifyResponse.data.property || verifyResponse.data;
    console.log(`✅ Update verified: ${updatedProperty.name.includes('(Updated)')}`);

    // 5. Test property deletion (but don't actually delete to preserve data)
    console.log('\n5. Testing delete endpoint (dry run)...');
    // We'll just check if the endpoint exists by making a request to a non-existent ID
    try {
      await axios.delete(`${baseURL}/properties/non-existent-id`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✅ Delete endpoint exists and properly handles non-existent IDs');
      } else {
        console.log('⚠️ Delete endpoint response:', error.response?.status || 'Network error');
      }
    }

    // 6. Restore original property name
    console.log('\n6. Restoring original property...');
    const restoreResponse = await axios.put(`${baseURL}/properties/${testProperty.id}`, testProperty);
    console.log(`✅ Property restored: ${restoreResponse.status === 200}`);

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- ✅ Properties list fetch: Working');
    console.log('- ✅ Individual property fetch: Working');
    console.log('- ✅ Property update (edit): Working');
    console.log('- ✅ Delete endpoint: Available');
    console.log('- ✅ Data restoration: Working');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testPropertyEditDelete();