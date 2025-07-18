import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('=== DATABASE CHECK ===')
    
    // Check if api_keys table exists and its structure
    const { data: apiKeysSchema, error: schemaError } = await supabaseAdmin
      .rpc('get_table_columns', { table_name: 'api_keys' })
      .catch(() => {
        // If the RPC doesn't exist, try a different approach
        return supabaseAdmin
          .from('api_keys')
          .select('*')
          .limit(1)
      })
    
    console.log('API Keys schema check:', { apiKeysSchema, schemaError })
    
    // Check existing API keys
    const { data: existingKeys, error: keysError } = await supabaseAdmin
      .from('api_keys')
      .select('id, user_id, name, created_at')
      .limit(5)
    
    console.log('Existing API keys:', { count: existingKeys?.length || 0, keys: existingKeys, keysError })
    
    // Check users table
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, email, name, created_at')
      .limit(5)
    
    console.log('Users:', { count: users?.length || 0, users, usersError })
    
    // Try to get table schema information
    const { data: tableInfo, error: tableError } = await supabaseAdmin
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'api_keys')
      .catch(() => ({ data: null, error: 'Information schema not accessible' }))
    
    return NextResponse.json({
      success: true,
      checks: {
        apiKeysSchema: {
          data: apiKeysSchema,
          error: schemaError
        },
        existingKeys: {
          count: existingKeys?.length || 0,
          sample: existingKeys,
          error: keysError
        },
        users: {
          count: users?.length || 0,
          sample: users,
          error: usersError
        },
        tableInfo: {
          data: tableInfo,
          error: tableError
        }
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Database check error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
} 