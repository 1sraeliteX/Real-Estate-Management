import { Property, Room, RoomOccupant, Payment, MaintenanceRequest } from '@/types'

// Test data generators
export const generateTestProperty = (overrides: Partial<Property> = {}): Omit<Property, 'id'> => ({
  name: 'Test Property',
  address: '123 Test Street, Test City',
  type: 'apartment',
  status: 'available',
  yearlyRent: 1200000,
  bedrooms: 2,
  bathrooms: 1,
  area: 1000,
  images: [],
  description: 'Test property description',
  amenities: ['Parking', 'Security'],
  yearBuilt: 2020,
  parkingSpaces: 1,
  ...overrides
})

export const generateTestRoom = (propertyId: string, overrides: Partial<Room> = {}): Omit<Room, 'id'> => ({
  propertyId,
  propertyName: 'Test Property',
  roomNumber: '101',
  status: 'available',
  occupants: [],
  yearlyRent: 600000,
  ...overrides
})

export const generateTestOccupant = (roomId: string, overrides: Partial<RoomOccupant> = {}): Omit<RoomOccupant, 'id'> => ({
  roomId,
  name: 'Test Occupant',
  phone: '+2348012345678',
  nextOfKin: 'Test Next of Kin',
  nextOfKinPhone: '+2348087654321',
  numberOfOccupants: 1,
  rentStartDate: '2024-01-01',
  rentExpiryDate: '2024-12-31',
  totalRent: 600000,
  amountPaid: 300000,
  paymentStatus: 'pending',
  issues: [],
  notes: [],
  ...overrides
})

// Data integrity tests
export class DataIntegrityTester {
  static async testPropertyCRUD(api: any): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = []
    
    try {
      // Test Create
      const testProperty = generateTestProperty()
      const createResponse = await api.properties.create(testProperty)
      if (!createResponse.data?.id) errors.push('Property creation failed - no ID returned')
      
      const propertyId = createResponse.data.id
      
      // Test Read
      const readResponse = await api.properties.getById(propertyId)
      if (readResponse.data.name !== testProperty.name) errors.push('Property read failed - data mismatch')
      
      // Test Update
      const updateData = { name: 'Updated Test Property' }
      await api.properties.update(propertyId, updateData)
      const updatedResponse = await api.properties.getById(propertyId)
      if (updatedResponse.data.name !== updateData.name) errors.push('Property update failed')
      
      // Test Delete
      await api.properties.delete(propertyId)
      try {
        await api.properties.getById(propertyId)
        errors.push('Property delete failed - property still exists')
      } catch {
        // Expected to fail after deletion
      }
      
    } catch (error) {
      errors.push(`CRUD test failed: ${error}`)
    }
    
    return { success: errors.length === 0, errors }
  }
}