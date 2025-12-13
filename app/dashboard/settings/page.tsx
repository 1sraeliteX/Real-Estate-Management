'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Building2, Edit3 } from 'lucide-react'
import { SettingsClient } from '@/lib/client/settingsClient'
import { AuthClient } from '@/lib/client/authClient'

export default function SettingsPage() {

  const [propertyTypes, setPropertyTypes] = useState<string[]>([
    'apartment',
    'house',
    'condo',
    'commercial',
    'lodge',
    'studio'
  ])
  const [newPropertyType, setNewPropertyType] = useState('')
  const [propertyTypesSaved, setPropertyTypesSaved] = useState(false)
  const [appName, setAppName] = useState('Cornerstone Realty App')
  const [rentDueReminderDays, setRentDueReminderDays] = useState(30)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load property types from database
        const propertyTypesData = await SettingsClient.getPropertyTypes()
        setPropertyTypes(propertyTypesData.map(pt => pt.name))
        
        // Load user settings from database
        const userSettings = await AuthClient.getUserSettings()
        if (userSettings) {
          setAppName(userSettings.appName || 'Cornerstone Realty App')
          setRentDueReminderDays(userSettings.rentDueReminderDays || 30)
        }

      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    }
    
    loadSettings()
  }, [])


  const handleSaveReminderDays = async () => {
    try {
      await AuthClient.updateUserSettings({
        rentDueReminderDays
      })
      alert('Rent due reminder settings saved!')
    } catch (error) {
      console.error('Failed to save reminder days:', error)
      alert('Failed to save reminder settings')
    }
  }

  const handleAddPropertyType = async () => {
    if (newPropertyType.trim() && !propertyTypes.includes(newPropertyType.toLowerCase().trim())) {
      try {
        await SettingsClient.addPropertyType(newPropertyType.toLowerCase().trim())
        const updatedTypes = [...propertyTypes, newPropertyType.toLowerCase().trim()]
        setPropertyTypes(updatedTypes)
        setNewPropertyType('')
        setPropertyTypesSaved(true)
        setTimeout(() => setPropertyTypesSaved(false), 3000)
      } catch (error) {
        console.error('Failed to add property type:', error)
        alert('Failed to add property type')
      }
    }
  }

  const handleRemovePropertyType = async (type: string) => {
    if (confirm(`Are you sure you want to remove "${type}" property type?`)) {
      try {
        await SettingsClient.removePropertyType(type)
        const updatedTypes = propertyTypes.filter(t => t !== type)
        setPropertyTypes(updatedTypes)
        setPropertyTypesSaved(true)
        setTimeout(() => setPropertyTypesSaved(false), 3000)
      } catch (error) {
        console.error('Failed to remove property type:', error)
        alert('Failed to remove property type')
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

      {/* App Name Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Edit3 className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-900">App Name</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current App Name
            </label>
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
              <span className="text-lg font-semibold text-indigo-900">{appName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rent Due Reminder Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl mb-6">
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900">Rent Due Reminder</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Show reminder when rent is due in (days)
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="1"
                max="365"
                value={rentDueReminderDays}
                onChange={(e) => setRentDueReminderDays(parseInt(e.target.value) || 30)}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <span className="text-sm text-gray-600">days before expiry</span>
              <button
                onClick={handleSaveReminderDays}
                className="ml-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Save
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Rooms with rent expiring within this timeframe will show a red notification
            </p>
          </div>
        </div>
      </div>

      {/* Property Types Management */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Property Types</h2>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Manage property types available when adding new properties. These types will appear in property forms.
        </p>

        {/* Add New Property Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add New Property Type
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newPropertyType}
              onChange={(e) => setNewPropertyType(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddPropertyType()}
              placeholder="e.g., villa, townhouse, duplex"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={handleAddPropertyType}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        {/* Property Types List */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Current Property Types ({propertyTypes.length})
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {propertyTypes.map((type) => (
              <div
                key={type}
                className="flex items-center justify-between px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg"
              >
                <span className="text-sm font-medium text-purple-900 capitalize">{type}</span>
                <button
                  onClick={() => handleRemovePropertyType(type)}
                  className="text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded p-1"
                  title="Remove property type"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          {propertyTypesSaved && (
            <p className="mt-3 text-sm text-green-600">Property types updated successfully!</p>
          )}
        </div>

        {/* Important Information with Color Hierarchy */}
        <div className="mt-6 space-y-3">
          {/* High Importance - Usage Information */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">ℹ</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-900 mb-1">Important Usage Information</h3>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Property types are used throughout the application when adding or filtering properties.
                </p>
              </div>
            </div>
          </div>

          {/* Medium Importance - Safety Information */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-green-900 mb-1">Safe to Remove</h3>
                <p className="text-sm text-green-800 leading-relaxed">
                  Removing a type won't affect existing properties with that type.
                </p>
              </div>
            </div>
          </div>

          {/* Low Importance - Additional Context */}
          <div className="p-3 bg-gradient-to-r from-gray-50 to-slate-50 border-l-4 border-gray-400 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">💡</span>
              </div>
              <div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Changes take effect immediately across all property forms and filters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}
