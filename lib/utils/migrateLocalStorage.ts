/**
 * Migration utility to move data from localStorage to database
 */

import { AuthClient } from '../client/authClient'
import { SettingsClient } from '../client/settingsClient'
import { PropertyClient } from '../client/propertyClient'
import { ActivityClient } from '../client/activityClient'

export class LocalStorageMigration {
  static async migrateAllData(): Promise<void> {
    if (typeof window === 'undefined') return

    try {
      console.log('Starting localStorage migration...')
      
      // Check if migration has already been done
      const migrationDone = localStorage.getItem('db_migration_completed')
      if (migrationDone) {
        console.log('Migration already completed')
        return
      }

      await Promise.all([
        this.migrateUserProfile(),
        this.migrateUserSettings(),
        this.migratePropertyTypes(),
        this.migrateTwilioSettings(),
        this.migrateProperties(),
        this.migrateActivities()
      ])

      // Mark migration as completed
      localStorage.setItem('db_migration_completed', 'true')
      console.log('Migration completed successfully')

      // Optionally clear old localStorage data
      this.clearOldLocalStorageData()
    } catch (error) {
      console.error('Migration failed:', error)
    }
  }

  private static async migrateUserProfile(): Promise<void> {
    try {
      const savedProfile = localStorage.getItem('userProfile')
      if (savedProfile) {
        const profile = JSON.parse(savedProfile)
        await AuthClient.updateProfile({
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
          avatar: profile.avatar
        })
        console.log('User profile migrated')
      }
    } catch (error) {
      console.error('Failed to migrate user profile:', error)
    }
  }

  private static async migrateUserSettings(): Promise<void> {
    try {
      const appName = localStorage.getItem('appName')
      const reminderDays = localStorage.getItem('rentDueReminderDays')
      
      const settings: any = {}
      if (appName) settings.appName = appName
      if (reminderDays) settings.rentDueReminderDays = parseInt(reminderDays)

      if (Object.keys(settings).length > 0) {
        await AuthClient.updateUserSettings(settings)
        console.log('User settings migrated')
      }
    } catch (error) {
      console.error('Failed to migrate user settings:', error)
    }
  }

  private static async migratePropertyTypes(): Promise<void> {
    try {
      const savedTypes = localStorage.getItem('propertyTypes')
      if (savedTypes) {
        const types = JSON.parse(savedTypes)
        const defaultTypes = ['apartment', 'house', 'condo', 'commercial', 'lodge', 'studio']
        
        // Add custom types (not in default list)
        for (const type of types) {
          if (!defaultTypes.includes(type)) {
            try {
              await SettingsClient.addPropertyType(type)
            } catch (error) {
              // Type might already exist, continue
              console.log(`Property type ${type} already exists or failed to add`)
            }
          }
        }
        console.log('Property types migrated')
      }
    } catch (error) {
      console.error('Failed to migrate property types:', error)
    }
  }

  private static async migrateTwilioSettings(): Promise<void> {
    try {
      const savedTwilioSettings = localStorage.getItem('twilioSettings')
      if (savedTwilioSettings) {
        const settings = JSON.parse(savedTwilioSettings)
        await SettingsClient.updateTwilioSettings({
          accountSid: settings.accountSid,
          authToken: settings.authToken,
          phoneNumber: settings.phoneNumber,
          isEnabled: settings.enabled || false
        })
        console.log('Twilio settings migrated')
      }
    } catch (error) {
      console.error('Failed to migrate Twilio settings:', error)
    }
  }

  private static async migrateProperties(): Promise<void> {
    try {
      // Migrate from both old and new localStorage keys
      const customProperties = localStorage.getItem('customProperties')
      const mockProperties = localStorage.getItem('mock_properties')
      
      const propertiesToMigrate = []
      
      if (customProperties) {
        const parsed = JSON.parse(customProperties)
        propertiesToMigrate.push(...parsed)
      }
      
      if (mockProperties) {
        const parsed = JSON.parse(mockProperties)
        // Filter out default properties that might already exist
        const customOnly = parsed.filter((p: any) => 
          !['Sunset Apartments', 'Green Valley House'].includes(p.name)
        )
        propertiesToMigrate.push(...customOnly)
      }

      for (const property of propertiesToMigrate) {
        try {
          await PropertyClient.createProperty({
            name: property.name,
            address: property.address,
            type: property.type,
            status: property.status,
            yearlyRent: property.yearlyRent || property.rent || 0,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            area: property.area,
            description: property.description || '',
            amenities: property.amenities || '',
            images: property.images || JSON.stringify([]),
            yearBuilt: property.yearBuilt || new Date().getFullYear(),
            parkingSpaces: property.parkingSpaces || '0',
            numberOfRooms: property.numberOfRooms,
            numberOfKitchens: property.numberOfKitchens,
            numberOfBathrooms: property.numberOfBathrooms,
            waterAvailability: property.waterAvailability
          })
        } catch (error) {
          console.error(`Failed to migrate property ${property.name}:`, error)
        }
      }
      
      if (propertiesToMigrate.length > 0) {
        console.log(`Migrated ${propertiesToMigrate.length} properties`)
      }
    } catch (error) {
      console.error('Failed to migrate properties:', error)
    }
  }

  private static async migrateActivities(): Promise<void> {
    try {
      const savedActivities = localStorage.getItem('recentActivities')
      if (savedActivities) {
        const activities = JSON.parse(savedActivities)
        
        for (const activity of activities.slice(0, 20)) { // Migrate last 20 activities
          try {
            await ActivityClient.createActivity({
              type: activity.category || 'general',
              title: `${activity.category || 'Activity'} ${activity.type}`,
              description: activity.description,
              metadata: {
                originalType: activity.type,
                originalCategory: activity.category,
                migratedFrom: 'localStorage'
              }
            })
          } catch (error) {
            console.error(`Failed to migrate activity:`, error)
          }
        }
        console.log(`Migrated ${Math.min(activities.length, 20)} activities`)
      }
    } catch (error) {
      console.error('Failed to migrate activities:', error)
    }
  }

  private static clearOldLocalStorageData(): void {
    const keysToRemove = [
      'userProfile',
      'appName',
      'rentDueReminderDays',
      'propertyTypes',
      'twilioSettings',
      'customProperties',
      'mock_properties',
      'mock_rooms',
      'mock_occupants',
      'recentActivities',
      'properties_migration_done'
    ]

    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
    })

    console.log('Old localStorage data cleared')
  }

  // Method to check if migration is needed
  static needsMigration(): boolean {
    if (typeof window === 'undefined') return false
    
    const migrationDone = localStorage.getItem('db_migration_completed')
    if (migrationDone) return false

    // Check if any old data exists
    const keysToCheck = [
      'userProfile',
      'appName',
      'propertyTypes',
      'twilioSettings',
      'customProperties',
      'mock_properties',
      'recentActivities'
    ]

    return keysToCheck.some(key => localStorage.getItem(key) !== null)
  }
}