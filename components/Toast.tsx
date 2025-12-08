'use client'

import { useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'warning'
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle className="w-6 h-6" />,
    error: <XCircle className="w-6 h-6" />,
    warning: <AlertCircle className="w-6 h-6" />
  }

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-orange-500'
  }

  return (
    <div className={`fixed top-4 right-4 z-50 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md animate-slide-in`}>
      {icons[type]}
      <p className="flex-1 font-medium">{message}</p>
      <button onClick={onClose} className="hover:bg-white/20 rounded p-1">
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}
