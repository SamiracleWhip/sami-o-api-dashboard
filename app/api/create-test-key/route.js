import { NextResponse } from 'next/server'
import { getAuthenticatedUser, generateApiKey, supabaseAdmin } from '@/lib/api-auth'

export async function POST(request) {
  try {
    console.log('Creating test API key...')
    
    // Get authenticated user
    const { user, error: authError } = await getAuthenticatedUser(request)
    
    if (!user) {
      // Allow unauthenticated users to create test keys with limited functionality
      console.log('No authenticated user found, creating anonymous test key')
      
      // Create a temporary test key (not stored in database)
      const testApiKey = generateApiKey()
      
      return NextResponse.json({
        success: true,
        apiKey: testApiKey,
        message: 'Test API key generated (temporary)',
        note: 'This is a temporary test key. Sign up for a free account to create persistent API keys.'
      })
    }

    console.log('Authenticated user found:', user.email)

    // Create a test API key for the authenticated user
    const testApiKey = {
      user_id: user.id,
      name: 'Test API Key',
      description: 'Automatically generated test key for API exploration',
      permissions: 'read',
      status: 'active',
      key_type: 'development',
      usage_limit: 25, // Lower limit for test keys
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
        details: error.message 
      }, { status: 500 })
    }

    console.log('Test API key created successfully:', data.id)

    return NextResponse.json({
      success: true,
      apiKey: data.api_key,
      keyInfo: {
        id: data.id,
        name: data.name,
        permissions: data.permissions,
        usageLimit: data.usage_limit
      },
      message: 'Test API key created successfully!'
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
    usage: 'curl -X POST http://localhost:3001/api/create-test-key',
    note: 'Authentication required - you must be signed in to create test keys'
  })
} 