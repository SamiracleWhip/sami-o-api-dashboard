import { getToken } from 'next-auth/jwt'
import { getUserByEmail } from './user-manager'

/**
 * Get the current authenticated user from the session in API routes
 * @param {Request} request - The incoming request object
 * @returns {Promise<{user: Object|null, error: string|null}>}
 */
export async function getCurrentUser(request) {
  try {
    if (!request) {
      return { user: null, error: 'Request object is required' }
    }

    // Get the token from NextAuth.js JWT
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    if (!token?.email) {
      return { user: null, error: 'Not authenticated' }
    }
    
    // Get full user data from database
    const user = await getUserByEmail(token.email)
    
    if (!user) {
      return { user: null, error: 'User not found in database' }
    }
    
    return { user, error: null }
  } catch (error) {
    console.error('Error getting current user:', error)
    return { user: null, error: 'Authentication error' }
  }
}

/**
 * Middleware to require authentication for API routes
 * @param {Request} request - The incoming request object
 * @returns {Promise<{user: Object, response: Response|null}>}
 */
export async function requireAuth(request) {
  const { user, error } = await getCurrentUser(request)
  
  if (!user) {
    return {
      user: null,
      response: new Response(
        JSON.stringify({ error: error || 'Authentication required' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
  }
  
  return { user, response: null }
}

/**
 * Check if a user has access to a specific resource
 * @param {string} userId - The user ID from the resource
 * @param {Object} currentUser - The current authenticated user
 * @returns {boolean}
 */
export function hasResourceAccess(userId, currentUser) {
  return currentUser && currentUser.id === userId
} 