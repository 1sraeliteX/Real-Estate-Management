import { prisma } from '../database'
import { Property } from '@prisma/client'
import { cache, cacheKeys } from '../utils/cache'

export interface PropertyData {
  name: string
  address: string
  type: string
  status: string
  yearlyRent: number
  bedrooms?: number
  bathrooms?: number
  area?: number
  description: string
  amenities: string[] | string // Accept both array and JSON string
  images: string[] | string // Accept both array and JSON string
  yearBuilt: number
  parkingSpaces: string | number
  numberOfRooms?: number
  numberOfKitchens?: number
  numberOfBathrooms?: number
  waterAvailability?: string
  userId?: string
  isCustom?: boolean
}

export class PropertyService {
  static async getAllProperties(userId?: string): Promise<Property[]> {
    const cacheKey = cacheKeys.properties(userId)
    const cached = cache.get(cacheKey)
    if (cached) return cached

    const properties = await prisma.property.findMany({
      where: userId ? { 
        OR: [
          { userId },
          { isCustom: false } // Include default properties
        ]
      } : {},
      orderBy: [
        { isCustom: 'asc' }, // Default properties first
        { createdAt: 'desc' }
      ],
      select: {
        id: true,
        name: true,
        address: true,
        type: true,
        status: true,
        yearlyRent: true,
        bedrooms: true,
        bathrooms: true,
        area: true,
        description: true,
        amenities: true,
        images: true,
        yearBuilt: true,
        parkingSpaces: true,
        numberOfRooms: true,
        numberOfKitchens: true,
        numberOfBathrooms: true,
        waterAvailability: true,
        userId: true,
        isCustom: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            rooms: true
          }
        }
      }
    })

    // Transform JSON strings back to arrays for frontend
    const result = properties.map(property => ({
      ...property,
      amenities: this.parseJsonField(property.amenities, []),
      images: this.parseJsonField(property.images, []),
      roomCount: property._count.rooms
    }))

    cache.set(cacheKey, result, 60) // Cache for 1 minute
    return result
  }

  // Helper method to safely parse JSON fields
  private static parseJsonField(field: string, defaultValue: any = null): any {
    try {
      return JSON.parse(field)
    } catch {
      return defaultValue
    }
  }

  static async getPropertyById(id: string, includeRelations: boolean = false): Promise<Property | null> {
    let property
    
    if (includeRelations) {
      property = await prisma.property.findUnique({
        where: { id },
        include: {
          rooms: {
            include: {
              occupants: true
            }
          },
          payments: true,
          maintenanceRequests: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })
    } else {
      property = await prisma.property.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          address: true,
          type: true,
          status: true,
          yearlyRent: true,
          bedrooms: true,
          bathrooms: true,
          area: true,
          description: true,
          amenities: true,
          images: true,
          yearBuilt: true,
          parkingSpaces: true,
          numberOfRooms: true,
          numberOfKitchens: true,
          numberOfBathrooms: true,
          waterAvailability: true,
          userId: true,
          isCustom: true,
          createdAt: true,
          updatedAt: true
        }
      })
    }

    if (!property) return null

    // Transform JSON strings back to arrays for frontend
    return {
      ...property,
      amenities: this.parseJsonField(property.amenities, []),
      images: this.parseJsonField(property.images, [])
    }
  }

  static async createProperty(propertyData: PropertyData): Promise<Property> {
    // Transform arrays to JSON strings for database storage
    const transformedData = {
      ...propertyData,
      amenities: Array.isArray(propertyData.amenities) 
        ? JSON.stringify(propertyData.amenities) 
        : propertyData.amenities,
      images: Array.isArray(propertyData.images) 
        ? JSON.stringify(propertyData.images) 
        : propertyData.images,
      parkingSpaces: typeof propertyData.parkingSpaces === 'number' 
        ? propertyData.parkingSpaces.toString() 
        : propertyData.parkingSpaces,
      isCustom: true, // User-created properties are custom
      // Only include userId if it's provided and not null/undefined
      ...(propertyData.userId && { userId: propertyData.userId })
    }

    // Remove userId from transformedData if it's null, undefined, or empty string
    if (!transformedData.userId) {
      delete transformedData.userId
    }

    const property = await prisma.property.create({
      data: transformedData
    })

    // Invalidate relevant caches
    this.invalidatePropertyCaches(propertyData.userId)

    // Transform JSON strings back to arrays for frontend response
    return {
      ...property,
      amenities: this.parseJsonField(property.amenities, []),
      images: this.parseJsonField(property.images, [])
    }
  }

  static async updateProperty(id: string, propertyData: Partial<PropertyData>): Promise<Property> {
    // Get existing property to know userId for cache invalidation
    const existingProperty = await prisma.property.findUnique({
      where: { id },
      select: { userId: true }
    })

    // Transform arrays to JSON strings for database storage
    const { userId, ...dataWithoutUserId } = propertyData
    const transformedData: any = {
      ...dataWithoutUserId,
      ...(propertyData.amenities && {
        amenities: Array.isArray(propertyData.amenities) 
          ? JSON.stringify(propertyData.amenities) 
          : propertyData.amenities
      }),
      ...(propertyData.images && {
        images: Array.isArray(propertyData.images) 
          ? JSON.stringify(propertyData.images) 
          : propertyData.images
      }),
      ...(propertyData.parkingSpaces && {
        parkingSpaces: typeof propertyData.parkingSpaces === 'number' 
          ? propertyData.parkingSpaces.toString() 
          : propertyData.parkingSpaces
      })
    }

    const property = await prisma.property.update({
      where: { id },
      data: transformedData
    })

    // Invalidate relevant caches
    this.invalidatePropertyCaches(existingProperty?.userId)
    cache.delete(cacheKeys.property(id, false))
    cache.delete(cacheKeys.property(id, true))

    // Transform JSON strings back to arrays for frontend
    return {
      ...property,
      amenities: this.parseJsonField(property.amenities, []),
      images: this.parseJsonField(property.images, [])
    }
  }

  static async deleteProperty(id: string): Promise<Property> {
    // Get existing property to know userId for cache invalidation
    const existingProperty = await prisma.property.findUnique({
      where: { id },
      select: { userId: true }
    })

    const property = await prisma.property.delete({
      where: { id }
    })

    // Invalidate relevant caches
    this.invalidatePropertyCaches(existingProperty?.userId)
    cache.delete(cacheKeys.property(id, false))
    cache.delete(cacheKeys.property(id, true))

    return property
  }

  static async getUserProperties(userId: string): Promise<Property[]> {
    return await prisma.property.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        rooms: true
      }
    })
  }

  static async getPropertiesByType(type: string, userId?: string): Promise<Property[]> {
    const properties = await prisma.property.findMany({
      where: {
        type,
        ...(userId && { 
          OR: [
            { userId },
            { isCustom: false }
          ]
        })
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform JSON strings back to arrays for frontend
    return properties.map(property => ({
      ...property,
      amenities: this.parseJsonField(property.amenities, []),
      images: this.parseJsonField(property.images, [])
    }))
  }

  static async searchProperties(query: string, userId?: string): Promise<Property[]> {
    const properties = await prisma.property.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: query } },
              { address: { contains: query } },
              { description: { contains: query } }
            ]
          },
          ...(userId ? [{
            OR: [
              { userId },
              { isCustom: false }
            ]
          }] : [])
        ]
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform JSON strings back to arrays for frontend
    return properties.map(property => ({
      ...property,
      amenities: this.parseJsonField(property.amenities, []),
      images: this.parseJsonField(property.images, [])
    }))
  }

  static async getPropertyStats(userId?: string) {
    const cacheKey = cacheKeys.propertyStats(userId)
    const cached = cache.get(cacheKey)
    if (cached) return cached

    const where = userId ? { 
      OR: [
        { userId },
        { isCustom: false }
      ]
    } : {}

    // Use aggregation for better performance
    const [propertyStats, roomStats] = await Promise.all([
      prisma.property.groupBy({
        by: ['status'],
        where,
        _count: {
          id: true
        }
      }),
      prisma.room.groupBy({
        by: ['status'],
        where: {
          property: where
        },
        _count: {
          id: true
        }
      })
    ])

    const totalProperties = propertyStats.reduce((sum, stat) => sum + stat._count.id, 0)
    const occupiedProperties = propertyStats.find(s => s.status === 'occupied')?._count.id || 0
    const availableProperties = propertyStats.find(s => s.status === 'available')?._count.id || 0
    
    const totalRooms = roomStats.reduce((sum, stat) => sum + stat._count.id, 0)
    const occupiedRooms = roomStats.find(s => s.status === 'occupied')?._count.id || 0

    const result = {
      totalProperties,
      occupiedProperties,
      availableProperties,
      totalRooms,
      occupiedRooms,
      vacantRooms: totalRooms - occupiedRooms
    }

    cache.set(cacheKey, result, 120) // Cache for 2 minutes
    return result
  }

  // Cache invalidation helper
  private static invalidatePropertyCaches(userId?: string | null): void {
    // Clear all property list caches
    cache.delete(cacheKeys.properties(userId || undefined))
    cache.delete(cacheKeys.properties()) // Clear global cache too
    cache.delete(cacheKeys.propertyStats(userId || undefined))
    cache.delete(cacheKeys.propertyStats()) // Clear global stats too
  }

  // Initialize default properties (migration helper)
  static async initializeDefaultProperties(): Promise<void> {
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
  }
}