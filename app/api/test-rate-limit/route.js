import { NextResponse } from 'next/server'
import { validateApiKey, generateRateLimitHeaders, createRateLimitResponse } from '@/lib/api-auth'

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
      const response = createRateLimitResponse(validation)
      return NextResponse.json(response.body, {
        status: response.status,
        headers: response.headers
      })
    }

    // Success response
    const responseHeaders = generateRateLimitHeaders(validation.keyInfo)

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
    message: 'Test rate limiting functionality',
    usage: 'POST to this endpoint with your API key to test rate limiting',
    example: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        apiKey: 'smo-your-api-key-here'
      }
    },
    note: 'This endpoint only tests rate limiting. Use /api/github-summarizer for full repository analysis with stars and latest release information.',
    features: [
      'API key validation',
      'Usage tracking',
      'Rate limit enforcement',
      'Usage statistics'
    ]
  })
} 