import { NextRequest, NextResponse } from 'next/server'
import { PropertyService } from '@/lib/services/propertyService'
import { AuthService } from '@/lib/services/authService'
import { ActivityService } from '@/lib/services/activityService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    
    // Get current user from session
    const token = request.cookies.get('session')?.value
    const user = token ? await AuthService.validateSession(token) : null

    let properties
    
    if (search) {
      properties = await PropertyService.searchProperties(search, user?.id)
    } else if (type) {
      properties = await PropertyService.getPropertiesByType(type, user?.id)
    } else {
      properties = await PropertyService.getAllProperties(user?.id)
    }

    return NextResponse.json({ properties })
  } catch (error) {
    console.error('Get properties error:', error)
    return NextResponse.json(
      { error: 'Failed to get properties' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('session')?.value
    const user = token ? await AuthService.validateSession(token) : null

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const propertyData = await request.json()
    
    const property = await PropertyService.createProperty({
      ...propertyData,
      userId: user.id
    })

    // Log activity
    await ActivityService.logPropertyActivity('created', property.name, user.id)

    return NextResponse.json({ property })
  } catch (error) {
    console.error('Create property error:', error)
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    )
  }
}