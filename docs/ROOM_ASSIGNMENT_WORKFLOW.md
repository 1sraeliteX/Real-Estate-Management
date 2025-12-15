# Room Assignment Workflow Documentation

## Overview

The Room Assignment Workflow is a comprehensive system that manages the complete lifecycle of room assignments in the property management application. It ensures proper room allocation, prevents conflicts, and maintains data integrity throughout the tenant management process.

## Key Features

### 1. **Property Creation with Room Configuration**
- Admins can define individual rooms during property registration
- Each room has a unique identifier (prefix + number, e.g., "A-101", "RM-03")
- Rooms are stored as distinct records linked to their property
- Initial status is set to "available"

### 2. **Room Availability Management**
- Real-time tracking of room occupancy status
- Automatic status updates based on occupancy
- Prevention of over-assignment through capacity validation

### 3. **Tenant Assignment Process**
- Only available rooms are shown during tenant registration
- Automatic room status updates upon assignment
- Duplicate assignment prevention at the database level
- Assignment history tracking

### 4. **Move-Out and Reassignment**
- Structured move-out process
- Automatic room availability restoration
- Historical record keeping

## Database Schema

### Room Model
```prisma
model Room {
  id              String   @id @default(cuid())
  propertyId      String
  propertyName    String
  roomPrefix      String   // e.g., "A", "B", "RM"
  roomNumber      String   // e.g., "101", "03"
  roomIdentifier  String   // e.g., "A-101", "RM-03"
  status          String   // 'available', 'occupied', 'maintenance', 'reserved'
  yearlyRent      Int
  maxOccupants    Int      @default(1)
  currentOccupants Int     @default(0)
  roomType        String?  // 'single', 'shared', 'studio', 'apartment'
  // ... other fields
  
  @@unique([propertyId, roomIdentifier]) // Prevents duplicate room IDs per property
}
```

### Room Assignment History
```prisma
model RoomAssignmentHistory {
  id            String   @id @default(cuid())
  roomId        String
  occupantId    String?
  propertyId    String
  action        String   // 'assigned', 'moved_out', 'transferred', 'status_changed'
  assignedBy    String?
  reason        String?
  effectiveDate String
  // ... other fields
}
```

## API Endpoints

### 1. Property Creation with Rooms
```http
POST /api/properties
Content-Type: application/json

{
  "name": "Test Lodge",
  "address": "123 Test Street",
  "type": "lodge",
  // ... other property fields
  "rooms": [
    {
      "roomPrefix": "A",
      "roomNumber": "101",
      "roomType": "single",
      "maxOccupants": 1,
      "yearlyRent": 500000,
      "amenities": ["Bed", "Desk", "Wardrobe"]
    }
  ]
}
```

### 2. Get Available Rooms
```http
GET /api/rooms/available?propertyId={id}&minCapacity={number}
```

### 3. Assign Tenant to Room
```http
POST /api/occupants
Content-Type: application/json

{
  "roomId": "room_id_here",
  "name": "John Doe",
  "phone": "08012345678",
  "numberOfOccupants": 1,
  // ... other tenant fields
}
```

### 4. Room Assignment Operations
```http
POST /api/rooms/assignments
Content-Type: application/json

{
  "action": "assign|transfer|remove",
  "occupantId": "occupant_id",
  "roomId": "room_id", // for assign/transfer
  "reason": "Optional reason",
  "notes": "Optional notes"
}
```

## Workflow Steps

### 1. Property Registration with Rooms

```javascript
// During property creation
const propertyData = {
  name: "Student Lodge",
  address: "University Area",
  type: "lodge",
  rooms: [
    {
      roomPrefix: "A",
      roomNumber: "101",
      roomType: "single",
      maxOccupants: 1,
      yearlyRent: 500000
    },
    {
      roomPrefix: "A", 
      roomNumber: "102",
      roomType: "shared",
      maxOccupants: 2,
      yearlyRent: 400000
    }
  ]
}

// API creates property and rooms in transaction
const response = await fetch('/api/properties', {
  method: 'POST',
  body: JSON.stringify(propertyData)
})
```

### 2. Tenant Registration with Room Selection

```javascript
// Get available rooms for selection
const availableRooms = await fetch('/api/rooms/available')

// Show only rooms with available capacity
const roomsWithSpace = availableRooms.filter(room => 
  room.availableSpace > 0
)

// Tenant selects room and completes registration
const tenantData = {
  roomId: selectedRoom.id,
  name: "John Doe",
  numberOfOccupants: 1,
  // ... other fields
}

// Assignment automatically updates room status
const response = await fetch('/api/occupants', {
  method: 'POST',
  body: JSON.stringify(tenantData)
})
```

### 3. Room Status Management

The system automatically manages room status based on occupancy:

- **Available**: `currentOccupants < maxOccupants`
- **Occupied**: `currentOccupants >= maxOccupants`
- **Maintenance**: Manually set for repairs
- **Reserved**: Manually set for future assignments

### 4. Move-Out Process

```javascript
// Process tenant move-out
const moveOutResult = await fetch('/api/rooms/assignments', {
  method: 'POST',
  body: JSON.stringify({
    action: 'remove',
    occupantId: tenant.id,
    reason: 'Lease ended'
  })
})

// Room automatically becomes available again
```

## Data Integrity Features

### 1. **Unique Room Identifiers**
- Database constraint prevents duplicate room identifiers per property
- Format: `{prefix}-{number}` (e.g., "A-101", "RM-03")

