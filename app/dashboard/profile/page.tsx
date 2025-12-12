'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Camera, Save, X } from 'lucide-react'
import { AuthClient } from '@/lib/client/authClient'
import Toast from '@/components/Toast'

interface UserProfile {
  name: string
  email: string
  phone: string
  address: string
  role: string
  avatar?: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Admin User',
    email: 'admin@property.com',
    phone: '+234 800 000 0000',
    address: 'Lagos, Nigeria',
    role: 'Administrator'
  })
  
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  useEffect(() => {
    // Load profile from database
    const loadProfile = async () => {
      try {
        const user = await AuthClient.getCurrentUser()
        if (user) {
          const userProfile = {
            name: user.name || 'Admin User',
            email: user.email || 'admin@property.com',
            phone: user.phone || '+234 800 000 0000',
            address: user.address || 'Lagos, Nigeria',
            role: user.role || 'Administrator',
            avatar: user.avatar || undefined
          }
          setProfile(userProfile)
          setEditedProfile(userProfile)
          if (user.avatar) {
            setAvatarPreview(user.avatar)
          }
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
        setToast({ message: 'Failed to load profile', type: 'error' })
      }
    }
    loadProfile()
  }, [])

  const handleSave = async () => {
    try {
      await AuthClient.updateProfile({
        name: editedProfile.name,
        phone: editedProfile.phone,
        address: editedProfile.address,
        avatar: editedProfile.avatar
      })
      setProfile(editedProfile)
      setIsEditing(false)
      setToast({ message: 'Profile updated successfully!', type: 'success' })
    } catch (error) {
      console.error('Failed to update profile:', error)
      setToast({ message: 'Failed to update profile', type: 'error' })
    }
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setAvatarPreview(profile.avatar || null)
    setIsEditing(false)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setAvatarPreview(result)
        setEditedProfile({ ...editedProfile, avatar: result })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>
        
        <div className="px-6 pb-6">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>
              
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="mt-4 sm:mt-0">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {isEditing ? editedProfile.name : profile.name}
              </h2>
              <p className="text-gray-600">{profile.role}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{profile.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{profile.email}</span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{profile.phone}</span>
                  </div>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.address}
                    onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{profile.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="px-4 py-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Role</p>
                <p className="text-gray-900 font-medium mt-1">{profile.role}</p>
              </div>
              <div className="px-4 py-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-gray-900 font-medium mt-1">January 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
        <div className="space-y-4">
          <button className="w-full sm:w-auto px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
            Change Password
          </button>
          <div className="text-sm text-gray-600">
            Last password change: Never
          </div>
        </div>
      </div>
    </div>
  )
}
