import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'
import { getToken } from 'next-auth/jwt'

export async function GET(request) {
  try {
    console.log('=== AUTH DEBUG TEST ===')
    
    // Test 1: Check raw token
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    console.log('Raw JWT token:', token)
    
    // Test 2: Check our getCurrentUser helper
    const { user, error } = await getCurrentUser(request)
    console.log('getCurrentUser result:', { user, error })
    
    // Test 3: Check headers
    const headers = Object.fromEntries(request.headers.entries())
    console.log('Request headers:', {
      cookie: headers.cookie,
      authorization: headers.authorization,
      'user-agent': headers['user-agent']
    })
    
    return NextResponse.json({
      success: true,
      token: token ? {
        email: token.email,
        name: token.name,
        uid: token.uid,
        sub: token.sub
      } : null,
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name
      } : null,
      error,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Auth debug error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
} 