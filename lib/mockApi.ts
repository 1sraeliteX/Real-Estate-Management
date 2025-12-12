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
  },
  {
    id: '6',
    name: 'Golden Heights Penthouse',
    address: '555 Gold Ave, Penthouse, Manhattan, NY 10019',
    type: 'condo',
    status: 'occupied',
    yearlyRent: 8400000,
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
    description: 'Luxury penthouse with panoramic city views and premium finishes.',
    amenities: ['Private Elevator', 'Rooftop Terrace', 'Wine Cellar', 'Smart Home', 'Concierge'],
    yearBuilt: 2022,
    parkingSpaces: 2
  },
  {
    id: '7',
    name: 'Maple Grove Townhouse',
    address: '234 Maple Grove, Staten Island, NY 10301',
    type: 'house',
    status: 'available',
    yearlyRent: 3600000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    images: ['https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800'],
    description: 'Charming townhouse in quiet neighborhood with private garden.',
    amenities: ['Garden', 'Patio', 'Fireplace', 'Garage', 'Storage Room'],
    yearBuilt: 2017,
    parkingSpaces: 1
  },
  {
    id: '8',
    name: 'Metro Plaza Office Suite',
    address: '100 Business Blvd, Suite 1200, Manhattan, NY 10005',
    type: 'commercial',
    status: 'occupied',
    yearlyRent: 15600000,
    area: 2500,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
    description: 'Premium office space in the heart of the financial district.',
    amenities: ['Reception Area', 'Conference Rooms', 'High-Speed Internet', 'Security', 'Parking'],
    yearBuilt: 2019,
    parkingSpaces: 4
  },
  {
    id: '9',
    name: 'Harmony Student Lodge',
    address: '456 University Ave, Lagos',
    type: 'lodge',
    status: 'occupied',
    yearlyRent: 18000000,
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'],
    description: 'Premium student accommodation with modern facilities and study areas.',
    amenities: ['Study Rooms', 'Gym', 'Laundry', 'Security', 'WiFi', 'Generator', 'Water Tank'],
    yearBuilt: 2020,
    parkingSpaces: 15,
    numberOfRooms: 20,
    numberOfKitchens: 4,
    numberOfBathrooms: 10,
    waterAvailability: 'in-building',
    rooms: []
  },
  {
    id: '10',
    name: 'Serenity Apartments 4A',
    address: '678 Peace Street, Apt 4A, Bronx, NY 10451',
    type: 'apartment',
    status: 'maintenance',
    yearlyRent: 2280000,
    bedrooms: 2,
    bathrooms: 1,
    area: 950,
    images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'],
    description: 'Affordable apartment undergoing renovation for improved living standards.',
    amenities: ['Laundry Room', 'Parking', 'Playground', 'Community Garden'],
    yearBuilt: 2010,
    parkingSpaces: 1
  },
  {
    id: '11',
    name: 'Luxury Villa Estate',
    address: '999 Elite Drive, Long Island, NY 11701',
    type: 'house',
    status: 'available',
    yearlyRent: 12000000,
    bedrooms: 6,
    bathrooms: 5,
    area: 5000,
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    description: 'Magnificent estate with pool, tennis court, and guest house.',
    amenities: ['Swimming Pool', 'Tennis Court', 'Guest House', 'Wine Cellar', 'Home Theater', 'Gym'],
    yearBuilt: 2018,
    parkingSpaces: 4
  },
  {
    id: '12',
    name: 'Urban Loft 7C',
    address: '321 Industrial Way, Loft 7C, Brooklyn, NY 11205',
    type: 'apartment',
    status: 'occupied',
    yearlyRent: 4200000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1600,
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
    description: 'Converted industrial loft with exposed brick and high ceilings.',
    amenities: ['Exposed Brick', 'High Ceilings', 'Hardwood Floors', 'Freight Elevator', 'Rooftop Access'],
    yearBuilt: 2016,
    parkingSpaces: 0
  }
]

