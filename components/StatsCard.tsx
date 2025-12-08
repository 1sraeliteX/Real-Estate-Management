import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  subtitle?: string
}

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  red: 'bg-red-100 text-red-600',
  purple: 'bg-purple-100 text-purple-600'
}

export default function StatsCard({ title, value, icon: Icon, color, subtitle }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}
