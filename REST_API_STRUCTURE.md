# Sami-O REST API Documentation

## Overview

The Sami-O API has been restructured to follow proper REST conventions with user-specific endpoints. All API operations require authentication and automatically filter data based on the authenticated user.

## Authentication

All endpoints require authentication via NextAuth.js JWT tokens passed through browser cookies. The API extracts the user's email from the JWT token and looks up the corresponding user in the Supabase database.

### Authentication Flow
1. User signs in with Google OAuth via NextAuth.js
2. JWT token is stored in browser cookies
3. API routes extract the token and verify the user
4. User ID is used to filter all operations

## Base URL Structure

All user-specific API operations are under the `/api/users/me/` namespace:

```
/api/users/me/api-keys/          # Collection operations
/api/users/me/api-keys/{id}/     # Individual resource operations
```

## Endpoints

### 1. Collection Operations

#### GET /api/users/me/api-keys
Fetch all API keys for the authenticated user.

**Query Parameters:**
- `search` (optional): Search in name, description, or API key
- `status` (optional): Filter by status (active, inactive, all)
- `permission` (optional): Filter by permission level (read, write, all)

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "name": "My API Key",
    "description": "Development key",
    "permissions": "read",
    "status": "active",
    "key_type": "development",
    "usage_limit": 1000,
    "api_key": "smo-...",
    "usage_count": 0,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z",
    "last_used": null
  }
]
```

#### POST /api/users/me/api-keys
Create a new API key for the authenticated user.

**Request Body:**
```json
{
  "name": "My New API Key",
  "description": "Optional description",
  "keyType": "development", // or "production"
  "usageLimit": "1000",
  "status": "active",      // optional
  "permissions": "read"    // optional
}
```

**Response:** Returns the created API key object (201 Created)

### 2. Individual Resource Operations

#### GET /api/users/me/api-keys/{id}
Get a specific API key by ID (only if owned by the authenticated user).

**Response:** Returns the API key object or 404 if not found/not owned

#### PUT /api/users/me/api-keys/{id}
Update a specific API key (only if owned by the authenticated user).

**Request Body:** Any combination of updateable fields:
```json
{
  "name": "Updated name",
  "description": "Updated description",
  "status": "inactive",
  "keyType": "production",
  "usageLimit": "5000",
  "permissions": "write"
}
```

**Response:** Returns the updated API key object

#### DELETE /api/users/me/api-keys/{id}
Delete a specific API key (only if owned by the authenticated user).

**Response:** 
```json
{
  "message": "API key deleted successfully"
}
```

### 3. Special Operations

#### POST /api/users/me/api-keys/{id}/regenerate
Regenerate the API key value for a specific key (only if owned by the authenticated user).

**Response:** Returns the updated API key object with new `api_key` value and reset usage statistics

## Security Features

### User Isolation
- All operations automatically filter by authenticated user's ID
- Users cannot access, modify, or delete other users' API keys
- Database-level security with Row Level Security (RLS) policies

### Ownership Verification
- Double-check ownership on all modify operations
- Proper HTTP status codes (401 Unauthorized, 403 Forbidden, 404 Not Found)
- Detailed error messages for debugging

### Data Validation
- Required field validation on create operations
- Proper data type conversion (e.g., usageLimit to integer)
- Sanitization of undefined values on updates

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Not authenticated"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied"
}
```

### 404 Not Found
```json
{
  "error": "API key not found"
}
```

### 400 Bad Request
```json
{
  "error": "Name and key type are required"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Usage Examples

### Create a new API key
```bash
curl -X POST http://localhost:3001/api/users/me/api-keys \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "name": "Production API Key",
    "description": "For production use",
    "keyType": "production",
    "usageLimit": "10000"
  }'
```

### Get all API keys
```bash
curl http://localhost:3001/api/users/me/api-keys \
  -H "Cookie: next-auth.session-token=..."
```

### Update an API key
```bash
curl -X PUT http://localhost:3001/api/users/me/api-keys/uuid-here \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "name": "Updated Name",
    "status": "inactive"
  }'
```

### Delete an API key
```bash
curl -X DELETE http://localhost:3001/api/users/me/api-keys/uuid-here \
  -H "Cookie: next-auth.session-token=..."
```

### Regenerate an API key
```bash
curl -X POST http://localhost:3001/api/users/me/api-keys/uuid-here/regenerate \
  -H "Cookie: next-auth.session-token=..."
```

## Migration from Old API

### Old Endpoints → New Endpoints
- `GET /api/api-keys` → `GET /api/users/me/api-keys`
- `POST /api/api-keys` → `POST /api/users/me/api-keys`
- `PUT /api/api-keys` → `PUT /api/users/me/api-keys/{id}`
- `DELETE /api/api-keys?id=x` → `DELETE /api/users/me/api-keys/{id}`
- `POST /api/api-keys/regenerate` → `POST /api/users/me/api-keys/{id}/regenerate`

### Key Changes
1. **URL Structure**: Resource ID is now in the URL path, not query parameters
2. **Authentication**: Now required for all operations
3. **User Filtering**: Automatic user-specific filtering
4. **Error Handling**: More specific HTTP status codes
5. **Validation**: Enhanced request validation

## Future Enhancements

- **Bulk Operations**: Support for bulk delete/update operations
- **API Key Scopes**: Fine-grained permissions per key
- **Usage Analytics**: Detailed usage tracking and reporting
- **Rate Limiting**: Per-user and per-key rate limiting
- **Team Support**: Shared API keys within organizations 