-- Update the default usage_limit from 1000 to 25
ALTER TABLE api_keys ALTER COLUMN usage_limit SET DEFAULT 25;

-- Update existing API keys that have the old default (1000) to the new default (25)
-- This only affects keys that were created with the default value
UPDATE api_keys 
SET usage_limit = 25 
WHERE usage_limit = 1000 
AND created_at >= (SELECT MAX(created_at) FROM api_keys WHERE usage_limit = 1000) - INTERVAL '1 day'; 