# Example: Converting Dashboard to Use API

Here's how to convert your dashboard page from mock data to real API calls:

## Before (Mock Data)

```tsx
// app/dashboard/page.tsx
import { mockRooms, mockProperties } from '@/lib/mockApi'

export default function DashboardPage() {
  const totalRooms = mockRooms.length
  const occupiedRooms = mockRooms.filter(r => r.status === 'occupied').length
  
  const stats = {
    totalFinance: 15000000,
    totalProperties: mockProperties.length,
    // ... more stats
  }
  
  return <div>{/* Display stats */}</div>
}
```

## After (API Integration)

```tsx
// app/dashboard/page.tsx
'use client'

import { useDashboardStats } from '@/lib/hooks/useStats'
import { useProperties } from '@/lib/hooks/useProperties'
import { useRooms } from '@/lib/hooks/useRooms'

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: properties, isLoading: propertiesLoading } = useProperties()
  const { data: rooms, isLoading: roomsLoading } = useRooms()
  
  if (statsLoading || propertiesLoading || roomsLoading) {
    return <div>Loading dashboard...</div>
  }
  
  const totalRooms = rooms?.length || 0
  const occupiedRooms = rooms?.filter(r => r.status === 'occupied').length || 0
  
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Finance Stats - Auto-updates every 30 seconds */}
      <div>
        <h2>Total Finance: ₦{stats?.totalFinance.toLocaleString()}</h2>
        <h2>Pending Payments: ₦{stats?.pendingPayments.toLocaleString()}</h2>
      </div>
      
      {/* Property Stats - Updates when properties change */}
      <div>
        <h2>Total Properties: {properties?.length}</h2>
        <h2>Occupied Rooms: {occupiedRooms} of {totalRooms}</h2>
      </div>
    </div>
  )
}
```

## Example: Adding an Occupant with Auto-Refresh

```tsx
// components/AddOccupantModal.tsx
'use client'

import { useCreateOccupant } from '@/lib/hooks/useOccupants'
import { useState } from 'react'

export default function AddOccupantModal({ roomId, onClose }) {
  const [formData, setFormData] = useState({...})
  const createOccupant = useCreateOccupant()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Make API call
      await createOccupant.mutateAsync({
        roomId,
        name: formData.name,
        phone: formData.phone,
        // ... other fields
      })
      
      // Success! These will automatically refresh:
      // - Occupants list
      // - Room occupancy status
      // - Dashboard stats
      // - Finance totals
      
      alert('Occupant added successfully!')
      onClose()
    } catch (error) {
      alert('Error adding occupant: ' + error.message)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      
      <button 
        type="submit" 
        disabled={createOccupant.isPending}
      >
        {createOccupant.isPending ? 'Adding...' : 'Add Occupant'}
      </button>
    </form>
  )
}
```

## What Happens When You Add an Occupant?

1. User fills form and clicks "Add Occupant"
2. API call is made to `POST /api/occupants`
3. On success, React Query invalidates these caches:
   - `['occupants']` - All occupants list
   - `['occupants', 'room', roomId]` - Occupants in this room
   - `['rooms']` - All rooms (to update occupancy count)
   - `['stats']` - Dashboard stats
4. All components using these queries automatically refetch
5. UI updates everywhere:
   - Dashboard shows new occupant count
   - Room shows updated occupancy
   - Occupants page includes new entry
   - Finance stats reflect new payment

## No Manual Refresh Needed!

The beauty of React Query is that you don't need to:
- Manually update state in multiple places
- Pass callbacks up through components
- Trigger manual refreshes
- Worry about stale data

Everything stays in sync automatically! 🎉

## Quick Start Checklist

- [ ] Install dependencies: `npm install @tanstack/react-query axios`
- [ ] Create `.env.local` with your API URL
- [ ] Wrap app with `<QueryProvider>` (already done in layout.tsx)
- [ ] Replace mock data imports with hooks
- [ ] Test each feature
- [ ] Enjoy automatic data synchronization!
