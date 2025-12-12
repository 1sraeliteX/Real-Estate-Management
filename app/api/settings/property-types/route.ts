import { NextRequest, NextResponse } from 'next/server'
import { SettingsService } from '@/lib/services/settingsService'

export async function GET() {
  try {
    const propertyTypes = await SettingsService.getPropertyTypes()
    return NextResponse.json({ propertyTypes })
  } catch (error) {
    console.error('Get property types error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Property type name is required' },
        { status: 400 }
      )
    }

    const propertyType = await SettingsService.addPropertyType(name)
    return NextResponse.json({ propertyType })
  } catch (error) {
    console.error('Add property type error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')

    if (!name) {
      return NextResponse.json(
        { error: 'Property type name is required' },
        { status: 400 }
      )
    }

    await SettingsService.removePropertyType(name)
    return NextResponse.json({ message: 'Property type deleted' })
  } catch (error) {
    console.error('Delete property type error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}