-- Migration: Add user_id to api_keys table and implement user-specific policies
-- This migration adds user association to API keys for multi-user support

-- Step 1: Add user_id column to api_keys table
ALTER TABLE api_keys 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- Step 2: Create index for better performance
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);

-- Step 3: For existing API keys without user_id, we need to handle them
-- Option A: Delete all existing API keys (recommended for development)
-- TRUNCATE TABLE api_keys;

-- Option B: Assign to a default user (if you have existing data you want to keep)
-- First, ensure there's at least one user in the system
-- You can manually run this if you want to preserve existing API keys:
-- UPDATE api_keys SET user_id = (SELECT id FROM users LIMIT 1) WHERE user_id IS NULL;

-- Step 4: Make user_id NOT NULL after handling existing data
-- Uncomment the next line after handling existing data:
-- ALTER TABLE api_keys ALTER COLUMN user_id SET NOT NULL;

-- Step 5: Drop old RLS policies
DROP POLICY IF EXISTS "Enable all operations for api_keys" ON api_keys;

-- Step 6: Create new user-specific RLS policies
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

-- Step 7: Service role policy for administrative access
CREATE POLICY "Service role full access api_keys" ON api_keys
    FOR ALL USING (auth.role() = 'service_role');

-- Step 8: Update any existing triggers to handle the new column
-- The existing update_updated_at_column trigger should work fine with the new column 