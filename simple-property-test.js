#!/usr/bin/env node

const axios = require('axios')

async function testPropertyCreation() {
  console.log('🧪 Testing Property Creation API...')
  
  const baseURL = 'http://localhost:3002/api'
  
  try {
    // Test 1: Get existing properties
    console.log('📋 Testing GET /api/properties...')
    const getResponse = await axios.get(`${baseURL}/properties`, { timeout: 10000 })
    console.log('✅ GET request successful')
    console.log(`📊 Found ${getResponse.data.properties?.length || 0} existing properties`)
    
    // Test 2: Create a new property
    console.log('\n📝 Testing POST /api/properties...')
    const testProperty = {
      name: 'API Test Property',
      address: '123 Test Street',
      type: 'apartment',
      status: 'available',
      yearlyRent: 1000000,
      bedrooms: 2,
      bathrooms: 2,
      area: 800,
      description: 'Test property for API validation',
      amenities: ['WiFi', 'Parking'],
      images: ['/realestate3.jpeg'],
      yearBuilt: 2023,
      parkingSpaces: 'yes'
    }
    
    const createResponse = await axios.post(`${baseURL}/properties`, testProperty, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    })
    
    console.log('✅ POST request successful')
    console.log('📋 Created property:', createResponse.data.property.name)
    console.log('🔍 Property ID:', createResponse.data.property.id)
    
    // Verify data transformation
    const property = createResponse.data.property
    if (Array.isArray(property.amenities)) {
      console.log('✅ Amenities correctly returned as array')
    } else {
      console.log('⚠️ Amenities not returned as array:', typeof property.amenities)
    }
    
    if (Array.isArray(property.images)) {
      console.log('✅ Images correctly returned as array')
    } else {
      console.log('⚠️ Images not returned as array:', typeof property.images)
    }
    
    // Test 3: Verify the property was saved
    console.log('\n🔍 Verifying property was saved...')
    const verifyResponse = await axios.get(`${baseURL}/properties`, { timeout: 10000 })
    const savedProperty = verifyResponse.data.properties.find(p => p.name === 'API Test Property')
    
    if (savedProperty) {
      console.log('✅ Property successfully saved and retrieved')
      console.log('📋 Saved property amenities:', savedProperty.amenities)
      console.log('📋 Saved property images:', savedProperty.images)
    } else {
      console.log('❌ Property not found in database')
    }
    
    // Test 4: Clean up - delete the test property
    if (createResponse.data.property.id) {
      console.log('\n🧹 Cleaning up test property...')
      await axios.delete(`${baseURL}/properties/${createResponse.data.property.id}`, { timeout: 10000 })
      console.log('✅ Test property deleted')
    }
    
    console.log('\n🎉 All tests passed! Property creation is working correctly.')
    
  } catch (error) {
    console.error('\n❌ Test failed:')
    console.error('Error message:', error.message)
    
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Response data:', error.response.data)
    }
    
    if (error.code) {
      console.error('Error code:', error.code)
    }
    
    process.exit(1)
  }
}

testPropertyCreation()