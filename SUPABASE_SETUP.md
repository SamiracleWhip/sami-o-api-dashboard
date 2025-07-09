# Supabase Integration Setup

This guide will help you set up Supabase with your API key management dashboard.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Fill in your project details:
   - Name: `api-key-manager` (or any name you prefer)
   - Database Password: Create a strong password
   - Region: Choose the closest region to your users
5. Click "Create new project"

## Step 2: Set up the Database

1. In your Supabase dashboard, go to the "SQL Editor"
2. Run the SQL script from `supabase/schema.sql` to create the database table:

```sql
-- Create the api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    permissions VARCHAR(50) NOT NULL DEFAULT 'read',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    key_type VARCHAR(20) NOT NULL DEFAULT 'development',
    usage_limit INTEGER NOT NULL DEFAULT 1000,
    api_key TEXT NOT NULL UNIQUE,
    usage_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    last_used TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(api_key);
CREATE INDEX IF NOT EXISTS idx_api_keys_status ON api_keys(status);
CREATE INDEX IF NOT EXISTS idx_api_keys_type ON api_keys(key_type);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_api_keys_updated_at 
    BEFORE UPDATE ON api_keys 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations
CREATE POLICY "Enable all operations for api_keys" ON api_keys
    FOR ALL USING (true);
```

## Step 3: Get Your Supabase Credentials

1. In your Supabase dashboard, go to "Settings" → "API"
2. Copy the following values:
   - Project URL
   - `anon` `public` key
   - `service_role` `secret` key (⚠️ Keep this secret!)

## Step 4: Configure Environment Variables

1. In your project root, update the `.env.local` file with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Important**: Replace the placeholder values with your actual Supabase credentials.

## Step 5: Install Dependencies

The Supabase client is already included in your project. If you need to install it manually:

```bash
npm install @supabase/supabase-js
```

## Step 6: Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Navigate to `/dashboards` in your browser
3. Try creating a new API key to test the database connection

## Security Considerations

1. **Environment Variables**: Never commit your `.env.local` file to version control
2. **Row Level Security**: The current setup allows all operations. In production, you should implement proper RLS policies based on your authentication requirements
3. **Service Role Key**: Only use the service role key for server-side operations that need elevated permissions

## Troubleshooting

### Common Issues

1. **"Failed to fetch API keys"**: Check your environment variables and ensure they're correctly set
2. **CORS errors**: Make sure your domain is added to the allowed origins in Supabase settings
3. **Database connection errors**: Verify your database is running and accessible

### Debugging Tips

1. Check the browser console for detailed error messages
2. Verify your environment variables are loaded correctly
3. Test your Supabase connection directly in the browser console:

```javascript
import { supabase } from './lib/supabase'
const { data, error } = await supabase.from('api_keys').select('*')
console.log(data, error)
```

## Features Included

- ✅ Create API keys
- ✅ Read/List API keys with search and filtering
- ✅ Update API keys
- ✅ Delete API keys (single and bulk)
- ✅ Regenerate API keys
- ✅ Real-time updates
- ✅ TypeScript support
- ✅ Error handling
- ✅ Loading states

## Next Steps

1. Add user authentication (Supabase Auth)
2. Implement proper Row Level Security policies
3. Add API key usage tracking
4. Set up monitoring and analytics
5. Add rate limiting for API key generation 