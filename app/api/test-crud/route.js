import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/api-auth'

export async function GET(request) {
  try {
    // Test authentication
    const { user, error } = await getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: error || 'Not authenticated',
        message: 'Authentication failed'
      }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      message: 'CRUD authentication working correctly',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('CRUD test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Internal server error'
    }, { status: 500 })
  }
} 