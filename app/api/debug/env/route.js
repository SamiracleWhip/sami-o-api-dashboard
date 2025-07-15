import { NextResponse } from 'next/server'

export async function GET() {
  // Only show this in development or if explicitly requested
  if (process.env.NODE_ENV === 'production' && !process.env.SHOW_DEBUG) {
    return NextResponse.json({ error: 'Debug endpoint disabled in production' }, { status: 403 })
  }

  const envStatus = {
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set (will use VERCEL_URL)',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing',
    VERCEL_URL: process.env.VERCEL_URL || 'Not set',
    timestamp: new Date().toISOString()
  }

  return NextResponse.json(envStatus, { status: 200 })
} 