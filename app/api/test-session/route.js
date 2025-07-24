import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request) {
  try {
    // Test NextAuth session directly
    const session = await getServerSession(authOptions)
    
    // Get cookies
    const cookies = request.headers.get('cookie') || ''
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      nextAuthSession: {
        exists: !!session,
        user: session?.user ? {
          email: session.user.email,
          name: session.user.name,
          id: session.user.id
        } : null,
        expires: session?.expires
      },
      cookies: {
        present: cookies ? 'Yes' : 'No',
        length: cookies.length,
        containsNextAuth: cookies.includes('next-auth') ? 'Yes' : 'No',
        containsSession: cookies.includes('session-token') ? 'Yes' : 'No',
        containsCsrf: cookies.includes('csrf-token') ? 'Yes' : 'No'
      },
      environment: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
        NODE_ENV: process.env.NODE_ENV
      }
    })
  } catch (error) {
    console.error('Session test error:', error)
    return NextResponse.json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : 'Hidden in production'
    }, { status: 500 })
  }
} 