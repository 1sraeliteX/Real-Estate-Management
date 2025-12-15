#!/usr/bin/env node

/**
 * Comprehensive Property Creation Debug Script
 * This script tests the entire property creation flow from frontend to database
 */

const axios = require('axios')

class PropertyCreationDebugger {
  constructor() {
    this.baseURL = 'http://localhost:3003/api'
    this.errors = []
    this.warnings = []
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString()
    const prefix = {
      info: '📋',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      debug: '🔍'
    }[type]
    
    console.log(`${prefix} [${timestamp}] ${message}`)
    
    if (type === 'error') this.errors.push(message)
    if (type === 'warning') this.warnings.push(message)
  }

  async testServerConnection() {
    this.log('Testing server connection...', 'debug')
    try {
      const response = await axios.get(`${this.baseURL}/properties`, { timeout: 5000 })
      this.log('Server connection successful', 'success')
      return true
    } catch (error) {
      this.log(`Server connection failed: ${error.message}`, 'error')
      if (error.code === 'ECONNREFUSED') {
        this.log('Make sure your development server is running: npm run dev', 'warning')
      }
      return false
    }
  }

  async testFormDataValidation() {
    this.log('Testing form data validation...', 'debug')
    
    const testCases = [
      {
        name: 'Valid On-Campus Property',
        data: {
          name: 'Debug Test Lodge',
          address: '123 Campus Street',
          type: 'lodge',
          status: 'available',
          yearlyRent: 500000,
          numberOfRooms: 20,
          numberOfBathrooms: 10,
          bedrooms: 0,
          bathrooms: 10,
          numberOfKitchens: 0,
          area: 0,
          description: 'Test lodge for debugging',
          amenities: ['WiFi', 'Study Room', 'Laundry'],
          images: ['/realestate1.jpeg'],
          yearBuilt: new Date().getFullYear(),
          parkingSpaces: 'yes',
        },
        shouldPass: true
      },
      {
        name: 'Valid Off-Campus Property',
        data: {
          name: 'Debug Test Apartment',
          address: '456 Off-Campus Ave',
          type: 'apartment',
          status: 'available',
          yearlyRent: 1200000,
          bedrooms: 2,
          bathrooms: 2,
          numberOfKitchens: 1,
          numberOfRooms: 0,
          numberOfBathrooms: 2,
          area: 850,
          description: 'Test apartment for debugging',
          amenities: ['Parking', 'Gym', 'Pool'],
          images: ['/realestate2.jpeg'],
          yearBuilt: new Date().getFullYear(),
          parkingSpaces: 'yes',
        },
        shouldPass: true
      },
      {
        name: 'Missing Required Fields',
        data: {
          name: '',
          address: '',
          type: 'apartment',
          yearlyRent: 0,
        },
        shouldPass: false
      }
    ]

    for (const testCase of testCases) {
      this.log(`Testing: ${testCase.name}`, 'debug')
      
      try {
        const response = await axios.post(`${this.baseURL}/properties`, testCase.data, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        })
        
        if (testCase.shouldPass) {
          this.log(`✅ ${testCase.name} - Created successfully`, 'success')
          
          // Verify data transformation
          const property = response.data.property
          if (Array.isArray(property.amenities) && Array.isArray(property.images)) {
            this.log('Data transformation working correctly', 'success')
          } else {
            this.log('Data transformation issue detected', 'warning')
          }
        } else {
          this.log(`⚠️ ${testCase.name} - Should have failed but passed`, 'warning')
        }
      } catch (error) {
        if (!testCase.shouldPass) {
          this.log(`✅ ${testCase.name} - Correctly rejected`, 'success')
        } else {
          this.log(`❌ ${testCase.name} - Failed: ${error.response?.data?.error || error.message}`, 'error')
          
          // Detailed error analysis
          if (error.response?.data?.details) {
            this.log(`Error details: ${JSON.stringify(error.response.data.details, null, 2)}`, 'debug')
          }
        }
      }
    }
  }

  async testDataTransformation() {
    this.log('Testing data transformation...', 'debug')
    
    try {
      // Get existing properties to test transformation
      const response = await axios.get(`${this.baseURL}/properties`)
      const properties = response.data.properties || response.data
      
      if (!Array.isArray(properties)) {
        this.log('Properties response is not an array', 'error')
        return
      }
      
      this.log(`Found ${properties.length} properties`, 'info')
      
      // Check data types
      properties.forEach((property, index) => {
        if (property.amenities && !Array.isArray(property.amenities)) {
          this.log(`Property ${index + 1}: amenities is not an array (${typeof property.amenities})`, 'warning')
        }
        if (property.images && !Array.isArray(property.images)) {
          this.log(`Property ${index + 1}: images is not an array (${typeof property.images})`, 'warning')
        }
      })
      
      this.log('Data transformation test completed', 'success')
    } catch (error) {
      this.log(`Data transformation test failed: ${error.message}`, 'error')
    }
  }

  async testAuthenticationFlow() {
    this.log('Testing authentication flow...', 'debug')
    
    // Test without authentication (should work in development)
    try {
      const testProperty = {
        name: 'Auth Test Property',
        address: '789 Auth Test St',
        type: 'apartment',
        status: 'available',
        yearlyRent: 1000000,
        bedrooms: 1,
        bathrooms: 1,
        area: 500,
        description: 'Testing auth flow',
        amenities: ['Basic'],
        images: [],
        yearBuilt: 2023,
        parkingSpaces: 'no',
      }
      
      const response = await axios.post(`${this.baseURL}/properties`, testProperty)
      this.log('Property creation without auth successful', 'success')
      
      // Clean up
      if (response.data.property?.id) {
        await axios.delete(`${this.baseURL}/properties/${response.data.property.id}`)
        this.log('Test property cleaned up', 'info')
      }
    } catch (error) {
      if (error.response?.status === 401) {
        this.log('Authentication required - this is expected in production', 'info')
      } else {
        this.log(`Auth test failed: ${error.message}`, 'error')
      }
    }
  }

  async testErrorHandling() {
    this.log('Testing error handling...', 'debug')
    
    const errorTests = [
      {
        name: 'Invalid JSON',
        data: 'invalid json',
        expectedError: 'JSON parse error'
      },
      {
        name: 'Missing Content-Type',
        data: { name: 'Test' },
        headers: { 'Content-Type': 'text/plain' },
        expectedError: 'Content type error'
      }
    ]
    
    for (const test of errorTests) {
      try {
        await axios.post(`${this.baseURL}/properties`, test.data, {
          headers: test.headers || { 'Content-Type': 'application/json' }
        })
        this.log(`⚠️ ${test.name} - Should have failed`, 'warning')
      } catch (error) {
        this.log(`✅ ${test.name} - Correctly handled error`, 'success')
      }
    }
  }

  async runFullDiagnostic() {
    this.log('🚀 Starting Property Creation Diagnostic...', 'info')
    this.log('=' * 50, 'info')
    
    // Test server connection first
    const serverOnline = await this.testServerConnection()
    if (!serverOnline) {
      this.log('Cannot proceed without server connection', 'error')
      return this.generateReport()
    }
    
    // Run all tests
    await this.testFormDataValidation()
    await this.testDataTransformation()
    await this.testAuthenticationFlow()
    await this.testErrorHandling()
    
    return this.generateReport()
  }

  generateReport() {
    this.log('=' * 50, 'info')
    this.log('🔍 DIAGNOSTIC REPORT', 'info')
    this.log('=' * 50, 'info')
    
    if (this.errors.length === 0) {
      this.log('🎉 All tests passed! Property creation is working correctly.', 'success')
    } else {
      this.log(`❌ Found ${this.errors.length} error(s):`, 'error')
      this.errors.forEach((error, index) => {
        this.log(`${index + 1}. ${error}`, 'error')
      })
    }
    
    if (this.warnings.length > 0) {
      this.log(`⚠️ Found ${this.warnings.length} warning(s):`, 'warning')
      this.warnings.forEach((warning, index) => {
        this.log(`${index + 1}. ${warning}`, 'warning')
      })
    }
    
    // Recommendations
    this.log('📋 RECOMMENDATIONS:', 'info')
    
    if (this.errors.length > 0) {
      this.log('1. Check server logs for detailed error information', 'info')
      this.log('2. Verify database connection and schema', 'info')
      this.log('3. Ensure all required environment variables are set', 'info')
    }
    
    if (this.warnings.length > 0) {
      this.log('1. Review data transformation logic', 'info')
      this.log('2. Check frontend form validation', 'info')
    }
    
    this.log('=' * 50, 'info')
    
    return {
      success: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    }
  }
}

// Run the diagnostic
if (require.main === module) {
  const debugTool = new PropertyCreationDebugger()
  debugTool.runFullDiagnostic()
    .then(report => {
      process.exit(report.success ? 0 : 1)
    })
    .catch(error => {
      console.error('Diagnostic failed:', error)
      process.exit(1)
    })
}

module.exports = PropertyCreationDebugger