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

export async function POST() {
  try {
    console.log('Creating test API key...')
    
    // Get current user (optional for test keys)
    const { user, error: authError } = await getCurrentUser()
    
    // For demonstration purposes, we'll create a temporary user if none exists
    // In a real application, you might want to require authentication
    let userId = user?.id
    
    if (!userId) {
      // Create a temporary demo user for anonymous test keys
      const tempUser = {
        name: 'Demo User',
        email: `demo-${Date.now()}@temp.local`,
        image: null,
        email_verified: new Date().toISOString(),
        provider: 'demo',
        provider_account_id: `demo-${Date.now()}`,
      }
      
      const { data: createdUser, error: userError } = await supabaseAdmin
        .from('users')
        .insert([tempUser])
        .select()
        .single()
      
      if (userError) {
        console.error('Error creating demo user:', userError)
        return NextResponse.json({ 
          error: 'Failed to create demo user for test key',
          details: userError 
        }, { status: 500 })
      }
      
      userId = createdUser.id
      console.log('Created temporary demo user for test key:', userId)
    }
    
    const testApiKey = {
      user_id: userId,
      name: user ? 'Test Demo Key' : 'Anonymous Test Key',
      description: user 
        ? 'Auto-generated for API testing' 
        : 'Temporary test key for demo purposes',
      permissions: 'read',
      status: 'active',
      key_type: 'development',
      usage_limit: user ? 1000 : 10, // Limit anonymous keys to 10 uses
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
        status: data.status,
        isAuthenticated: !!user
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
    usage: 'curl -X POST http://localhost:3001/api/create-test-key',
    note: 'Test keys will be associated with your account if logged in, or created as temporary demo keys if anonymous'
  })
} 