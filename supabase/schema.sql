-- Create the api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    permissions VARCHAR(50) NOT NULL DEFAULT 'read',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    key_type VARCHAR(20) NOT NULL DEFAULT 'development',
    usage_limit INTEGER NOT NULL DEFAULT 25,
    api_key TEXT NOT NULL UNIQUE,
    usage_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    last_used TIMESTAMP WITH TIME ZONE
);

-- Create an index on the api_key for faster lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(api_key);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_api_keys_status ON api_keys(status);

-- Create an index on key_type for filtering
CREATE INDEX IF NOT EXISTS idx_api_keys_type ON api_keys(key_type);

-- Create an index on user_id for faster user-specific queries
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);

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

-- Drop the old policy
DROP POLICY IF EXISTS "Enable all operations for api_keys" ON api_keys;

-- Create user-specific policies for api_keys
CREATE POLICY "Users can read own api_keys" ON api_keys
    FOR SELECT USING (
        auth.uid()::text = user_id::text OR auth.role() = 'service_role'
    );

CREATE POLICY "Users can create own api_keys" ON api_keys
    FOR INSERT WITH CHECK (
        auth.uid()::text = user_id::text OR auth.role() = 'service_role'
    );

CREATE POLICY "Users can update own api_keys" ON api_keys
    FOR UPDATE USING (
        auth.uid()::text = user_id::text OR auth.role() = 'service_role'
    );

CREATE POLICY "Users can delete own api_keys" ON api_keys
    FOR DELETE USING (
        auth.uid()::text = user_id::text OR auth.role() = 'service_role'
    );

-- Service role policy for administrative access
CREATE POLICY "Service role full access api_keys" ON api_keys
    FOR ALL USING (auth.role() = 'service_role');

-- NextAuth.js required tables for Google SSO
-- These tables are required by @auth/supabase-adapter

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    email_verified TIMESTAMP WITH TIME ZONE,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Accounts table (for OAuth providers like Google)
CREATE TABLE IF NOT EXISTS accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at BIGINT,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(provider, provider_account_id)
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_token TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW') NOT NULL
);

-- Verification tokens table
CREATE TABLE IF NOT EXISTS verification_tokens (
    identifier TEXT NOT NULL,
    token TEXT NOT NULL,
    expires TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (identifier, token)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_provider ON accounts(provider, provider_account_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);

-- Enable RLS on auth tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies for auth tables (allow all operations for now)
CREATE POLICY "Enable all operations for users" ON users FOR ALL USING (true);
CREATE POLICY "Enable all operations for accounts" ON accounts FOR ALL USING (true);
CREATE POLICY "Enable all operations for sessions" ON sessions FOR ALL USING (true);
CREATE POLICY "Enable all operations for verification_tokens" ON verification_tokens FOR ALL USING (true);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at 
    BEFORE UPDATE ON accounts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at 
    BEFORE UPDATE ON sessions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 