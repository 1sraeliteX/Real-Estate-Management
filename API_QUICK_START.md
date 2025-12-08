# API Integration - Quick Start Guide

## ✅ Setup Complete!

Your app is now configured with React Query for API integration. Here's what's been set up:

### Installed Packages
- ✅ `@tanstack/react-query` - Data fetching and caching
- ✅ `@tanstack/react-query-devtools` - Development tools
- ✅ `axios` - HTTP client

### Created Files
- ✅ `lib/api.ts` - API service layer
- ✅ `lib/providers/QueryProvider.tsx` - React Query provider
- ✅ `lib/hooks/useProperties.ts` - Property hooks
- ✅ `lib/hooks/useRooms.ts` - Room hooks
- ✅ `lib/hooks/useOccupants.ts` - Occupant hooks
- ✅ `lib/hooks/usePayments.ts` - Payment hooks
- ✅ `lib/hooks/useMaintenance.ts` - Maintenance hooks
- ✅ `lib/hooks/useStats.ts` - Statistics hooks
- ✅ `lib/mockApiAdapter.ts` - Mock API for development
- ✅ `.env.local` - Environment configuration

### Configuration
- ✅ QueryProvider added to root layout
- ✅ Mock mode enabled for development (`NEXT_PUBLIC_USE_MOCK=true`)

## 🚀 How to Use

### Current Mode: MOCK DATA

Your app is currently using **mock data** so you can develop without a backend. The mock adapter simulates API calls with realistic delays.

### Example: Using Hooks in a Component

```tsx
'use client'

import { useProperties, useCreateProperty } from '@/lib/hooks'

export default function PropertiesPage() {
  const { data: properties, isLoading, error } = useProperties()
  const createProperty = useCreateProperty()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const handleAdd = async (propertyData) => {
    try {
      await createProperty.mutateAsync(propertyData)
      alert('Property added! All related data auto-refreshed.')
    } catch (err) {
      alert('Error adding property')
    }
  }

  return (
    <div>
      {properties?.map(property => (
        <div key={property.id}>{property.name}</div>
      ))}
    </div>
  )
}
```

## 🔄 Automatic Data Synchronization

When you perform any action (create, update, delete), React Query automatically:

1. **Updates the cache** - Instant UI feedback
2. **Invalidates related queries** - Marks data as stale
3. **Refetches in background** - Gets fresh data
4. **Updates all components** - Everything stays in sync

### Example Flow:
```
Add Occupant
  ↓
✅ Occupants list updates
✅ Room status changes to "occupied"
✅ Dashboard stats refresh
✅ Finance totals update
✅ Property occupancy updates
```

**No manual refresh needed!** 🎉

## 📝 Next Steps

### Option 1: Continue with Mock Data (Recommended for now)

Keep developing with mock data. Everything works the same as with a real API:
- ✅ Data persists during the session
- ✅ Realistic network delays
- ✅ Automatic synchronization
- ✅ No backend required

### Option 2: Connect to Real Backend

When ready to connect to a real API:

1. **Set up your backend** with the required endpoints (see API_INTEGRATION_GUIDE.md)

2. **Update `.env.local`:**
   ```env
   NEXT_PUBLIC_API_URL=http://your-backend-url/api
   NEXT_PUBLIC_USE_MOCK=false
   ```

3. **Restart the dev server:**
   ```bash
   npm run dev
   ```

That's it! Your app will now use the real API.

## 🛠️ Development Tools

React Query DevTools are included. Look for the React Query icon in the bottom-left corner of your app to:
- View all queries and their states
- See cached data
- Manually refetch queries
- Debug issues

## 📚 Available Hooks

### Properties
- `useProperties()` - Get all properties
- `useProperty(id)` - Get single property
- `useCreateProperty()` - Create property
- `useUpdateProperty()` - Update property
- `useDeleteProperty()` - Delete property

### Rooms
- `useRooms()` - Get all rooms
- `usePropertyRooms(propertyId)` - Get rooms by property
- `useRoom(id)` - Get single room
- `useCreateRoom()` - Create room
- `useUpdateRoom()` - Update room
- `useDeleteRoom()` - Delete room

### Occupants
- `useOccupants()` - Get all occupants
- `useRoomOccupants(roomId)` - Get occupants by room
- `useCreateOccupant()` - Create occupant
- `useUpdateOccupant()` - Update occupant
- `useDeleteOccupant()` - Delete occupant

### Payments
- `usePayments()` - Get all payments
- `useOccupantPayments(occupantId)` - Get payments by occupant
- `useCreatePayment()` - Create payment
- `useUpdatePayment()` - Update payment

### Maintenance
- `useMaintenance()` - Get all maintenance requests
- `usePropertyMaintenance(propertyId)` - Get maintenance by property
- `useCreateMaintenance()` - Create maintenance request
- `useUpdateMaintenance()` - Update maintenance request

### Statistics
- `useDashboardStats()` - Get dashboard statistics (auto-refreshes every 30s)
- `useFinanceStats()` - Get financial statistics (auto-refreshes every 30s)

## 🎯 Common Patterns

### Loading States
```tsx
const { data, isLoading, error } = useProperties()

if (isLoading) return <LoadingSpinner />
if (error) return <ErrorMessage error={error} />
```

### Mutations with Feedback
```tsx
const createProperty = useCreateProperty()

const handleSubmit = async (data) => {
  try {
    await createProperty.mutateAsync(data)
    toast.success('Property created!')
  } catch (error) {
    toast.error('Failed to create property')
  }
}

// Show loading state
{createProperty.isPending && <Spinner />}
```

### Conditional Fetching
```tsx
// Only fetch if ID exists
const { data } = useProperty(propertyId, {
  enabled: !!propertyId
})
```

## 🐛 Troubleshooting

### Data not updating?
- Check browser console for errors
- Verify query keys match between hooks
- Open React Query DevTools to inspect cache

### Mock mode not working?
- Verify `.env.local` has `NEXT_PUBLIC_USE_MOCK=true`
- Restart dev server after changing env variables

### TypeScript errors?
- Run `npm run build` to check for type errors
- Ensure all types are imported from `@/types`

## 📖 More Information

- See `API_INTEGRATION_GUIDE.md` for detailed documentation
- See `EXAMPLE_API_USAGE.md` for more code examples
- Visit [TanStack Query Docs](https://tanstack.com/query/latest) for advanced features

## 🎉 You're Ready!

Your app now has:
- ✅ Automatic data synchronization
- ✅ Smart caching
- ✅ Loading and error states
- ✅ Optimistic updates
- ✅ Background refetching
- ✅ Mock mode for development

Start converting your pages to use the hooks and enjoy automatic data synchronization! 🚀
