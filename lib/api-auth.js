import { createClient } from '@supabase/supabase-js'
import { getToken } from 'next-auth/jwt'

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
 * Get authenticated user from JWT token and Supabase database
 * @param {Request} request - The incoming request object
 * @returns {Promise<{user: Object|null, error: string|null}>}
 */
export async function getAuthenticatedUser(request) {
  try {
    console.log('=== getAuthenticatedUser DEBUG ===')
    
    // Extract cookies and create mock req object for getToken
    const cookies = request.headers.get('cookie') || ''
    console.log('Cookies present:', cookies ? 'Yes' : 'No')
    console.log('Cookie header length:', cookies.length)
    
    const mockReq = {
      headers: {
        cookie: cookies,
        ...Object.fromEntries(request.headers.entries())
      }
    }

    console.log('Environment check:')
    console.log('- NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing')
    console.log('- SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing')
    console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing')

    // Get JWT token
    console.log('Attempting to get JWT token...')
    const token = await getToken({
      req: mockReq,
      secret: process.env.NEXTAUTH_SECRET
    })

    console.log('JWT token result:', token ? 'Found' : 'Not found')
    if (token) {
      console.log('Token email:', token.email)
      console.log('Token keys:', Object.keys(token))
    }

    if (!token?.email) {
      console.log('No token or email found, returning not authenticated')
      return { user: null, error: 'Not authenticated' }
    }

    console.log('Looking up user in database by email:', token.email)
    // Get user from database by email
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', token.email)
      .single()

    console.log('Database lookup result:')
    console.log('- Error:', error ? error.message : 'None')
    console.log('- User found:', user ? 'Yes' : 'No')
    if (user) {
      console.log('- User ID:', user.id)
      console.log('- User email:', user.email)
    }

    if (error || !user) {
      console.log('User not found in database, returning error')
      return { user: null, error: 'User not found in database' }
    }

    console.log('Authentication successful for user:', user.email)
    return { user, error: null }
  } catch (error) {
    console.error('Authentication error:', error)
    console.error('Error stack:', error.stack)
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