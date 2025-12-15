import { User } from '@prisma/client'

export interface LoginResponse {
  user: User
  message: string
}

export class AuthClient {
  static async login(email: string): Promise<LoginResponse> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error((error as any)?.error || 'Login failed')
    }

    return await response.json()
  }

  static async logout(): Promise<void> {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error('Logout failed')
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch('/api/auth/me')
      
      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return data.user
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  static async updateProfile(profileData: Partial<User>): Promise<User> {
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error((error as any)?.error || 'Profile update failed')
    }

    const data = await response.json()
    return data.profile
  }

  static async getUserSettings() {
    const response = await fetch('/api/user/settings')
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error((error as any)?.error || 'Failed to get settings')
    }

    const data = await response.json()
    return data.settings
  }

  static async updateUserSettings(settings: any) {
    const response = await fetch('/api/user/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error((error as any)?.error || 'Settings update failed')
    }

    const data = await response.json()
    return data.settings
  }
}