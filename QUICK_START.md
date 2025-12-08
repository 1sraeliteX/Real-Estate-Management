# Quick Start Guide

## Running the Application

1. **Install dependencies:**
```bash
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## First Steps

### 1. View the Dashboard
- The app opens to the main dashboard
- See summary statistics for your properties
- Click "Properties" to manage your lodges and properties

### 2. Add a Lodge
1. Go to Properties page
2. Click "Add Property" dropdown
3. Select "Add Lodge"
4. Fill in the form:
   - Lodge name
   - Number of rooms, kitchens, bathrooms
   - Water availability
   - Parking spaces
   - Upload images from your device
5. Click "Add Lodge"

### 3. Add Rooms to a Lodge
1. Click on a lodge card to view details
2. Go to the "Rooms" tab
3. Click "Add Room"
4. Enter room number and yearly rent
5. Click "Add Room"

### 4. Add Occupants to a Room
1. In the Rooms tab, find an available room
2. Click "Add Occupant"
3. Fill in occupant details:
   - Name and phone
   - Next of kin information
   - Number of occupants
   - Rent dates
   - Payment amounts
4. Click "Add Occupant"

### 5. Manage Occupants
1. Go to the "Occupants" tab
2. View all occupants in a table
3. Use WhatsApp or Call buttons to contact them
4. Add issues to track problems
5. Add notes to log conversations

### 6. Track Finances
1. Go to the "Finance" tab
2. View payment status for all occupants
3. See total collected, expected, and pending amounts
4. Payment status automatically updates based on amounts

### 7. Add Maintenance Notes
1. Go to the "Maintenance" tab
2. Add notes about repairs or maintenance work
3. Click "Save Note"

### 8. Export Data
1. On any property detail page
2. Click the "Export" button
3. CSV file downloads with all occupant data

### 9. Configure Twilio (Optional)
1. Go to Settings from the sidebar
2. Enter your Twilio credentials:
   - Account SID
   - Auth Token
   - Phone Number
3. Enable the integration
4. Click "Save Settings"

## Key Features to Try

✅ **Upload images from device** - Use the file picker in Add Lodge modal
✅ **Track yearly rent** - All rent fields are now yearly instead of monthly
✅ **Multiple rooms per lodge** - Add as many rooms as needed
✅ **Multiple occupants per room** - Track everyone living in each room
✅ **Payment status tracking** - Automatic Pending/Completed badges
✅ **WhatsApp integration** - Quick contact via WhatsApp
✅ **Issues checklist** - Track and resolve occupant issues
✅ **Notes system** - Log conversations and important details
✅ **Export to CSV** - Download all data for external use

## Tips

- **Payment Status**: Automatically shows "Completed" when amount paid >= total rent, otherwise shows "Pending" with balance
- **WhatsApp Button**: Opens WhatsApp web/app with the occupant's number
- **Call Button**: Initiates a phone call on devices that support it
- **Export**: Exports all occupants from the current property
- **Search**: Use the search bar to quickly find properties or occupants
- **Filters**: Filter properties by status and type

## Need Help?

Check the README.md for detailed documentation of all features and the project structure.
