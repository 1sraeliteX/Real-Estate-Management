import { NextRequest, NextResponse } from 'next/server'
import { PropertyService } from '@/lib/services/propertyService'
import { AuthService } from '@/lib/services/authService'
import { ActivityService } from '@/lib/services/activityService'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await PropertyService.getPropertyById(params.id)
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ property })
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

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const property = await PropertyService.deleteProperty(params.id)

    // Log activity
    await ActivityService.logPropertyActivity('deleted', property.name, user.id)

    return NextResponse.json({ property })
  } catch (error) {
    console.error('Delete property error:', error)
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}