'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Building2, Edit3 } from 'lucide-react'
import { SettingsClient } from '@/lib/client/settingsClient'
import { AuthClient } from '@/lib/client/authClient'
import LoadingSpinner from '@/components/LoadingSpinner'

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
  const [reminderText, setReminderText] = useState('')
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState('₦')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true)
        
        // Load property types from database
        const propertyTypesData = await SettingsClient.getPropertyTypes()
        setPropertyTypes(propertyTypesData.map(pt => pt.name))
        
        // Load user settings from database
        const userSettings = await AuthClient.getUserSettings()
        if (userSettings) {
          setAppName(userSettings.appName || 'Cornerstone Realty App')
          setRentDueReminderDays(userSettings.rentDueReminderDays || 30)
          setReminderText(userSettings.reminderText || '')
          setReminderEnabled(userSettings.reminderEnabled || false)
          setSelectedCurrency(userSettings.currencySymbol || '₦')
        }

      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setIsLoading(false)
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

  const handleSaveReminder = async () => {
    try {
      // Check if user is authenticated first
      const currentUser = await AuthClient.getCurrentUser()
      if (!currentUser) {
        alert('Please log in to save reminder settings')
        return
      }

      await AuthClient.updateUserSettings({
        reminderText,
        reminderEnabled
      })
      alert('Reminder settings saved successfully!')
    } catch (error) {
      console.error('Failed to save reminder:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save reminder settings'
      if (errorMessage.includes('Not authenticated')) {
        alert('Please log in to save reminder settings')
      } else {
        alert('Failed to save reminder settings. Please try again.')
      }
    }
  }

  const handleSaveCurrency = async () => {
    try {
      const currentUser = await AuthClient.getCurrentUser()
      if (!currentUser) {
        alert('Please log in to save currency settings')
        return
      }

      await AuthClient.updateUserSettings({
        currencySymbol: selectedCurrency
      })
      alert('Currency settings saved successfully!')
    } catch (error) {
      console.error('Failed to save currency:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save currency settings'
      if (errorMessage.includes('Not authenticated')) {
        alert('Please log in to save currency settings')
      } else {
        alert('Failed to save currency settings. Please try again.')
      }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner text="Loading settings..." />
      </div>
    )
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

      {/* Currency Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl mb-6">
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900">Currency Settings</h2>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Choose the currency symbol that will be displayed throughout the application for rent amounts and financial data.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Currency Symbol
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { symbol: '₦', name: 'Nigerian Naira', code: 'NGN' },
                { symbol: '$', name: 'US Dollar', code: 'USD' },
                { symbol: '€', name: 'Euro', code: 'EUR' },
                { symbol: '£', name: 'British Pound', code: 'GBP' },
                { symbol: '¥', name: 'Japanese Yen', code: 'JPY' },
                { symbol: '₹', name: 'Indian Rupee', code: 'INR' },
                { symbol: 'R', name: 'South African Rand', code: 'ZAR' },
                { symbol: 'C$', name: 'Canadian Dollar', code: 'CAD' }
              ].map((currency) => (
                <div
                  key={currency.code}
                  onClick={() => setSelectedCurrency(currency.symbol)}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    currency.symbol === selectedCurrency 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{currency.symbol}</div>
                    <div className="text-xs font-medium text-gray-700">{currency.code}</div>
                    <div className="text-xs text-gray-500 mt-1">{currency.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <p className="text-sm font-medium text-gray-700">Selected Currency</p>
              <p className="text-lg font-bold text-emerald-600">
                {selectedCurrency} {
                  [
                    { symbol: '₦', name: 'Nigerian Naira' },
                    { symbol: '$', name: 'US Dollar' },
                    { symbol: '€', name: 'Euro' },
                    { symbol: '£', name: 'British Pound' },
                    { symbol: '¥', name: 'Japanese Yen' },
                    { symbol: '₹', name: 'Indian Rupee' },
                    { symbol: 'R', name: 'South African Rand' },
                    { symbol: 'C$', name: 'Canadian Dollar' }
                  ].find(c => c.symbol === selectedCurrency)?.name || 'Unknown'
                }
              </p>
            </div>
            <button 
              onClick={handleSaveCurrency}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Save Currency
            </button>
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Changing the currency symbol will update the display throughout the application but will not convert existing monetary values. This is purely a display preference.
            </p>
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

      {/* Reminders Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl mb-6">
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900">Reminders</h2>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Add scrolling reminder text that will appear at the top of the app. This is useful for important announcements or notices.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reminder Text
            </label>
            <textarea
              value={reminderText}
              onChange={(e) => setReminderText(e.target.value)}
              placeholder="Enter your reminder text here... (e.g., 'Rent payment deadline is approaching - Pay before the 30th to avoid late fees')"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={reminderEnabled}
                onChange={(e) => setReminderEnabled(e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Enable scrolling reminder</span>
            </label>
            
            <button
              onClick={handleSaveReminder}
              className="ml-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save Reminder
            </button>
          </div>

          {reminderEnabled && reminderText && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-800 mb-1">Preview:</p>
              <div className="bg-green-100 p-2 rounded border overflow-hidden">
                <div className="animate-pulse text-sm text-green-800">
                  📢 {reminderText}
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">
                This will appear as a scrolling banner at the top of all dashboard pages
              </p>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>How it works:</strong> When enabled, your reminder text will scroll across the top of all dashboard pages. 
              Users can dismiss it by clicking the X button. Perfect for important announcements, deadlines, or notices.
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

        {/* Important Usage Information Section */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg shadow-sm">
          <h3 className="text-sm font-bold text-blue-900 mb-3">Important Usage Information</h3>
          <div className="space-y-2">
            <p className="text-sm text-blue-800 leading-relaxed">
              Property types are used throughout the application when adding or filtering properties.
            </p>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold text-sm">✓</span>
              <p className="text-sm text-blue-800 leading-relaxed">
                Safe to Remove — Removing a type won't affect existing properties with that type.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-600 font-bold text-sm">💡</span>
              <p className="text-sm text-blue-800 leading-relaxed">
                Changes take effect immediately across all property forms and filters.
              </p>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}
