import { prisma } from '../database'
import { Property } from '@prisma/client'

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
  amenities: string
  images: string // JSON string
  yearBuilt: number
  parkingSpaces: string
  numberOfRooms?: number
  numberOfKitchens?: number
  numberOfBathrooms?: number
  waterAvailability?: string
  userId?: string
  isCustom?: boolean
}

export class PropertyService {
  static async getAllProperties(userId?: string): Promise<Property[]> {
    return await prisma.property.findMany({
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
      include: {
        rooms: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
  }

  static async getPropertyById(id: string): Promise<Property | null> {
    return await prisma.property.findUnique({
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
  }

  static async createProperty(propertyData: PropertyData): Promise<Property> {
    return await prisma.property.create({
      data: {
        ...propertyData,
        isCustom: true // User-created properties are custom
      }
    })
  }

  static async updateProperty(id: string, propertyData: Partial<PropertyData>): Promise<Property> {
    return await prisma.property.update({
      where: { id },
      data: propertyData
    })
  }

  static async deleteProperty(id: string): Promise<Property> {
    return await prisma.property.delete({
      where: { id }
    })
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
    return await prisma.property.findMany({
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
  }

  static async searchProperties(query: string, userId?: string): Promise<Property[]> {
    return await prisma.property.findMany({
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
  }

  static async getPropertyStats(userId?: string) {
    const where = userId ? { 
      OR: [
        { userId },
        { isCustom: false }
      ]
    } : {}

    const [
      totalProperties,
      occupiedProperties,
      availableProperties,
      totalRooms,
      occupiedRooms
    ] = await Promise.all([
      prisma.property.count({ where }),
      prisma.property.count({ 
        where: { ...where, status: 'occupied' }
      }),
      prisma.property.count({ 
        where: { ...where, status: 'available' }
      }),
      prisma.room.count({
        where: {
          property: where
        }
      }),
      prisma.room.count({
        where: {
          property: where,
          status: 'occupied'
        }
      })
    ])

    return {
      totalProperties,
      occupiedProperties,
      availableProperties,
      totalRooms,
      occupiedRooms,
      vacantRooms: totalRooms - occupiedRooms
    }
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