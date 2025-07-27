import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request) {
  try {
    // Check if supabaseAdmin is available
    if (!supabaseAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Supabase admin client not available',
        message: 'Missing environment variables'
      }, { status: 500 })
    }

    // Get cookies
    const cookies = request.headers.get('cookie') || ''
    
    // Test NextAuth session directly
    const session = await getServerSession(authOptions)
    
    // Test our authentication function
    const authResult = await getAuthenticatedUser(request)
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      cookies: {
        present: cookies ? 'Yes' : 'No',
        length: cookies.length,
        containsNextAuth: cookies.includes('next-auth') ? 'Yes' : 'No',
        containsSession: cookies.includes('session-token') ? 'Yes' : 'No',
        containsCsrf: cookies.includes('csrf-token') ? 'Yes' : 'No'
      },
      nextAuthSession: {
        exists: !!session,
        user: session?.user ? {
          email: session.user.email,
          name: session.user.name,
          id: session.user.id
        } : null,
        expires: session?.expires
      },
      authHelper: {
        success: authResult.user ? 'Yes' : 'No',
        error: authResult.error,
        user: authResult.user ? {
          id: authResult.user.id,
          email: authResult.user.email,
          name: authResult.user.name
        } : null
      },
      environment: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
        NODE_ENV: process.env.NODE_ENV
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Debug endpoint failed',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : 'Hidden in production'
    }, { status: 500 })
  }
} 