# Authentication Test Guide

## 🧪 Testing the Authentication Flow

### Step 1: Check Current Status
```bash
# Test if you're authenticated
curl http://localhost:3000/api/test-auth

# Expected: {"authenticated":false,"error":"Not authenticated"}
```

### Step 2: Sign In Process
1. Open browser: `http://localhost:3000/auth/signin`
2. Click "Continue with Google"
3. Complete Google OAuth
4. You'll be redirected to `/dashboards`

### Step 3: Verify Authentication
```bash
# After signing in, test again
curl http://localhost:3000/api/test-auth

# Expected: {"authenticated":true,"user":{"id":"...","email":"..."}}
```

### Step 4: Test API Keys
```bash
# Test API keys endpoint
curl http://localhost:3000/api/users/me/api-keys

# Expected: Array of API keys or empty array []
```

## 🔍 Debug Endpoints

### Check Session
```bash
curl http://localhost:3000/api/debug/session
```

### Check Environment
```bash
curl http://localhost:3000/api/debug/env
```

### Test Database
```bash
curl http://localhost:3000/api/test-db
```

## ✅ Success Indicators

- **Before Sign In**: All endpoints return "Not authenticated"
- **After Sign In**: 
  - `/api/test-auth` returns `{"authenticated":true}`
  - `/api/users/me/api-keys` returns your API keys
  - Dashboard shows API key management interface

## 🐛 Common Issues

### Issue 1: "Configuration Error"
**Solution**: Check Google OAuth credentials in `.env.local`

### Issue 2: "Redirect URI Mismatch"
**Solution**: Update Google OAuth redirect URIs to include `http://localhost:3000`

### Issue 3: "Database Error"
**Solution**: Verify Supabase connection and run database migration

## 📱 Manual Testing

1. **Open Browser**: `http://localhost:3000`
2. **Click "Sign Up"** or "Login"
3. **Complete Google OAuth**
4. **Verify Dashboard Access**: Should show API key management
5. **Test API Key Creation**: Create a new API key
6. **Test API Key Usage**: Use the key in the playground

## 🎯 Expected Flow

```
Not Signed In → Sign In Page → Google OAuth → Dashboard → API Keys
```

The authentication system is working correctly - you just need to sign in first! 