import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'Set' : 'Missing',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'Set' : 'Missing',
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing'
    }

    const missingVars = Object.entries(envCheck)
      .filter(([key, value]) => value === 'Missing' && key !== 'NODE_ENV')
      .map(([key]) => key)

    return NextResponse.json({
      success: missingVars.length === 0,
      environment: envCheck,
      missingVariables: missingVars,
      message: missingVars.length === 0 
        ? 'All environment variables are set correctly' 
        : `Missing ${missingVars.length} environment variable(s)`
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to check environment variables',
      details: error.message
    }, { status: 500 })
  }
} 