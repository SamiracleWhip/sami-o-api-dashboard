import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'

// Helper function to generate API key
function generateApiKey() {
  let result = 'smo-'
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < 48; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

// GET - Fetch user's API keys
export async function GET(request) {
  try {
    console.log('=== API KEYS GET REQUEST ===')
    console.log('Request URL:', request.url)
    console.log('Request headers:', Object.fromEntries(request.headers.entries()))
    
    // Get current user
    const { user, error: authError } = await getCurrentUser(request)
    console.log('Auth result:', { user: user ? { id: user.id, email: user.email } : null, authError })
    
    if (!user) {
      console.log('Authentication failed:', authError)
      return NextResponse.json({ 
        error: authError || 'Authentication required',
        debug: {
          authError,
          hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
          timestamp: new Date().toISOString()
        }
      }, { status: 401 })
    }

    console.log('User authenticated successfully:', user.email)

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const permission = searchParams.get('permission')

    let query = supabaseAdmin
      .from('api_keys')
      .select('*')
      .eq('user_id', user.id)  // Filter by user ID
      .order('created_at', { ascending: false })

    console.log('Querying for user_id:', user.id)

    // Apply search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,api_key.ilike.%${search}%`)
    }

    // Apply status filter
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Apply permission filter
    if (permission && permission !== 'all') {
      query = query.eq('permissions', permission)
    }

    const { data, error } = await query
    console.log('Supabase query result:', { data: data?.length || 0, error })

    if (error) {
      console.error('Error fetching API keys:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch API keys',
        debug: {
          supabaseError: error,
          userId: user.id
        }
      }, { status: 500 })
    }

    console.log('Successfully fetched', data?.length || 0, 'API keys')
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET /api/api-keys:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      debug: {
        message: error.message,
        stack: error.stack
      }
    }, { status: 500 })
  }
}

// POST - Create new API key for the current user
export async function POST(request) {
  try {
    // Get current user
    const { user, error: authError } = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: authError || 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, permissions, status, keyType, usageLimit } = body

    // Validate required fields
    if (!name || !keyType) {
      return NextResponse.json({ error: 'Name and key type are required' }, { status: 400 })
    }

    const newApiKey = {
      user_id: user.id,  // Associate with current user
      name,
      description: description || `${keyType} API key`,
      permissions: keyType === 'production' ? 'write' : 'read',
      status: status || 'active',
      key_type: keyType,
      usage_limit: parseInt(usageLimit) || 1000,
      api_key: generateApiKey(),
      usage_count: 0
    }

    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .insert([newApiKey])
      .select()
      .single()

    if (error) {
      console.error('Error creating API key:', error)
      return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/api-keys:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update user's API key
export async function PUT(request) {
  try {
    // Get current user
    const { user, error: authError } = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: authError || 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, description, permissions, status, keyType, usageLimit } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    // Verify the API key belongs to the current user
    const { data: existingKey, error: verifyError } = await supabaseAdmin
      .from('api_keys')
      .select('user_id')
      .eq('id', id)
      .single()

    if (verifyError || !existingKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 })
    }

    if (existingKey.user_id !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const updates = {
      name,
      description,
      permissions,
      status,
      key_type: keyType,
      usage_limit: parseInt(usageLimit)
    }

    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)  // Double-check user ownership
      .select()
      .single()

    if (error) {
      console.error('Error updating API key:', error)
      return NextResponse.json({ error: 'Failed to update API key' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in PUT /api/api-keys:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete user's API key(s)
export async function DELETE(request) {
  try {
    // Get current user
    const { user, error: authError } = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: authError || 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const ids = searchParams.get('ids')

    if (!id && !ids) {
      return NextResponse.json({ error: 'ID or IDs are required' }, { status: 400 })
    }

    let query = supabaseAdmin
      .from('api_keys')
      .delete()
      .eq('user_id', user.id)  // Ensure user can only delete their own keys

    if (ids) {
      // Bulk delete
      const idArray = ids.split(',')
      query = query.in('id', idArray)
    } else {
      // Single delete
      query = query.eq('id', id)
    }

    const { error } = await query

    if (error) {
      console.error('Error deleting API key(s):', error)
      return NextResponse.json({ error: 'Failed to delete API key(s)' }, { status: 500 })
    }

    return NextResponse.json({ message: 'API key(s) deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/api-keys:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 