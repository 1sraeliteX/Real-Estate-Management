'use client'

import { useState } from 'react'
import { AuthClient } from '@/lib/client/authClient'
import { LogIn } from 'lucide-react'

interface QuickLoginProps {
  onLoginSuccess?: () => void
}

export default function QuickLogin({ onLoginSuccess }: QuickLoginProps) {
  const [email, setEmail] = useState('admin@property.com')
  const [isLogging, setIsLogging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLogging(true)
    setError(null)

    try {
      await AuthClient.login(email)
      onLoginSuccess?.()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsLogging(false)
    }
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <LogIn className="w-5 h-5 text-yellow-600" />
        <h3 className="text-sm font-medium text-yellow-800">Authentication Required</h3>
      </div>
      <p className="text-sm text-yellow-700 mb-4">
        Please log in to update your profile.
      </p>
      
      <form onSubmit={handleLogin} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-3 py-2 border border-yellow-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          required
        />
        <button
          type="submit"
          disabled={isLogging}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white rounded-md text-sm font-medium transition-colors"
        >
          {isLogging ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </div>
  )
}