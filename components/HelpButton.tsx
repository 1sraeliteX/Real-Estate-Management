'use client'

import { useState } from 'react'
import { HelpCircle, X } from 'lucide-react'

interface HelpItem {
  question: string
  answer: string
}

const helpContent: HelpItem[] = [
  {
    question: '🏠 How do I add properties?',
    answer: 'Go to "My Properties" → Choose "On-Campus" or "Off-Campus" → Click "Add Property". Fill in details like name, address, property type, rooms, and rent amount.'
  },
  {
    question: '👥 How do I manage occupants?',
    answer: 'Visit "Occupants" section → Choose "On-Campus" or "Off-Campus" → Click "Add Occupant". You can assign them to specific rooms and track their payments.'
  },
  {
    question: '💰 How do I track finances?',
    answer: 'Click "Money" to see total collected rent, pending payments, and financial overview. You can track who has paid and who owes money.'
  },
  {
    question: '🏢 What\'s the difference between On-Campus and Off-Campus?',
    answer: 'On-Campus properties are typically lodges/hostels with multiple rooms. Off-Campus are independent apartments, houses, condos, etc. Each has different management features.'
  },
  {
    question: '🔧 How do I customize property types?',
    answer: 'Go to Settings → Property Types section. You can add custom property types like "villa", "duplex", etc. These will appear in property forms.'
  },
  {
    question: '📊 How do I view property statistics?',
    answer: 'The Dashboard shows overview stats. Visit individual property pages for detailed room occupancy, rent collection, and tenant information.'
  },
  {
    question: '🔔 How do notifications work?',
    answer: 'The bell icon shows important alerts like rent due dates, new occupants, and system updates. Click it to see all notifications.'
  },
  {
    question: '📱 Can I edit information after adding it?',
    answer: 'Yes! Click on any property or occupant to edit details. You can update rent amounts, contact info, room assignments, and more.'
  }
]

