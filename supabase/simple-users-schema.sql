-- Simple users table for storing Google OAuth user data
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    image TEXT,
    email_verified TIMESTAMP WITH TIME ZONE,
    provider TEXT DEFAULT 'google',
    provider_account_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider, provider_account_id);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Allow user creation" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Create policy to allow service role full access (for server-side operations)
CREATE POLICY "Service role full access" ON users FOR ALL USING (
  auth.role() = 'service_role'
);

-- Create policy to allow public read access (for API endpoints)
CREATE POLICY "Public read access" ON users FOR SELECT USING (true);

-- Create policy to allow authenticated users to read their own data
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (
  auth.uid()::text = id::text OR auth.role() = 'service_role'
);

-- Create policy to allow user creation (for new user registration)
CREATE POLICY "Allow user creation" ON users FOR INSERT WITH CHECK (true);

-- Create policy to allow updates (for user profile updates)
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (
  auth.uid()::text = id::text OR auth.role() = 'service_role'
);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 