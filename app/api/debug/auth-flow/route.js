import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request) {
  try {
    // Get cookies
    const cookies = request.headers.get('cookie') || ''
    
    // Test JWT token extraction
    const mockReq = {
      headers: {
        cookie: cookies,
        ...Object.fromEntries(request.headers.entries())
      }
    }

    const token = await getToken({
      req: mockReq,
      secret: process.env.NEXTAUTH_SECRET
    })

    // Test user lookup
    let user = null
    let userError = null
    if (token?.email) {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', token.email)
        .single()

      user = data
      userError = error
    }

    // Test full authentication
    const { user: authUser, error: authError } = await getAuthenticatedUser(request)

    // Check environment variables
    const envCheck = {
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing',
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
      SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing'
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      cookies: {
        present: cookies ? 'Yes' : 'No',
        length: cookies.length,
        containsNextAuth: cookies.includes('next-auth') ? 'Yes' : 'No'
      },
      jwt: {
        found: !!token,
        email: token?.email || null,
        name: token?.name || null,
        sub: token?.sub || null
      },
      database: {
        userFound: !!user,
        userError: userError?.message || null,
        user: user ? {
          id: user.id,
          email: user.email,
          name: user.name
        } : null
      },
      authentication: {
        success: !!authUser,
        error: authError,
        user: authUser ? {
          id: authUser.id,
          email: authUser.email,
          name: authUser.name
        } : null
      },
      environment: envCheck,
      recommendations: []
    })
  } catch (error) {
    console.error('Auth flow debug error:', error)
    return NextResponse.json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : 'Hidden in production'
    }, { status: 500 })
  }
} 