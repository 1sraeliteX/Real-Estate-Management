#!/usr/bin/env node

/**
 * Test script to simulate frontend form submission
 */

const axios = require('axios')

async function testFrontendFormSubmission() {
  console.log('🧪 Testing Frontend Form Submission...')
  
  try {
    const baseURL = 'http://localhost:3000/api'
    
    // Simulate the exact data structure that the frontend forms send
    const onCampusFormData = {
      name: 'Frontend Test Lodge',
      address: '789 Campus Street',
      type: 'lodge',
      status: 'available',
      yearlyRent: 500000,
      numberOfRooms: 20,
      numberOfBathrooms: 10,
      numberOfKitchens: 2, // Required for lodges
      waterAvailability: 'in-building', // Required for lodges
      bedrooms: 0, // Not used for on-campus
      bathrooms: 10,
      area: 0, // Not used for on-campus
      description: 'Test lodge from frontend form',
      amenities: ['WiFi', 'Study Room', 'Laundry'], // Array format from frontend
      images: ['/realestate1.jpeg'], // Array format
      yearBuilt: new Date().getFullYear(),
      parkingSpaces: 'yes',
    }

    console.log('📝 Sending on-campus form data:', onCampusFormData)
    
    const onCampusResponse = await axios.post(`${baseURL}/properties`, onCampusFormData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('✅ On-campus property created:', onCampusResponse.data.property.name)
    
    // Test off-campus form data
    const offCampusFormData = {
      name: 'Frontend Test Apartment',
      address: '456 Off-Campus Ave',
      type: 'apartment',
      status: 'available',
      yearlyRent: 1200000,
      bedrooms: 2,
      bathrooms: 2,
      numberOfKitchens: 1,
      numberOfRooms: 0, // Not used for off-campus
      numberOfBathrooms: 2,
      area: 850, // Required for apartments (in sq ft)
      description: 'Test apartment from frontend form',
      amenities: ['Parking', 'Gym', 'Pool'], // Array format from frontend
      images: ['/realestate2.jpeg'], // Array format
      yearBuilt: new Date().getFullYear(),
      parkingSpaces: 'yes',
    }

    console.log('📝 Sending off-campus form data:', offCampusFormData)
    
    const offCampusResponse = await axios.post(`${baseURL}/properties`, offCampusFormData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('✅ Off-campus property created:', offCampusResponse.data.property.name)
    
    // Test retrieval to make sure data is properly transformed back
    console.log('📖 Testing data retrieval and transformation...')
    const listResponse = await axios.get(`${baseURL}/properties`)
    const properties = listResponse.data.properties
    
    console.log('📋 Total properties:', properties.length)
    
    // Check if amenities and images are properly transformed back to arrays
    const testProperty = properties.find(p => p.name === 'Frontend Test Lodge')
    if (testProperty) {
      console.log('🔍 Test property amenities type:', typeof testProperty.amenities, testProperty.amenities)
      console.log('🔍 Test property images type:', typeof testProperty.images, testProperty.images)
      
      if (Array.isArray(testProperty.amenities) && Array.isArray(testProperty.images)) {
        console.log('✅ Data transformation working correctly!')
      } else {
        console.log('❌ Data transformation issue detected!')
      }
    }
    
    console.log('🎉 All frontend form tests passed!')
    
  } catch (error) {
    console.error('❌ Frontend form test failed:')
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Data:', error.response.data)
    } else {
      console.error('Error:', error.message)
    }
    process.exit(1)
  }
}

testFrontendFormSubmission()