import { NextResponse } from 'next/server'
import { validateApiKey } from '../github-summarizer/route'

export async function POST(request) {
  try {
    const body = await request.json()
    const { apiKey } = body

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      )
    }

    // Test the rate limiting validation
    const validation = await validateApiKey(apiKey)
    
    if (!validation.valid) {
      const responseHeaders = {}
      if (validation.status === 429 && validation.keyInfo) {
        responseHeaders['X-RateLimit-Limit'] = validation.keyInfo.usageLimit
        responseHeaders['X-RateLimit-Remaining'] = Math.max(0, validation.keyInfo.usageLimit - validation.keyInfo.usageCount)
        responseHeaders['X-RateLimit-Reset'] = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
      
      return NextResponse.json({
        success: false,
        error: validation.error,
        status: validation.status,
        ...(validation.status === 429 && validation.keyInfo ? {
          rateLimitInfo: {
            limit: validation.keyInfo.usageLimit,
            used: validation.keyInfo.usageCount,
            remaining: Math.max(0, validation.keyInfo.usageLimit - validation.keyInfo.usageCount)
          }
        } : {})
      }, {
        status: validation.status,
        headers: responseHeaders
      })
    }

    // Success response
    const responseHeaders = {
      'X-RateLimit-Limit': validation.keyInfo.usageLimit,
      'X-RateLimit-Remaining': Math.max(0, validation.keyInfo.usageLimit - validation.keyInfo.usageCount),
      'X-RateLimit-Reset': new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }

    return NextResponse.json({
      success: true,
      message: 'Rate limit test successful',
      apiKeyInfo: {
        name: validation.keyInfo.name,
        permissions: validation.keyInfo.permissions,
        user: {
          id: validation.keyInfo.userId,
          name: validation.keyInfo.user.name,
          email: validation.keyInfo.user.email
        },
        usage: {
          limit: validation.keyInfo.usageLimit,
          used: validation.keyInfo.usageCount,
          remaining: Math.max(0, validation.keyInfo.usageLimit - validation.keyInfo.usageCount)
        }
      }
    }, {
      headers: responseHeaders
    })

  } catch (error) {
    console.error('Error in test-rate-limit:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to test rate limiting',
    usage: 'curl -X POST http://localhost:3000/api/test-rate-limit -H "Content-Type: application/json" -d \'{"apiKey": "your-api-key"}\'',
    description: 'This endpoint tests the rate limiting functionality without actually processing a GitHub repository'
  })
} 