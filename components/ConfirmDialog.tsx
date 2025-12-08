'use client'

import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  type?: 'danger' | 'warning' | 'info'
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Yes, Continue',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'warning'
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const colors = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-orange-600 hover:bg-orange-700',
    info: 'bg-blue-600 hover:bg-blue-700'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-full ${type === 'danger' ? 'bg-red-100' : type === 'warning' ? 'bg-orange-100' : 'bg-blue-100'}`}>
            <AlertTriangle className={`w-6 h-6 ${type === 'danger' ? 'text-red-600' : type === 'warning' ? 'text-orange-600' : 'text-blue-600'}`} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        
        <p className="text-gray-700 mb-6 text-lg">{message}</p>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold text-lg"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 text-white rounded-lg font-semibold text-lg ${colors[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
