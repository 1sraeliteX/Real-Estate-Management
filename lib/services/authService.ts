import { prisma } from '../database'
import { User, Session } from '@prisma/client'
import { UserService } from './userService'

export class AuthService {
  static async createSession(userId: string, expiresAt: Date): Promise<Session> {
    const token = this.generateToken()
    
    return await prisma.session.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    })
  }

  static async getSessionByToken(token: string): Promise<(Session & { user: User }) | null> {
    return await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    })
  }

  static async deleteSession(token: string): Promise<void> {
    await prisma.session.delete({
      where: { token },
    })
  }

  static async deleteExpiredSessions(): Promise<void> {
    await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    })
  }

  static async validateSession(token: string): Promise<User | null> {
    const session = await this.getSessionByToken(token)
    
    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await this.deleteSession(token)
      }
      return null
    }

    return session.user
  }

  static async login(email: string): Promise<{ user: User; token: string } | null> {
    let user = await UserService.getUserByEmail(email)
    
    if (!user) {
      // Create user if doesn't exist (for demo purposes)
      user = await UserService.createUser({
        email,
        name: email.split('@')[0],
        phone: null,
        company: null,
        role: null,
        bio: null,
        avatar: null,
        address: null
      })
      
      // Create default settings
      await UserService.updateUserSettings(user.id, {})
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // 30 days

    const session = await this.createSession(user.id, expiresAt)
    
    return {
      user,
      token: session.token,
    }
  }

  static async logout(token: string): Promise<void> {
    await this.deleteSession(token)
  }

  private static generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }
}