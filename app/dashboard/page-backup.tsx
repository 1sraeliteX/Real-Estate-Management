'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back! 👋</h1>
        <p className="text-gray-600 text-lg">Here's what's happening with your properties today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-300 p-6">
          <h2 className="text-2xl font-bold text-emerald-900 mb-2">💰 Total Money Collected</h2>
          <p className="text-emerald-700 text-base mb-4">All rent payments received</p>
          <span className="text-4xl font-bold text-emerald-900">₦0</span>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-300 p-6">
          <h2 className="text-2xl font-bold text-amber-900 mb-2">⏰ Money Still Owed</h2>
          <p className="text-amber-700 text-base mb-4">Payments not yet received</p>
          <span className="text-4xl font-bold text-amber-900">₦0</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <button
          onClick={() => router.push('/dashboard/properties')}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-300 p-6 hover:shadow-xl transition-all cursor-pointer hover:scale-105 text-left"
        >
          <h2 className="text-2xl font-bold text-blue-900 mb-2">🏠 My Houses</h2>
          <p className="text-blue-700 text-base mb-4">View and manage all properties</p>
          <span className="text-4xl font-bold text-blue-900">0</span>
        </button>

        <button
          onClick={() => router.push('/dashboard/occupants')}
          className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border-2 border-slate-300 p-6 hover:shadow-xl transition-all cursor-pointer hover:scale-105 text-left"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-2">👥 My Tenants</h2>
          <p className="text-slate-700 text-base mb-4">People living in my properties</p>
          <span className="text-4xl font-bold text-slate-900">0</span>
        </button>
      </div>
    </div>
  )
}