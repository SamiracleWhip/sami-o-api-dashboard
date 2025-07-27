import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Check if supabaseAdmin is available
    if (!supabaseAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Supabase admin client not available',
        message: 'Missing environment variables'
      }, { status: 500 })
    }

    // Test database connection
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: data
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Database test failed',
      details: error.message
    }, { status: 500 })
  }
} 