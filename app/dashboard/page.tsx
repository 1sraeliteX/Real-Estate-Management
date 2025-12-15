'use client'

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Users, Home, AlertCircle, Bed } from 'lucide-react'
import QuickStartCard from '@/components/QuickStartCard'
import { useProperties } from '@/lib/hooks/useProperties'
import { useRooms } from '@/lib/hooks/useRooms'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useActivity } from '@/lib/contexts/ActivityContext'

export default function DashboardPage() {
  const router = useRouter()
  const propertiesQuery = useProperties()
  const roomsQuery = useRooms()
  const activityContext = useActivity()

  // Extract data with safe defaults
  const properties = propertiesQuery?.data || []
  const rooms = roomsQuery?.data || []
  const activities = activityContext?.activities || []
  const isLoading = propertiesQuery?.isLoading || roomsQuery?.isLoading || false

  // Memoized calculations for better performance
  const stats = useMemo(() => {
    // Calculate room stats
    const totalRooms = rooms.length
    const occupiedRooms = rooms.filter((r: any) => r.status === 'occupied').length
    const vacantRooms = totalRooms - occupiedRooms

    // Calculate property type stats
    const onCampusProperties = properties.filter((p: any) => p.type === 'lodge')
    const offCampusProperties = properties.filter((p: any) => p.type !== 'lodge')

    // Calculate stats from real data
    const totalOccupants = rooms.reduce((sum: number, room: any) => sum + (room.occupants?.length || 0), 0)
    const totalFinance = rooms.reduce((sum: number, room: any) => {
      const paidAmount = room.occupants?.reduce((occupantSum: number, occupant: any) => occupantSum + (occupant.amountPaid || 0), 0) || 0
      return sum + paidAmount
    }, 0)
    const pendingPayments = rooms.reduce((sum: number, room: any) => {
      const pendingAmount = room.occupants?.reduce((occupantSum: number, occupant: any) => {
        return occupantSum + ((occupant.totalRent || 0) - (occupant.amountPaid || 0))
      }, 0) || 0
      return sum + pendingAmount
    }, 0)

    return {
      totalFinance,
      totalProperties: properties.length,
      totalRooms,
      occupiedRooms,
      vacantRooms,
      onCampusProperties: onCampusProperties.length,
      offCampusProperties: offCampusProperties.length,
      totalOccupants,
      pendingPayments,
      occupiedProperties: properties.filter((p: any) => p.status === 'occupied').length,
      availableProperties: properties.filter((p: any) => p.status === 'available').length,
    }
  }, [properties, rooms])

  const showQuickStart = stats.totalProperties === 0 && stats.totalOccupants === 0

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back! 👋</h1>
        <p className="text-gray-600 text-lg">Here's what's happening with your properties today</p>
      </div>

      {/* Quick Start Guide for New Users */}
      {showQuickStart && (
        <div className="mb-8">
          <QuickStartCard />
        </div>
      )}

      {/* Finance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <button
          onClick={() => router.push('/dashboard/finances')}
          className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-300 p-6 hover:shadow-xl transition-all cursor-pointer hover:scale-105 text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full">
              <span className="text-2xl font-bold text-white">₦</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-emerald-900 mb-2">💰 Total Money Collected</h2>
          <p className="text-emerald-700 text-base mb-4">All rent payments received</p>
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold text-emerald-900">
              ₦{stats.totalFinance.toLocaleString()}
            </span>
          </div>
        </button>

        <button
          onClick={() => router.push('/dashboard/payments')}
          className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-300 p-6 hover:shadow-xl transition-all cursor-pointer hover:scale-105 text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="w-12 h-12 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-amber-900 mb-2">⏰ Money Still Owed</h2>
          <p className="text-amber-700 text-base mb-4">Payments not yet received</p>
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold text-amber-900">
              ₦{stats.pendingPayments.toLocaleString()}
            </span>
          </div>
        </button>
      </div>

      {/* Main Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <button
          onClick={() => router.push('/dashboard/properties')}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-300 p-6 hover:shadow-xl transition-all cursor-pointer hover:scale-105 text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <Building2 className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-blue-900 mb-2">🏠 My Houses</h2>
          <p className="text-blue-700 text-base mb-4">View and manage all properties</p>
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold text-blue-900">
              {stats.totalProperties.toLocaleString()}
            </span>
            <span className="text-base text-blue-600 font-semibold">Properties</span>
          </div>
        </button>

        <button
          onClick={() => router.push('/dashboard/occupants')}
          className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border-2 border-slate-300 p-6 hover:shadow-xl transition-all cursor-pointer hover:scale-105 text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="w-12 h-12 text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">👥 My Tenants</h2>
          <p className="text-slate-700 text-base mb-4">People living in my properties</p>
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold text-slate-900">
              {stats.totalOccupants.toLocaleString()}
            </span>
            <span className="text-base text-slate-600 font-semibold">Tenants</span>
          </div>
        </button>
      </div>

      {/* Room Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200 p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-emerald-900">✅ Rooms with People</h3>
            <Bed className="w-10 h-10 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl font-bold text-emerald-900">{stats.occupiedRooms}</span>
            <span className="text-2xl text-emerald-700">out of {stats.totalRooms}</span>
          </div>
          <div className="w-full bg-emerald-200 rounded-full h-4 mt-4">
            <div 
              className="bg-gradient-to-r from-emerald-600 to-teal-600 h-4 rounded-full transition-all"
              style={{ width: `${stats.totalRooms > 0 ? (stats.occupiedRooms / stats.totalRooms) * 100 : 0}%` }}
            />
          </div>
          <p className="text-base text-emerald-700 mt-3 font-medium">
            {stats.totalRooms > 0 ? ((stats.occupiedRooms / stats.totalRooms) * 100).toFixed(0) : 0}% of rooms are occupied
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-blue-900">🔓 Empty Rooms</h3>
            <Bed className="w-10 h-10 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl font-bold text-blue-900">{stats.vacantRooms}</span>
            <span className="text-2xl text-blue-700">out of {stats.totalRooms}</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-4 mt-4">
            <div 
              className="bg-gradient-to-r from-blue-600 to-cyan-600 h-4 rounded-full transition-all"
              style={{ width: `${stats.totalRooms > 0 ? (stats.vacantRooms / stats.totalRooms) * 100 : 0}%` }}
            />
          </div>
          <p className="text-base text-blue-700 mt-3 font-medium">
            {stats.totalRooms > 0 ? ((stats.vacantRooms / stats.totalRooms) * 100).toFixed(0) : 0}% ready for new tenants
          </p>
        </div>
      </div>

      {/* Property Type Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border-2 border-slate-200 p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-slate-900">🏨 Lodges</h3>
            <Building2 className="w-10 h-10 text-slate-600" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl font-bold text-slate-900">{stats.onCampusProperties}</span>
            <span className="text-2xl text-slate-700">hostels</span>
          </div>
          <p className="text-base text-slate-700 mt-3 font-medium">
            Student accommodation facilities
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border-2 border-amber-200 p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-amber-900">🏘️ Private Houses</h3>
            <Home className="w-10 h-10 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl font-bold text-amber-900">{stats.offCampusProperties}</span>
            <span className="text-2xl text-amber-700">houses</span>
          </div>
          <p className="text-base text-amber-700 mt-3 font-medium">
            Houses outside campus
          </p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mt-8 bg-white rounded-xl border-2 border-gray-200 p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📝 What You Did Recently</h2>
        {activities.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl font-medium">Nothing here yet</p>
            <p className="text-base mt-2">Your recent actions will show up here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase">Action</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase">Category</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase">Details</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activities.slice(0, 10).map((activity: any) => {
                  const actionColors: { [key: string]: string } = {
                    added: 'bg-green-100 text-green-800',
                    updated: 'bg-blue-100 text-blue-800',
                    deleted: 'bg-red-100 text-red-800',
                    created: 'bg-green-100 text-green-800',
                    property: 'bg-purple-100 text-purple-800',
                    payment: 'bg-green-100 text-green-800',
                    maintenance: 'bg-yellow-100 text-yellow-800'
                  }
                  const categoryColors: { [key: string]: string } = {
                    property: 'bg-purple-100 text-purple-800',
                    occupant: 'bg-orange-100 text-orange-800',
                    room: 'bg-cyan-100 text-cyan-800',
                    payment: 'bg-green-100 text-green-800',
                    maintenance: 'bg-yellow-100 text-yellow-800'
                  }
                  return (
                    <tr key={activity.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <span className={`px-3 py-2 text-sm font-semibold rounded-lg capitalize ${actionColors[activity.type] || 'bg-gray-100 text-gray-800'}`}>
                          {activity.type}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-2 text-sm font-semibold rounded-lg capitalize ${categoryColors[activity.title] || 'bg-gray-100 text-gray-800'}`}>
                          {activity.title}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-base text-gray-900">{activity.description}</td>
                      <td className="px-4 py-4 text-base text-gray-600">{new Date(activity.timestamp).toLocaleString('en-GB')}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 p-6 md:p-8 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">⚡ Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => router.push('/dashboard/properties')}
            className="px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            🏠 View My Houses
          </button>
          <button
            onClick={() => router.push('/dashboard/occupants')}
            className="px-6 py-4 bg-gradient-to-r from-slate-600 to-gray-600 text-white rounded-xl hover:from-slate-700 hover:to-gray-700 font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            👥 View Occupants
          </button>
          <button
            onClick={() => router.push('/dashboard/finances')}
            className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            💰 Check Money
          </button>
          <button
            onClick={() => router.push('/dashboard/settings')}
            className="px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            ⚙️ Settings
          </button>
        </div>
      </div>
    </div>
  )
}