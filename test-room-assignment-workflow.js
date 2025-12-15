/**
 * Comprehensive Room Assignment Workflow Test
 * 
 * This test verifies the complete room assignment workflow:
 * 1. Property creation with room configuration
 * 2. Room availability checking
 * 3. Tenant assignment with automatic room status updates
 * 4. Duplicate assignment prevention
 * 5. Move-out process and room availability restoration
 */

const API_BASE = 'http://localhost:3000/api'

// Test data
const testProperty = {
  name: 'Test Lodge for Room Assignment',
  address: '123 Test Street, Test City',
  type: 'lodge',
  status: 'available',
  yearlyRent: 500000,
  numberOfRooms: 5,
  numberOfBathrooms: 3,
  numberOfKitchens: 2,
  waterAvailability: 'in-building',
  bedrooms: 0,
  bathrooms: 3,
  area: 0,
  description: 'Test property for room assignment workflow',
  amenities: ['WiFi', 'Security', 'Parking'],
  images: ['/test-image.jpg'],
  yearBuilt: 2023,
  parkingSpaces: 'yes',
  rooms: [
    {
      roomNumber: 'A-101',
      roomType: 'single',
      maxOccupants: 1,
      yearlyRent: 500000,
      floor: 1,
      size: 12.5,
      hasPrivateBath: true,
      hasKitchen: false,
      amenities: ['Bed', 'Desk', 'Wardrobe']
    },
    {
      roomNumber: 'A-102',
      roomType: 'shared',
      maxOccupants: 2,
      yearlyRent: 400000,
      floor: 1,
      size: 15.0,
      hasPrivateBath: false,
      hasKitchen: false,
      amenities: ['Beds', 'Study Area']
    },
    {
      roomNumber: 'B-201',
      roomType: 'single',
      maxOccupants: 1,
      yearlyRent: 550000,
      floor: 2,
      size: 14.0,
      hasPrivateBath: true,
      hasKitchen: true,
      amenities: ['Bed', 'Desk', 'Kitchenette', 'Private Bath']
    }
  ]
}

const testTenants = [
  {
    name: 'John Doe',
    phone: '08012345678',
    email: 'john.doe@test.com',
    nextOfKin: 'Jane Doe',
    nextOfKinPhone: '08087654321',
    numberOfOccupants: 1,
    kitchenAccess: 'shared',
    rentStartDate: '2024-01-01',
    rentExpiryDate: '2024-12-31',
    totalRent: 500000,
    amountPaid: 500000,
    securityDeposit: 50000
  },
  {
    name: 'Alice Smith',
    phone: '08023456789',
    email: 'alice.smith@test.com',
    nextOfKin: 'Bob Smith',
    nextOfKinPhone: '08098765432',
    numberOfOccupants: 1,
    kitchenAccess: 'shared',
    rentStartDate: '2024-01-15',
    rentExpiryDate: '2024-12-31',
    totalRent: 400000,
    amountPaid: 200000,
    securityDeposit: 40000
  },
  {
    name: 'Mike Johnson',
    phone: '08034567890',
    email: 'mike.johnson@test.com',
    nextOfKin: 'Sarah Johnson',
    nextOfKinPhone: '08076543210',
    numberOfOccupants: 1,
    kitchenAccess: 'private',
    rentStartDate: '2024-02-01',
    rentExpiryDate: '2024-12-31',
    totalRent: 550000,
    amountPaid: 550000,
    securityDeposit: 55000
  }
]

