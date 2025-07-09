# Supabase Integration Setup Guide

## Prerequisites

- Supabase account
- Node.js and yarn installed
- Basic understanding of Next.js and databases

## Step 1: Create Supabase Project

1. Sign in to [Supabase](https://supabase.com)
2. Click "New Project"
3. Fill in your project details:
   - **Name**: `sami-o-api-dashboard` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for the project to be created (usually takes 2-3 minutes)

## Step 2: Database Setup

1. In your Supabase dashboard, go to the **SQL Editor**
2. Run the following SQL script to create the `api_keys` table:

```sql
-- Create the api_keys table
CREATE TABLE api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  permissions VARCHAR(50) NOT NULL DEFAULT 'read',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  key_type VARCHAR(50) NOT NULL DEFAULT 'development',
  usage_limit INTEGER DEFAULT 1000,
  api_key VARCHAR(255) UNIQUE NOT NULL,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  last_used TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_api_keys_status ON api_keys(status);
CREATE INDEX idx_api_keys_api_key ON api_keys(api_key);
CREATE INDEX idx_api_keys_created_at ON api_keys(created_at);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (you can customize this later)
CREATE POLICY "Allow all operations on api_keys" ON api_keys
    FOR ALL USING (true);
```

## Step 3: Get Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key
   - **service_role** key (keep this secret!)

## Step 4: Configure Environment Variables

1. In your project root, create a `.env.local` file (if it doesn't exist)
2. Add your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Important**: Never commit the `.env.local` file to version control!

## Step 5: Install Dependencies

Install the Supabase client:

```bash
yarn add @supabase/supabase-js
```

## Step 6: Test the Integration

1. Start your development server:
```bash
yarn dev
```

2. Navigate to `/dashboards` in your browser
3. Try creating a new API key to test the database connection

## Security Considerations

- **Never commit** your `.env.local` file to version control
- The `service_role` key has admin privileges - use it only for server-side operations
- In production, implement proper Row Level Security (RLS) policies
- Consider implementing user authentication before deploying

## Troubleshooting

### Issue: Can't fetch API keys
- Check your environment variables are correctly set
- Verify your Supabase project is running
- Check the browser console for error messages

### Issue: CORS errors
- Ensure you're using the correct Supabase URL
- Check that your domain is allowed in Supabase settings

### Issue: Database connection errors
- Verify your database credentials
- Check that the `api_keys` table exists
- Test the connection directly in Supabase SQL Editor

### Debug Connection
You can test your Supabase connection directly in the browser console:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_ANON_KEY'
)

// Test the connection
const { data, error } = await supabase
  .from('api_keys')
  .select('*')
  .limit(1)

console.log('Connection test:', { data, error })
```

## Features Included

- ✅ Create, read, update, and delete API keys
- ✅ Real-time updates using Supabase
- ✅ TypeScript support
- ✅ Error handling and validation
- ✅ Responsive design

## Next Steps

1. **Add Authentication**: Implement user authentication with Supabase Auth
2. **Implement RLS**: Set up proper Row Level Security policies
3. **API Key Usage Tracking**: Track and limit API key usage
4. **Monitoring**: Set up monitoring and analytics
5. **Rate Limiting**: Implement rate limiting for API key generation

## Support

If you encounter any issues, check:
1. Supabase project status
2. Environment variables
3. Database table structure
4. Network connectivity

For more help, refer to the [Supabase Documentation](https://supabase.com/docs). 