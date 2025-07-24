# Google OAuth Authorization Error Fix

## 🚨 **The Problem**
You're getting "Access blocked: Authorization Error" because your Google OAuth app doesn't comply with Google's OAuth 2.0 policy.

## 🔧 **Step-by-Step Fix**

### **Step 1: Update Google Cloud Console**

1. **Go to**: https://console.cloud.google.com/
2. **Select your project** (or create one if needed)
3. **Navigate to**: APIs & Services → Credentials
4. **Find your OAuth 2.0 Client ID** and click on it

### **Step 2: Update Authorized JavaScript Origins**

Add these URLs to **Authorized JavaScript origins**:
```
http://localhost:3000
https://localhost:3000
```

### **Step 3: Update Authorized Redirect URIs**

Add these URLs to **Authorized redirect URIs**:
```
http://localhost:3000/api/auth/callback/google
https://localhost:3000/api/auth/callback/google
```

### **Step 4: Configure OAuth Consent Screen**

1. **Go to**: APIs & Services → OAuth consent screen
2. **Set App Information**:
   - App name: "Sami-O" (or your preferred name)
   - User support email: Your email
   - Developer contact information: Your email
3. **Set Publishing Status**: "Testing"
4. **Add Test Users**: Add your email address
5. **Save and Continue**

### **Step 5: Verify Environment Variables**

Make sure your `.env.local` has these values:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-here-32-chars-minimum
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### **Step 6: Restart Development Server**

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## 🧪 **Testing the Fix**

### **Test 1: Check Environment**
```bash
curl http://localhost:3000/api/debug/env
```
**Expected**: `NEXTAUTH_URL` should show `http://localhost:3000`

### **Test 2: Try Sign In**
1. Go to: `http://localhost:3000/auth/signin`
2. Click "Continue with Google"
3. Should now work without authorization error

### **Test 3: Verify Authentication**
```bash
curl http://localhost:3000/api/test-auth
```

## 🐛 **Common Issues & Solutions**

### **Issue 1: "Invalid redirect URI"**
**Solution**: Double-check the redirect URIs in Google Cloud Console

### **Issue 2: "App not verified"**
**Solution**: 
- Keep app in "Testing" mode
- Add your email as test user
- This is normal for development

### **Issue 3: "Configuration error"**
**Solution**: 
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`
- Restart development server after changes

### **Issue 4: "Access blocked"**
**Solution**:
- Make sure you're using the correct Google account
- Check that your email is added as test user
- Verify app is in "Testing" mode

## 📋 **Checklist**

- [ ] Google Cloud Console credentials updated
- [ ] JavaScript origins include `http://localhost:3000`
- [ ] Redirect URIs include `/api/auth/callback/google`
- [ ] OAuth consent screen configured
- [ ] Test user added (your email)
- [ ] Environment variables set correctly
- [ ] Development server restarted
- [ ] Sign-in flow tested

## 🎯 **Expected Flow After Fix**

1. **Click "Continue with Google"**
2. **Google OAuth page loads** (no error)
3. **Complete Google sign-in**
4. **Redirected to dashboard**
5. **API keys accessible**

## 🆘 **If Still Having Issues**

1. **Clear browser cache and cookies**
2. **Try incognito/private browsing**
3. **Check Google Cloud Console logs**
4. **Verify all environment variables**
5. **Restart development server**

The key is making sure your Google OAuth app is properly configured for localhost development! 