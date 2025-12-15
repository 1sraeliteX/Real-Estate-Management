# Manual Button Testing Checklist

This checklist covers all interactive buttons in the application that require manual verification to ensure they function correctly and update the database appropriately.

## 🏠 Property Management Buttons

### On-Campus Properties (`/dashboard/properties/on-campus`)
- [ ] **Add Property Button**
  - [ ] Navigates to `/dashboard/properties/add-on-campus`
  - [ ] Page loads without errors
  
- [ ] **Edit Property Buttons**
  - [ ] Each property card has an "Edit" button
  - [ ] Clicking navigates to `/dashboard/properties/edit-on-campus/[id]`
  - [ ] Edit page loads with correct property data
  - [ ] Form fields are pre-populated
  
- [ ] **Delete Property Buttons**
  - [ ] Each property card has a "Delete" button
  - [ ] Clicking shows confirmation dialog
  - [ ] Confirming deletion removes property from database
  - [ ] Property disappears from list after deletion
  - [ ] Canceling deletion keeps property intact

### Off-Campus Properties (`/dashboard/properties/off-campus`)
- [ ] **Add Property Button**
  - [ ] Navigates to `/dashboard/properties/add-off-campus`
  - [ ] Page loads without errors
  
- [ ] **Edit Property Buttons**
  - [ ] Each property card has an "Edit" button
  - [ ] Clicking navigates to `/dashboard/properties/edit-off-campus/[id]`
  - [ ] Edit page loads with correct property data
  - [ ] Form fields are pre-populated
  
- [ ] **Delete Property Buttons**
  - [ ] Each property card has a "Delete" button
  - [ ] Clicking shows confirmation dialog
  - [ ] Confirming deletion removes property from database
  - [ ] Property disappears from list after deletion

## 📝 Form Buttons

### Add Property Forms
- [ ] **Submit Buttons**
  - [ ] Disabled when form is invalid
  - [ ] Enabled when all required fields are filled
  - [ ] Submitting creates new property in database
  - [ ] Success message appears after submission
  - [ ] Redirects to appropriate properties list
  
- [ ] **Cancel/Back Buttons**
  - [ ] Returns to previous page
  - [ ] No data is saved when canceled
  
- [ ] **Add Amenity Buttons**
  - [ ] Adds new amenity input field
  - [ ] Multiple amenities can be added
  - [ ] Amenities are saved with property

### Edit Property Forms
- [ ] **Update/Save Buttons**
  - [ ] Updates existing property in database
  - [ ] Changes are reflected immediately
  - [ ] Success message appears
  - [ ] Redirects to properties list
  
- [ ] **Cancel Buttons**
  - [ ] Returns to properties list
  - [ ] No changes are saved

## 👥 Occupant Management Buttons

### On-Campus Occupants (`/dashboard/occupants/on-campus`)
- [ ] **Add Occupant Button**
  - [ ] Opens "Add Occupant" modal
  - [ ] Modal displays correctly
  
- [ ] **Delete Occupant Buttons**
  - [ ] Each occupant has a delete/remove button
  - [ ] Clicking shows confirmation dialog
  - [ ] Confirming removes occupant from database
  - [ ] Occupant disappears from list
  - [ ] Room assignment is updated if applicable

### Off-Campus Occupants (`/dashboard/occupants/off-campus`)
- [ ] **Add Occupant Button**
  - [ ] Opens "Add Occupant" modal
  - [ ] Modal displays correctly
  
- [ ] **Delete Occupant Buttons**
  - [ ] Each occupant has a delete/remove button
  - [ ] Clicking shows confirmation dialog
  - [ ] Confirming removes occupant from database
  - [ ] Occupant disappears from list

### Add Occupant Modal
- [ ] **Submit Button**
  - [ ] Creates new occupant in database
  - [ ] Assigns to selected room if applicable
  - [ ] Modal closes after successful submission
  - [ ] New occupant appears in list
  
- [ ] **Cancel Button**
  - [ ] Closes modal without saving
  - [ ] Form data is cleared

## 🏠 Property Detail Page (`/dashboard/properties/[id]`)

### Room Management
- [ ] **Add Room Button**
  - [ ] Opens "Add Room" modal
  - [ ] Modal displays correctly
  
- [ ] **Edit Room Buttons**
  - [ ] Currently shows alert (placeholder)
  - [ ] Should eventually open edit modal
  
- [ ] **Delete Room Buttons**
  - [ ] Shows confirmation dialog
  - [ ] Removes room from property
  - [ ] Updates room count
  - [ ] Handles occupant reassignment

### Occupant Management in Rooms
- [ ] **Edit Occupant Buttons**
  - [ ] Currently shows alert (placeholder)
  - [ ] Should eventually open edit modal
  
- [ ] **Delete Occupant Buttons**
  - [ ] Removes occupant from room
  - [ ] Updates room occupancy
  - [ ] Occupant remains in system but unassigned

## 🔧 Navigation & UI Buttons

