import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { getAuthenticatedUser, supabaseAdmin } from '@/lib/api-auth'

export async function GET(request) {
  // Only allow in development or with explicit flag
  if (process.env.NODE_ENV === 'production' && !process.env.ENABLE_DEBUG) {
    return NextResponse.json({ error: 'Debug endpoint disabled in production' }, { status: 403 })
  }

  try {
    // Test JWT token extraction
    const cookies = request.headers.get('cookie') || ''
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
    if (token?.email) {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', token.email)
        .single()

      user = data
    }

    // Test full authentication helper
    const { user: authUser, error: authError } = await getAuthenticatedUser(request)

    return NextResponse.json({
      cookies: cookies ? 'Present' : 'Missing',
      token: token ? {
        email: token.email,
        name: token.name,
        sub: token.sub
      } : null,
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name
      } : null,
      authHelper: {
        success: !!authUser,
        error: authError,
        user: authUser ? {
          id: authUser.id,
          email: authUser.email,
          name: authUser.name
        } : null
      },
      env: {
        nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
        supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing'
      }
    })
  } catch (error) {
    console.error('Debug endpoint error:', error)
    return NextResponse.json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : 'Hidden in production'
    }, { status: 500 })
  }
} 