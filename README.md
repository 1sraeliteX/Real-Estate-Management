# Property & Lodge Management System

A comprehensive property and lodge management system built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🏢 Property Management
- Add and manage multiple properties (apartments, houses, condos, commercial, lodges)
- View properties as cards with detailed information
- Filter by status (available, occupied, maintenance) and type
- Search properties by name or address
- Upload images from device
- Track yearly rent instead of monthly

### 🏨 Lodge Management
- Register lodges with multiple rooms
- Configure lodge details:
  - Number of rooms
  - Number of kitchens (including option for 0 kitchens)
  - Number of bathrooms
  - Water availability (in building or in compound)
  - Parking space availability
- Display lodges as cards on the Properties page

### 🚪 Room Management
- Add rooms to each lodge
- Track room number and yearly rent
- View room status (available/occupied)
- Display room cards with occupant information
- Show payment status per room

### 👥 Occupants Management
- Add multiple occupants to a single room
- Track comprehensive occupant information:
  - Name and phone number
  - Next of kin details (name and phone)
  - Number of occupants per room
  - Rent start date and expiry date
  - Total rent and amount paid
- WhatsApp and call buttons for each occupant
- Issues checklist per occupant (mark as resolved)
- Notes section for logging conversations

### 💰 Finance Management
- Track total finance across all properties
- View payment status (Completed/Pending)
- Display balance remaining for pending payments
- Finance summary:
  - Total collected
  - Total expected
  - Total pending
- Payment status visible in:
  - Occupants view
  - Rooms view
  - Finance page

### 🔧 Maintenance
- Add maintenance notes per property
- Track maintenance history
- Note-taking functionality for repairs and issues

### 📊 Dashboard
- Two main buttons: Dashboard and Properties
- Summary statistics:
  - Total finance
  - Number of properties
  - Number of occupants
  - Occupancy rate
  - Pending payments
- Quick action buttons

### 📱 Twilio Integration
- Settings page for Twilio API configuration
- Configure Account SID, Auth Token, and Phone Number
- Enable/disable integration
- Instructions for setup

### 📤 Export Features
- Export occupant data to CSV
- Export includes:
  - Room number
  - Occupant details
  - Contact information
  - Payment status
  - Rent dates

## Property Detail Tabs

Each property has four main tabs:

1. **Rooms** - View and manage all rooms in the property
2. **Occupants** - Detailed occupant information with contact options
3. **Finance** - Payment tracking and financial overview
4. **Maintenance** - Maintenance notes and history

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd property-management
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── dashboard/
│   │   ├── page.tsx                    # Main dashboard
│   │   ├── properties/
│   │   │   ├── page.tsx                # Properties list
│   │   │   └── [id]/page.tsx           # Property detail with tabs
│   │   ├── occupants/page.tsx          # Occupants overview
│   │   ├── payments/page.tsx           # Payments management
│   │   ├── maintenance/page.tsx        # Maintenance requests
│   │   └── settings/page.tsx           # Twilio settings
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AddLodgeModal.tsx               # Add lodge form
│   ├── AddPropertyModal.tsx            # Add property form
│   ├── AddRoomModal.tsx                # Add room form
│   ├── AddOccupantModal.tsx            # Add occupant form
│   ├── Sidebar.tsx                     # Navigation sidebar
│   └── StatsCard.tsx                   # Statistics card component
├── lib/
│   └── mockApi.ts                      # Mock data and API functions
└── types/
    └── index.ts                        # TypeScript type definitions
```

## Key Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hooks** - State management

## Payment Status Logic

- **Completed**: Amount paid >= Total rent (Green badge)
- **Pending**: Amount paid < Total rent (Red badge with balance remaining)

The payment status is automatically calculated and displayed across:
- Room cards
- Occupants table
- Finance page

## Contact Features

Each occupant has quick action buttons:
- **WhatsApp**: Opens WhatsApp chat with the occupant
- **Call**: Initiates a phone call to the occupant

## Future Enhancements

- Word and Excel export formats
- Advanced reporting and analytics
- Email notifications
- Payment reminders
- Document management
- Lease agreement templates
- Tenant portal

## License

MIT License
