'use client'

import { useState, useEffect } from 'react'
import { X, Building2, Users, DollarSign, CheckCircle } from 'lucide-react'
import { AuthClient } from '@/lib/client/authClient'

export default function WelcomeGuide() {
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    checkWelcomeGuideStatus()
  }, [])

  const checkWelcomeGuideStatus = async () => {
    try {
      const settings = await AuthClient.getUserSettings()
      if (!settings?.hasSeenWelcomeGuide) {
        setShow(true)
      }
    } catch (error) {
      console.error('Error checking welcome guide status:', error)
      // Fallback to showing guide if there's an error
      setShow(true)
    }
  }

  const handleClose = async () => {
    try {
      await AuthClient.updateUserSettings({ hasSeenWelcomeGuide: true })
      setShow(false)
    } catch (error) {
      console.error('Error updating welcome guide status:', error)
      // Still close the guide even if update fails
      setShow(false)
    }
  }

  const steps = [
    {
      icon: <Building2 className="w-16 h-16 text-blue-600" />,
      title: 'Welcome! 👋',
      description: 'This app helps you manage your rental properties easily. Let me show you around!',
      color: 'blue'
    },
    {
      icon: <Building2 className="w-16 h-16 text-purple-600" />,
      title: 'Add Your Houses 🏠',
      description: 'Start by adding your properties - both school hostels and private houses. Click "My Houses" to begin.',
      color: 'purple'
    },
    {
      icon: <Users className="w-16 h-16 text-green-600" />,
      title: 'Add Your Tenants 👥',
      description: 'Add the people living in your properties. Keep track of their contact info and rent payments.',
      color: 'green'
    },
    {
      icon: <DollarSign className="w-16 h-16 text-emerald-600" />,
      title: 'Track Your Money 💰',
      description: 'See how much rent you\'ve collected and who still owes you money. Everything in one place!',
      color: 'emerald'
    },
    {
      icon: <CheckCircle className="w-16 h-16 text-blue-600" />,
      title: 'You\'re All Set! ✨',
      description: 'That\'s it! If you need help, just look for the help icons (?) throughout the app.',
      color: 'blue'
    }
  ]

  if (!show) return null

  const currentStep = steps[step]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl max-w-lg w-full p-10 shadow-2xl border-4 border-gradient-to-r from-blue-400 to-purple-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-purple-100/30 to-pink-100/30 animate-pulse"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div className={`p-6 rounded-full bg-gradient-to-br from-${currentStep.color}-200 to-${currentStep.color}-300 shadow-xl transform hover:scale-110 transition-all duration-300 border-4 border-white/50`}>
              {currentStep.icon}
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-red-500 p-3 hover:bg-red-100 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-90">
              <X className="w-7 h-7" />
            </button>
          </div>

          <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight">
            <span className="text-blue-900">
              {currentStep.title}
            </span>
          </h2>
          <p className="text-xl font-semibold text-gray-800 mb-10 leading-relaxed">{currentStep.description}</p>

          {/* Progress dots */}
          <div className="flex justify-center gap-3 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-4 rounded-full transition-all duration-300 ${
                  index === step 
                    ? 'w-12 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg transform scale-110' 
                    : 'w-4 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-4">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 px-8 py-5 border-4 border-gray-400 text-gray-700 rounded-2xl hover:bg-gray-100 hover:border-gray-500 font-black text-lg transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                ← Back
              </button>
            )}
            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 px-8 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 font-black text-lg shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 border-4 border-white/20"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleClose}
                className="flex-1 px-8 py-5 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 text-white rounded-2xl hover:from-green-700 hover:via-emerald-700 hover:to-teal-800 font-black text-lg shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-300 border-4 border-white/20"
              >
                Get Started! 🚀
              </button>
            )}
          </div>

          <button
            onClick={handleClose}
            className="w-full mt-6 text-gray-600 hover:text-red-600 text-base font-bold bg-gray-100 hover:bg-red-100 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Skip Tutorial
          </button>
        </div>
      </div>
    </div>
  )
}
