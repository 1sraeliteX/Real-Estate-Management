import { NextRequest, NextResponse } from 'next/server'
import { PropertyService } from '@/lib/services/propertyService'
import { AuthService } from '@/lib/services/authService'

export async function GET(request: NextRequest) {
  try {
    // Only validate session if needed for user-specific data
    let user = null
    const token = request.cookies.get('session')?.value
    if (token) {
      try {
        user = await AuthService.validateSession(token)
      } catch (error) {
        // Continue without user context if session validation fails
        console.warn('Session validation failed:', error)
      }
    }

    const stats = await PropertyService.getPropertyStats(user?.id)

    return NextResponse.json({ stats }, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600'
      }
    })
  } catch (error) {
    console.error('Get property stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get property stats' },
      { status: 500 }
    )
  }
}