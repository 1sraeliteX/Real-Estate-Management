import { NextRequest } from 'next/server'
import { AuthService } from './services/authService'

export async function getUser(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  if (!token) return null
  
  return await AuthService.validateSession(token)
}

export function requireAuth(handler: Function) {
  return async (request: NextRequest, context: any) => {
    const user = await getUser(request)
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    return handler(request, { ...context, user })
  }
}