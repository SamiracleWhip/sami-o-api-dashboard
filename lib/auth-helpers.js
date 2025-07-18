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

    // Convert the new Request API to the format getToken expects
    const cookies = request.headers.get('cookie') || ''
    
    // Create a mock req object that mimics the old Node.js req format
    const mockReq = {
      headers: {
        cookie: cookies,
        ...Object.fromEntries(request.headers.entries())
      },
      cookies: parseCookies(cookies),
      url: request.url,
      method: request.method
    }

    // Get the token from NextAuth.js JWT
    const token = await getToken({ 
      req: mockReq, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    console.log('Token result:', token ? { email: token.email, sub: token.sub } : 'No token')
    
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
 * Helper function to parse cookies from cookie header
 * @param {string} cookieHeader - The cookie header string
 * @returns {Object} Parsed cookies object
 */
function parseCookies(cookieHeader) {
  const cookies = {}
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const parts = cookie.trim().split('=')
      if (parts.length === 2) {
        cookies[parts[0]] = decodeURIComponent(parts[1])
      }
    })
  }
  return cookies
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