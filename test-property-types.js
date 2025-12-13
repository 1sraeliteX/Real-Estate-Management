// Test script to verify property types functionality
const { SettingsClient } = require('./lib/client/settingsClient')

async function testPropertyTypes() {
  try {
    console.log('Testing Property Types functionality...')
    
    // Test getting property types
    console.log('1. Getting property types...')
    const propertyTypes = await SettingsClient.getPropertyTypes()
    console.log('Property types:', propertyTypes.map(pt => pt.name))
    
    // Test adding a new property type
    console.log('2. Adding a test property type...')
    await SettingsClient.addPropertyType('test-type')
    console.log('Added test-type successfully')
    
    // Get updated list
    const updatedTypes = await SettingsClient.getPropertyTypes()
    console.log('Updated property types:', updatedTypes.map(pt => pt.name))
    
    // Test removing the test property type
    console.log('3. Removing test property type...')
    await SettingsClient.removePropertyType('test-type')
    console.log('Removed test-type successfully')
    
    // Final list
    const finalTypes = await SettingsClient.getPropertyTypes()
    console.log('Final property types:', finalTypes.map(pt => pt.name))
    
    console.log('✅ Property Types functionality is working correctly!')
    
  } catch (error) {
    console.error('❌ Error testing property types:', error)
  }
}

testPropertyTypes()