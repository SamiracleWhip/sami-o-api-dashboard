import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  try {
    console.log('=== FIXING DATABASE ISSUES ===')
    
    const results = []
    
    // Step 1: Check if user_id column exists
    const { data: existingKeys, error: keysError } = await supabaseAdmin
      .from('api_keys')
      .select('id, user_id, name')
      .limit(1)
    
    if (keysError) {
      results.push({
        step: 'check_user_id_column',
        error: keysError.message,
        action: 'Column might not exist'
      })
    } else {
      results.push({
        step: 'check_user_id_column',
        success: true,
        message: 'user_id column exists'
      })
    }
    
    // Step 2: Check for API keys without user_id
    const { data: orphanedKeys, error: orphanError } = await supabaseAdmin
      .from('api_keys')
      .select('id, name, user_id')
      .is('user_id', null)
    
    if (!orphanError && orphanedKeys?.length > 0) {
      results.push({
        step: 'found_orphaned_keys',
        count: orphanedKeys.length,
        keys: orphanedKeys,
        action: 'These keys need user_id values'
      })
      
      // Step 3: Get the first user to assign orphaned keys to
      const { data: firstUser, error: userError } = await supabaseAdmin
        .from('users')
        .select('id, email')
        .limit(1)
        .single()
      
      if (!userError && firstUser) {
        // Assign orphaned keys to first user
        const { data: updatedKeys, error: updateError } = await supabaseAdmin
          .from('api_keys')
          .update({ user_id: firstUser.id })
          .is('user_id', null)
          .select()
        
        if (!updateError) {
          results.push({
            step: 'assign_orphaned_keys',
            success: true,
            assignedTo: firstUser.email,
            count: updatedKeys?.length || 0
          })
        } else {
          results.push({
            step: 'assign_orphaned_keys',
            error: updateError.message
          })
        }
      } else {
        results.push({
          step: 'find_first_user',
          error: userError?.message || 'No users found',
          action: 'Create a user first by signing in'
        })
      }
    } else {
      results.push({
        step: 'check_orphaned_keys',
        message: 'No orphaned keys found',
        success: true
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database fix completed',
      results,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Database fix error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to fix database issues',
    description: 'This will assign orphaned API keys to the first user and fix common issues'
  })
} 