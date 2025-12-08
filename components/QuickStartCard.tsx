'use client'

import { useRouter } from 'next/navigation'
import { Building2, Users, DollarSign, ArrowRight } from 'lucide-react'

export default function QuickStartCard() {
  const router = useRouter()

  const tasks = [
    {
      icon: <Building2 className="w-8 h-8" />,
      title: 'Add Your First House',
      description: 'Start by adding a property you own',
      action: () => router.push('/dashboard/properties'),
      color: 'blue',
      emoji: '🏠'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Add Your Tenants',
      description: 'Add people living in your properties',
      action: () => router.push('/dashboard/occupants'),
      color: 'purple',
      emoji: '👥'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Track Payments',
      description: 'See who has paid and who owes money',
      action: () => router.push('/dashboard/finances'),
      color: 'green',
      emoji: '💰'
    }
  ]

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200 p-6 md:p-8 shadow-lg">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">🚀 Getting Started</h2>
      <p className="text-gray-700 text-base md:text-lg mb-6">Follow these simple steps to set up your property management</p>
      
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <button
            key={index}
            onClick={task.action}
            className={`w-full bg-white rounded-xl p-5 border-2 border-${task.color}-200 hover:border-${task.color}-400 hover:shadow-lg transition-all text-left group`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full bg-${task.color}-100 text-${task.color}-600 group-hover:scale-110 transition-transform`}>
                {task.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {task.emoji} {task.title}
                </h3>
                <p className="text-gray-600 text-sm">{task.description}</p>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
