'use client'

import { useState } from 'react'
import { Check, Building2, Home, Crown } from 'lucide-react'

interface PlanFeatures {
  autoMessages: boolean
  selfRegistration: boolean
  adminRegistration: boolean
  hostingYears: number
}

export default function PricingPage() {
  const [residentialFeatures, setResidentialFeatures] = useState<PlanFeatures>({
    autoMessages: false,
    selfRegistration: false,
    adminRegistration: true,
    hostingYears: 1
  })

  const [commercialFeatures, setCommercialFeatures] = useState<PlanFeatures>({
    autoMessages: false,
    selfRegistration: false,
    adminRegistration: true,
    hostingYears: 1
  })

  const [premiumHostingYears, setPremiumHostingYears] = useState(2)

  const BASE_RESIDENTIAL = 500000
  const BASE_COMMERCIAL = 600000
  const BASE_PREMIUM = 1100000

  const FEATURE_PRICES = {
    autoMessages: 50000,
    selfRegistration: 30000,
    adminRegistration: 0,
    hostingPerYear: 100000
  }

  const calculatePrice = (basePrice: number, features: PlanFeatures) => {
    let total = basePrice
    if (features.autoMessages) total += FEATURE_PRICES.autoMessages
    if (features.selfRegistration) total += FEATURE_PRICES.selfRegistration
    if (features.hostingYears > 1) {
      total += (features.hostingYears - 1) * FEATURE_PRICES.hostingPerYear
    }
    return total
  }

  const residentialPrice = calculatePrice(BASE_RESIDENTIAL, residentialFeatures)
  const commercialPrice = calculatePrice(BASE_COMMERCIAL, commercialFeatures)
  const premiumPrice = BASE_PREMIUM + (premiumHostingYears > 2 ? (premiumHostingYears - 2) * FEATURE_PRICES.hostingPerYear : 0)

  const toggleResidentialFeature = (feature: keyof PlanFeatures) => {
    if (feature === 'hostingYears') return
    setResidentialFeatures(prev => ({ ...prev, [feature]: !prev[feature] }))
  }

  const toggleCommercialFeature = (feature: keyof PlanFeatures) => {
    if (feature === 'hostingYears') return
    setCommercialFeatures(prev => ({ ...prev, [feature]: !prev[feature] }))
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the perfect property management solution for your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Residential Plan */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-200 overflow-hidden">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
              <Building2 className="w-12 h-12 mb-4" />
              <h2 className="text-3xl font-bold mb-2">Residential Plan</h2>
              <p className="text-blue-100">Perfect for on-campus housing</p>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="text-4xl font-bold text-gray-900">
                  ₦{residentialPrice.toLocaleString()}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  (One time payment)
                </p>
                <p className="text-sm text-gray-500">
                  {residentialFeatures.hostingYears} year{residentialFeatures.hostingYears > 1 ? 's' : ''} hosting
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Features:</h3>
                
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={residentialFeatures.autoMessages}
                    onChange={() => toggleResidentialFeature('autoMessages')}
                    className="w-5 h-5 text-blue-600 rounded mt-0.5"
                  />
                  <div className="flex-1">
                    <span className="text-gray-700">Automatic Messages (WhatsApp & SMS)</span>
                    <p className="text-xs text-gray-500">+₦{FEATURE_PRICES.autoMessages.toLocaleString()} (/ yearly)</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={residentialFeatures.selfRegistration}
                    onChange={() => toggleResidentialFeature('selfRegistration')}
                    className="w-5 h-5 text-blue-600 rounded mt-0.5"
                  />
                  <div className="flex-1">
                    <span className="text-gray-700">Occupants Self-Registration</span>
                    <p className="text-xs text-gray-500">+₦{FEATURE_PRICES.selfRegistration.toLocaleString()} (One time payment)</p>
                  </div>
                </label>

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={residentialFeatures.adminRegistration}
                    disabled
                    className="w-5 h-5 text-blue-600 rounded mt-0.5 opacity-50"
                  />
                  <div className="flex-1">
                    <span className="text-gray-700">Admin Registration</span>
                    <p className="text-xs text-green-600">Included</p>
                  </div>
                </label>
              </div>

              <div className="mb-6 pt-4 border-t">
                <h3 className="font-semibold text-gray-900 mb-3">Hosting Duration: <span className="text-sm text-gray-600">(Online Presence)</span></h3>
                <select
                  value={residentialFeatures.hostingYears}
                  onChange={(e) => setResidentialFeatures(prev => ({
                    ...prev,
                    hostingYears: parseInt(e.target.value)
                  }))}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(year => (
                    <option key={year} value={year}>
                      {year} Year{year > 1 ? 's' : ''} 
                      {year > 1 && ` (+₦${((year - 1) * FEATURE_PRICES.hostingPerYear).toLocaleString()})`}
                    </option>
                  ))}
                </select>
              </div>

              <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                Get Started
              </button>
            </div>
          </div>

          {/* Commercial Plan */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-200 overflow-hidden">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white">
              <Home className="w-12 h-12 mb-4" />
              <h2 className="text-3xl font-bold mb-2">Commercial Plan</h2>
              <p className="text-purple-100">Ideal for off-campus properties</p>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="text-4xl font-bold text-gray-900">
                  ₦{commercialPrice.toLocaleString()}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  (One time payment)
                </p>
                <p className="text-sm text-gray-500">
                  {commercialFeatures.hostingYears} year{commercialFeatures.hostingYears > 1 ? 's' : ''} hosting
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Features:</h3>
                
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={commercialFeatures.autoMessages}
                    onChange={() => toggleCommercialFeature('autoMessages')}
                    className="w-5 h-5 text-purple-600 rounded mt-0.5"
                  />
                  <div className="flex-1">
                    <span className="text-gray-700">Automatic Messages (WhatsApp & SMS)</span>
                    <p className="text-xs text-gray-500">+₦{FEATURE_PRICES.autoMessages.toLocaleString()} (/ yearly)</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={commercialFeatures.selfRegistration}
                    onChange={() => toggleCommercialFeature('selfRegistration')}
                    className="w-5 h-5 text-purple-600 rounded mt-0.5"
                  />
                  <div className="flex-1">
                    <span className="text-gray-700">Occupants Self-Registration</span>
                    <p className="text-xs text-gray-500">+₦{FEATURE_PRICES.selfRegistration.toLocaleString()} (One time payment)</p>
                  </div>
                </label>

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={commercialFeatures.adminRegistration}
                    disabled
                    className="w-5 h-5 text-purple-600 rounded mt-0.5 opacity-50"
                  />
                  <div className="flex-1">
                    <span className="text-gray-700">Admin Registration</span>
                    <p className="text-xs text-green-600">Included</p>
                  </div>
                </label>
              </div>

              <div className="mb-6 pt-4 border-t">
                <h3 className="font-semibold text-gray-900 mb-3">Hosting Duration: <span className="text-sm text-gray-600">(Online Presence)</span></h3>
                <select
                  value={commercialFeatures.hostingYears}
                  onChange={(e) => setCommercialFeatures(prev => ({
                    ...prev,
                    hostingYears: parseInt(e.target.value)
                  }))}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(year => (
                    <option key={year} value={year}>
                      {year} Year{year > 1 ? 's' : ''} 
                      {year > 1 && ` (+₦${((year - 1) * FEATURE_PRICES.hostingPerYear).toLocaleString()})`}
                    </option>
                  ))}
                </select>
              </div>

              <button className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700">
                Get Started
              </button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-yellow-400 overflow-hidden relative">
            <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 px-3 py-1 text-xs font-bold rounded-bl-lg">
              BEST VALUE
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 text-white">
              <Crown className="w-12 h-12 mb-4" />
              <h2 className="text-3xl font-bold mb-2">Premium Estate</h2>
              <p className="text-yellow-100">Full-featured management</p>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="text-4xl font-bold text-gray-900">
                  ₦{premiumPrice.toLocaleString()}
                </div>
                <p className="text-sm text-gray-500 mt-1">(One time payment)</p>
                <p className="text-sm text-gray-500">{premiumHostingYears} years hosting</p>
              </div>

              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">All Features Included:</h3>
                
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">On-Campus & Off-Campus</span>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Automatic Messages (WhatsApp & SMS)</span>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Occupants Self-Registration</span>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Admin Registration</span>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Priority Support</span>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Custom Branding</span>
                </div>
              </div>

              <div className="mb-6 pt-4 border-t">
                <h3 className="font-semibold text-gray-900 mb-3">Hosting Duration: <span className="text-sm text-gray-600">(Online Presence)</span></h3>
                <select
                  value={premiumHostingYears}
                  onChange={(e) => setPremiumHostingYears(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(year => (
                    <option key={year} value={year}>
                      {year} Years
                      {year > 2 && ` (+₦${((year - 2) * FEATURE_PRICES.hostingPerYear).toLocaleString()})`}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">2 years included, additional years at ₦{FEATURE_PRICES.hostingPerYear.toLocaleString()}/year</p>
              </div>

              <button className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700">
                Get Premium
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