let createdPropertyId = null
let createdRooms = []
let createdTenants = []

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.error || data.message || 'Request failed'}`)
    }
    
    return { success: true, data, status: response.status }
  } catch (error) {
    return { success: false, error: error.message, status: error.status || 500 }
  }
}

async function testPropertyCreationWithRooms() {
  console.log('\n🏠 Testing Property Creation with Rooms...')
  
  const result = await makeRequest(`${API_BASE}/properties`, {
    method: 'POST',
    body: JSON.stringify(testProperty)
  })
  
  if (!result.success) {
    throw new Error(`Property creation failed: ${result.error}`)
  }
  
  const property = result.data.property
  createdPropertyId = property.id
  
  console.log(`✅ Property created: ${property.name} (ID: ${property.id})`)
  
  // Verify rooms were created
  const roomsResult = await makeRequest(`${API_BASE}/rooms?propertyId=${property.id}`)
  
  if (!roomsResult.success) {
    throw new Error(`Failed to fetch rooms: ${roomsResult.error}`)
  }
  
  createdRooms = roomsResult.data.rooms
  console.log(`✅ ${createdRooms.length} rooms created successfully`)
  
  // Verify room identifiers and initial status
  createdRooms.forEach(room => {
    console.log(`   - Room ${room.roomNumber}: ${room.status}, Max: ${room.maxOccupants}, Current: ${room.currentOccupants}`)
    
    if (room.status !== 'available') {
      throw new Error(`Room ${room.roomNumber} should be available initially, but is ${room.status}`)
    }
    
    if (room.currentOccupants !== 0) {
      throw new Error(`Room ${room.roomNumber} should have 0 occupants initially, but has ${room.currentOccupants}`)
    }
  })
  
  return property
}

async function testAvailableRoomsAPI() {
  console.log('\n🔍 Testing Available Rooms API...')
  
  const result = await makeRequest(`${API_BASE}/rooms/available?propertyId=${createdPropertyId}`)
  
  if (!result.success) {
    throw new Error(`Available rooms API failed: ${result.error}`)
  }
  
  const availableRooms = result.data.rooms
  console.log(`✅ Found ${availableRooms.length} available rooms`)
  
  // All rooms should be available initially
  if (availableRooms.length !== createdRooms.length) {
    throw new Error(`Expected ${createdRooms.length} available rooms, but got ${availableRooms.length}`)
  }
  
  availableRooms.forEach(room => {
    console.log(`   - ${room.roomNumber}: ${room.availableSpace} spaces available`)
    
    if (room.availableSpace !== room.maxOccupants) {
      throw new Error(`Room ${room.roomNumber} should have ${room.maxOccupants} spaces available, but has ${room.availableSpace}`)
    }
  })
  
  return availableRooms
}

async function testTenantAssignment() {
  console.log('\n👤 Testing Tenant Assignment...')
  
  // Assign tenants to specific rooms
  const roomAssignments = [
    { tenant: testTenants[0], roomNumber: 'A-101' },
    { tenant: testTenants[1], roomNumber: 'A-102' },
    { tenant: testTenants[2], roomNumber: 'B-201' }
  ]
  
  for (const assignment of roomAssignments) {
    const room = createdRooms.find(r => r.roomNumber === assignment.roomNumber)
    if (!room) {
      throw new Error(`Room ${assignment.roomNumber} not found`)
    }
    
    const tenantData = {
      ...assignment.tenant,
      roomId: room.id
    }
    
    console.log(`   Assigning ${assignment.tenant.name} to room ${assignment.roomNumber}...`)
    
    const result = await makeRequest(`${API_BASE}/occupants`, {
      method: 'POST',
      body: JSON.stringify(tenantData)
    })
    
    if (!result.success) {
      throw new Error(`Tenant assignment failed: ${result.error}`)
    }
    
    const occupant = result.data.occupant
    createdTenants.push(occupant)
    
    console.log(`   ✅ ${occupant.name} assigned to room ${assignment.roomNumber}`)
    
    // Verify room status updated
    const roomResult = await makeRequest(`${API_BASE}/rooms/${room.id}`)
    if (roomResult.success) {
      const updatedRoom = roomResult.data.room
      console.log(`   📊 Room ${assignment.roomNumber} now has ${updatedRoom.currentOccupants}/${updatedRoom.maxOccupants} occupants`)
    }
  }
  
  return createdTenants
}

async function testRoomStatusUpdates() {
  console.log('\n📊 Testing Room Status Updates...')
  
  // Check that room statuses were updated correctly
  const roomsResult = await makeRequest(`${API_BASE}/rooms?propertyId=${createdPropertyId}`)
  
  if (!roomsResult.success) {
    throw new Error(`Failed to fetch updated rooms: ${roomsResult.error}`)
  }
  
  const updatedRooms = roomsResult.data.rooms
  
  updatedRooms.forEach(room => {
    const expectedOccupants = room.roomNumber === 'A-101' ? 1 : 
                             room.roomNumber === 'A-102' ? 1 : 
                             room.roomNumber === 'B-201' ? 1 : 0
    
    const expectedStatus = expectedOccupants >= room.maxOccupants ? 'occupied' : 'available'
    
    console.log(`   Room ${room.roomNumber}: ${room.currentOccupants}/${room.maxOccupants} occupants, status: ${room.status}`)
    
    if (room.currentOccupants !== expectedOccupants) {
      throw new Error(`Room ${room.roomNumber} should have ${expectedOccupants} occupants, but has ${room.currentOccupants}`)
    }
    
    if (room.status !== expectedStatus) {
      throw new Error(`Room ${room.roomNumber} should be ${expectedStatus}, but is ${room.status}`)
    }
  })
  
  console.log('✅ All room statuses updated correctly')
}

async function testDuplicateAssignmentPrevention() {
  console.log('\n🚫 Testing Duplicate Assignment Prevention...')
  
  // Try to assign another tenant to a full room (A-101 which has max 1 occupant)
  const fullRoom = createdRooms.find(r => r.roomNumber === 'A-101')
  
  const duplicateTenant = {
    name: 'Duplicate Tenant',
    phone: '08099999999',
    email: 'duplicate@test.com',
    nextOfKin: 'Emergency Contact',
    nextOfKinPhone: '08088888888',
    numberOfOccupants: 1,
    kitchenAccess: 'shared',
    rentStartDate: '2024-03-01',
    rentExpiryDate: '2024-12-31',
    totalRent: 500000,
    amountPaid: 500000,
    roomId: fullRoom.id
  }
  
  const result = await makeRequest(`${API_BASE}/occupants`, {
    method: 'POST',
    body: JSON.stringify(duplicateTenant)
  })
  
  if (result.success) {
    throw new Error('Duplicate assignment should have been prevented!')
  }
  
  console.log(`✅ Duplicate assignment correctly prevented: ${result.error}`)
}

async function testAvailableRoomsAfterAssignment() {
  console.log('\n🔍 Testing Available Rooms After Assignment...')
  
  const result = await makeRequest(`${API_BASE}/rooms/available?propertyId=${createdPropertyId}`)
  
  if (!result.success) {
    throw new Error(`Available rooms API failed: ${result.error}`)
  }
  
  const availableRooms = result.data.rooms
  console.log(`✅ Found ${availableRooms.length} available rooms after assignments`)
  
  // Only A-102 should still have space (max 2, current 1)
  const roomsWithSpace = availableRooms.filter(room => room.availableSpace > 0)
  
  if (roomsWithSpace.length !== 1 || roomsWithSpace[0].roomNumber !== 'A-102') {
    throw new Error('Expected only room A-102 to have available space')
  }
  
  console.log(`   - ${roomsWithSpace[0].roomNumber}: ${roomsWithSpace[0].availableSpace} spaces available`)
}

async function testMoveOutProcess() {
  console.log('\n🚪 Testing Move-Out Process...')
  
  // Move out the tenant from room A-101
  const tenantToMoveOut = createdTenants.find(t => t.name === 'John Doe')
  
  if (!tenantToMoveOut) {
    throw new Error('Tenant John Doe not found for move-out test')
  }
  
  const result = await makeRequest(`${API_BASE}/rooms/assignments`, {
    method: 'POST',
    body: JSON.stringify({
      action: 'remove',
      occupantId: tenantToMoveOut.id,
      reason: 'Lease ended'
    })
  })
  
  if (!result.success) {
    throw new Error(`Move-out failed: ${result.error}`)
  }
  
  console.log(`✅ ${tenantToMoveOut.name} moved out successfully`)
  
  // Verify room A-101 is now available again
  const roomsResult = await makeRequest(`${API_BASE}/rooms?propertyId=${createdPropertyId}`)
  
  if (!roomsResult.success) {
    throw new Error(`Failed to fetch rooms after move-out: ${roomsResult.error}`)
  }
  
  const roomA101 = roomsResult.data.rooms.find(r => r.roomNumber === 'A-101')
  
  if (!roomA101) {
    throw new Error('Room A-101 not found after move-out')
  }
  
  console.log(`   Room A-101 status: ${roomA101.status}, occupants: ${roomA101.currentOccupants}/${roomA101.maxOccupants}`)
  
  if (roomA101.currentOccupants !== 0) {
    throw new Error(`Room A-101 should have 0 occupants after move-out, but has ${roomA101.currentOccupants}`)
  }
  
  if (roomA101.status !== 'available') {
    throw new Error(`Room A-101 should be available after move-out, but is ${roomA101.status}`)
  }
  
  console.log('✅ Room A-101 is now available for reassignment')
}

async function testRoomAssignmentHistory() {
  console.log('\n📋 Testing Room Assignment History...')
  
  const result = await makeRequest(`${API_BASE}/rooms/assignments`)
  
  if (!result.success) {
    throw new Error(`Assignment history API failed: ${result.error}`)
  }
  
  const assignments = result.data.assignments
  console.log(`✅ Found ${assignments.length} assignment history records`)
  
  // Should have records for assignments and the move-out
  const assignmentActions = assignments.filter(a => a.action === 'assigned')
  const removeActions = assignments.filter(a => a.action === 'unassigned')
  
  console.log(`   - ${assignmentActions.length} assignment records`)
  console.log(`   - ${removeActions.length} move-out records`)
  
  if (assignmentActions.length < 3) {
    throw new Error('Expected at least 3 assignment records')
  }
  
  if (removeActions.length < 1) {
    throw new Error('Expected at least 1 move-out record')
  }
}

async function cleanup() {
  console.log('\n🧹 Cleaning up test data...')
  
  try {
    // Delete created tenants
    for (const tenant of createdTenants) {
      await makeRequest(`${API_BASE}/occupants/${tenant.id}`, { method: 'DELETE' })
    }
    
    // Delete created property (should cascade delete rooms)
    if (createdPropertyId) {
      await makeRequest(`${API_BASE}/properties/${createdPropertyId}`, { method: 'DELETE' })
    }
    
    console.log('✅ Test data cleaned up successfully')
  } catch (error) {
    console.log(`⚠️ Cleanup warning: ${error.message}`)
  }
}

async function runRoomAssignmentWorkflowTest() {
  console.log('🚀 Starting Room Assignment Workflow Test')
  console.log('=' .repeat(60))
  
  try {
    // Test the complete workflow
    await testPropertyCreationWithRooms()
    await testAvailableRoomsAPI()
    await testTenantAssignment()
    await testRoomStatusUpdates()
    await testDuplicateAssignmentPrevention()
    await testAvailableRoomsAfterAssignment()
    await testMoveOutProcess()
    await testRoomAssignmentHistory()
    
    console.log('\n' + '=' .repeat(60))
    console.log('🎉 ALL ROOM ASSIGNMENT WORKFLOW TESTS PASSED!')
    console.log('=' .repeat(60))
    
    console.log('\n📋 Test Summary:')
    console.log('✅ Property creation with room configuration')
    console.log('✅ Room availability checking')
    console.log('✅ Tenant assignment with automatic status updates')
    console.log('✅ Duplicate assignment prevention')
    console.log('✅ Room status management')
    console.log('✅ Move-out process and room availability restoration')
    console.log('✅ Assignment history tracking')
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message)
    console.error('Stack trace:', error.stack)
  } finally {
    await cleanup()
  }
}

// Run the test
runRoomAssignmentWorkflowTest().catch(console.error)