# Activity Tracking Implementation Guide

## Overview
The app now has automatic activity tracking and notifications! Every action you take (adding, updating, or deleting properties, occupants, rooms, etc.) will:
1. Show a toast notification immediately
2. Appear in the "What You Did Recently" section on the dashboard

## How It Works

### 1. Activity Context
The `ActivityContext` provides:
- `addActivity()` - Logs an activity to the recent activities list
- `showToast()` - Shows a toast notification
- `activities` - Array of recent activities

### 2. Using Activity Tracking in Components

#### Example: Adding a Property

```tsx
'use client'

import { useActivity } from '@/lib/contexts/ActivityContext'
import { useCreateProperty } from '@/lib/hooks/useProperties'

export default function AddPropertyExample() {
  const { addActivity } = useActivity()
  
  const createProperty = useCreateProperty((propertyName) => {
    addActivity('added', 'property', `Added property: ${propertyName}`)
  })

  const handleSubmit = async (data) => {
    await createProperty.mutateAsync(data)
    // Toast notification and activity log happen automatically!
  }

  return (
    // Your form here
  )
}
```

#### Example: Updating an Occupant

```tsx
'use client'

import { useActivity } from '@/lib/contexts/ActivityContext'
import { useUpdateOccupant } from '@/lib/hooks/useOccupants'

export default function EditOccupantExample() {
  const { addActivity } = useActivity()
  
  const updateOccupant = useUpdateOccupant((occupantName) => {
    addActivity('updated', 'occupant', `Updated occupant: ${occupantName}`)
  })

  const handleUpdate = async (id, data) => {
    await updateOccupant.mutateAsync({ id, data })
    // Notification shows automatically!
  }

  return (
    // Your form here
  )
}
```

#### Example: Deleting a Room

```tsx
'use client'

import { useActivity } from '@/lib/contexts/ActivityContext'
import { useDeleteRoom } from '@/lib/hooks/useRooms'

export default function RoomListExample() {
  const { addActivity } = useActivity()
  
  const deleteRoom = useDeleteRoom((roomNumber, propertyName) => {
    addActivity('deleted', 'room', `Deleted room ${roomNumber} from ${propertyName}`)
  })

  const handleDelete = async (roomId) => {
    if (confirm('Are you sure?')) {
      await deleteRoom.mutateAsync(roomId)
      // Notification shows automatically!
    }
  }

  return (
    // Your UI here
  )
}
```

### 3. Manual Toast Notifications

You can also show toast notifications manually:

```tsx
import { useActivity } from '@/lib/contexts/ActivityContext'

export default function MyComponent() {
  const { showToast } = useActivity()

  const handleAction = () => {
    // Success notification
    showToast('Payment recorded successfully!', 'success')
    
    // Error notification
    showToast('Failed to save changes', 'error')
    
    // Warning notification
    showToast('Please fill all required fields', 'warning')
  }

  return (
    // Your UI here
  )
}
```

## Activity Types

### Action Types
- `added` - When creating new items (green badge)
- `updated` - When modifying existing items (blue badge)
- `deleted` - When removing items (red badge)

### Category Types
- `property` - Property-related actions (purple badge)
- `occupant` - Occupant-related actions (orange badge)
- `room` - Room-related actions (cyan badge)
- `payment` - Payment-related actions (green badge)
- `maintenance` - Maintenance-related actions (yellow badge)

## Features

### Automatic Notifications
- Toast notifications appear in the top-right corner
- Auto-dismiss after 3 seconds
- Can be manually closed
- Shows appropriate icon based on type (✅ success, ❌ error, ⚠️ warning)

### Recent Activities Dashboard
- Shows last 10 activities
- Displays action type, category, description, and timestamp
- Color-coded badges for easy scanning
- Persists in localStorage
- Automatically updates when new actions occur

## Implementation Checklist

To add activity tracking to a new page:

1. ✅ Import the activity hook:
   ```tsx
   import { useActivity } from '@/lib/contexts/ActivityContext'
   ```

2. ✅ Use the hook in your component:
   ```tsx
   const { addActivity, showToast } = useActivity()
   ```

3. ✅ Pass the activity logger to your mutation hooks:
   ```tsx
   const createItem = useCreateProperty((name) => {
     addActivity('added', 'property', `Added: ${name}`)
   })
   ```

4. ✅ Call the mutation as normal - notifications happen automatically!

## Benefits

- **User Feedback**: Immediate visual confirmation of actions
- **Activity History**: Track what you've done recently
- **Error Handling**: Show error messages clearly
- **Better UX**: Users always know what's happening

## Next Steps

The activity tracking is already integrated into:
- ✅ Dashboard layout (ActivityProvider wrapper)
- ✅ Dashboard page (displays recent activities)
- ✅ All mutation hooks (properties, occupants, rooms)

To complete the integration, update your pages to use the activity callbacks when calling mutations!
