import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/services/authService'
import { UserService } from '@/lib/services/userService'

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

    const profile = await UserService.getUserById(user.id)
    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
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

    const profileData = await request.json()
    const updatedProfile = await UserService.updateUserProfile(user.id, profileData)
    
    return NextResponse.json({ profile: updatedProfile })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}