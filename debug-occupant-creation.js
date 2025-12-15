const API_BASE = 'http://localhost:3000/api'

async function testOccupantCreation() {
  let propertyId = null
  let roomId = null

  try {
    // First create a property with a room
    console.log('Creating property with room...')
    const propertyResponse = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Debug Property',
        address: '123 Debug Street',
        type: 'lodge',
        status: 'available',
        yearlyRent: 500000,
        numberOfRooms: 1,
        numberOfBathrooms: 1,
        numberOfKitchens: 1,
        waterAvailability: 'in-building',
        bedrooms: 0,
        bathrooms: 1,
        area: 0,
        description: 'Debug property',
        amenities: ['WiFi'],
        images: ['/test.jpg'],
        yearBuilt: 2023,
        parkingSpaces: 'yes',
        rooms: [{
          roomNumber: 'A-101',
          roomType: 'single',
          maxOccupants: 1,
          yearlyRent: 500000
        }]
      })
    })

    const propertyData = await propertyResponse.json()
    
    if (!propertyResponse.ok) {
      console.error('Property creation failed:', propertyData)
      return
    }

    propertyId = propertyData.property.id
    console.log('Property created:', propertyId)

    // Get the room
    const roomsResponse = await fetch(`${API_BASE}/rooms?propertyId=${propertyId}`)
    const roomsData = await roomsResponse.json()
    
    if (!roomsResponse.ok) {
      console.error('Failed to get rooms:', roomsData)
      return
    }

    if (roomsData.rooms.length === 0) {
      console.error('No rooms found')
      return
    }

    roomId = roomsData.rooms[0].id
    console.log('Room found:', roomId, 'Number:', roomsData.rooms[0].roomNumber)

    // Now try to create an occupant
    console.log('Creating occupant...')
    const occupantData = {
      roomId: roomId,
      name: 'Test Tenant',
      phone: '08012345678',
      email: 'test@example.com',
      nextOfKin: 'Emergency Contact',
      nextOfKinPhone: '08087654321',
      numberOfOccupants: 1,
      kitchenAccess: 'shared',
      rentStartDate: '2024-01-01',
      rentExpiryDate: '2024-12-31',
      totalRent: 500000,
      amountPaid: 500000,
      securityDeposit: 50000
    }

    console.log('Occupant payload:', JSON.stringify(occupantData, null, 2))

    const occupantResponse = await fetch(`${API_BASE}/occupants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(occupantData)
    })

    const occupantResult = await occupantResponse.json()
    
    if (!occupantResponse.ok) {
      console.error('Occupant creation failed:', occupantResult)
      console.error('Status:', occupantResponse.status)
    } else {
      console.log('Occupant created successfully:', occupantResult.occupant.name)
    }

  } catch (error) {
    console.error('Test error:', error)
  } finally {
    // Cleanup
    if (propertyId) {
      try {
        await fetch(`${API_BASE}/properties/${propertyId}`, { method: 'DELETE' })
        console.log('Cleanup completed')
      } catch (e) {
        console.log('Cleanup failed:', e.message)
      }
    }
  }
}

testOccupantCreation()