### 2. **Capacity Validation**
- API validates room capacity before assignment
- Prevents over-assignment at the application level
- Real-time occupancy tracking

### 3. **Transaction Safety**
- Room assignments use database transactions
- Ensures data consistency during concurrent operations
- Rollback on failure

### 4. **Assignment History**
- Complete audit trail of all room assignments
- Tracks who made assignments and when
- Includes reasons for changes

## Frontend Components

### 1. **RoomManagement Component**
- Used during property creation
- Allows defining multiple rooms with unique identifiers
- Validates room configuration before submission

### 2. **AddOccupantModal Component**
- Shows only available rooms in dropdown
- Real-time capacity information
- Prevents selection of full rooms

### 3. **RoomAssignmentWorkflow Component**
- Visual overview of all rooms and their status
- Quick assignment and move-out actions
- Occupancy statistics and availability tracking

## Error Handling

### Common Error Scenarios

1. **Room Not Available**
   ```json
   {
     "error": "Room capacity exceeded",
     "details": "Room A-101 can accommodate 1 occupant but 2 requested"
   }
   ```

2. **Duplicate Room Identifier**
   ```json
   {
     "error": "Room A-101 already exists for this property"
   }
   ```

3. **Assignment Conflict**
   ```json
   {
     "error": "Room assignment conflicts with existing data"
   }
   ```

## Testing

The system includes comprehensive tests covering:

- Property creation with room configuration
- Room availability checking
- Tenant assignment with status updates
- Duplicate assignment prevention
- Move-out process and availability restoration
- Assignment history tracking

Run tests with:
```bash
node test-room-assignment-workflow.js
```

## Best Practices

### 1. **Room Naming Convention**
- Use consistent prefixes (A, B, C for buildings; RM for generic rooms)
- Sequential numbering within each prefix
- Consider floor numbers in room numbers (101, 102 for floor 1)

### 2. **Capacity Planning**
- Set realistic `maxOccupants` based on room size
- Consider shared vs. private room types
- Account for amenities when setting capacity

### 3. **Status Management**
- Use "maintenance" status for repairs
- Use "reserved" status for future assignments
- Regular audits of room occupancy vs. status

### 4. **Data Validation**
- Always validate room capacity before assignment
- Check for duplicate identifiers during room creation
- Verify tenant data completeness before assignment

## Migration and Deployment

### Database Migration
```sql
-- Ensure unique constraint exists
ALTER TABLE rooms ADD CONSTRAINT unique_room_per_property 
UNIQUE (propertyId, roomIdentifier);

-- Add indexes for performance
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_rooms_property_status ON rooms(propertyId, status);
CREATE INDEX idx_room_occupants_assignment_status ON room_occupants(assignmentStatus);
```

### Environment Setup
1. Ensure database supports transactions
2. Configure proper error handling
3. Set up monitoring for room assignment operations
4. Test with realistic data volumes

## Monitoring and Analytics

### Key Metrics to Track
- Room occupancy rates by property
- Average time between assignments
- Assignment success/failure rates
- Move-out frequency and patterns

### Alerts to Configure
- Room over-assignment attempts
- Unusual assignment patterns
- Database constraint violations
- API endpoint failures

## Future Enhancements

### Planned Features
1. **Automated Room Recommendations**
   - Suggest optimal room assignments based on tenant preferences
   - Consider proximity to amenities and facilities

2. **Bulk Assignment Operations**
   - Mass assignment for group bookings
   - Batch move-out processing

3. **Room Swap Functionality**
   - Allow tenants to exchange rooms
   - Maintain assignment history during swaps

4. **Advanced Reporting**
   - Occupancy trends and forecasting
   - Revenue optimization suggestions
   - Maintenance scheduling based on occupancy

5. **Integration Features**
   - Calendar integration for lease dates
   - Payment system integration
   - Notification system for status changes

## Support and Troubleshooting

### Common Issues

1. **Room Status Not Updating**
   - Check if `RoomAssignmentService.updateRoomOccupancy()` is being called
   - Verify database transaction completion
   - Review assignment history for conflicts

2. **Duplicate Assignment Errors**
   - Ensure unique constraints are properly configured
   - Check for race conditions in concurrent assignments
   - Verify frontend validation is working

3. **Performance Issues**
   - Add database indexes on frequently queried fields
   - Implement caching for room availability queries
   - Optimize transaction scope and duration

### Debug Tools

1. **Assignment History Query**
   ```sql
   SELECT * FROM room_assignment_history 
   WHERE roomId = 'room_id' 
   ORDER BY createdAt DESC;
   ```

2. **Room Occupancy Audit**
   ```sql
   SELECT r.roomIdentifier, r.currentOccupants, r.maxOccupants, r.status,
          COUNT(ro.id) as active_assignments
   FROM rooms r
   LEFT JOIN room_occupants ro ON r.id = ro.roomId 
     AND ro.assignmentStatus = 'active'
   GROUP BY r.id;
   ```

3. **API Testing**
   ```bash
   # Test room availability
   curl -X GET "http://localhost:3000/api/rooms/available?propertyId=prop_id"
   
   # Test assignment
   curl -X POST "http://localhost:3000/api/occupants" \
     -H "Content-Type: application/json" \
     -d '{"roomId":"room_id","name":"Test Tenant",...}'
   ```

This comprehensive room assignment workflow ensures reliable, scalable, and maintainable tenant management with proper data integrity and user experience.