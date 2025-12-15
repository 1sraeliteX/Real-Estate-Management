const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrateRoomAssignments() {
  console.log('🚀 Starting room assignment migration...')

  try {
    // Step 1: Update existing rooms with new fields
    console.log('📊 Step 1: Updating existing rooms with capacity and occupancy data...')
    
    const rooms = await prisma.room.findMany({
      include: {
        occupants: {
          where: {
            // Only count active occupants (assuming existing ones are active)
            // We'll add assignmentStatus field with default 'active'
          }
        }
      }
    })

    for (const room of rooms) {
      // Calculate current occupants from existing data
      const currentOccupants = room.occupants.reduce(
        (total, occupant) => total + occupant.numberOfOccupants, 
        0
      )

      // Set reasonable defaults for room capacity based on room type or current occupants
      let maxOccupants = Math.max(currentOccupants, 1) // At least 1, or current occupants
      
      // You can customize this logic based on your room types
      if (room.roomNumber.toLowerCase().includes('shared')) {
        maxOccupants = Math.max(maxOccupants, 4)
      } else if (room.roomNumber.toLowerCase().includes('studio')) {
        maxOccupants = Math.max(maxOccupants, 2)
      }

      // Determine room status based on occupancy
      let status = room.status
      if (currentOccupants === 0) {
        status = 'available'
      } else if (currentOccupants >= maxOccupants) {
        status = 'occupied'
      }

      console.log(`   Updating Room ${room.roomNumber}: ${currentOccupants}/${maxOccupants} occupants, status: ${status}`)

      // Note: We can't directly update the new fields until the migration is applied
      // This script should be run AFTER running: npx prisma db push
    }

    // Step 2: Update existing occupants with new fields
    console.log('👥 Step 2: Updating existing occupants with assignment status...')
    
    const occupants = await prisma.roomOccupant.findMany()
    
    for (const occupant of occupants) {
      console.log(`   Updating occupant ${occupant.name} - setting as active`)
      
      // Note: We can't directly update the new fields until the migration is applied
      // This script should be run AFTER running: npx prisma db push
    }

    console.log('✅ Migration preparation complete!')
    console.log('\n📋 Next steps:')
    console.log('1. Run: npx prisma db push')
    console.log('2. Run this script again to populate the new fields')
    console.log('3. Verify the data in your database')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

async function populateNewFields() {
  console.log('🔄 Populating new fields after schema update...')

  try {
    // Update rooms with capacity and occupancy data
    const rooms = await prisma.room.findMany({
      include: {
        occupants: true
      }
    })

    for (const room of rooms) {
      const currentOccupants = room.occupants.reduce(
        (total, occupant) => total + occupant.numberOfOccupants, 
        0
      )

      let maxOccupants = Math.max(currentOccupants, 1)
      
      if (room.roomNumber.toLowerCase().includes('shared')) {
        maxOccupants = Math.max(maxOccupants, 4)
      } else if (room.roomNumber.toLowerCase().includes('studio')) {
        maxOccupants = Math.max(maxOccupants, 2)
      }

      let status = room.status
      if (currentOccupants === 0) {
        status = 'available'
      } else if (currentOccupants >= maxOccupants) {
        status = 'occupied'
      }

      await prisma.room.update({
        where: { id: room.id },
        data: {
          maxOccupants,
          currentOccupants,
          status,
          roomType: 'single' // Default room type
        }
      })

      console.log(`✅ Updated Room ${room.roomNumber}: ${currentOccupants}/${maxOccupants}`)
    }

    // Update occupants with assignment status
    await prisma.roomOccupant.updateMany({
      data: {
        assignmentStatus: 'active',
        depositStatus: 'pending'
      }
    })

    console.log('✅ All fields populated successfully!')

  } catch (error) {
    console.error('❌ Field population failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Check if we should run migration prep or field population
async function main() {
  try {
    // Try to access new fields to see if schema is updated
    await prisma.room.findFirst({
      select: { maxOccupants: true }
    })
    
    // If we get here, schema is updated, populate fields
    await populateNewFields()
  } catch (error) {
    if (error.message.includes('Unknown field')) {
      // Schema not updated yet, run migration prep
      await migrateRoomAssignments()
    } else {
      throw error
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })