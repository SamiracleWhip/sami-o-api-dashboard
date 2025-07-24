import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { getAuthenticatedUser } from '@/lib/api-auth'

export async function GET(request) {
  try {
    // Get all headers and cookies
    const headers = Object.fromEntries(request.headers.entries())
    const cookies = request.headers.get('cookie') || ''
    
    // Parse cookies
    const cookiePairs = cookies.split(';').map(pair => pair.trim())
    const cookieMap = {}
    cookiePairs.forEach(pair => {
      const [key, value] = pair.split('=')
      if (key && value) {
        cookieMap[key.trim()] = value.trim()
      }
    })

    // Test JWT token extraction
    const mockReq = {
      headers: {
        cookie: cookies,
        ...headers
      }
    }

    const token = await getToken({
      req: mockReq,
      secret: process.env.NEXTAUTH_SECRET
    })

    // Test full authentication
    const { user, error } = await getAuthenticatedUser(request)

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      requestInfo: {
        method: request.method,
        url: request.url,
        userAgent: headers['user-agent'] || 'Not provided',
        referer: headers['referer'] || 'Not provided',
        origin: headers['origin'] || 'Not provided'
      },
      cookies: {
        raw: cookies,
        parsed: cookieMap,
        nextAuthCookies: Object.keys(cookieMap).filter(key => key.includes('next-auth')),
        sessionCookie: cookieMap['next-auth.session-token'] || 'Not found',
        csrfCookie: cookieMap['next-auth.csrf-token'] || 'Not found'
      },
      jwt: {
        found: !!token,
        email: token?.email || null,
        name: token?.name || null,
        sub: token?.sub || null,
        exp: token?.exp ? new Date(token.exp * 1000).toISOString() : null,
        iat: token?.iat ? new Date(token.iat * 1000).toISOString() : null
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
      environment: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
        NODE_ENV: process.env.NODE_ENV
      }
    })
  } catch (error) {
    console.error('Browser session debug error:', error)
    return NextResponse.json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : 'Hidden in production'
    }, { status: 500 })
  }
} 