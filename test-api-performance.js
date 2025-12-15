#!/usr/bin/env node

/**
 * Performance test script for optimized API endpoints
 */

const axios = require('axios')

async function measureApiPerformance() {
  console.log('🚀 Testing API Performance Optimizations...')
  
  try {
    const baseURL = 'http://localhost:3002/api'
    
    // Test 1: Properties list endpoint (cold cache)
    console.log('\n📊 Test 1: Properties List (Cold Cache)')
    const start1 = Date.now()
    const response1 = await axios.get(`${baseURL}/properties`)
    const time1 = Date.now() - start1
    console.log(`✅ Cold cache response time: ${time1}ms`)
    console.log(`📋 Properties returned: ${response1.data.properties.length}`)
    
    // Test 2: Properties list endpoint (warm cache)
    console.log('\n📊 Test 2: Properties List (Warm Cache)')
    const start2 = Date.now()
    const response2 = await axios.get(`${baseURL}/properties`)
    const time2 = Date.now() - start2
    console.log(`✅ Warm cache response time: ${time2}ms`)
    console.log(`🚀 Cache speedup: ${((time1 - time2) / time1 * 100).toFixed(1)}%`)
    
    // Test 3: Properties with stats in single call
    console.log('\n📊 Test 3: Properties + Stats (Single Call)')
    const start3 = Date.now()
    const response3 = await axios.get(`${baseURL}/properties?includeStats=true`)
    const time3 = Date.now() - start3
    console.log(`✅ Combined response time: ${time3}ms`)
    console.log(`📊 Stats included: ${!!response3.data.stats}`)
    
    // Test 4: Separate stats call for comparison
    console.log('\n📊 Test 4: Separate Stats Call')
    const start4 = Date.now()
    const response4 = await axios.get(`${baseURL}/properties/stats`)
    const time4 = Date.now() - start4
    console.log(`✅ Stats only response time: ${time4}ms`)
    
    // Test 5: Property by ID (minimal data)
    if (response1.data.properties.length > 0) {
      const propertyId = response1.data.properties[0].id
      
      console.log('\n📊 Test 5: Property by ID (Minimal)')
      const start5 = Date.now()
      const response5 = await axios.get(`${baseURL}/properties/${propertyId}`)
      const time5 = Date.now() - start5
      console.log(`✅ Minimal property response time: ${time5}ms`)
      
      console.log('\n📊 Test 6: Property by ID (With Relations)')
      const start6 = Date.now()
      const response6 = await axios.get(`${baseURL}/properties/${propertyId}?includeRelations=true`)
      const time6 = Date.now() - start6
      console.log(`✅ Full property response time: ${time6}ms`)
      console.log(`📈 Minimal vs Full difference: ${time6 - time5}ms`)
    }
    
    // Test 7: Multiple concurrent requests
    console.log('\n📊 Test 7: Concurrent Requests (5x)')
    const start7 = Date.now()
    const promises = Array(5).fill().map(() => axios.get(`${baseURL}/properties`))
    await Promise.all(promises)
    const time7 = Date.now() - start7
    console.log(`✅ 5 concurrent requests time: ${time7}ms`)
    console.log(`⚡ Average per request: ${(time7 / 5).toFixed(1)}ms`)
    
    // Test 8: Create property performance
    console.log('\n📊 Test 8: Create Property Performance')
    const testProperty = {
      name: 'Performance Test Property',
      address: '123 Speed Street',
      type: 'apartment',
      status: 'available',
      yearlyRent: 1000000,
      bedrooms: 2,
      bathrooms: 2,
      area: 800,
      description: 'Performance test property',
      amenities: ['WiFi', 'Parking'],
      images: ['/realestate1.jpeg'],
      yearBuilt: 2023,
      parkingSpaces: '2'
    }
    
    const start8 = Date.now()
    const response8 = await axios.post(`${baseURL}/properties`, testProperty)
    const time8 = Date.now() - start8
    console.log(`✅ Create property time: ${time8}ms`)
    
    // Clean up test property (skip if auth required)
    if (response8.data.property?.id) {
      try {
        await axios.delete(`${baseURL}/properties/${response8.data.property.id}`)
        console.log('🧹 Test property cleaned up')
      } catch (deleteError) {
        console.log('⚠️  Test property cleanup skipped (auth required)')
      }
    }
    
    // Summary
    console.log('\n🎯 Performance Summary:')
    console.log(`• Cold cache: ${time1}ms`)
    console.log(`• Warm cache: ${time2}ms (${((time1 - time2) / time1 * 100).toFixed(1)}% faster)`)
    console.log(`• Combined call: ${time3}ms`)
    console.log(`• Stats only: ${time4}ms`)
    console.log(`• Create property: ${time8}ms`)
    console.log(`• Concurrent avg: ${(time7 / 5).toFixed(1)}ms`)
    
    if (time2 < 100) {
      console.log('🚀 Excellent performance! API responses under 100ms')
    } else if (time2 < 500) {
      console.log('✅ Good performance! API responses under 500ms')
    } else {
      console.log('⚠️  Consider further optimizations for sub-500ms responses')
    }
    
  } catch (error) {
    console.error('❌ Performance test failed:')
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Data:', error.response.data)
    } else {
      console.error('Error:', error.message)
    }
    process.exit(1)
  }
}

measureApiPerformance()