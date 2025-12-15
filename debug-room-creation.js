const API_BASE = 'http://localhost:3000/api'

async function testRoomCreation() {
  const testProperty = {
    name: 'Debug Property',
    address: '123 Debug Street',
    type: 'lodge',
    status: 'available',
    yearlyRent: 500000,
    numberOfRooms: 2,
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
    rooms: [
      {
        roomNumber: 'A-101',
        roomType: 'single',
        maxOccupants: 1,
        yearlyRent: 500000,
        status: 'available'
      }
    ]
  }

  try {
    console.log('Creating property with rooms...')
    console.log('Payload:', JSON.stringify(testProperty, null, 2))
    
    const response = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testProperty)
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      console.error('Error:', data)
      return
    }
    
    console.log('Property created:', data.property.name)
    console.log('Property ID:', data.property.id)
    
    // Check rooms
    const roomsResponse = await fetch(`${API_BASE}/rooms?propertyId=${data.property.id}`)
    const roomsData = await roomsResponse.json()
    
    console.log('Rooms created:', roomsData.rooms.length)
    roomsData.rooms.forEach(room => {
      console.log('Room:', {
        id: room.id,
        roomNumber: room.roomNumber,
        maxOccupants: room.maxOccupants,
        status: room.status
      })
    })
    
    // Clean up
    await fetch(`${API_BASE}/properties/${data.property.id}`, { method: 'DELETE' })
    console.log('Cleanup completed')
    
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testRoomCreation()