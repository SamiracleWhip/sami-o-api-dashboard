import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api-auth'

export async function GET(request) {
  try {
    const { user, error } = await getAuthenticatedUser(request)
    
    return NextResponse.json({
      authenticated: !!user,
      error: error || null,
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name
      } : null,
      message: user ? 'Authentication successful' : 'Not authenticated'
    })
  } catch (error) {
    console.error('Auth test error:', error)
    return NextResponse.json({
      authenticated: false,
      error: error.message,
      user: null,
      message: 'Authentication test failed'
    }, { status: 500 })
  }
} 