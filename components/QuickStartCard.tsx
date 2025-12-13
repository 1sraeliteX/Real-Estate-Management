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
    <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 rounded-3xl border-4 border-gradient-to-r from-blue-400 to-teal-500 p-8 md:p-10 shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-cyan-100/30 to-teal-100/30 animate-pulse"></div>
      <div className="relative z-10">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
          <span className="text-5xl animate-bounce inline-block">🚀</span> 
          <span className="text-blue-900">
            Getting Started
          </span>
        </h2>
        <p className="text-gray-800 text-lg md:text-xl font-semibold mb-8 leading-relaxed">
          ⚡ Follow these simple steps to set up your property management empire!
        </p>
        
        <div className="space-y-6">
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
    </div>
  )
}
