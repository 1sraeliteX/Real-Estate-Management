import { NextRequest, NextResponse } from 'next/server'
import { SettingsService } from '@/lib/services/settingsService'

export async function GET() {
  try {
    const twilioSettings = await SettingsService.getTwilioSettings()
    return NextResponse.json({ twilioSettings })
  } catch (error) {
    console.error('Get Twilio settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const settingsData = await request.json()
    const updatedSettings = await SettingsService.updateTwilioSettings(settingsData)
    
    return NextResponse.json({ twilioSettings: updatedSettings })
  } catch (error) {
    console.error('Update Twilio settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}