export interface Property {
  id: string
  name: string
  address: string
  type: 'apartment' | 'house' | 'condo' | 'commercial' | 'lodge'
  status: 'available' | 'occupied' | 'maintenance'
  yearlyRent: number
  bedrooms?: number
  bathrooms?: number
  area?: number
  images: File[] | string[]
  description: string
  amenities: string[]
  yearBuilt: number
  parkingSpaces: number | 'yes' | 'no'
  // Lodge specific fields
  numberOfRooms?: number
  numberOfKitchens?: number
  numberOfBathrooms?: number
  waterAvailability?: 'in-building' | 'in-compound'
  rooms?: Room[]
}

export interface Room {
  id: string
  propertyId: string
  propertyName: string
  roomNumber: string
  status: 'available' | 'occupied' | 'maintenance' | 'reserved'
  occupants: RoomOccupant[]
  yearlyRent: number
  maxOccupants: number
  currentOccupants: number
  roomType?: 'single' | 'shared' | 'studio' | 'apartment'
  amenities?: string[]
  floor?: number
  size?: number
  hasPrivateBath: boolean
  hasKitchen: boolean
  rentStartDate?: string
  rentExpiryDate?: string
  lastOccupiedDate?: string
  availableSpace?: number // Calculated field for UI
}

export interface RoomOccupant {
  id: string
  roomId: string
  name: string
  phone: string
  email?: string
  nextOfKin: string
  nextOfKinPhone: string
  numberOfOccupants: number
  kitchenAccess?: 'shared' | 'private' | 'none'
  rentStartDate: string
  rentExpiryDate: string
  totalRent: number
  amountPaid: number
  paymentStatus: 'pending' | 'partial' | 'completed' | 'overdue'
  assignmentStatus: 'active' | 'moved_out' | 'terminated'
  moveInDate?: string
  moveOutDate?: string
  securityDeposit: number
  depositStatus: 'pending' | 'paid' | 'refunded'
  emergencyContact?: string
  occupation?: string
  idNumber?: string
  issues: Issue[]
  notes: Note[]
  assignedBy?: string
  assignedAt?: string
}

export interface Issue {
  id: string
  description: string
  resolved: boolean
  createdAt: string
  resolvedAt?: string
}

export interface Note {
  id: string
  content: string
  createdAt: string
}

export interface Tenant {
  id: string
  name: string
  email: string
  phone: string
  moveInDate: string
  leaseEndDate: string
  rentAmount: number
  depositAmount: number
  proofOfPayment?: string[]
}

export interface Occupant {
  id: string
  name: string
  email?: string
  phone?: string
  relationship: string
}

export interface Payment {
  id: string
  propertyId: string
  propertyName: string
  tenantName: string
  amount: number
  type: 'rent' | 'deposit' | 'utilities' | 'maintenance' | 'late_fee' | 'refund' | 'adjustment' | 'service_charge'
  method: 'card' | 'bank' | 'cash' | 'check' | 'mobile' | 'pending'
  status: 'completed' | 'pending' | 'overdue'
  dueDate: string
  paidDate?: string
  description: string
  roomNumber?: string
}

export interface MaintenanceRequest {
  id: string
  propertyId: string
  propertyName: string
  title: string
  description: string
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'other'
  priority: 'urgent' | 'high' | 'medium' | 'low'
  status: 'open' | 'in-progress' | 'completed' | 'cancelled'
  reportedBy: string
  reportedDate: string
  assignedTo?: string
  estimatedCost: number
  actualCost?: number
  completedDate?: string
  resolutionTime?: number
  notes: Note[]
}

export interface TwilioSettings {
  accountSid: string
  authToken: string
  phoneNumber: string
  enabled: boolean
}

export interface PropertyStats {
  total: number
  available: number
  occupied: number
  maintenance: number
}

export interface PaymentStats {
  totalRevenue: number
  pendingAmount: number
  overdueAmount: number
  monthlyRevenue: number
}

export interface MaintenanceStats {
  total: number
  open: number
  inProgress: number
  completed: number
  avgResolutionTime: number
}
