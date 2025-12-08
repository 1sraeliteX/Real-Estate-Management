import { Property, Payment, MaintenanceRequest, PropertyStats, PaymentStats, MaintenanceStats, Room } from '@/types'

export const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Sunset Apartments 101',
    address: '123 Main St, Apt 101, New York, NY 10001',
    type: 'apartment',
    status: 'occupied',
    yearlyRent: 3000000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    description: 'Beautiful 2-bedroom apartment with modern amenities and stunning city views.',
    amenities: ['Air Conditioning', 'Dishwasher', 'Gym', 'Pool', 'Parking', 'Laundry'],
    yearBuilt: 2018,
    parkingSpaces: 1,
  },
  {
    id: '2',
    name: 'Oak Street House',
    address: '456 Oak Street, Brooklyn, NY 11201',
    type: 'house',
    status: 'available',
    yearlyRent: 5040000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2400,
    images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'],
    description: 'Spacious family home with backyard and garage.',
    amenities: ['Garden', 'Garage', 'Fireplace', 'Central Heating', 'Hardwood Floors'],
    yearBuilt: 2015,
    parkingSpaces: 2
  },
  {
    id: '3',
    name: 'Downtown Condo 5B',
    address: '789 Park Ave, Unit 5B, Manhattan, NY 10022',
    type: 'condo',
    status: 'maintenance',
    yearlyRent: 4560000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
    description: 'Luxury condo in prime location, currently under maintenance.',
    amenities: ['Doorman', 'Concierge', 'Rooftop Terrace', 'Gym', 'Storage'],
    yearBuilt: 2020,
    parkingSpaces: 1
  },
  {
    id: '4',
    name: 'Riverside Apartments 203',
    address: '321 River Rd, Apt 203, Queens, NY 11101',
    type: 'apartment',
    status: 'occupied',
    yearlyRent: 2640000,
    bedrooms: 1,
    bathrooms: 1,
    area: 850,
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    description: 'Cozy studio with river views and modern finishes.',
    amenities: ['Balcony', 'Air Conditioning', 'Elevator', 'Pet Friendly'],
    yearBuilt: 2019,
    parkingSpaces: 0,
  },
  {
    id: '5',
    name: 'Sunrise Lodge',
    address: '789 Lodge Street, Lagos',
    type: 'lodge',
    status: 'occupied',
    yearlyRent: 12000000,
    images: ['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800'],
    description: 'Modern lodge with multiple rooms, perfect for students and workers.',
    amenities: ['Security', 'Generator', 'Water Tank', 'Parking', 'CCTV'],
    yearBuilt: 2021,
    parkingSpaces: 8,
    numberOfRooms: 12,
    numberOfKitchens: 2,
    numberOfBathrooms: 6,
    waterAvailability: 'in-building',
    rooms: []
  }
]

export const mockRooms: Room[] = [
  {
    id: 'r1',
    propertyId: '5',
    propertyName: 'Sunrise Lodge',
    roomNumber: '101',
    status: 'occupied',
    yearlyRent: 600000,
    rentStartDate: '2024-01-01',
    rentExpiryDate: '2024-12-31',
    occupants: [
      {
        id: 'o1',
        roomId: 'r1',
        name: 'Ahmed Ibrahim',
        phone: '+2348012345678',
        nextOfKin: 'Fatima Ibrahim',
        nextOfKinPhone: '+2348098765432',
        numberOfOccupants: 1,
        rentStartDate: '2024-01-01',
        rentExpiryDate: '2024-12-31',
        totalRent: 600000,
        amountPaid: 600000,
        paymentStatus: 'completed',
        issues: [],
        notes: []
      }
    ]
  },
  {
    id: 'r2',
    propertyId: '5',
    propertyName: 'Sunrise Lodge',
    roomNumber: '102',
    status: 'occupied',
    yearlyRent: 600000,
    rentStartDate: '2024-02-01',
    rentExpiryDate: '2025-01-31',
    occupants: [
      {
        id: 'o2',
        roomId: 'r2',
        name: 'Chioma Okafor',
        phone: '+2347011223344',
        nextOfKin: 'Emeka Okafor',
        nextOfKinPhone: '+2347099887766',
        numberOfOccupants: 1,
        rentStartDate: '2024-02-01',
        rentExpiryDate: '2025-01-31',
        totalRent: 600000,
        amountPaid: 300000,
        paymentStatus: 'pending',
        issues: [
          {
            id: 'i1',
            description: 'Ceiling fan not working',
            resolved: false,
            createdAt: '2024-12-01T10:00:00Z'
          }
        ],
        notes: [
          {
            id: 'n1',
            content: 'Promised to pay balance by end of month',
            createdAt: '2024-12-05T14:30:00Z'
          }
        ]
      }
    ]
  },
  {
    id: 'r3',
    propertyId: '5',
    propertyName: 'Sunrise Lodge',
    roomNumber: '103',
    status: 'available',
    yearlyRent: 600000,
    occupants: []
  }
]

