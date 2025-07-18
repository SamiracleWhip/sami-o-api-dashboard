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

export async function POST() {
  try {
    console.log('Creating test API key...')
    
    const testApiKey = {
      name: 'Test Demo Key',
      description: 'Auto-generated for API testing',
      permissions: 'read',
      status: 'active',
      key_type: 'development',
      usage_limit: 1000,
      api_key: generateApiKey(),
      usage_count: 0
    }

    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .insert([testApiKey])
      .select()
      .single()

    if (error) {
      console.error('Error creating test API key:', error)
      return NextResponse.json({ 
        error: 'Failed to create test API key',
        details: error 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Test API key created successfully!',
      apiKey: data.api_key,
      keyInfo: {
        name: data.name,
        permissions: data.permissions,
        usageLimit: data.usage_limit,
        status: data.status
      }
    })

  } catch (error) {
    console.error('Error in create-test-key:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to create a test API key',
    usage: 'curl -X POST http://localhost:3001/api/create-test-key'
  })
} 