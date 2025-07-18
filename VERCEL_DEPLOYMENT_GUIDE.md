# Vercel Deployment Guide for Sami-O

## 🚀 Pre-Deployment Checklist

### 1. Environment Variables Setup

In your Vercel dashboard, add these environment variables:

#### Required Variables
```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-here-32-chars-minimum
NEXTAUTH_URL=https://your-app.vercel.app

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional
OPENAI_API_KEY=your-openai-key (for GitHub summarizer)
```

#### Debug Variables (Optional)
```env
# Only add if you need debug endpoints in production
ENABLE_DEBUG=true
```

### 2. Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Edit your OAuth 2.0 Client
4. Add authorized redirect URIs:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
5. Add authorized JavaScript origins:
   ```
   https://your-app.vercel.app
   ```

### 3. Supabase Configuration

1. Go to your Supabase dashboard
2. Navigate to Authentication > URL Configuration
3. Add your Vercel URL to Site URL:
   ```
   https://your-app.vercel.app
   ```
4. Add redirect URLs:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   https://your-app.vercel.app/auth/signin
   ```

## 📦 Deployment Steps

### Step 1: Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the main branch

### Step 2: Configure Build Settings
- **Framework Preset**: Next.js
- **Root Directory**: ./ (default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: .next (default)
- **Install Command**: `npm install` (default)

### Step 3: Add Environment Variables
1. In the "Environment Variables" section
2. Add all the required variables listed above
3. Make sure to use the production values

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Vercel will provide your deployment URL

## 🔧 Post-Deployment Configuration

### 1. Update Environment Variables
After getting your Vercel URL (e.g., `https://your-app.vercel.app`):

1. Update `NEXTAUTH_URL` in Vercel environment variables
2. Update Google OAuth redirect URIs
3. Update Supabase redirect URLs

### 2. Test the Deployment

#### Basic Tests
- [ ] Homepage loads correctly
- [ ] Sign in with Google works
- [ ] Dashboard is accessible after sign in
- [ ] API keys can be created/viewed
- [ ] API validation endpoint works

#### Debug Tests (if enabled)
- Visit `https://your-app.vercel.app/api/debug/session`
- Check that all environment variables show as "Set"
- Verify authentication flow works

### 3. Database Migration (if needed)
If this is your first deployment, run the database migration:

1. Go to Supabase SQL Editor
2. Run the migration script:
   ```sql
   -- From supabase/migrations/001_add_user_id_to_api_keys.sql
   ALTER TABLE api_keys 
   ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;
   
   CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
   
   -- Update RLS policies (see migration file for full script)
   ```

## 🐛 Troubleshooting

### Common Issues

#### Issue 1: "Configuration Error"
**Symptoms**: Error during sign in
**Causes**: 
- Missing `NEXTAUTH_SECRET`
- Incorrect `NEXTAUTH_URL`
- Missing Google OAuth credentials

**Solution**:
- Verify all environment variables are set
- Ensure `NEXTAUTH_SECRET` is at least 32 characters
- Check Google OAuth configuration

#### Issue 2: "Database Connection Error"
**Symptoms**: API endpoints returning 500 errors
**Causes**:
- Incorrect Supabase credentials
- Network issues
- RLS policy problems

**Solution**:
- Verify Supabase URL and service role key
- Check database migration was applied
- Test connection with debug endpoint

#### Issue 3: "Redirect URI Mismatch"
**Symptoms**: OAuth error during Google sign in
**Causes**:
- Google OAuth not configured for production URL
- Incorrect redirect URIs

**Solution**:
- Update Google OAuth configuration
- Ensure all URLs use HTTPS
- Check for typos in URLs

#### Issue 4: Build Failures
**Symptoms**: Deployment fails during build
**Causes**:
- TypeScript errors
- Missing dependencies
- Syntax errors

**Solution**:
- Run `npm run build` locally first
- Fix any TypeScript errors
- Ensure all imports are correct

### Debug Commands

#### Check Environment Variables
Visit: `https://your-app.vercel.app/api/debug/env`

#### Check Authentication Flow
Visit: `https://your-app.vercel.app/api/debug/session`

#### Test Database Connection
Visit: `https://your-app.vercel.app/api/test-db`

## 🔒 Security Checklist

### Production Security
- [ ] `NEXTAUTH_SECRET` is unique and secure (32+ characters)
- [ ] Service role key is kept secret
- [ ] Debug endpoints disabled in production (remove `ENABLE_DEBUG`)
- [ ] Google OAuth configured with correct domains only
- [ ] Supabase RLS policies are active
- [ ] Environment variables are properly configured

### Monitoring
- [ ] Check Vercel function logs for errors
- [ ] Monitor Supabase logs for database issues
- [ ] Set up error tracking (optional)

## 🚀 Performance Optimization

### Vercel Settings
1. Enable Edge Runtime for API routes (if compatible)
2. Configure appropriate regions
3. Set up proper caching headers

### Database Optimization
1. Ensure database indexes are created
2. Monitor query performance in Supabase
3. Consider connection pooling for high traffic

## 📊 Monitoring & Maintenance

### Regular Checks
- Monitor Vercel function execution times
- Check Supabase database performance
- Review authentication error logs
- Monitor API key usage patterns

### Scaling Considerations
- Supabase usage limits
- Vercel function limits
- OpenAI API quota (if using GitHub summarizer)

## 🆘 Support

If deployment issues persist:

1. Check Vercel deployment logs
2. Test debug endpoints
3. Verify environment variables
4. Check Supabase logs
5. Review Google OAuth configuration

The application is now production-ready with proper error handling, security measures, and monitoring capabilities. 