import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

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

// GET - Fetch all API keys
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const permission = searchParams.get('permission')

    let query = supabaseAdmin
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false })

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

    if (error) {
      console.error('Error fetching API keys:', error)
      return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET /api/api-keys:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new API key
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, description, permissions, status, keyType, usageLimit } = body

    // Validate required fields
    if (!name || !keyType) {
      return NextResponse.json({ error: 'Name and key type are required' }, { status: 400 })
    }

    const newApiKey = {
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

// PUT - Update API key
export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, name, description, permissions, status, keyType, usageLimit } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
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

// DELETE - Delete API key
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const ids = searchParams.get('ids')

    if (!id && !ids) {
      return NextResponse.json({ error: 'ID or IDs are required' }, { status: 400 })
    }

    let query = supabaseAdmin.from('api_keys').delete()

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