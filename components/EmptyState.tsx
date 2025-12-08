'use client'

import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  emoji?: string
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  emoji = '📭'
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gray-100 rounded-full p-6 mb-6">
        <Icon className="w-16 h-16 text-gray-400" />
      </div>
      
      <h3 className="text-3xl font-bold text-gray-900 mb-3">
        {emoji} {title}
      </h3>
      
      <p className="text-xl text-gray-600 text-center max-w-md mb-8">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