export const mockRooms: Room[] = [
  // Sunrise Lodge Rooms
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
  },
  {
    id: 'r4',
    propertyId: '5',
    propertyName: 'Sunrise Lodge',
    roomNumber: '104',
    status: 'occupied',
    yearlyRent: 650000,
    rentStartDate: '2024-03-15',
    rentExpiryDate: '2025-03-14',
    occupants: [
      {
        id: 'o3',
        roomId: 'r4',
        name: 'Kemi Adebayo',
        phone: '+2348055667788',
        nextOfKin: 'Tunde Adebayo',
        nextOfKinPhone: '+2348033445566',
        numberOfOccupants: 1,
        rentStartDate: '2024-03-15',
        rentExpiryDate: '2025-03-14',
        totalRent: 650000,
        amountPaid: 650000,
        paymentStatus: 'completed',
        issues: [],
        notes: [
          {
            id: 'n2',
            content: 'Excellent tenant, always pays on time',
            createdAt: '2024-11-15T09:00:00Z'
          }
        ]
      }
    ]
  },
  {
    id: 'r5',
    propertyId: '5',
    propertyName: 'Sunrise Lodge',
    roomNumber: '105',
    status: 'occupied',
    yearlyRent: 600000,
    rentStartDate: '2024-06-01',
    rentExpiryDate: '2025-05-31',
    occupants: [
      {
        id: 'o4',
        roomId: 'r5',
        name: 'David Okonkwo',
        phone: '+2347088990011',
        nextOfKin: 'Grace Okonkwo',
        nextOfKinPhone: '+2347066778899',
        numberOfOccupants: 1,
        rentStartDate: '2024-06-01',
        rentExpiryDate: '2025-05-31',
        totalRent: 600000,
        amountPaid: 400000,
        paymentStatus: 'pending',
        issues: [
          {
            id: 'i2',
            description: 'Door lock needs repair',
            resolved: false,
            createdAt: '2024-11-28T16:30:00Z'
          }
        ],
        notes: []
      }
    ]
  },
  // Harmony Student Lodge Rooms
  {
    id: 'r6',
    propertyId: '9',
    propertyName: 'Harmony Student Lodge',
    roomNumber: 'A01',
    status: 'occupied',
    yearlyRent: 800000,
    rentStartDate: '2024-09-01',
    rentExpiryDate: '2025-08-31',
    occupants: [
      {
        id: 'o5',
        roomId: 'r6',
        name: 'Blessing Okoro',
        phone: '+2348123456789',
        nextOfKin: 'Mrs. Okoro',
        nextOfKinPhone: '+2348098765432',
        numberOfOccupants: 1,
        rentStartDate: '2024-09-01',
        rentExpiryDate: '2025-08-31',
        totalRent: 800000,
        amountPaid: 400000,
        paymentStatus: 'pending',
        issues: [],
        notes: [
          {
            id: 'n3',
            content: 'Engineering student at University of Lagos',
            createdAt: '2024-09-01T10:00:00Z'
          }
        ]
      }
    ]
  },
  {
    id: 'r7',
    propertyId: '9',
    propertyName: 'Harmony Student Lodge',
    roomNumber: 'A02',
    status: 'occupied',
    yearlyRent: 800000,
    rentStartDate: '2024-09-01',
    rentExpiryDate: '2025-08-31',
    occupants: [
      {
        id: 'o6',
        roomId: 'r7',
        name: 'Michael Eze',
        phone: '+2347012345678',
        nextOfKin: 'Joseph Eze',
        nextOfKinPhone: '+2347087654321',
        numberOfOccupants: 1,
        rentStartDate: '2024-09-01',
        rentExpiryDate: '2025-08-31',
        totalRent: 800000,
        amountPaid: 800000,
        paymentStatus: 'completed',
        issues: [],
        notes: []
      }
    ]
  },
  {
    id: 'r8',
    propertyId: '9',
    propertyName: 'Harmony Student Lodge',
    roomNumber: 'A03',
    status: 'available',
    yearlyRent: 800000,
    occupants: []
  },
  {
    id: 'r9',
    propertyId: '9',
    propertyName: 'Harmony Student Lodge',
    roomNumber: 'B01',
    status: 'occupied',
    yearlyRent: 850000,
    rentStartDate: '2024-10-01',
    rentExpiryDate: '2025-09-30',
    occupants: [
      {
        id: 'o7',
        roomId: 'r9',
        name: 'Funmi Adesanya',
        phone: '+2348099887766',
        nextOfKin: 'Bola Adesanya',
        nextOfKinPhone: '+2348077665544',
        numberOfOccupants: 1,
        rentStartDate: '2024-10-01',
        rentExpiryDate: '2025-09-30',
        totalRent: 850000,
        amountPaid: 212500,
        paymentStatus: 'pending',
        issues: [
          {
            id: 'i3',
            description: 'WiFi connection unstable',
            resolved: false,
            createdAt: '2024-12-03T14:20:00Z'
          }
        ],
        notes: [
          {
            id: 'n4',
            content: 'Medical student, needs quiet environment',
            createdAt: '2024-10-01T12:00:00Z'
          }
        ]
      }
    ]
  },
  {
    id: 'r10',
    propertyId: '9',
    propertyName: 'Harmony Student Lodge',
    roomNumber: 'B02',
    status: 'available',
    yearlyRent: 850000,
    occupants: []
  }
]

