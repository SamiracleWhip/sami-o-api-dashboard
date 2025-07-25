import { NextResponse } from 'next/server'
import { getAuthenticatedUser, verifyApiKeyOwnership, supabaseAdmin } from '@/lib/api-auth'

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
    const { name, description, permissions, status, keyType, usageLimit } = body

    // Verify ownership
    const { valid, error: ownershipError } = await verifyApiKeyOwnership(id, user.id)
    if (!valid) {
      return NextResponse.json({ error: ownershipError }, { status: ownershipError === 'API key not found' ? 404 : 403 })
    }

    // Prepare updates
    const updates = {
      name,
      description,
      permissions,
      status,
      key_type: keyType,
      usage_limit: parseInt(usageLimit)
    }

    // Remove undefined values
    Object.keys(updates).forEach(key => {
      if (updates[key] === undefined) {
        delete updates[key]
      }
    })

    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
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