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

-- Create an index on the api_key for faster lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(api_key);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_api_keys_status ON api_keys(status);

-- Create an index on key_type for filtering
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

-- Create a policy that allows all operations (you can modify this based on your auth requirements)
CREATE POLICY "Enable all operations for api_keys" ON api_keys
    FOR ALL USING (true); 