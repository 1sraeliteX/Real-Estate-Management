# API Integration Guide

This guide explains how to connect your app to a real API backend and enable real-time data synchronization.

## Architecture Overview

The app uses **React Query (TanStack Query)** for:
- Automatic caching
- Background refetching
- Optimistic updates
- Request deduplication
- Automatic retry logic

## Setup Steps

### 1. Install Dependencies

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools axios
```

### 2. Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Backend API Requirements

Your backend should provide these endpoints:

#### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

#### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/properties/:propertyId/rooms` - Get rooms by property
- `POST /api/rooms` - Create room
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

#### Occupants
- `GET /api/occupants` - Get all occupants
- `GET /api/rooms/:roomId/occupants` - Get occupants by room
- `POST /api/occupants` - Create occupant
- `PUT /api/occupants/:id` - Update occupant
- `DELETE /api/occupants/:id` - Delete occupant

#### Payments
- `GET /api/payments` - Get all payments
- `GET /api/occupants/:occupantId/payments` - Get payments by occupant
- `POST /api/payments` - Create payment

#### Stats
- `GET /api/stats/dashboard` - Get dashboard statistics
- `GET /api/stats/finances` - Get financial statistics

## Usage Examples

### Example 1: Fetching Properties

```tsx
'use client'

import { useProperties } from '@/lib/hooks/useProperties'

export default function PropertiesPage() {
  const { data: properties, isLoading, error } = useProperties()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading properties</div>

  return (
    <div>
      {properties?.map(property => (
        <div key={property.id}>{property.name}</div>
      ))}
    </div>
  )
}
```

### Example 2: Creating an Occupant

```tsx
'use client'

import { useCreateOccupant } from '@/lib/hooks/useOccupants'

export default function AddOccupantForm() {
  const createOccupant = useCreateOccupant()

  const handleSubmit = async (data) => {
    try {
      await createOccupant.mutateAsync(data)
      // Success! All related data will auto-refresh
      alert('Occupant added successfully')
    } catch (error) {
      alert('Error adding occupant')
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

### Example 3: Real-time Dashboard Stats

```tsx
'use client'

import { useDashboardStats } from '@/lib/hooks/useStats'

export default function Dashboard() {
  // Automatically refetches every 30 seconds
  const { data: stats } = useDashboardStats()

  return (
    <div>
      <h1>Total Finance: ₦{stats?.totalFinance.toLocaleString()}</h1>
      <h2>Total Properties: {stats?.totalProperties}</h2>
    </div>
  )
}
```

## How Data Synchronization Works

### Automatic Cache Invalidation

When you create, update, or delete data, React Query automatically:

1. **Invalidates related queries** - Marks cached data as stale
2. **Refetches in background** - Gets fresh data from API
3. **Updates all components** - Components using that data re-render

Example flow when adding an occupant:
```
User adds occupant
  ↓
API call succeeds
  ↓
Invalidate: ['occupants'], ['rooms'], ['stats']
  ↓
All components using these queries automatically refresh
  ↓
Dashboard shows updated occupant count
Room shows new occupant
Occupants list includes new entry
```

### Query Keys Strategy

Query keys determine what gets invalidated:

```typescript
['properties'] // All properties
['properties', '123'] // Specific property
['occupants', 'room', '456'] // Occupants in specific room
['stats', 'dashboard'] // Dashboard stats
```

## Migration from Mock Data

### Step 1: Keep Mock Data as Fallback

```typescript
// lib/api.ts
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

export const propertiesApi = {
  getAll: () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: mockProperties })
    }
    return api.get<Property[]>('/properties')
  },
}
```

### Step 2: Gradual Migration

1. Start with read-only endpoints (GET)
2. Test with real backend
3. Add write endpoints (POST, PUT, DELETE)
4. Remove mock data fallbacks

## Backend Options

### Option A: Node.js + Express + MongoDB

```javascript
// Example Express endpoint
app.get('/api/properties', async (req, res) => {
  const properties = await Property.find()
  res.json(properties)
})
```

### Option B: Next.js API Routes

Create files in `app/api/`:

```typescript
// app/api/properties/route.ts
export async function GET() {
  const properties = await db.properties.findMany()
  return Response.json(properties)
}
```

### Option C: Firebase/Supabase

Use their SDKs directly in your hooks.

### Option D: External API (Laravel, Django, etc.)

Just point `NEXT_PUBLIC_API_URL` to your backend.

## Authentication

Add token to requests:

```typescript
// lib/api.ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

## Error Handling

```typescript
const { data, error, isError } = useProperties()

if (isError) {
  console.error('Error:', error.message)
  // Show error toast/notification
}
```

## Optimistic Updates

For instant UI feedback:

```typescript
const updateProperty = useMutation({
  mutationFn: propertiesApi.update,
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['properties'] })
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(['properties'])
    
    // Optimistically update
    queryClient.setQueryData(['properties'], (old) => 
      old.map(p => p.id === newData.id ? { ...p, ...newData } : p)
    )
    
    return { previous }
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['properties'], context.previous)
  },
})
```

## Testing

Test with mock API:

```bash
# Install json-server for quick mock API
npm install -g json-server

# Create db.json with mock data
json-server --watch db.json --port 3001
```

## Performance Tips

1. **Stale time**: Adjust based on data freshness needs
2. **Cache time**: Keep data in cache even when unused
3. **Refetch on focus**: Disable for less critical data
4. **Pagination**: Use `useInfiniteQuery` for large lists

## Next Steps

1. Set up your backend API
2. Update `.env.local` with API URL
3. Replace mock data imports with hooks
4. Test each feature
5. Deploy!

## Troubleshooting

### CORS Issues
Add CORS headers to your backend:
```javascript
app.use(cors({
  origin: 'http://localhost:3000'
}))
```

### Network Errors
Check browser console and Network tab for failed requests.

### Data Not Updating
Verify query keys match between mutations and queries.