export const mockPayments: Payment[] = [
  // Regular rent payments - various statuses and timing
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
    propertyId: '6',
    propertyName: 'Golden Heights Penthouse',
    tenantName: 'Robert Chen',
    amount: 700000,
    type: 'rent',
    method: 'bank',
    status: 'overdue',
    dueDate: '2024-11-15',
    description: 'November 2024 rent payment - OVERDUE'
  },
  {
    id: 'p4',
    propertyId: '8',
    propertyName: 'Metro Plaza Office Suite',
    tenantName: 'TechCorp Inc.',
    amount: 1300000,
    type: 'rent',
    method: 'bank',
    status: 'completed',
    dueDate: '2024-12-01',
    paidDate: '2024-11-25',
    description: 'December 2024 commercial rent'
  },
  {
    id: 'p5',
    propertyId: '12',
    propertyName: 'Urban Loft 7C',
    tenantName: 'Maria Rodriguez',
    amount: 350000,
    type: 'rent',
    method: 'cash',
    status: 'completed',
    dueDate: '2024-12-01',
    paidDate: '2024-12-01',
    description: 'December 2024 rent payment'
  },

  // Lodge room payments
  {
    id: 'p6',
    propertyId: '5',
    propertyName: 'Sunrise Lodge',
    tenantName: 'Ahmed Ibrahim',
    roomNumber: '101',
    amount: 300000,
    type: 'rent',
    method: 'bank',
    status: 'completed',
    dueDate: '2024-12-01',
    paidDate: '2024-11-30',
    description: 'Room 101 - December 2024 rent (6 months paid)'
  },
  {
    id: 'p7',
    propertyId: '5',
    propertyName: 'Sunrise Lodge',
    tenantName: 'Chioma Okafor',
    roomNumber: '102',
    amount: 50000,
    type: 'rent',
    method: 'mobile',
    status: 'completed',
    dueDate: '2024-12-01',
    paidDate: '2024-12-05',
    description: 'Room 102 - Partial payment December 2024'
  },
  {
    id: 'p8',
    propertyId: '9',
    propertyName: 'Harmony Student Lodge',
    tenantName: 'Blessing Okoro',
    roomNumber: 'A01',
    amount: 200000,
    type: 'rent',
    method: 'bank',
    status: 'pending',
    dueDate: '2024-12-01',
    description: 'Room A01 - December 2024 installment'
  },
  {
    id: 'p9',
    propertyId: '9',
    propertyName: 'Harmony Student Lodge',
    tenantName: 'Michael Eze',
    roomNumber: 'A02',
    amount: 800000,
    type: 'rent',
    method: 'bank',
    status: 'completed',
    dueDate: '2024-09-01',
    paidDate: '2024-08-28',
    description: 'Room A02 - Full year payment (Academic session)'
  },

  // Utility payments
  {
    id: 'p10',
    propertyId: '1',
    propertyName: 'Sunset Apartments 101',
    tenantName: 'John Smith',
    amount: 15000,
    type: 'utilities',
    method: 'bank',
    status: 'completed',
    dueDate: '2024-11-15',
    paidDate: '2024-11-14',
    description: 'November utilities - Electricity & Water'
  },
  {
    id: 'p11',
    propertyId: '6',
    propertyName: 'Golden Heights Penthouse',
    tenantName: 'Robert Chen',
    amount: 45000,
    type: 'utilities',
    method: 'card',
    status: 'overdue',
    dueDate: '2024-11-20',
    description: 'November utilities - High usage month'
  },
  {
    id: 'p12',
    propertyId: '8',
    propertyName: 'Metro Plaza Office Suite',
    tenantName: 'TechCorp Inc.',
    amount: 85000,
    type: 'utilities',
    method: 'bank',
    status: 'completed',
    dueDate: '2024-12-05',
    paidDate: '2024-12-03',
    description: 'December utilities - Office complex'
  },

  // Security deposits
  {
    id: 'p13',
    propertyId: '4',
    propertyName: 'Riverside Apartments 203',
    tenantName: 'Sarah Johnson',
    amount: 440000,
    type: 'deposit',
    method: 'bank',
    status: 'completed',
    dueDate: '2023-06-01',
    paidDate: '2023-05-28',
    description: 'Security deposit - 2 months rent'
  },
  {
    id: 'p14',
    propertyId: '12',
    propertyName: 'Urban Loft 7C',
    tenantName: 'Maria Rodriguez',
    amount: 700000,
    type: 'deposit',
    method: 'bank',
    status: 'completed',
    dueDate: '2024-08-01',
    paidDate: '2024-07-28',
    description: 'Security deposit - 2 months rent'
  },
  {
    id: 'p15',
    propertyId: '8',
    propertyName: 'Metro Plaza Office Suite',
    tenantName: 'TechCorp Inc.',
    amount: 2600000,
    type: 'deposit',
    method: 'bank',
    status: 'completed',
    dueDate: '2024-01-01',
    paidDate: '2023-12-20',
    description: 'Commercial security deposit - 2 months rent'
  },

  // Maintenance and repair costs
  {
    id: 'p16',
    propertyId: '3',
    propertyName: 'Downtown Condo 5B',
    tenantName: 'Previous Tenant',
    amount: 50000,
    type: 'maintenance',
    method: 'check',
    status: 'overdue',
    dueDate: '2024-11-01',
    description: 'Damage repair costs - Wall painting'
  },
  {
    id: 'p17',
    propertyId: '1',
    propertyName: 'Sunset Apartments 101',
    tenantName: 'John Smith',
    amount: 25000,
    type: 'maintenance',
    method: 'cash',
    status: 'completed',
    dueDate: '2024-11-10',
    paidDate: '2024-11-08',
    description: 'Plumbing repair - Kitchen faucet'
  },
  {
    id: 'p18',
    propertyId: '5',
    propertyName: 'Sunrise Lodge',
    tenantName: 'Lodge Management',
    amount: 120000,
    type: 'maintenance',
    method: 'bank',
    status: 'completed',
    dueDate: '2024-11-30',
    paidDate: '2024-11-28',
    description: 'Generator servicing and repairs'
  },

  // Late fees and penalties
  {
    id: 'p19',
    propertyId: '6',
    propertyName: 'Golden Heights Penthouse',
    tenantName: 'Robert Chen',
    amount: 35000,
    type: 'late_fee',
    method: 'pending',
    status: 'pending',
    dueDate: '2024-12-10',
    description: 'Late payment penalty - November rent'
  },
  {
    id: 'p20',
    propertyId: '4',
    propertyName: 'Riverside Apartments 203',
    tenantName: 'Sarah Johnson',
    amount: 10000,
    type: 'late_fee',
    method: 'card',
    status: 'completed',
    dueDate: '2024-10-15',
    paidDate: '2024-10-20',
    description: 'Late payment fee - September rent'
  },

  // Partial payments and installments
  {
    id: 'p21',
    propertyId: '5',
    propertyName: 'Sunrise Lodge',
    tenantName: 'David Okonkwo',
    roomNumber: '105',
    amount: 100000,
    type: 'rent',
    method: 'mobile',
    status: 'completed',
    dueDate: '2024-11-01',
    paidDate: '2024-11-05',
    description: 'Room 105 - Partial payment (1 of 6)'
  },
  {
    id: 'p22',
    propertyId: '5',
    propertyName: 'Sunrise Lodge',
    tenantName: 'David Okonkwo',
    roomNumber: '105',
    amount: 100000,
    type: 'rent',
    method: 'mobile',
    status: 'completed',
    dueDate: '2024-11-15',
    paidDate: '2024-11-18',
    description: 'Room 105 - Partial payment (2 of 6)'
  },
  {
    id: 'p23',
    propertyId: '9',
    propertyName: 'Harmony Student Lodge',
    tenantName: 'Funmi Adesanya',
    roomNumber: 'B01',
    amount: 212500,
    type: 'rent',
    method: 'bank',
    status: 'completed',
    dueDate: '2024-10-01',
    paidDate: '2024-09-28',
    description: 'Room B01 - First quarter payment'
  },

  // Refunds and adjustments
  {
    id: 'p24',
    propertyId: '10',
    propertyName: 'Serenity Apartments 4A',
    tenantName: 'Former Tenant',
    amount: -30000,
    type: 'refund',
    method: 'bank',
    status: 'completed',
    dueDate: '2024-10-15',
    paidDate: '2024-10-12',
    description: 'Utility overpayment refund'
  },
  {
    id: 'p25',
    propertyId: '3',
    propertyName: 'Downtown Condo 5B',
    tenantName: 'Property Owner',
    amount: -15000,
    type: 'adjustment',
    method: 'bank',
    status: 'completed',
    dueDate: '2024-11-20',
    paidDate: '2024-11-18',
    description: 'Rent adjustment - Maintenance period'
  },

  // Advance payments
  {
    id: 'p26',
    propertyId: '1',
    propertyName: 'Sunset Apartments 101',
    tenantName: 'John Smith',
    amount: 500000,
    type: 'rent',
    method: 'bank',
    status: 'completed',
    dueDate: '2025-01-01',
    paidDate: '2024-12-08',
    description: 'January & February 2025 rent - Advance payment'
  },
  {
    id: 'p27',
    propertyId: '8',
    propertyName: 'Metro Plaza Office Suite',
    tenantName: 'TechCorp Inc.',
    amount: 3900000,
    type: 'rent',
    method: 'bank',
    status: 'completed',
    dueDate: '2025-01-01',
    paidDate: '2024-12-01',
    description: 'Q1 2025 commercial rent - Quarterly advance'
  },

  // Service charges and fees
  {
    id: 'p28',
    propertyId: '6',
    propertyName: 'Golden Heights Penthouse',
    tenantName: 'Robert Chen',
    amount: 75000,
    type: 'service_charge',
    method: 'card',
    status: 'pending',
    dueDate: '2024-12-15',
    description: 'Monthly service charge - Concierge & Maintenance'
  },
  {
    id: 'p29',
    propertyId: '9',
    propertyName: 'Harmony Student Lodge',
    tenantName: 'All Residents',
    amount: 25000,
    type: 'service_charge',
    method: 'bank',
    status: 'completed',
    dueDate: '2024-12-01',
    paidDate: '2024-11-30',
    description: 'Monthly WiFi and security service charge'
  },

  // Historical payments for trend analysis
  {
    id: 'p30',
    propertyId: '1',
    propertyName: 'Sunset Apartments 101',
    tenantName: 'John Smith',
    amount: 250000,
    type: 'rent',
    method: 'bank',
    status: 'completed',
    dueDate: '2024-11-01',
    paidDate: '2024-10-28',
    description: 'November 2024 rent payment'
  },
  {
    id: 'p31',
    propertyId: '1',
    propertyName: 'Sunset Apartments 101',
    tenantName: 'John Smith',
    amount: 250000,
    type: 'rent',
    method: 'bank',
    status: 'completed',
    dueDate: '2024-10-01',
    paidDate: '2024-09-29',
    description: 'October 2024 rent payment'
  },
  {
    id: 'p32',
    propertyId: '4',
    propertyName: 'Riverside Apartments 203',
    tenantName: 'Sarah Johnson',
    amount: 220000,
    type: 'rent',
    method: 'card',
    status: 'completed',
    dueDate: '2024-11-01',
    paidDate: '2024-11-03',
    description: 'November 2024 rent payment'
  },
  {
    id: 'p33',
    propertyId: '8',
    propertyName: 'Metro Plaza Office Suite',
    tenantName: 'TechCorp Inc.',
    amount: 1300000,
    type: 'rent',
    method: 'bank',
    status: 'completed',
    dueDate: '2024-11-01',
    paidDate: '2024-10-25',
    description: 'November 2024 commercial rent'
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
  
  // Filter out refunds and adjustments from revenue calculations
  const revenuePayments = completed.filter(p => p.amount > 0 && !['refund', 'adjustment'].includes(p.type))
  const pendingRevenue = pending.filter(p => p.amount > 0 && !['refund', 'adjustment'].includes(p.type))
  const overdueRevenue = overdue.filter(p => p.amount > 0 && !['refund', 'adjustment'].includes(p.type))
  
  return {
    totalRevenue: revenuePayments.reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: pendingRevenue.reduce((sum, p) => sum + p.amount, 0),
    overdueAmount: overdueRevenue.reduce((sum, p) => sum + p.amount, 0),
    monthlyRevenue: revenuePayments.filter(p => p.paidDate?.startsWith('2024-12')).reduce((sum, p) => sum + p.amount, 0)
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
