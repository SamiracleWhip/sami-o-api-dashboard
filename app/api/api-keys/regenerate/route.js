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

// POST - Regenerate API key
export async function POST(request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
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