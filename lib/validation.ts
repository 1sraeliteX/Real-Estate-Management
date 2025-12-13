import { Property, Room, RoomOccupant, Payment, MaintenanceRequest } from '@/types'

// Property validation
export function validateProperty(data: Partial<Property>): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.name?.trim()) errors.push('Property name is required')
  if (!data.address?.trim()) errors.push('Property address is required')
  if (!data.type) errors.push('Property type is required')
  if (!data.yearlyRent || data.yearlyRent <= 0) errors.push('Valid yearly rent is required')
  if (!data.description?.trim()) errors.push('Property description is required')
  if (!data.yearBuilt || data.yearBuilt < 1900 || data.yearBuilt > new Date().getFullYear()) {
    errors.push('Valid year built is required')
  }
  
  // Validate parking spaces (can be number, 'yes', or 'no')
  if (data.parkingSpaces !== undefined) {
    if (typeof data.parkingSpaces === 'number' && data.parkingSpaces < 0) {
      errors.push('Parking spaces cannot be negative')
    } else if (typeof data.parkingSpaces === 'string' && !['yes', 'no'].includes(data.parkingSpaces)) {
      errors.push('Parking spaces must be a number, "yes", or "no"')
    }
  }

  // Lodge-specific validation
  if (data.type === 'lodge') {
    if (!data.numberOfRooms || data.numberOfRooms <= 0) errors.push('Number of rooms is required for lodges')
    if (!data.numberOfKitchens || data.numberOfKitchens <= 0) errors.push('Number of kitchens is required for lodges')
    if (!data.numberOfBathrooms || data.numberOfBathrooms <= 0) errors.push('Number of bathrooms is required for lodges')
    if (!data.waterAvailability || !['in-building', 'in-compound'].includes(data.waterAvailability)) {
      errors.push('Water availability is required for lodges')
    }
  }

  // Regular property validation
  if (data.type !== 'lodge' && data.type !== 'commercial') {
    if (!data.bedrooms || data.bedrooms <= 0) errors.push('Number of bedrooms is required')
    if (!data.bathrooms || data.bathrooms <= 0) errors.push('Number of bathrooms is required')
    if (!data.area || data.area <= 0) errors.push('Property area is required')
  }

  return { isValid: errors.length === 0, errors }
}

// Room validation
export function validateRoom(data: Partial<Room>): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.propertyId?.trim()) errors.push('Property ID is required')
  if (!data.roomNumber?.trim()) errors.push('Room number is required')
  if (!data.yearlyRent || data.yearlyRent <= 0) errors.push('Valid yearly rent is required')

  return { isValid: errors.length === 0, errors }
}

// Occupant validation
export function validateOccupant(data: Partial<RoomOccupant>): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.name?.trim()) errors.push('Occupant name is required')
  if (!data.phone?.trim()) errors.push('Phone number is required')
  if (!data.nextOfKin?.trim()) errors.push('Next of kin is required')
  if (!data.nextOfKinPhone?.trim()) errors.push('Next of kin phone is required')
  if (!data.numberOfOccupants || data.numberOfOccupants <= 0) errors.push('Number of occupants must be greater than 0')
  if (data.kitchenAccess && !['shared', 'private', 'none'].includes(data.kitchenAccess)) {
    errors.push('Kitchen access must be shared, private, or none')
  }
  if (!data.rentStartDate) errors.push('Rent start date is required')
  if (!data.rentExpiryDate) errors.push('Rent expiry date is required')
  if (!data.totalRent || data.totalRent <= 0) errors.push('Total rent must be greater than 0')
  if (data.amountPaid !== undefined && data.amountPaid < 0) errors.push('Amount paid cannot be negative')

  // Date validation
  if (data.rentStartDate && data.rentExpiryDate) {
    const startDate = new Date(data.rentStartDate)
    const endDate = new Date(data.rentExpiryDate)
    if (endDate <= startDate) errors.push('Rent expiry date must be after start date')
  }

  // Phone number format validation (basic)
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
  if (data.phone && !phoneRegex.test(data.phone)) errors.push('Invalid phone number format')
  if (data.nextOfKinPhone && !phoneRegex.test(data.nextOfKinPhone)) errors.push('Invalid next of kin phone number format')

  return { isValid: errors.length === 0, errors }
}

// Payment validation
export function validatePayment(data: Partial<Payment>): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.propertyId?.trim()) errors.push('Property ID is required')
  if (!data.tenantName?.trim()) errors.push('Tenant name is required')
  if (!data.amount || data.amount === 0) errors.push('Payment amount is required')
  if (!data.type) errors.push('Payment type is required')
  if (!data.method) errors.push('Payment method is required')
  if (!data.dueDate) errors.push('Due date is required')
  if (!data.description?.trim()) errors.push('Payment description is required')

  return { isValid: errors.length === 0, errors }
}

// Maintenance request validation
export function validateMaintenanceRequest(data: Partial<MaintenanceRequest>): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.propertyId?.trim()) errors.push('Property ID is required')
  if (!data.title?.trim()) errors.push('Title is required')
  if (!data.description?.trim()) errors.push('Description is required')
  if (!data.category) errors.push('Category is required')
  if (!data.priority) errors.push('Priority is required')
  if (!data.reportedBy?.trim()) errors.push('Reporter name is required')
  if (!data.estimatedCost || data.estimatedCost < 0) errors.push('Valid estimated cost is required')

  return { isValid: errors.length === 0, errors }
}

// File validation
export function validateFile(file: File): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  const maxSize = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '5242880') // 5MB default
  const allowedTypes = (process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp').split(',')

  if (file.size > maxSize) {
    errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`)
  }

  return { isValid: errors.length === 0, errors }
}

// Utility function to sanitize input
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

// Utility function to validate email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}