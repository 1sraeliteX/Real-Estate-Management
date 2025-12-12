import { prisma } from '../database'
import { AppSettings, PropertyType, TwilioSettings } from '@prisma/client'

export interface TwilioConfig {
  accountSid?: string
  authToken?: string
  phoneNumber?: string
  isEnabled: boolean
}

export class SettingsService {
  // App Settings
  static async getAppSetting(key: string): Promise<string | null> {
    const setting = await prisma.appSettings.findUnique({
      where: { key },
    })
    return setting?.value || null
  }

  static async setAppSetting(key: string, value: string, description?: string): Promise<AppSettings> {
    return await prisma.appSettings.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description },
    })
  }

  // Property Types
  static async getPropertyTypes(): Promise<PropertyType[]> {
    return await prisma.propertyType.findMany({
      orderBy: [
        { isDefault: 'desc' },
        { name: 'asc' },
      ],
    })
  }

  static async addPropertyType(name: string): Promise<PropertyType> {
    return await prisma.propertyType.create({
      data: {
        name: name.toLowerCase().trim(),
        isDefault: false,
      },
    })
  }

  static async removePropertyType(name: string): Promise<void> {
    await prisma.propertyType.delete({
      where: { name: name.toLowerCase().trim() },
    })
  }

  static async initializeDefaultPropertyTypes(): Promise<void> {
    const defaultTypes = [
      'apartment',
      'house', 
      'condo',
      'commercial',
      'lodge',
      'studio'
    ]

    for (const type of defaultTypes) {
      await prisma.propertyType.upsert({
        where: { name: type },
        update: {},
        create: {
          name: type,
          isDefault: true,
        },
      })
    }
  }

  // Twilio Settings
  static async getTwilioSettings(): Promise<TwilioSettings | null> {
    return await prisma.twilioSettings.findFirst()
  }

  static async updateTwilioSettings(settings: TwilioConfig): Promise<TwilioSettings> {
    const existing = await this.getTwilioSettings()
    
    if (existing) {
      return await prisma.twilioSettings.update({
        where: { id: existing.id },
        data: settings,
      })
    } else {
      return await prisma.twilioSettings.create({
        data: settings,
      })
    }
  }
}