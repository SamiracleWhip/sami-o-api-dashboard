import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('Testing database connection...')
    
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1)
    
    if (connectionError) {
      console.error('Connection error:', connectionError)
      return NextResponse.json({ 
        error: 'Database connection failed', 
        details: connectionError 
      }, { status: 500 })
    }
    
    // Test insert permissions
    const testUser = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      image: 'https://example.com/avatar.jpg',
      email_verified: new Date().toISOString(),
      provider: 'google',
      provider_account_id: 'test-123',
    }
    
    const { data: insertResult, error: insertError } = await supabaseAdmin
      .from('users')
      .insert([testUser])
      .select()
      .single()
    
    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ 
        error: 'Insert failed', 
        details: insertError 
      }, { status: 500 })
    }
    
    // Clean up test user
    await supabaseAdmin
      .from('users')
      .delete()
      .eq('email', testUser.email)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection and permissions working',
      testResult: insertResult
    })
    
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({ 
      error: 'Test failed', 
      details: error.message 
    }, { status: 500 })
  }
} 