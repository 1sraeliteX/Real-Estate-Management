'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Building2, Home, Crown } from 'lucide-react'

interface PlanFeatures {
  autoMessages: boolean
  selfRegistration: boolean
  adminRegistration: boolean
  hostingYears: number
}

export default function PricingPage() {
  const router = useRouter()
  const [userCount, setUserCount] = useState(23)
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

  // Dynamic counter that increases every 30 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount(prev => {
        const increment = Math.floor(Math.random() * 3) + 1 // Random increment between 1-3
        return prev + increment
      })
    }, 1800000) // Update every 30 minutes (30 * 60 * 1000 milliseconds)

    return () => clearInterval(interval)
  }, [])

  const BASE_RESIDENTIAL = 500000
  const BASE_COMMERCIAL = 600000
  const BASE_PREMIUM = 1100000

  const FEATURE_PRICES = {
    autoMessages: 100000,
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto mt-6 mb-6">
            <p className="text-blue-800 text-sm font-medium">
              💡 Click on any plan card below to view detailed pricing features and learn more about what's included
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 max-w-3xl mx-auto mt-6">
            🏠 Trusted by {userCount}+ landlords and caretakers to manage properties effortlessly. ✨ Experience smarter real estate management. 🚀
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Residential Plan */}
          <div 
            onClick={() => router.push('/dashboard/pricing/residential')}
            className="bg-white rounded-2xl shadow-xl border-2 border-blue-200 overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-105 transition-all"
          >
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
                    <span className="text-gray-700">AI powerful automation, faster workflows, and priority support</span>
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
                      Plus {year} year{year > 1 ? 's' : ''} – ₦{(year * FEATURE_PRICES.hostingPerYear).toLocaleString()}
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
          <div 
            onClick={() => router.push('/dashboard/pricing/commercial')}
            className="bg-white rounded-2xl shadow-xl border-2 border-purple-200 overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-105 transition-all"
          >
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
                    <span className="text-gray-700">AI powerful automation, faster workflows, and priority support</span>
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
                      Plus {year} year{year > 1 ? 's' : ''} – ₦{(year * FEATURE_PRICES.hostingPerYear).toLocaleString()}
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
          <div 
            onClick={() => router.push('/dashboard/pricing/premium')}
            className="bg-white rounded-2xl shadow-xl border-2 border-yellow-400 overflow-hidden relative cursor-pointer hover:shadow-2xl hover:scale-105 transition-all"
          >
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
                  <span className="text-gray-700">AI powerful automation, faster workflows, and priority support</span>
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
                      Plus {year} years – ₦{(year * FEATURE_PRICES.hostingPerYear).toLocaleString()}
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

        {/* Up Next - Cornerstone Pro Section (Only on Pricing Page) */}
        <div className="mt-12 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Real Estate Logo in Golden Rectangle */}
              <div className="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg p-4 shadow-lg">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-amber-600" />
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold text-amber-900">Up Next – Cornerstone Pro</h3>
                  <span className="text-2xl">✨</span>
                </div>
                <p className="text-amber-800 text-lg font-medium mb-2">
                  The Ultimate Property Management Hierarchy
                </p>
                <p className="text-amber-700 text-sm">
                  This upgrade is based on user feedbacks to make user experience better.
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-amber-600 font-medium mb-1">Coming Soon</div>
              <div className="text-xs text-amber-500">Enhanced Features</div>
            </div>
          </div>
        </div>

        {/* Note Section */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">📝 Note</h3>
          <p className="text-gray-700 text-sm">
            Pricing might vary due to inflation and customization demands.
          </p>
        </div>
      </div>
    </div>
  )
}
