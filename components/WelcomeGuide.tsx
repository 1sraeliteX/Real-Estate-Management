'use client'

import { useState, useEffect } from 'react'
import { X, Building2, Users, DollarSign, CheckCircle } from 'lucide-react'

export default function WelcomeGuide() {
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('hasSeenWelcomeGuide')
    if (!hasSeenGuide) {
      setShow(true)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem('hasSeenWelcomeGuide', 'true')
    setShow(false)
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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div className={`p-4 rounded-full bg-${currentStep.color}-100`}>
            {currentStep.icon}
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">{currentStep.title}</h2>
        <p className="text-xl text-gray-700 mb-8 leading-relaxed">{currentStep.description}</p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-3 rounded-full transition-all ${
                index === step ? 'w-8 bg-blue-600' : 'w-3 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-bold text-lg"
            >
              ← Back
            </button>
          )}
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-lg shadow-lg"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold text-lg shadow-lg"
            >
              Get Started! 🚀
            </button>
          )}
        </div>

        <button
          onClick={handleClose}
          className="w-full mt-4 text-gray-500 hover:text-gray-700 text-sm font-medium"
        >
          Skip Tutorial
        </button>
      </div>
    </div>
  )
}
