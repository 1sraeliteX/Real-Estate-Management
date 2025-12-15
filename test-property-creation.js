#!/usr/bin/env node

/**
 * Test script to verify property creation functionality
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testPropertyCreation() {
  console.log('🧪 Testing Property Creation...')
  
  try {
    // Test data matching frontend structure
    const testProperty = {
      name: 'Test Property',
      address: '123 Test Street',
      type: 'apartment',
      status: 'available',
      yearlyRent: 1200000,
      bedrooms: 2,
      bathrooms: 2,
      area: 850,
      description: 'Test property for debugging',
      amenities: JSON.stringify(['WiFi', 'Parking', 'Security']),
      images: JSON.stringify(['/realestate4.jpeg']),
      yearBuilt: 2023,
      parkingSpaces: 'yes',
      userId: null, // Allow null userId for testing
      isCustom: true
    }

    console.log('📝 Creating property with data:', testProperty)
    
    const property = await prisma.property.create({
      data: testProperty
    })
    
    console.log('✅ Property created successfully:', property)
    
    // Test retrieval
    const retrieved = await prisma.property.findUnique({
      where: { id: property.id }
    })
    
    console.log('📖 Retrieved property:', retrieved)
    
    // Parse JSON fields
    const parsedAmenities = JSON.parse(retrieved.amenities)
    const parsedImages = JSON.parse(retrieved.images)
    
    console.log('🔍 Parsed amenities:', parsedAmenities)
    console.log('🔍 Parsed images:', parsedImages)
    
    // Cleanup
    await prisma.property.delete({
      where: { id: property.id }
    })
    
    console.log('🧹 Test property cleaned up')
    console.log('🎉 All tests passed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testPropertyCreation()