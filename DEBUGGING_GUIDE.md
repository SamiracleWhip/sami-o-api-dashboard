# API Keys Authentication Debugging Guide

## The Problem

Users are getting "Error Loading API Keys - Please log in to access your API keys" even when they appear to be signed in.

## Debugging Steps

### 1. Check Development Server Logs

After starting the development server (`npm run dev`), check the console output when:
- Users sign in
- Users navigate to the dashboard
- API calls are made

Look for the debug output we added:
```
=== getAuthenticatedUser DEBUG ===
=== API KEYS ENDPOINT DEBUG ===
```

### 2. Test the Debug Endpoint

Visit: `http://localhost:3000/api/debug/session`

This will show you:
- Whether JWT tokens are being created
- Whether users exist in the database
- Environment variable status
- Full authentication flow

### 3. Check Environment Variables

Ensure these are set in `.env.local`:
```env
NEXTAUTH_SECRET=your-secret-here
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 4. Check Browser Developer Tools

1. **Network Tab**: Look for failed API calls to `/api/users/me/api-keys`
2. **Application Tab > Cookies**: Check for NextAuth session cookies
3. **Console Tab**: Look for any JavaScript errors

### 5. Test User Creation

When you sign in, check the server console for:
```
SignIn callback triggered:
Attempting to save user to Supabase:
User save result:
```

### 6. Check Supabase Database

1. Go to your Supabase dashboard
2. Check the `users` table - ensure your user exists
3. Check the `api_keys` table structure - ensure `user_id` column exists

## Common Issues & Solutions

### Issue 1: JWT Token Not Found
**Symptoms**: Console shows "JWT token result: Not found"
**Causes**: 
- NEXTAUTH_SECRET not set
- Session strategy issues
- Cookie domain problems

**Solution**: 
- Verify NEXTAUTH_SECRET in `.env.local`
- Clear browser cookies and sign in again
- Check NextAuth configuration

### Issue 2: User Not Found in Database
**Symptoms**: Console shows "User found: No"
**Causes**:
- User creation failed during sign-in
- Database connection issues
- Email mismatch

**Solution**:
- Check Supabase dashboard for user existence
- Look for user creation errors in server logs
- Manually create user if needed

### Issue 3: Environment Variables Missing
**Symptoms**: Debug endpoint shows variables as "Missing"
**Causes**:
- .env.local file not found
- Variable names incorrect
- Server not restarted after changes

**Solution**:
- Verify .env.local file exists and has correct variables
- Restart development server
- Check variable names match exactly

### Issue 4: Database Connection Errors
**Symptoms**: "Supabase query error" in console
**Causes**:
- Service role key incorrect
- Database permissions
- Network issues

**Solution**:
- Verify SUPABASE_SERVICE_ROLE_KEY
- Check Supabase project status
- Test connection with debug endpoint

## Manual Testing Steps

### Step 1: Fresh Sign In
1. Clear all browser data for localhost:3000
2. Sign in with Google
3. Check server console for user creation logs
4. Visit debug endpoint

### Step 2: Database Verification
```sql
-- In Supabase SQL editor
SELECT * FROM users;
SELECT * FROM api_keys;

-- Check if your user exists
SELECT * FROM users WHERE email = 'your-email@gmail.com';
```

### Step 3: Manual User Creation (if needed)
```sql
-- If user doesn't exist, create manually
INSERT INTO users (name, email, email_verified, image)
VALUES ('Your Name', 'your-email@gmail.com', NOW(), 'your-image-url');
```

### Step 4: Create Test API Key
```sql
-- Create a test API key for your user
INSERT INTO api_keys (user_id, name, description, api_key, permissions, status)
VALUES (
  (SELECT id FROM users WHERE email = 'your-email@gmail.com'),
  'Test Key',
  'Manual test key',
  'smo-test123456789',
  'read',
  'active'
);
```

## Contact Information

If issues persist after trying these steps:
1. Share the output from `/api/debug/session`
2. Share relevant server console logs
3. Confirm which debugging steps were attempted

The debug logging will help identify exactly where the authentication flow is breaking down. 