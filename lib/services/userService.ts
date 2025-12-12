import { prisma } from '../database'
import { User, UserSettings } from '@prisma/client'

export interface UserProfile {
  id?: string
  name?: string
  email?: string
  phone?: string
  company?: string
  role?: string
  bio?: string
  avatar?: string
}

export class UserService {
  static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return await prisma.user.create({
      data: userData,
    })
  }

  static async getUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        settings: true,
      },
    })
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        settings: true,
      },
    })
  }

  static async updateUserProfile(id: string, profileData: Partial<UserProfile>): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: profileData,
    })
  }

  static async getUserSettings(userId: string): Promise<UserSettings | null> {
    return await prisma.userSettings.findUnique({
      where: { userId },
    })
  }

  static async updateUserSettings(
    userId: string, 
    settings: Partial<Omit<UserSettings, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<UserSettings> {
    return await prisma.userSettings.upsert({
      where: { userId },
      update: settings,
      create: {
        userId,
        ...settings,
      },
    })
  }

  static async markWelcomeGuideAsSeen(userId: string): Promise<void> {
    await this.updateUserSettings(userId, { hasSeenWelcomeGuide: true })
  }
}