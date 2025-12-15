const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkRoomSchema() {
  try {
    console.log('Checking Room model schema...')
    
    // Try to create a simple room to see what fields are available
    const testRoom = {
      propertyId: 'test',
      propertyName: 'Test Property',
      roomNumber: '101',
      roomIdentifier: 'A-101',
      status: 'available',
      yearlyRent: 500000,
      maxOccupants: 1,
      currentOccupants: 0
    }
    
    console.log('Attempting to create room with basic fields...')
    
    try {
      await prisma.room.create({
        data: testRoom
      })
      console.log('✅ Basic room creation successful')
    } catch (error) {
      console.log('❌ Basic room creation failed:', error.message)
    }
    
    // Now try with roomPrefix
    const testRoomWithPrefix = {
      ...testRoom,
      roomPrefix: 'A',
      propertyId: 'test2',
      roomIdentifier: 'A-102'
    }
    
    console.log('Attempting to create room with roomPrefix...')
    
    try {
      await prisma.room.create({
        data: testRoomWithPrefix
      })
      console.log('✅ Room creation with roomPrefix successful')
    } catch (error) {
      console.log('❌ Room creation with roomPrefix failed:', error.message)
    }
    
    // Check existing rooms
    console.log('Checking existing rooms...')
    const existingRooms = await prisma.room.findMany()
    console.log(`Found ${existingRooms.length} existing rooms`)
    
    if (existingRooms.length > 0) {
      console.log('First room structure:', Object.keys(existingRooms[0]))
    }
    
    // Clean up test rooms
    await prisma.room.deleteMany({
      where: {
        propertyId: { in: ['test', 'test2'] }
      }
    })
    
  } catch (error) {
    console.error('Schema check error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkRoomSchema()