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

// POST - Regenerate user's API key
export async function POST(request) {
  try {
    // Get current authenticated user
    const { user, error: authError } = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: authError || 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { id } = body

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

    const newApiKey = generateApiKey()

    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .update({ 
        api_key: newApiKey,
        usage_count: 0,
        last_used: null
      })
      .eq('id', id)
      .eq('user_id', user.id)  // Double-check user ownership
      .select()
      .single()

    if (error) {
      console.error('Error regenerating API key:', error)
      return NextResponse.json({ error: 'Failed to regenerate API key' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in POST /api/api-keys/regenerate:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}