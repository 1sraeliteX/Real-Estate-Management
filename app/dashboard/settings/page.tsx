'use client'

import { useState, useEffect } from 'react'
import { Save, Phone, Plus, X, Building2, Eye, EyeOff, Edit3 } from 'lucide-react'

export default function SettingsPage() {
  const [twilioSettings, setTwilioSettings] = useState({
    accountSid: '',
    authToken: '',
    phoneNumber: '',
    enabled: false,
  })

  const [saved, setSaved] = useState(false)
  const [showAuthToken, setShowAuthToken] = useState(false)
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
  const [appName, setAppName] = useState('Property Management')
  const [isEditingAppName, setIsEditingAppName] = useState(false)
  const [tempAppName, setTempAppName] = useState('')
  const [rentDueReminderDays, setRentDueReminderDays] = useState(30)

  useEffect(() => {
    // Load property types from localStorage
    const savedTypes = localStorage.getItem('propertyTypes')
    if (savedTypes) {
      setPropertyTypes(JSON.parse(savedTypes))
    }
    
    // Load app name from localStorage
    const savedAppName = localStorage.getItem('appName')
    if (savedAppName) {
      setAppName(savedAppName)
    }
    
    // Load rent due reminder days
    const savedReminderDays = localStorage.getItem('rentDueReminderDays')
    if (savedReminderDays) {
      setRentDueReminderDays(parseInt(savedReminderDays))
    }
    
    // Load Twilio settings
    const savedTwilioSettings = localStorage.getItem('twilioSettings')
    if (savedTwilioSettings) {
      setTwilioSettings(JSON.parse(savedTwilioSettings))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setTwilioSettings({
      ...twilioSettings,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    // Save to localStorage or backend
    localStorage.setItem('twilioSettings', JSON.stringify(twilioSettings))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleSaveAppName = () => {
    if (tempAppName.trim()) {
      setAppName(tempAppName)
      localStorage.setItem('appName', tempAppName)
      setIsEditingAppName(false)
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('appNameChanged'))
    }
  }

  const handleSaveReminderDays = () => {
    localStorage.setItem('rentDueReminderDays', rentDueReminderDays.toString())
    alert('Rent due reminder settings saved!')
  }

  const handleAddPropertyType = () => {
    if (newPropertyType.trim() && !propertyTypes.includes(newPropertyType.toLowerCase().trim())) {
      const updatedTypes = [...propertyTypes, newPropertyType.toLowerCase().trim()]
      setPropertyTypes(updatedTypes)
      localStorage.setItem('propertyTypes', JSON.stringify(updatedTypes))
      setNewPropertyType('')
      setPropertyTypesSaved(true)
      setTimeout(() => setPropertyTypesSaved(false), 3000)
    }
  }

  const handleRemovePropertyType = (type: string) => {
    if (confirm(`Are you sure you want to remove "${type}" property type?`)) {
      const updatedTypes = propertyTypes.filter(t => t !== type)
      setPropertyTypes(updatedTypes)
      localStorage.setItem('propertyTypes', JSON.stringify(updatedTypes))
      setPropertyTypesSaved(true)
      setTimeout(() => setPropertyTypesSaved(false), 3000)
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
            {isEditingAppName ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tempAppName}
                  onChange={(e) => setTempAppName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter app name"
                />
                <button
                  onClick={handleSaveAppName}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingAppName(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                <span className="text-lg font-semibold text-indigo-900">{appName}</span>
                <button
                  onClick={() => {
                    setTempAppName(appName)
                    setIsEditingAppName(true)
                  }}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-100 rounded"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              </div>
            )}
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

        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 className="text-sm font-semibold text-purple-900 mb-2">Note:</h3>
          <p className="text-sm text-purple-800">
            Property types are used throughout the application when adding or filtering properties. 
            Removing a type won't affect existing properties with that type.
          </p>
        </div>
      </div>

      {/* Twilio Integration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Phone className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Twilio Integration</h2>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account SID
            </label>
            <input
              type="text"
              name="accountSid"
              value={twilioSettings.accountSid}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Auth Token
            </label>
            <div className="relative">
              <input
                type={showAuthToken ? 'text' : 'password'}
                name="authToken"
                value={twilioSettings.authToken}
                onChange={handleInputChange}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your auth token"
              />
              <button
                type="button"
                onClick={() => setShowAuthToken(!showAuthToken)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showAuthToken ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Twilio Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={twilioSettings.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1234567890"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="enabled"
              id="enabled"
              checked={twilioSettings.enabled}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="enabled" className="text-sm font-medium text-gray-700">
              Enable Twilio Integration
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
            {saved && (
              <p className="mt-2 text-sm text-green-600">Settings saved successfully!</p>
            )}
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">How to get Twilio credentials:</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Sign up for a Twilio account at twilio.com</li>
            <li>Navigate to your Twilio Console Dashboard</li>
            <li>Find your Account SID and Auth Token</li>
            <li>Get a Twilio phone number from the Phone Numbers section</li>
            <li>Enter the credentials above and enable the integration</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