export const mockPayments: Payment[] = [
  {
    id: 'p1',
    propertyId: '1',
    propertyName: 'Sunset Apartments 101',
    tenantName: 'John Smith',
    amount: 250000,
    type: 'rent',
    method: 'bank',
    status: 'completed',
    dueDate: '2024-12-01',
    paidDate: '2024-11-28',
    description: 'December 2024 rent payment'
  },
  {
    id: 'p2',
    propertyId: '4',
    propertyName: 'Riverside Apartments 203',
    tenantName: 'Sarah Johnson',
    amount: 220000,
    type: 'rent',
    method: 'card',
    status: 'pending',
    dueDate: '2024-12-01',
    description: 'December 2024 rent payment'
  },
  {
    id: 'p3',
    propertyId: '1',
    propertyName: 'Sunset Apartments 101',
    tenantName: 'John Smith',
    amount: 15000,
    type: 'utilities',
    method: 'bank',
    status: 'completed',
    dueDate: '2024-11-15',
    paidDate: '2024-11-14',
    description: 'November utilities'
  },
  {
    id: 'p4',
    propertyId: '3',
    propertyName: 'Downtown Condo 5B',
    tenantName: 'Previous Tenant',
    amount: 50000,
    type: 'maintenance',
    method: 'check',
    status: 'overdue',
    dueDate: '2024-11-01',
    description: 'Damage repair costs'
  },
  {
    id: 'p5',
    propertyId: '4',
    propertyName: 'Riverside Apartments 203',
    tenantName: 'Sarah Johnson',
    amount: 440000,
    type: 'deposit',
    method: 'bank',
    status: 'completed',
    dueDate: '2023-06-01',
    paidDate: '2023-05-28',
    description: 'Security deposit'
  }
]

export const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'm1',
    propertyId: '1',
    propertyName: 'Sunset Apartments 101',
    title: 'Leaking Kitchen Faucet',
    description: 'Kitchen faucet has been dripping constantly for the past week.',
    category: 'plumbing',
    priority: 'high',
    status: 'in-progress',
    reportedBy: 'John Smith',
    reportedDate: '2024-12-01',
    assignedTo: 'Mike\'s Plumbing',
    estimatedCost: 15000,
    resolutionTime: 5,
    notes: []
  },
  {
    id: 'm2',
    propertyId: '3',
    propertyName: 'Downtown Condo 5B',
    title: 'HVAC System Not Heating',
    description: 'Heating system not working properly. Temperature not reaching set point.',
    category: 'hvac',
    priority: 'urgent',
    status: 'open',
    reportedBy: 'Property Manager',
    reportedDate: '2024-12-05',
    estimatedCost: 50000,
    notes: []
  },
  {
    id: 'm3',
    propertyId: '4',
    propertyName: 'Riverside Apartments 203',
    title: 'Broken Dishwasher',
    description: 'Dishwasher not draining water properly.',
    category: 'appliance',
    priority: 'medium',
    status: 'completed',
    reportedBy: 'Sarah Johnson',
    reportedDate: '2024-11-20',
    assignedTo: 'Appliance Repair Co',
    estimatedCost: 20000,
    actualCost: 18000,
    completedDate: '2024-11-22',
    resolutionTime: 2,
    notes: []
  },
  {
    id: 'm4',
    propertyId: '1',
    propertyName: 'Sunset Apartments 101',
    title: 'Light Fixture Replacement',
    description: 'Bathroom light fixture needs replacement.',
    category: 'electrical',
    priority: 'low',
    status: 'open',
    reportedBy: 'John Smith',
    reportedDate: '2024-12-03',
    estimatedCost: 10000,
    notes: []
  }
]

export function getPropertyStats(): PropertyStats {
  return {
    total: mockProperties.length,
    available: mockProperties.filter(p => p.status === 'available').length,
    occupied: mockProperties.filter(p => p.status === 'occupied').length,
    maintenance: mockProperties.filter(p => p.status === 'maintenance').length
  }
}

export function getPaymentStats(): PaymentStats {
  const completed = mockPayments.filter(p => p.status === 'completed')
  const pending = mockPayments.filter(p => p.status === 'pending')
  const overdue = mockPayments.filter(p => p.status === 'overdue')
  
  return {
    totalRevenue: completed.reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: pending.reduce((sum, p) => sum + p.amount, 0),
    overdueAmount: overdue.reduce((sum, p) => sum + p.amount, 0),
    monthlyRevenue: completed.filter(p => p.paidDate?.startsWith('2024-12')).reduce((sum, p) => sum + p.amount, 0)
  }
}

export function getMaintenanceStats(): MaintenanceStats {
  const completed = mockMaintenanceRequests.filter(m => m.status === 'completed')
  const avgTime = completed.length > 0 
    ? completed.reduce((sum, m) => sum + (m.resolutionTime || 0), 0) / completed.length 
    : 0
  
  return {
    total: mockMaintenanceRequests.length,
    open: mockMaintenanceRequests.filter(m => m.status === 'open').length,
    inProgress: mockMaintenanceRequests.filter(m => m.status === 'in-progress').length,
    completed: completed.length,
    avgResolutionTime: Math.round(avgTime)
  }
}
