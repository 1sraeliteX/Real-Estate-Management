#!/usr/bin/env node

/**
 * Test script to verify the complete API flow for property creation
 */

const axios = require('axios')

async function testApiFlow() {
  console.log('🧪 Testing Complete API Flow...')
  
  try {
    const baseURL = 'http://localhost:3001/api'
    
    // Test property data matching frontend structure
    const testProperty = {
      name: 'API Test Property',
      address: '456 API Test Street',
      type: 'apartment',
      status: 'available',
      yearlyRent: 1500000,
      bedrooms: 3,
      bathrooms: 2,
      area: 1000,
      description: 'Test property via API',
      amenities: ['WiFi', 'Gym', 'Pool'], // Array format from frontend
      images: ['/realestate2.jpeg', '/realestate3.jpeg'], // Array format
      yearBuilt: 2023,
      parkingSpaces: 'yes'
    }

    console.log('📝 Sending POST request with data:', testProperty)
    
    const response = await axios.post(`${baseURL}/properties`, testProperty, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('✅ API Response:', response.data)
    
    const createdProperty = response.data.property
    
    // Test retrieval
    console.log('📖 Testing property retrieval...')
    const getResponse = await axios.get(`${baseURL}/properties/${createdProperty.id}`)
    console.log('📖 Retrieved property:', getResponse.data)
    
    // Test list all properties
    console.log('📋 Testing properties list...')
    const listResponse = await axios.get(`${baseURL}/properties`)
    console.log('📋 Properties list length:', listResponse.data.properties.length)
    
    console.log('🎉 All API tests passed!')
    
  } catch (error) {
    console.error('❌ API Test failed:')
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Data:', error.response.data)
    } else {
      console.error('Error:', error.message)
    }
    process.exit(1)
  }
}

// Only run if server is available
testApiFlow().catch(error => {
  console.log('⚠️  Server not running. Start with: npm run dev')
  console.log('Error:', error.message)
})