import { NextRequest, NextResponse } from 'next/server'
import { PropertyService } from '@/lib/services/propertyService'
import { AuthService } from '@/lib/services/authService'
import { ActivityService } from '@/lib/services/activityService'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const includeRelations = searchParams.get('includeRelations') === 'true'
    
    const property = await PropertyService.getPropertyById(params.id, includeRelations)
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ property }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    })
  } catch (error) {
    console.error('Get property error:', error)
    return NextResponse.json(
      { error: 'Failed to get property' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const property = await PropertyService.updateProperty(params.id, propertyData)

    // Log activity
    await ActivityService.logPropertyActivity('updated', property.name, user.id)

    return NextResponse.json({ property })
  } catch (error) {
    console.error('Update property error:', error)
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('session')?.value
    const user = token ? await AuthService.validateSession(token) : null

    // For development, allow deletion without authentication
    const authEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true'
    if (authEnabled && !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const property = await PropertyService.deleteProperty(params.id)

    // Log activity if user is authenticated
    if (user) {
      await ActivityService.logPropertyActivity('deleted', property.name, user.id)
    }

    return NextResponse.json({ property })
  } catch (error) {
    console.error('Delete property error:', error)
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}