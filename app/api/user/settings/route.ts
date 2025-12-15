import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/services/authService'
import { UserService } from '@/lib/services/userService'
import { handleApiError } from '@/lib/errorHandler'

async function getAuthenticatedUser(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  if (!token) return null
  return await AuthService.validateSession(token)
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const settings = await UserService.getUserSettings(user.id)
    return NextResponse.json({ settings })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const settingsData = await request.json()
    const updatedSettings = await UserService.updateUserSettings(user.id, settingsData)
    
    return NextResponse.json({ settings: updatedSettings })
  } catch (error) {
    return handleApiError(error)
  }
}