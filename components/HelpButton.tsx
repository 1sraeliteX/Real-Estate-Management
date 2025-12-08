'use client'

import { useState } from 'react'
import { HelpCircle, X } from 'lucide-react'

interface HelpItem {
  question: string
  answer: string
}

const helpContent: HelpItem[] = [
  {
    question: '🏠 How do I add a new house?',
    answer: 'Click on "My Houses" in the menu, then click the "Add New Property" button. Fill in the details and click save.'
  },
  {
    question: '👥 How do I add a tenant?',
    answer: 'Go to "Tenants" in the menu, then click "Add New Tenant". Fill in their information including name, phone, and rent details.'
  },
  {
    question: '💰 How do I track payments?',
    answer: 'Click on "Money" in the menu to see all payments. You can see who has paid and who still owes money.'
  },
  {
    question: '📱 What if I make a mistake?',
    answer: 'Don\'t worry! You can edit or delete any information by clicking on it and choosing "Edit" or "Delete".'
  },
  {
    question: '🔒 Is my information safe?',
    answer: 'Yes! All your information is stored securely on your device. Only you can see it.'
  }
]

export default function HelpButton() {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 hover:scale-110 transition-all z-40 group"
        aria-label="Need Help"
        title="Need Help"
      >
        <HelpCircle className="w-7 h-7" />
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Need Help
        </span>
      </button>

      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">❓ Need Help?</h2>
              <button onClick={() => setShowHelp(false)} className="text-gray-400 hover:text-gray-600 p-2">
                <X className="w-7 h-7" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-lg text-gray-700 mb-6">
                Here are answers to common questions:
              </p>

              {helpContent.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.question}</h3>
                  <p className="text-base text-gray-700 leading-relaxed">{item.answer}</p>
                </div>
              ))}

              <div className="mt-8 bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                <h3 className="text-xl font-bold text-blue-900 mb-3">💡 Quick Tip</h3>
                <p className="text-base text-blue-800">
                  Look for the <HelpCircle className="w-5 h-5 inline text-blue-600" /> icon throughout the app for more help on specific features!
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl">
              <button
                onClick={() => setShowHelp(false)}
                className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-lg shadow-lg"
              >
                Got It! ✅
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
