'use client'

import { useState, useMemo } from 'react'
import { DollarSign, TrendingUp, Clock, TrendingDown, Filter, ArrowLeft, Download } from 'lucide-react'
import { mockPayments, mockProperties, mockRooms } from '@/lib/mockApi'
import StatsCard from '@/components/StatsCard'
import { useRouter } from 'next/navigation'

type FilterStatus = 'all' | 'completed' | 'pending' | 'overdue'

export default function OffCampusFinancesPage() {
  const router = useRouter()
  const [selectedProperty, setSelectedProperty] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [showFilters, setShowFilters] = useState(false)

  const allPayments = useMemo(() => {
    const offCampusRooms = mockRooms.filter(room => 
      mockProperties.find(p => p.id === room.propertyId)?.type !== 'lodge'
    )

    return offCampusRooms.flatMap(room =>
      room.occupants.map((occ: any) => ({
        id: `room-${occ.id}`,
        propertyId: room.propertyId,
        propertyName: room.propertyName,
        tenantName: occ.name,
        amount: occ.amountPaid,
        type: 'rent' as const,
        method: 'bank' as const,
        status: occ.paymentStatus,
        dueDate: occ.rentExpiryDate,
        paidDate: occ.paymentStatus === 'completed' ? occ.rentStartDate : undefined,
        description: `Room ${room.roomNumber} - Rent payment`,
        balance: occ.totalRent - occ.amountPaid
      }))
    )
  }, [])

  const filteredPayments = useMemo(() => {
    return allPayments.filter(payment => {
      if (selectedProperty !== 'all' && payment.propertyId !== selectedProperty) return false
      if (statusFilter !== 'all' && payment.status !== statusFilter) return false
      return true
    })
  }, [allPayments, selectedProperty, statusFilter])

  const stats = useMemo(() => {
    const completed = filteredPayments.filter(p => p.status === 'completed')
    const pending = filteredPayments.filter(p => p.status === 'pending')
    const overdue = filteredPayments.filter(p => p.status === 'overdue')

    return {
      totalRevenue: completed.reduce((sum, p) => sum + p.amount, 0),
      pendingAmount: pending.reduce((sum, p) => sum + p.amount, 0),
      overdueAmount: overdue.reduce((sum, p) => sum + p.amount, 0),
      totalExpected: filteredPayments.reduce((sum, p) => sum + p.amount + (p.balance || 0), 0)
    }
  }, [filteredPayments])

  const propertyBreakdown = useMemo(() => {
    const breakdown = new Map<string, {
      propertyName: string
      collected: number
      pending: number
      overdue: number
    }>()

    filteredPayments.forEach(payment => {
      const existing = breakdown.get(payment.propertyId) || {
        propertyName: payment.propertyName,
        collected: 0,
        pending: 0,
        overdue: 0
      }

      if (payment.status === 'completed') {
        existing.collected += payment.amount
      } else if (payment.status === 'pending') {
        existing.pending += payment.amount
      } else if (payment.status === 'overdue') {
        existing.overdue += payment.amount
      }

      breakdown.set(payment.propertyId, existing)
    })

    return Array.from(breakdown.values())
  }, [filteredPayments])

  const offCampusProperties = mockProperties.filter(p => p.type !== 'lodge')

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800'
    }
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const handleExport = () => {
    const csv = [
      ['Property', 'Tenant', 'Type', 'Amount', 'Due Date', 'Paid Date', 'Status', 'Description'].join(','),
      ...filteredPayments.map(payment => [
        payment.propertyName,
        payment.tenantName,
        payment.type,
        payment.amount,
        payment.dueDate,
        payment.paidDate || 'N/A',
        payment.status,
        `"${payment.description}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `off-campus-finances-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <button
        onClick={() => router.push('/dashboard/finances')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Finances
      </button>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Off-Campus Finances</h1>
          <p className="text-gray-600">Financial overview for off-campus properties</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property</label>
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Properties</option>
                {offCampusProperties.map(prop => (
                  <option key={prop.id} value={prop.id}>{prop.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <StatsCard
          title="Total Revenue"
          value={`₦${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="green"
          subtitle="Collected payments"
        />
        <StatsCard
          title="Total Expected"
          value={`₦${stats.totalExpected.toLocaleString()}`}
          icon={TrendingUp}
          color="purple"
          subtitle="Total expected revenue"
        />
        <StatsCard
          title="Pending Amount"
          value={`₦${stats.pendingAmount.toLocaleString()}`}
          icon={Clock}
          color="yellow"
          subtitle="Awaiting payment"
        />
        <StatsCard
          title="Overdue Amount"
          value={`₦${stats.overdueAmount.toLocaleString()}`}
          icon={TrendingDown}
          color="red"
          subtitle="Requires attention"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Property Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Collected</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pending</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Overdue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {propertyBreakdown.map((prop, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{prop.propertyName}</td>
                  <td className="px-4 py-3 text-sm text-green-600 font-semibold">₦{prop.collected.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-yellow-600 font-semibold">₦{prop.pending.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-red-600 font-semibold">₦{prop.overdue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-bold">
                    ₦{(prop.collected + prop.pending + prop.overdue).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">All Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{payment.propertyName}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{payment.tenantName}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">₦{payment.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{payment.dueDate}</td>
                  <td className="px-4 py-3">{getStatusBadge(payment.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
