'use client'

import { Crown, Check, ArrowLeft, Building2, Home, Star, Zap, Shield, Headphones } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PremiumPlanPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen">
      {/* Header with Plan Color Background */}
      <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 px-4 py-2 text-sm font-bold rounded-bl-2xl">
          BEST VALUE
        </div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-yellow-100 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Pricing
        </button>
        <div className="text-center">
          <Crown className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Premium Estate</h1>
          <p className="text-xl text-yellow-100">Full-featured management solution</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Star className="w-5 h-5 text-yellow-200 fill-current" />
            <span className="text-yellow-100">Everything you need in one package</span>
            <Star className="w-5 h-5 text-yellow-200 fill-current" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Premium Benefits Banner */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border-2 border-yellow-200 p-6 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-yellow-900 mb-2">Why Choose Premium?</h2>
            <p className="text-yellow-800 text-lg">
              Get both On-Campus AND Off-Campus management in one complete package, 
              plus exclusive premium features you won't find anywhere else!
            </p>
          </div>
        </div>

        {/* Plan Features Explained Simply */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl border-2 border-yellow-200 p-6 shadow-md">
            <div className="flex items-start gap-4">
              <div className="flex gap-1">
                <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <Home className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">On-Campus & Off-Campus Properties</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Manage BOTH types of properties with one system! Whether you have student hostels on campus or private 
                  houses and apartments off campus, this plan handles everything. It's like having two systems in one - 
                  you don't need to buy separate plans anymore.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-medium">Saves you ₦600,000+ compared to buying both plans separately</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-yellow-200 p-6 shadow-md">
            <div className="flex items-start gap-4">
              <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Admin Registration</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  You (the landlord) can add new tenants to ALL your properties. Whether it's a hostel room or a private 
                  apartment, you can put their information into the system yourself. It's like having one master control 
                  panel for all your properties.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-yellow-200 p-6 shadow-md">
            <div className="flex items-start gap-4">
              <Zap className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI Powerful Automation, Faster Workflows, and Priority Support</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  The computer automatically sends messages to ALL your tenants across all properties! It reminds them about 
                  rent payments through WhatsApp and SMS. Plus, you get the fastest support when you need help - no waiting 
                  in line!
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-medium">Included FREE (saves ₦100,000/year)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-yellow-200 p-6 shadow-md">
            <div className="flex items-start gap-4">
              <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Occupants Self-Registration</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Your tenants can sign up by themselves for ANY of your properties! They can choose between hostel rooms 
                  or private apartments, fill out their own information, and get started immediately. This saves you tons 
                  of time across all your properties.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-medium">Included FREE (saves ₦30,000)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-yellow-200 p-6 shadow-md">
            <div className="flex items-start gap-4">
              <Headphones className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Priority Support</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  When you need help, you get it FIRST! No waiting behind other customers. Our support team will help you 
                  immediately with any questions or problems. It's like having a VIP pass for customer service.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-yellow-700 font-medium">Premium-only feature</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-yellow-200 p-6 shadow-md">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Custom Branding</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Make the system look like YOUR business! You can add your company logo, change colors, and customize 
                  how everything looks. Your tenants will see YOUR brand, not ours. It's like having your own custom-made 
                  property management system.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-yellow-700 font-medium">Premium-only feature</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-yellow-200 p-6 shadow-md">
            <div className="flex items-start gap-4">
              <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Extended Hosting Duration</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Your system stays online and working for 2 FULL YEARS included! That's double what other plans offer. 
                  You can also extend it up to 10 years at a discounted rate. Think of it like getting 2 years of internet 
                  service included in the price.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-medium">2 years included (saves ₦100,000)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Comparison */}
        <div className="mt-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-8">
          <h2 className="text-2xl font-bold text-green-900 mb-6 text-center">Amazing Value!</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-green-800 mb-3">If you bought separately:</h3>
              <div className="space-y-2 text-green-700">
                <div className="flex justify-between">
                  <span>Residential Plan:</span>
                  <span>₦500,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Commercial Plan:</span>
                  <span>₦600,000</span>
                </div>
                <div className="flex justify-between">
                  <span>AI Automation (2 years):</span>
                  <span>₦200,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Self-Registration:</span>
                  <span>₦30,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Extra Hosting Year:</span>
                  <span>₦100,000</span>
                </div>
                <div className="border-t border-green-300 pt-2 flex justify-between font-bold">
                  <span>Total:</span>
                  <span>₦1,430,000</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-800 mb-3">Premium Plan:</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-900 mb-2">₦1,100,000</div>
                <div className="text-2xl font-bold text-green-600 mb-4">You Save ₦330,000!</div>
                <div className="bg-green-100 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    Plus you get Premium-only features like Priority Support and Custom Branding!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="mt-12 bg-gradient-to-br from-yellow-50 to-amber-100 rounded-xl border-2 border-yellow-200 p-8">
          <h2 className="text-2xl font-bold text-yellow-900 mb-4 text-center">Premium Estate Plan</h2>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-900 mb-2">₦1,100,000</div>
            <p className="text-yellow-700 text-lg">One-time payment for 2 years hosting</p>
            <p className="text-yellow-600 mt-2">Complete property management solution for all property types</p>
          </div>
          
          <div className="mt-6 text-center">
            <button className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-bold text-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-lg transform hover:scale-105">
              Get Premium Now
            </button>
            <p className="text-sm text-yellow-600 mt-2">30-day money-back guarantee</p>
          </div>
        </div>
      </div>
    </div>
  )
}