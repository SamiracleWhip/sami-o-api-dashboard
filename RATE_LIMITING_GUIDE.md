# Rate Limiting Guide

This guide shows how to implement rate limiting in your API endpoints using the reusable functions from `lib/api-auth.js`.

## Available Functions

### 1. `validateApiKey(apiKey)`
Validates an API key and checks rate limits. Automatically increments usage count.

**Returns:**
```javascript
{
  valid: boolean,
  error: string | null,
  status: number,
  keyInfo: {
    id: string,
    name: string,
    permissions: string,
    userId: string,
    user: Object,
    usageCount: number,
    usageLimit: number
  } | null
}
```

### 2. `generateRateLimitHeaders(keyInfo)`
Generates standard rate limit headers for API responses.

**Returns:**
```javascript
{
  'X-RateLimit-Limit': number,
  'X-RateLimit-Remaining': number,
  'X-RateLimit-Reset': string
}
```

### 3. `createRateLimitResponse(validation)`
Creates a standardized error response for rate limit violations.

**Returns:**
```javascript
{
  body: Object,
  status: number,
  headers: Object
}
```

## Implementation Example

```javascript
import { NextResponse } from 'next/server'
import { validateApiKey, generateRateLimitHeaders, createRateLimitResponse } from '@/lib/api-auth'

export async function POST(request) {
  try {
    // Get API key from header
    const apiKey = request.headers.get('x-api-key')
    
    // Validate API key and check rate limits
    const validation = await validateApiKey(apiKey)
    if (!validation.valid) {
      const response = createRateLimitResponse(validation)
      return NextResponse.json(response.body, {
        status: response.status,
        headers: response.headers
      })
    }

    // Your API logic here...
    const result = await yourApiFunction()

    // Add rate limit headers to successful response
    const responseHeaders = generateRateLimitHeaders(validation.keyInfo)

    return NextResponse.json({
      success: true,
      data: result,
      apiKeyInfo: {
        name: validation.keyInfo.name,
        permissions: validation.keyInfo.permissions,
        user: validation.keyInfo.user,
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## Response Headers

All endpoints using rate limiting will include these headers:

- `X-RateLimit-Limit`: Total allowed requests
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: When limits reset (24 hours from now)

## Error Responses

### Rate Limit Exceeded (429)
```json
{
  "error": "Rate limit exceeded. API key usage limit is 100 requests. Current usage: 100",
  "rateLimitInfo": {
    "limit": 100,
    "used": 100,
    "remaining": 0
  }
}
```

### Invalid API Key (401)
```json
{
  "error": "Invalid API key"
}
```

### Missing API Key (400)
```json
{
  "error": "API key is required"
}
```

## Success Response Example

```json
{
  "success": true,
  "data": { /* your API response */ },
  "apiKeyInfo": {
    "name": "My API Key",
    "permissions": "read",
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "usage": {
      "limit": 100,
      "used": 5,
      "remaining": 95
    }
  }
}
```

## Testing

Use the test endpoint to verify rate limiting:

```bash
curl -X POST http://localhost:3000/api/test-rate-limit \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "your-api-key"}'
```

## Database Schema

The rate limiting uses these columns in the `api_keys` table:

- `usage_count`: Current usage count
- `usage_limit`: Maximum allowed requests
- `last_used`: Timestamp of last usage
- `status`: Must be 'active' for the key to work

## Usage Tracking

- Usage count is automatically incremented on each API call
- Optimistic locking prevents race conditions
- Usage is tracked per API key, not per user
- Limits are enforced in real-time 