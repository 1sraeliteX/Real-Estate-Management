const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function initializeDatabase() {
  try {
    console.log('Initializing database with default data...')

    // Initialize default property types
    const defaultPropertyTypes = [
      'apartment',
      'house', 
      'condo',
      'commercial',
      'lodge',
      'studio'
    ]

    for (const type of defaultPropertyTypes) {
      await prisma.propertyType.upsert({
        where: { name: type },
        update: {},
        create: {
          name: type,
          isDefault: true,
        },
      })
    }
    console.log('✓ Default property types initialized')

    // Initialize default properties
    const defaultProperties = [
      {
        name: "Sunset Apartments",
        address: "123 Sunset Blvd, Lagos",
        type: "apartment",
        status: "available",
        yearlyRent: 1200000,
        bedrooms: 2,
        bathrooms: 2,
        area: 850,
        description: "Modern apartment with city view",
        amenities: "Pool, Gym, Parking",
        images: JSON.stringify([]),
        yearBuilt: 2020,
        parkingSpaces: "2",
        numberOfRooms: 4,
        numberOfKitchens: 1,
        numberOfBathrooms: 2,
        waterAvailability: "24/7",
        isCustom: false
      },
      {
        name: "Green Valley House",
        address: "456 Valley Road, Abuja",
        type: "house",
        status: "occupied",
        yearlyRent: 2400000,
        bedrooms: 4,
        bathrooms: 3,
        area: 1200,
        description: "Spacious family house with garden",
        amenities: "Garden, Garage, Security",
        images: JSON.stringify([]),
        yearBuilt: 2018,
        parkingSpaces: "3",
        numberOfRooms: 6,
        numberOfKitchens: 1,
        numberOfBathrooms: 3,
        waterAvailability: "24/7",
        isCustom: false
      }
    ]

    for (const property of defaultProperties) {
      // Check if property already exists
      const existing = await prisma.property.findFirst({
        where: { name: property.name }
      })
      
      if (!existing) {
        await prisma.property.create({
          data: property
        })
      }
    }
    console.log('✓ Default properties initialized')

    // Initialize default Twilio settings
    await prisma.twilioSettings.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        isEnabled: false
      }
    })
    console.log('✓ Default Twilio settings initialized')

    console.log('Database initialization completed successfully!')
  } catch (error) {
    console.error('Database initialization failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

initializeDatabase()