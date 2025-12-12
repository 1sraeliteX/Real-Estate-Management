'use client'

import { Building2, Check, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ResidentialPlanPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen">
      {/* Header with Plan Color Background */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-100 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Pricing
        </button>
        <div className="text-center">
          <Building2 className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Residential Plan</h1>
          <p className="text-xl text-blue-100">Perfect for on-campus housing</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Plan Features Explained Simply */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl border-2 border-blue-200 p-6 shadow-md">
            <div className="flex items-start gap-4">
              <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Admin Registration</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  You (the landlord) can add new tenants to your properties. This means when someone wants to rent your room, 
                  you can put their information into the system yourself. It's like having a digital notebook where you write 
                  down who lives where.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-blue-200 p-6 shadow-md">
            <div className="flex items-start gap-4">
              <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI Powerful Automation, Faster Workflows, and Priority Support</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  The computer can send messages to your tenants automatically! It can remind them about rent payments through 
                  WhatsApp and SMS (text messages). It's like having a helpful assistant that never forgets to remind people 
                  about important things. Plus, you get special help when you need it.
                </p>
                <p className="text-sm text-blue-600 font-medium mt-2">Optional: +₦100,000 per year</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-blue-200 p-6 shadow-md">
            <div className="flex items-start gap-4">
              <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Occupants Self-Registration</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Your tenants can sign up by themselves! They can use their phone or computer to put in their own information 
                  and choose their room. It's like letting people fill out their own forms instead of you doing it for them. 
                  This saves you time and makes things faster.
                </p>
                <p className="text-sm text-blue-600 font-medium mt-2">Optional: +₦30,000 one time</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-blue-200 p-6 shadow-md">
            <div className="flex items-start gap-4">
              <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Hosting Duration</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  This is how long your property management system stays online and working. Think of it like paying for 
                  internet - you choose how many years you want the service to work. You can pick from 1 year up to 10 years. 
                  The longer you choose, the more you save per year!
                </p>
                <p className="text-sm text-blue-600 font-medium mt-2">Starting at ₦100,000 per year</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="mt-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">Plan Summary</h2>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-900 mb-2">Starting at ₦500,000</div>
            <p className="text-blue-700 text-lg">Base price for 1 year hosting</p>
            <p className="text-blue-600 mt-2">Perfect for managing student hostels and on-campus housing</p>
          </div>
          
          <div className="mt-6 text-center">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg">
              Choose This Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}