export default function HelpButton() {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 text-white p-5 rounded-full shadow-2xl hover:shadow-blue-500/70 hover:scale-125 transition-all duration-300 z-40 group animate-bounce hover:animate-pulse border-4 border-white/30"
        aria-label="Need Help"
        title="Need Help"
      >
        <HelpCircle className="w-8 h-8 animate-spin group-hover:animate-pulse" />
        <span className="absolute bottom-full right-0 mb-3 px-5 py-3 bg-gradient-to-r from-blue-900 via-cyan-900 to-teal-900 text-white text-base font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl transform group-hover:scale-110 border-2 border-white/20">
          <span className="text-xl">🆘</span> Need Help?
        </span>
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400 opacity-0 group-hover:opacity-30 animate-ping"></div>
      </button>

      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-gradient-to-r from-purple-500 to-pink-500">
            <div className="sticky top-0 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 px-8 py-6 flex items-center justify-between rounded-t-2xl border-b-4 border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-cyan-400/30 to-teal-400/30 animate-pulse"></div>
              <h2 className="text-3xl font-black text-white flex items-center gap-4 relative z-10 drop-shadow-lg">
                <span className="text-5xl">🆘</span> 
                <span className="text-white">
                  Need Help with Cornerstone Realty?
                </span>
              </h2>
              <button 
                onClick={() => setShowHelp(false)} 
                className="text-white hover:text-yellow-200 p-3 hover:bg-white/30 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-90 relative z-10 border-2 border-white/20 hover:border-yellow-200/50"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 rounded-2xl p-6 border-4 border-gradient-to-r from-blue-400 to-teal-500 mb-8 shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-cyan-100/40 to-teal-100/40 animate-pulse"></div>
                <p className="text-xl font-black text-gray-900 text-center relative z-10 leading-relaxed">
                  <span className="text-3xl inline-block">🎯</span> 
                  <span className="text-blue-900">
                    Quick answers to get you started with your property management!
                  </span>
                  <span className="block mt-2 text-lg text-gray-700">⚡ Everything you need to know in one place!</span>
                </p>
              </div>

              {helpContent.map((item, index) => {
                const colors = [
                  'from-blue-100 to-blue-200 border-blue-400 hover:from-blue-200 hover:to-blue-300',
                  'from-green-100 to-green-200 border-green-400 hover:from-green-200 hover:to-green-300', 
                  'from-purple-100 to-purple-200 border-purple-400 hover:from-purple-200 hover:to-purple-300',
                  'from-orange-100 to-orange-200 border-orange-400 hover:from-orange-200 hover:to-orange-300',
                  'from-pink-100 to-pink-200 border-pink-400 hover:from-pink-200 hover:to-pink-300',
                  'from-indigo-100 to-indigo-200 border-indigo-400 hover:from-indigo-200 hover:to-indigo-300',
                  'from-teal-100 to-teal-200 border-teal-400 hover:from-teal-200 hover:to-teal-300',
                  'from-red-100 to-red-200 border-red-400 hover:from-red-200 hover:to-red-300'
                ]
                const colorClass = colors[index % colors.length]
                
                return (
                  <div key={index} className={`bg-gradient-to-br ${colorClass} rounded-2xl p-6 border-3 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-rotate-1 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <h3 className="text-xl font-black text-gray-900 mb-4 leading-relaxed">{item.question}</h3>
                      <p className="text-base font-semibold text-gray-800 leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                )
              })}

              <div className="mt-8 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-8 border-4 border-gradient-to-r from-amber-400 to-orange-500 shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 via-orange-100/30 to-yellow-100/30 animate-pulse"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-amber-900 mb-4 flex items-center gap-3">
                    <span className="text-4xl">💡</span> 
                    <span className="text-amber-900">
                      Pro Tip of the Day!
                    </span>
                  </h3>
                  <p className="text-lg font-semibold text-amber-900 leading-relaxed">
                    🔍 Look for the <HelpCircle className="w-6 h-6 inline text-amber-600 animate-pulse" /> icon throughout the app for context-specific help on any feature! 
                    <span className="block mt-2 text-amber-700">✨ Pro users get priority support and advanced features!</span>
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 rounded-2xl p-8 border-4 border-gradient-to-r from-emerald-400 to-teal-500 shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/40 via-green-200/40 to-teal-200/40 animate-pulse"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-emerald-900 mb-4 flex items-center gap-3">
                    <span className="text-4xl">🚀</span> 
                    <span className="text-emerald-900">
                      Need Instant Support?
                    </span>
                  </h3>
                  <p className="text-lg font-bold text-emerald-900 mb-6 leading-relaxed">
                    🎯 Get lightning-fast help from our expert developer team! 
                    <span className="block mt-2 text-emerald-700">⚡ Available 24/7 for urgent issues!</span>
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="https://wa.me/2347018080377"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-green-500 via-emerald-600 to-green-700 text-white px-6 py-4 rounded-xl hover:from-green-600 hover:via-emerald-700 hover:to-green-800 transition-all font-bold text-lg text-center flex items-center justify-center gap-3 shadow-2xl hover:shadow-green-500/50 transform hover:scale-110 hover:-rotate-1 duration-300"
                    >
                      <span className="text-2xl animate-pulse">💬</span> WhatsApp Chat
                    </a>
                    <a
                      href="tel:+2347018080377"
                      className="flex-1 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:via-purple-700 hover:to-indigo-800 transition-all font-bold text-lg text-center flex items-center justify-center gap-3 shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 hover:rotate-1 duration-300"
                    >
                      <span className="text-2xl animate-pulse">📞</span> Call Now
                    </a>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm font-semibold text-emerald-800 bg-emerald-200 rounded-lg px-4 py-2 inline-block">
                      🌟 Response time: Usually under 5 minutes!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 to-white border-t-4 border-gradient-to-r from-blue-400 to-teal-500 px-8 py-6 rounded-b-2xl">
              <button
                onClick={() => setShowHelp(false)}
                className="w-full px-8 py-5 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-700 text-white rounded-2xl hover:from-blue-700 hover:via-cyan-700 hover:to-teal-800 font-black text-xl shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 border-4 border-white/20 hover:border-amber-300/50"
              >
                <span className="flex items-center justify-center gap-3">
                  <span className="text-2xl">✅</span>
                  Got It! I'm Ready to Manage Properties!
                  <span className="text-2xl">🚀</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
