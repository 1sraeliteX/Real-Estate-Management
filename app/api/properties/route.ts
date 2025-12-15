import { NextRequest, NextResponse } from 'next/server'
import { PropertyService } from '@/lib/services/propertyService'
import { AuthService } from '@/lib/services/authService'
import { ActivityService } from '@/lib/services/activityService'
import { validateProperty } from '@/lib/validation'
import { handleApiError } from '@/lib/errorHandler'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const includeStats = searchParams.get('includeStats') === 'true'
    
    // Only validate session if needed for user-specific data
    let user = null
    const token = request.cookies.get('session')?.value
    if (token) {
      try {
        user = await AuthService.validateSession(token)
      } catch (error) {
        // Continue without user context if session validation fails
        // Session validation failed, continue without user context
      }
    }

    let properties
    
    if (search) {
      properties = await PropertyService.searchProperties(search, user?.id)
    } else if (type) {
      properties = await PropertyService.getPropertiesByType(type, user?.id)
    } else {
      properties = await PropertyService.getAllProperties(user?.id)
    }

    const response: any = { properties }
    
    // Include stats if requested to reduce API calls
    if (includeStats) {
      response.stats = await PropertyService.getPropertyStats(user?.id)
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('session')?.value
    const user = token ? await AuthService.validateSession(token) : null

    const { rooms, ...propertyData } = await request.json()
    
    // Validate property data
    const validation = validateProperty(propertyData)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      )
    }
    
    // For development/testing, don't include userId if no user is authenticated
    // This avoids foreign key constraint issues
    const createData = {
      ...propertyData,
      ...(user?.id && { userId: user.id }) // Only include userId if user exists
    }
    
    const property = await PropertyService.createPropertyWithRooms(createData, rooms)

    // Log activity if user is authenticated
    if (user) {
      await ActivityService.logPropertyActivity('created', property.name, user.id)
    }

    return NextResponse.json({ property })
  } catch (error) {
    return handleApiError(error)
  }
}