import { NextResponse } from 'next/server'
import { getAuthenticatedUser, verifyApiKeyOwnership } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/users/me/api-keys/[id] - Get specific API key
export async function GET(request, { params }) {
  try {
    // Authenticate user
    const { user, error: authError } = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: authError }, { status: 401 })
    }

    const { id } = params

    // Verify ownership and get API key
    const { data: apiKey, error } = await supabaseAdmin
      .from('api_keys')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error || !apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 })
    }

    return NextResponse.json(apiKey)
  } catch (error) {
    console.error('Error in GET /api/users/me/api-keys/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/users/me/api-keys/[id] - Update specific API key
export async function PUT(request, { params }) {
  try {
    // Authenticate user
    const { user, error: authError } = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: authError }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { name, description, permissions, status, keyType } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const ownershipCheck = await verifyApiKeyOwnership(id, user.id)
    if (!ownershipCheck.valid) {
      return NextResponse.json(
        { error: ownershipCheck.error },
        { status: 403 }
      )
    }

    // Update API key
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .update({
        name,
        description: description || '',
        permissions: permissions || 'read',
        status: status || 'active',
        key_type: keyType || 'development'
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating API key:', error)
      return NextResponse.json({ error: 'Failed to update API key' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in PUT /api/users/me/api-keys/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/users/me/api-keys/[id] - Delete specific API key
export async function DELETE(request, { params }) {
  try {
    // Authenticate user
    const { user, error: authError } = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: authError }, { status: 401 })
    }

    const { id } = params

    // Verify ownership
    const { valid, error: ownershipError } = await verifyApiKeyOwnership(id, user.id)
    if (!valid) {
      return NextResponse.json({ error: ownershipError }, { status: ownershipError === 'API key not found' ? 404 : 403 })
    }

    // Delete the API key
    const { error } = await supabaseAdmin
      .from('api_keys')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting API key:', error)
      return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 })
    }

    return NextResponse.json({ message: 'API key deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/users/me/api-keys/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 