### Sidebar
- [ ] **Sidebar Toggle Button**
  - [ ] Collapses/expands sidebar
  - [ ] State persists across page navigation
  - [ ] Works on desktop only (hidden on mobile)
  
- [ ] **Dark Mode Toggle**
  - [ ] Switches between light and dark themes
  - [ ] Preference is saved to localStorage
  - [ ] Theme persists across sessions

### Help System
- [ ] **Help Button (floating)**
  - [ ] Opens help modal
  - [ ] Modal displays help content
  - [ ] Animated and visually appealing
  
- [ ] **Close Help Button**
  - [ ] Closes help modal
  - [ ] Returns focus to main content

## ⚙️ Settings Page (`/dashboard/settings`)

### Currency Settings
- [ ] **Save Currency Button**
  - [ ] Updates currency preference
  - [ ] Changes are reflected throughout app
  - [ ] Success feedback provided

### Reminder Settings
- [ ] **Save Reminder Days Button**
  - [ ] Updates reminder day preference
  - [ ] Setting is saved to database
  
- [ ] **Save Reminder Button**
  - [ ] Updates reminder preferences
  - [ ] Settings are applied immediately

### Property Types
- [ ] **Add Property Type Button**
  - [ ] Adds new property type
  - [ ] New type appears in dropdown lists
  - [ ] Type is saved to database

## 👤 Profile Page (`/dashboard/profile`)

### Profile Editing
- [ ] **Edit Profile Button**
  - [ ] Switches to edit mode
  - [ ] Form fields become editable
  - [ ] Save and Cancel buttons appear
  
- [ ] **Save Profile Button**
  - [ ] Updates user profile in database
  - [ ] Success message appears
  - [ ] Returns to view mode
  
- [ ] **Cancel Edit Button**
  - [ ] Discards changes
  - [ ] Returns to view mode
  - [ ] Original data is restored

## 💰 Financial Management Buttons

### Payments Page
- [ ] **Record Payment Button**
  - [ ] Opens payment recording modal
  - [ ] Modal displays correctly
  
- [ ] **Submit Payment Button**
  - [ ] Records payment in database
  - [ ] Updates financial records
  - [ ] Modal closes after success

### Maintenance Page
- [ ] **Add Maintenance Request Button**
  - [ ] Opens maintenance request modal
  - [ ] Modal displays correctly
  
- [ ] **Submit Request Button**
  - [ ] Creates maintenance request
  - [ ] Request appears in list
  - [ ] Notifications are triggered

## 🔔 Notifications

### Notification Management
- [ ] **Delete Notification Buttons**
  - [ ] Removes notification from database
  - [ ] Notification disappears from list
  - [ ] Unread count updates if applicable
  
- [ ] **Mark as Read Buttons**
  - [ ] Updates notification status
  - [ ] Visual state changes
  - [ ] Unread count decreases

## 🧪 Database Verification Tests

For each button that modifies data, verify:

1. **Database Updates**
   - [ ] Changes are persisted to database
   - [ ] Data integrity is maintained
   - [ ] Related records are updated correctly

2. **Error Handling**
   - [ ] Network errors are handled gracefully
   - [ ] User receives appropriate feedback
   - [ ] UI remains functional after errors

3. **Validation**
   - [ ] Client-side validation works
   - [ ] Server-side validation prevents invalid data
   - [ ] Error messages are clear and helpful

4. **Performance**
   - [ ] Button responses are immediate
   - [ ] No unnecessary API calls
   - [ ] Loading states are shown when appropriate

## 📱 Responsive Testing

Test all buttons on different screen sizes:

- [ ] **Desktop (1920x1080)**
  - [ ] All buttons are visible and clickable
  - [ ] Hover states work correctly
  
- [ ] **Tablet (768x1024)**
  - [ ] Buttons are appropriately sized
  - [ ] Touch targets are adequate
  
- [ ] **Mobile (375x667)**
  - [ ] Buttons are accessible
  - [ ] No overlap or clipping issues

## 🌐 Browser Compatibility

Test in multiple browsers:

- [ ] **Chrome**
- [ ] **Firefox**
- [ ] **Safari**
- [ ] **Edge**

## 🚨 Critical Issues to Watch For

1. **JavaScript Errors**
   - Check browser console for errors
   - Ensure no broken event handlers

2. **Network Issues**
   - Verify API endpoints are responding
   - Check for CORS issues

3. **State Management**
   - Ensure React state updates correctly
   - Verify component re-renders

4. **Authentication**
   - Confirm user sessions are maintained
   - Check for unauthorized access

5. **Data Consistency**
   - Verify database transactions
   - Check for race conditions

## 📋 Testing Notes

**Date:** ___________  
**Tester:** ___________  
**Environment:** ___________  

**Issues Found:**
- 
- 
- 

**Recommendations:**
- 
- 
- 

**Overall Status:** ⭕ Pass / ❌ Fail / ⚠️ Needs Attention