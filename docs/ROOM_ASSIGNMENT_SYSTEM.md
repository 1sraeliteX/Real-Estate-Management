# Room Assignment System Documentation

## Overview

The Room Assignment System provides comprehensive management of room occupancy, capacity tracking, and assignment history. This system ensures proper room allocation, prevents overbooking, and maintains detailed records of all room assignments.

## Database Schema Updates

### Enhanced Room Model
```typescript
model Room {
  id              String   @id @default(cuid())
  propertyId      String
  propertyName    String
  roomNumber      String
  status          String   // 'available', 'occupied', 'maintenance', 'reserved'
  yearlyRent      Int
  maxOccupants    Int      @default(1)  // Maximum capacity
  currentOccupants Int     @default(0)  // Current occupancy
  roomType        String?  // 'single', 'shared', 'studio', 'apartment'
  amenities       String?  // JSON string for amenities
  floor           Int?     // Floor number
  size            Float?   // Room size in square meters
  hasPrivateBath  Boolean  @default(false)
  hasKitchen      Boolean  @default(false)
  lastOccupiedDate String? // Track when room was last occupied
  // ... other fields
}
```

### Enhanced RoomOccupant Model
```typescript
model RoomOccupant {
  id                 String   @id @default(cuid())
  roomId             String
  name               String
  phone              String
  email              String?  // Optional email
  // ... contact fields
  assignmentStatus   String   @default("active") // 'active', 'moved_out', 'terminated'
  moveInDate         String?  // Actual move-in date
  moveOutDate        String?  // Actual move-out date
  securityDeposit    Int      @default(0)
  depositStatus      String   @default("pending") // 'pending', 'paid', 'refunded'
  occupation         String?  // Occupant's profession
  idNumber           String?  // ID/passport number
  assignedBy         String?  // User who made assignment
  assignedAt         DateTime @default(now())
  // ... other fields
}
```

### New RoomAssignmentHistory Model
```typescript
model RoomAssignmentHistory {
  id            String   @id @default(cuid())
  roomId        String
  occupantId    String?
  propertyId    String
  action        String   // 'assigned', 'moved_out', 'transferred', 'status_changed'
  fromStatus    String?  // Previous status
  toStatus      String?  // New status
  assignedBy    String?  // User who made the change
  reason        String?  // Reason for change
  effectiveDate String   // When change took effect
  // ... other fields
}
```

## Room Assignment Service

### Core Features

#### 1. Room Availability Checking
```typescript
const availability = await RoomAssignmentService.checkRoomAvailability(roomId, numberOfOccupants)
// Returns: { canAccommodate, availableSpace, currentOccupants, maxOccupants, roomStatus }
```

#### 2. Available Rooms Retrieval
```typescript
const availableRooms = await RoomAssignmentService.getAvailableRooms(propertyId, minCapacity)
// Returns rooms with available space, including partially occupied shared rooms
```

#### 3. Occupant Assignment
```typescript
const occupant = await RoomAssignmentService.assignOccupantToRoom({
  roomId: 'room-id',
  occupantData: { /* occupant details */ },
  assignedBy: 'user-id'
})
// Automatically updates room occupancy and status
```

#### 4. Room Transfer
```typescript
const result = await RoomAssignmentService.transferOccupant({
  occupantId: 'occupant-id',
  fromRoomId: 'old-room-id',
  toRoomId: 'new-room-id',
  transferDate: '2024-01-15',
  reason: 'Requested room change',
  assignedBy: 'user-id'
})
```

#### 5. Move Out Processing
```typescript
const result = await RoomAssignmentService.removeOccupantFromRoom(
  occupantId, 
  moveOutDate, 
  assignedBy
)
// Updates room availability and records history
```

## API Endpoints

### 1. Available Rooms
```
GET /api/rooms/available?propertyId=xxx&minCapacity=2
```
Returns rooms that can accommodate the specified number of occupants.

### 2. Room Assignment Operations
```
POST /api/rooms/assignments
{
  "action": "transfer",
  "occupantId": "xxx",
  "fromRoomId": "xxx",
  "toRoomId": "xxx",
  "transferDate": "2024-01-15",
  "reason": "Room change request"
}
```

