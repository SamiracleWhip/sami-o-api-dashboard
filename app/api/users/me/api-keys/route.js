import { NextResponse } from 'next/server'
import { getAuthenticatedUser, generateApiKey, supabaseAdmin } from '@/lib/api-auth'

// GET /api/users/me/api-keys - Fetch user's API keys
export async function GET(request) {
  try {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('=== API KEYS ENDPOINT DEBUG ===')
      console.log('Request URL:', request.url)
    }
    
    // Authenticate user
    const { user, error: authError } = await getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: authError }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const permission = searchParams.get('permission')

    // Build query with user filter
    let query = supabaseAdmin
      .from('api_keys')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,api_key.ilike.%${search}%`)
    }

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (permission && permission !== 'all') {
      query = query.eq('permissions', permission)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase query error:', error)
      return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 })
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Query successful, found', data?.length || 0, 'API keys')
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET /api/users/me/api-keys:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/users/me/api-keys - Create new API key
export async function POST(request) {
  try {
    // Authenticate user
    const { user, error: authError } = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: authError }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, permissions, status, keyType } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Generate API key
    const apiKey = generateApiKey()

    // Create API key in database
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .insert({
        user_id: user.id,
        name,
        description: description || '',
        permissions: permissions || 'read',
        status: status || 'active',
        key_type: keyType || 'development',
        api_key: apiKey,
        usage_limit: 25, // Default usage limit
        usage_count: 0
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating API key:', error)
      return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/users/me/api-keys:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 