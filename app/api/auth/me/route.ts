import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/services/authService'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const user = await AuthService.validateSession(token)

    if (!user) {
      const response = NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
      response.cookies.delete('auth-token')
      return response
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Auth validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}