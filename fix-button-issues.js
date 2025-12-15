/**
 * Quick Fix Script for Button Functionality Issues
 * Addresses the critical issues identified in the button review
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Button Functionality Fix Script');
console.log('==================================\n');

// Issue 1: Fix Room Delete API Integration
function fixRoomDeleteHandler() {
  console.log('1. Fixing Room Delete Handler...');
  
  const filePath = 'app/dashboard/properties/[id]/page.tsx';
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find the current handleDeleteRoom function
    const oldHandler = `const handleDeleteRoom = (roomId: string) => {
    if (confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      setRooms(rooms.filter(room => room.id !== roomId))
    }
  }`;
    
    // Replace with API-integrated version
    const newHandler = `const handleDeleteRoom = async (roomId: string) => {
    if (confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      try {
        // Call API to delete room
        const response = await fetch(\`/api/rooms/\${roomId}\`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete room');
        }
        
        // Update local state after successful API call
        setRooms(rooms.filter(room => room.id !== roomId));
        console.log('Room deleted successfully');
      } catch (error) {
        console.error('Error deleting room:', error);
        alert('Failed to delete room. Please try again.');
      }
    }
  }`;
    
    if (content.includes('setRooms(rooms.filter(room => room.id !== roomId))')) {
      content = content.replace(oldHandler, newHandler);
      fs.writeFileSync(filePath, content);
      console.log('   ✅ Room delete handler updated with API integration');
    } else {
      console.log('   ⚠️  Room delete handler pattern not found - manual fix needed');
    }
    
  } catch (error) {
    console.log('   ❌ Error fixing room delete handler:', error.message);
  }
}

// Issue 2: Create Edit Room Modal Component
function createEditRoomModal() {
  console.log('\n2. Creating Edit Room Modal Component...');
  
  const modalContent = `import React, { useState } from 'react'
import { X } from 'lucide-react'

interface Room {
  id: string
  roomNumber: string
  type: string
  rent: number
  maxOccupants: number
  amenities: string[]
  status: string
}

interface EditRoomModalProps {
  isOpen: boolean
  onClose: () => void
  room: Room | null
  onSave: (roomData: Partial<Room>) => void
}

export default function EditRoomModal({ isOpen, onClose, room, onSave }: EditRoomModalProps) {
  const [formData, setFormData] = useState({
    roomNumber: room?.roomNumber || '',
    type: room?.type || 'single',
    rent: room?.rent || 0,
    maxOccupants: room?.maxOccupants || 1,
    amenities: room?.amenities || [],
    status: room?.status || 'available'
  })

  if (!isOpen || !room) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...formData, id: room.id })
    onClose()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rent' || name === 'maxOccupants' ? Number(value) : value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Edit Room {room.roomNumber}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Number
            </label>
            <input
              type="text"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="single">Single</option>
              <option value="shared">Shared</option>
              <option value="studio">Studio</option>
              <option value="apartment">Apartment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Rent
            </label>
            <input
              type="number"
              name="rent"
              value={formData.rent}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Occupants
            </label>
            <input
              type="number"
              name="maxOccupants"
              value={formData.maxOccupants}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
              max="10"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}`;

  try {
    fs.writeFileSync('components/EditRoomModal.tsx', modalContent);
    console.log('   ✅ EditRoomModal.tsx component created');
  } catch (error) {
    console.log('   ❌ Error creating EditRoomModal component:', error.message);
  }
}

// Issue 3: Update Property Detail Page to Use Edit Room Modal
function updatePropertyDetailPage() {
  console.log('\n3. Updating Property Detail Page...');
  
  const filePath = 'app/dashboard/properties/[id]/page.tsx';
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add import for EditRoomModal
    if (!content.includes('EditRoomModal')) {
      const importSection = content.match(/import.*from.*\n/g);
      if (importSection) {
        const lastImport = importSection[importSection.length - 1];
        const newImport = "import EditRoomModal from '@/components/EditRoomModal'\n";
        content = content.replace(lastImport, lastImport + newImport);
      }
    }
    
    // Add state for edit room modal
    if (!content.includes('editingRoom')) {
      const stateSection = content.match(/const \[.*useState.*\n/g);
      if (stateSection) {
        const lastState = stateSection[stateSection.length - 1];
        const newStates = `  const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<any>(null)
`;
        content = content.replace(lastState, lastState + newStates);
      }
    }
    
    // Replace edit room button handler
    const oldEditHandler = `onClick={() => alert(\`Edit room \${room.roomNumber}\`)}`;
    const newEditHandler = `onClick={() => {
                              setEditingRoom(room)
                              setIsEditRoomModalOpen(true)
                            }}`;
    
    if (content.includes(oldEditHandler)) {
      content = content.replace(oldEditHandler, newEditHandler);
    }
    
    // Add edit room handler function
    if (!content.includes('handleEditRoom')) {
      const handleDeleteRoom = content.match(/const handleDeleteRoom.*?\n  \}/s);
      if (handleDeleteRoom) {
        const editRoomHandler = `
  const handleEditRoom = async (roomData: any) => {
    try {
      const response = await fetch(\`/api/rooms/\${roomData.id}\`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update room');
      }
      
      // Update local state
      setRooms(rooms.map(room => 
        room.id === roomData.id ? { ...room, ...roomData } : room
      ));
      console.log('Room updated successfully');
    } catch (error) {
      console.error('Error updating room:', error);
      alert('Failed to update room. Please try again.');
    }
  }
`;
        content = content.replace(handleDeleteRoom[0], handleDeleteRoom[0] + editRoomHandler);
      }
    }
    
    // Add EditRoomModal component before closing div
    if (!content.includes('<EditRoomModal')) {
      const closingDiv = content.lastIndexOf('</div>');
      const modalComponent = `
      <EditRoomModal
        isOpen={isEditRoomModalOpen}
        onClose={() => {
          setIsEditRoomModalOpen(false)
          setEditingRoom(null)
        }}
        room={editingRoom}
        onSave={handleEditRoom}
      />
`;
      content = content.slice(0, closingDiv) + modalComponent + content.slice(closingDiv);
    }
    
    fs.writeFileSync(filePath, content);
    console.log('   ✅ Property detail page updated with edit room functionality');
    
  } catch (error) {
    console.log('   ❌ Error updating property detail page:', error.message);
  }
}

// Issue 4: Create Confirmation Dialog Component
function createConfirmationDialog() {
  console.log('\n4. Creating Confirmation Dialog Component...');
  
  const confirmDialogContent = `import React from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  type?: 'danger' | 'warning' | 'info'
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'danger'
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'text-red-600',
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
          iconBg: 'bg-red-100'
        }
      case 'warning':
        return {
          icon: 'text-yellow-600',
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
          iconBg: 'bg-yellow-100'
        }
      case 'info':
        return {
          icon: 'text-blue-600',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
          iconBg: 'bg-blue-100'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
        <div className="flex items-start gap-4">
          <div className={\`p-2 rounded-full \${styles.iconBg}\`}>
            <AlertTriangle className={\`w-6 h-6 \${styles.icon}\`} />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={\`flex-1 px-4 py-2 rounded-lg font-medium \${styles.confirmButton}\`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}`;

  try {
    fs.writeFileSync('components/ConfirmDialog.tsx', confirmDialogContent);
    console.log('   ✅ ConfirmDialog.tsx component created');
  } catch (error) {
    console.log('   ❌ Error creating ConfirmDialog component:', error.message);
  }
}

// Main execution
function runFixes() {
  console.log('Starting button functionality fixes...\n');
  
  // Check if we're in the right directory
  if (!fs.existsSync('app') || !fs.existsSync('components')) {
    console.log('❌ Error: This script must be run from the project root directory');
    console.log('   Make sure you can see the "app" and "components" folders');
    return;
  }
  
  try {
    fixRoomDeleteHandler();
    createEditRoomModal();
    updatePropertyDetailPage();
    createConfirmationDialog();
    
    console.log('\n🎉 Button Functionality Fixes Complete!');
    console.log('\n📋 Next Steps:');
    console.log('1. Review the changes made to the files');
    console.log('2. Test the room edit and delete functionality');
    console.log('3. Consider replacing browser confirm() with ConfirmDialog component');
    console.log('4. Run the button functionality tests to verify everything works');
    console.log('\n🧪 Test Commands:');
    console.log('   npm run dev                              # Start development server');
    console.log('   node api-button-functionality-test.js   # Test API endpoints');
    console.log('   # Use manual-button-testing-checklist.md for comprehensive testing');
    
  } catch (error) {
    console.log('\n❌ Error during fix process:', error.message);
  }
}

// Run the fixes
runFixes();

module.exports = {
  fixRoomDeleteHandler,
  createEditRoomModal,
  updatePropertyDetailPage,
  createConfirmationDialog
};