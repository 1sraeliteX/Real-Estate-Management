'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@prisma/client'
import { AuthClient } from '@/lib/client/authClient'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false) // Start as false to avoid initial API call

  const checkAuth = async () => {
    try {
      setIsLoading(true)
      const currentUser = await AuthClient.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null) // Explicitly set to null on error
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const result = await AuthClient.login(email)
      setUser(result.user)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    try {
      const result = await AuthClient.login(email) // Using existing login for demo
      setUser(result.user)
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await AuthClient.logout()
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
      setUser(null) // Still clear user on logout error
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}