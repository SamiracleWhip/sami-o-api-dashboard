import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api-auth'

export async function GET(request) {
  try {
    // Get cookies
    const cookies = request.headers.get('cookie') || ''
    
    // Test authentication
    const { user, error } = await getAuthenticatedUser(request)
    
    // Get referer to see where the request came from
    const referer = request.headers.get('referer') || 'No referer'
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      cookies: {
        present: cookies ? 'Yes' : 'No',
        length: cookies.length,
        containsNextAuth: cookies.includes('next-auth') ? 'Yes' : 'No',
        containsSession: cookies.includes('session-token') ? 'Yes' : 'No'
      },
      authentication: {
        success: !!user,
        error: error,
        user: user ? {
          id: user.id,
          email: user.email,
          name: user.name
        } : null
      },
      request: {
        referer: referer,
        url: request.url,
        method: request.method
      }
    })
  } catch (error) {
    console.error('Dashboard auth test error:', error)
    return NextResponse.json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : 'Hidden in production'
    }, { status: 500 })
  }
} 