### 3. Assignment History
```
GET /api/rooms/assignments?roomId=xxx&limit=50
```
Returns assignment history for tracking changes.

### 4. Occupancy Statistics
```
GET /api/rooms/occupancy-stats?propertyId=xxx
```
Returns comprehensive occupancy statistics.

## Room Status Management

### Status Types
- **available**: Room has space for new occupants
- **occupied**: Room is at full capacity
- **maintenance**: Room is under maintenance
- **reserved**: Room is reserved but not yet occupied

### Automatic Status Updates
The system automatically updates room status based on occupancy:
- When occupants are assigned: `available` → `occupied` (if at capacity)
- When occupants move out: `occupied` → `available` (if empty)
- Manual status changes are tracked in history

## Capacity Management

### Room Types and Default Capacities
- **Single Room**: 1 occupant (default)
- **Shared Room**: 2-4 occupants
- **Studio**: 1-2 occupants
- **Apartment**: 2-6 occupants

### Flexible Capacity
- Each room has a `maxOccupants` field
- System prevents overbooking
- Supports partial occupancy in shared rooms
- Real-time availability calculation

## Assignment History Tracking

### Tracked Events
- **assigned**: New occupant assigned to room
- **moved_out**: Occupant moved out
- **transferred**: Occupant moved to different room
- **status_changed**: Room status manually changed

### History Data
- Who made the change (`assignedBy`)
- When it took effect (`effectiveDate`)
- Reason for change (`reason`)
- Before/after status (`fromStatus`/`toStatus`)

## Migration Process

### Step 1: Update Database Schema
```bash
npx prisma db push
```

### Step 2: Run Migration Script
```bash
node scripts/migrate-room-assignments.js
```

### Step 3: Verify Data
Check that existing rooms and occupants have been properly migrated with:
- Room capacity and occupancy counts
- Assignment status for existing occupants
- Proper room status based on occupancy

## Usage Examples

### Adding New Occupant with Room Selection
```typescript
// Frontend: Get available rooms
const response = await fetch('/api/rooms/available?minCapacity=2')
const { rooms } = await response.json()

// Show rooms in dropdown with capacity info
rooms.forEach(room => {
  console.log(`${room.roomNumber}: ${room.availableSpace} spaces available`)
})

// Assign occupant using the service
const occupant = await RoomAssignmentService.assignOccupantToRoom({
  roomId: selectedRoomId,
  occupantData: formData,
  assignedBy: currentUserId
})
```

### Checking Room Availability
```typescript
const availability = await RoomAssignmentService.checkRoomAvailability(roomId, 2)
if (!availability.canAccommodate) {
  alert(`Room can only accommodate ${availability.availableSpace} more occupants`)
}
```

### Getting Occupancy Statistics
```typescript
const stats = await RoomAssignmentService.getRoomOccupancyStats(propertyId)
console.log(`Occupancy Rate: ${stats.occupancyRate.toFixed(1)}%`)
console.log(`Available Rooms: ${stats.availableRooms}`)
```

## Benefits

### 1. Prevents Overbooking
- Real-time capacity checking
- Automatic status updates
- Clear availability indicators

### 2. Comprehensive Tracking
- Complete assignment history
- Audit trail for all changes
- User accountability

### 3. Flexible Room Management
- Support for different room types
- Partial occupancy in shared rooms
- Easy room transfers

### 4. Better User Experience
- Clear capacity information
- Real-time availability
- Intuitive room selection

### 5. Data Integrity
- Transactional operations
- Consistent state management
- Automatic cleanup on moves

## Future Enhancements

### 1. Room Reservations
- Temporary room holds
- Reservation expiration
- Waitlist management

### 2. Advanced Matching
- Occupant preferences
- Room compatibility scoring
- Automatic suggestions

### 3. Bulk Operations
- Mass room assignments
- Batch transfers
- Group move-ins/outs

### 4. Integration Features
- Calendar integration
- Notification system
- Reporting dashboard