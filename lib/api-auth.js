import { createClient } from '@supabase/supabase-js'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

// Initialize Supabase client for server-side operations
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

/**
 * Get authenticated user from NextAuth session and Supabase database
 * @param {Request} request - The incoming request object
 * @returns {Promise<{user: Object|null, error: string|null}>}
 */
export async function getAuthenticatedUser(request) {
  try {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('=== getAuthenticatedUser DEBUG ===')
    }
    
    // Get NextAuth session directly
    const session = await getServerSession(authOptions)
    
    if (process.env.NODE_ENV === 'development') {
      console.log('NextAuth session result:', session ? 'Found' : 'Not found')
      if (session?.user) {
        console.log('Session user email:', session.user.email)
        console.log('Session user ID:', session.user.id)
      }
    }

    if (!session?.user?.email) {
      return { user: null, error: 'Not authenticated' }
    }

    // Get user from database by email
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', session.user.email)
      .single()

    if (process.env.NODE_ENV === 'development') {
      console.log('Database lookup result:')
      console.log('- Error:', error ? error.message : 'None')
      console.log('- User found:', user ? 'Yes' : 'No')
      if (user) {
        console.log('- User ID:', user.id)
        console.log('- User email:', user.email)
      }
    }

    if (error || !user) {
      return { user: null, error: 'User not found in database' }
    }

    return { user, error: null }
  } catch (error) {
    console.error('Authentication error:', error)
    return { user: null, error: 'Authentication failed' }
  }
}

/**
 * Verify that an API key belongs to the authenticated user
 * @param {string} apiKeyId - The API key ID to verify
 * @param {string} userId - The user ID to check ownership against
 * @returns {Promise<{valid: boolean, error: string|null}>}
 */
export async function verifyApiKeyOwnership(apiKeyId, userId) {
  const { data: apiKey, error } = await supabaseAdmin
    .from('api_keys')
    .select('user_id')
    .eq('id', apiKeyId)
    .single()

  if (error || !apiKey) {
    return { valid: false, error: 'API key not found' }
  }

  if (apiKey.user_id !== userId) {
    return { valid: false, error: 'Access denied' }
  }

  return { valid: true, error: null }
}

/**
 * Generate a new API key with the smo- prefix
 * @returns {string} A new API key
 */
export function generateApiKey() {
  let result = 'smo-'
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < 48; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
} 