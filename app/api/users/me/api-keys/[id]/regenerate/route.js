import { NextResponse } from 'next/server'
import { getAuthenticatedUser, verifyApiKeyOwnership, generateApiKey } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

// POST /api/users/me/api-keys/[id]/regenerate - Regenerate API key
export async function POST(request, { params }) {
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

    // Generate new API key
    const newApiKey = generateApiKey()

    // Update the API key with new value and reset usage
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .update({
        api_key: newApiKey,
        usage_count: 0,
        last_used: null
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error regenerating API key:', error)
      return NextResponse.json({ error: 'Failed to regenerate API key' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in POST /api/users/me/api-keys/[id]/regenerate:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 