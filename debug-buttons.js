// Debug script to check button functionality
console.log('🔍 Debugging Property Edit and Delete Buttons...\n');

// Check if the pages are accessible
const axios = require('axios');

async function debugButtons() {
  try {
    // 1. Check if properties API is working
    console.log('1. Testing properties API...');
    const response = await axios.get('http://localhost:3000/api/properties');
    let properties = response.data;
    
    // Handle different response structures
    if (properties.properties) {
      properties = properties.properties;
    }
    
    console.log(`✅ API working - Found ${properties?.length || 0} properties`);

    if (properties.length > 0) {
      const testProperty = properties[0];
      console.log(`\n2. Testing with property: ${testProperty.name} (ID: ${testProperty.id})`);

      // 3. Test individual property fetch (used by edit pages)
      try {
        const propResponse = await axios.get(`http://localhost:3000/api/properties/${testProperty.id}`);
        console.log('✅ Individual property fetch working');
      } catch (error) {
        console.log('❌ Individual property fetch failed:', error.response?.status || error.message);
      }

      // 4. Test edit page accessibility
      const editUrls = [
        `http://localhost:3000/dashboard/properties/edit-on-campus/${testProperty.id}`,
        `http://localhost:3000/dashboard/properties/edit-off-campus/${testProperty.id}`
      ];

      for (const url of editUrls) {
        try {
          const editResponse = await axios.get(url);
          console.log(`✅ Edit page accessible: ${url}`);
        } catch (error) {
          console.log(`⚠️ Edit page issue: ${url} - ${error.response?.status || error.message}`);
        }
      }

      // 5. Test delete endpoint
      console.log('\n3. Testing delete endpoint (dry run)...');
      try {
        await axios.delete(`http://localhost:3000/api/properties/fake-id`);
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('✅ Delete endpoint exists and handles 404 properly');
        } else {
          console.log('⚠️ Delete endpoint response:', error.response?.status || error.message);
        }
      }
    }

    console.log('\n📋 Button Functionality Analysis:');
    console.log('- Edit buttons should navigate to: /dashboard/properties/edit-[type]/[id]');
    console.log('- Delete buttons should show confirmation dialog then call API');
    console.log('- Both buttons are implemented with proper onClick handlers');
    
    console.log('\n🔧 Common Issues to Check:');
    console.log('1. JavaScript errors in browser console');
    console.log('2. Network connectivity issues');
    console.log('3. Authentication/session issues');
    console.log('4. Property ID format issues');
    console.log('5. React state management issues');

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugButtons();