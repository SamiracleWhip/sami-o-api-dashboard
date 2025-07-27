import { createClient } from '@supabase/supabase-js'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { supabaseAdmin } from './supabase'

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

    // Check if supabaseAdmin is available
    if (!supabaseAdmin) {
      console.error('Supabase admin client not available - missing environment variables')
      return { user: null, error: 'Database configuration error' }
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

/**
 * Reset API key usage counts (typically called monthly)
 * @param {string} userId - Optional user ID to reset only their keys
 * @returns {Promise<{success: boolean, resetCount: number, error: string|null}>}
 */
export async function resetApiKeyUsage(userId = null) {
  try {
    let query = supabaseAdmin
      .from('api_keys')
      .update({ 
        usage_count: 0,
        updated_at: new Date().toISOString()
      })
    
    // If userId is provided, only reset that user's keys
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error resetting API key usage:', error)
      return { success: false, resetCount: 0, error: error.message }
    }
    
    return { success: true, resetCount: data?.length || 0, error: null }
  } catch (error) {
    console.error('Error in resetApiKeyUsage:', error)
    return { success: false, resetCount: 0, error: error.message }
  }
}

/**
 * Get API key usage statistics
 * @param {string} userId - Optional user ID to get stats for specific user
 * @returns {Promise<{totalKeys: number, activeKeys: number, totalUsage: number, error: string|null}>}
 */
export async function getApiKeyUsageStats(userId = null) {
  try {
    let query = supabaseAdmin
      .from('api_keys')
      .select('usage_count, status')
    
    // If userId is provided, only get stats for that user
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error getting API key usage stats:', error)
      return { totalKeys: 0, activeKeys: 0, totalUsage: 0, error: error.message }
    }
    
    const totalKeys = data.length
    const activeKeys = data.filter(key => key.status === 'active').length
    const totalUsage = data.reduce((sum, key) => sum + (key.usage_count || 0), 0)
    
    return { 
      totalKeys, 
      activeKeys, 
      totalUsage, 
      error: null 
    }
  } catch (error) {
    console.error('Error in getApiKeyUsageStats:', error)
    return { totalKeys: 0, activeKeys: 0, totalUsage: 0, error: error.message }
  }
} 

/**
 * Validate API key and check rate limits
 * @param {string} apiKey - The API key to validate
 * @returns {Promise<{valid: boolean, error: string|null, status: number, keyInfo: Object|null}>}
 */
export async function validateApiKey(apiKey) {
  if (!apiKey) {
    return { valid: false, error: 'API key is required', status: 400 }
  }

  // Check if supabaseAdmin is available
  if (!supabaseAdmin) {
    console.error('Supabase admin client not available - missing environment variables')
    return { valid: false, error: 'Database configuration error', status: 500 }
  }

  try {
    // First, get the current API key data
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .select(`
        id, 
        name, 
        status, 
        api_key, 
        usage_count, 
        usage_limit, 
        permissions,
        user_id,
        users!inner(id, name, email)
      `)
      .eq('api_key', apiKey)
      .eq('status', 'active')
      .single()

    if (error) {
      // If no matching record found
      if (error.code === 'PGRST116') {
        return { valid: false, error: 'Invalid API key', status: 401 }
      }
      
      console.error('Database error during API key validation:', error)
      return { valid: false, error: 'Database error occurred', status: 500 }
    }

    if (!data) {
      return { valid: false, error: 'Invalid API key', status: 401 }
    }

    // Check if usage limit is exceeded
    if (data.usage_count >= data.usage_limit) {
      return { 
        valid: false, 
        error: `Rate limit exceeded. API key usage limit is ${data.usage_limit} requests. Current usage: ${data.usage_count}`, 
        status: 429,
        keyInfo: {
          id: data.id,
          name: data.name,
          permissions: data.permissions,
          userId: data.user_id,
          user: data.users,
          usageCount: data.usage_count,
          usageLimit: data.usage_limit
        }
      }
    }

    // Increment usage count atomically using a transaction
    const { error: updateError } = await supabaseAdmin
      .from('api_keys')
      .update({ 
        usage_count: data.usage_count + 1,
        last_used: new Date().toISOString()
      })
      .eq('id', data.id)
      .eq('usage_count', data.usage_count) // Optimistic locking to prevent race conditions

    if (updateError) {
      console.error('Error updating usage count:', updateError)
      return { valid: false, error: 'Failed to update usage count', status: 500 }
    }

    return { 
      valid: true, 
      keyInfo: {
        id: data.id,
        name: data.name,
        permissions: data.permissions,
        userId: data.user_id,
        user: data.users,
        usageCount: data.usage_count + 1,
        usageLimit: data.usage_limit
      }
    }
  } catch (error) {
    console.error('API key validation error:', error)
    return { valid: false, error: 'Internal server error', status: 500 }
  }
}

/**
 * Generate rate limit headers for API responses
 * @param {Object} keyInfo - The API key information object
 * @returns {Object} Headers object with rate limit information
 */
export function generateRateLimitHeaders(keyInfo) {
  return {
    'X-RateLimit-Limit': keyInfo.usageLimit,
    'X-RateLimit-Remaining': Math.max(0, keyInfo.usageLimit - keyInfo.usageCount),
    'X-RateLimit-Reset': new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Reset in 24 hours
  }
}

/**
 * Create rate limit error response
 * @param {Object} validation - The validation result from validateApiKey
 * @returns {Object} Response object with error and headers
 */
export function createRateLimitResponse(validation) {
  const responseHeaders = {}
  if (validation.status === 429 && validation.keyInfo) {
    Object.assign(responseHeaders, generateRateLimitHeaders(validation.keyInfo))
  }
  
  return {
    body: { 
      error: validation.error,
      ...(validation.status === 429 && validation.keyInfo ? {
        rateLimitInfo: {
          limit: validation.keyInfo.usageLimit,
          used: validation.keyInfo.usageCount,
          remaining: Math.max(0, validation.keyInfo.usageLimit - validation.keyInfo.usageCount)
        }
      } : {})
    },
    status: validation.status,
    headers: responseHeaders
  }
} 