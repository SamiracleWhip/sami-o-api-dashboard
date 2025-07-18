import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { valid: false, error: 'API key is required' },
        { status: 400 }
      );
    }

    // Query the database to check if the API key exists and is active
    // Also get user information
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .select(`
        id, 
        name, 
        status, 
        api_key, 
        user_id,
        users!inner(id, name, email)
      `)
      .eq('api_key', apiKey)
      .eq('status', 'active')
      .single();

    if (error) {
      // If no matching record found, it's not necessarily an error
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { valid: false, error: 'Invalid API key' },
          { status: 401 }
        );
      }
      
      console.error('Database error:', error);
      return NextResponse.json(
        { valid: false, error: 'Database error occurred' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { valid: false, error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // API key is valid and active
    return NextResponse.json({
      valid: true,
      message: 'API key is valid',
      keyInfo: {
        id: data.id,
        name: data.name,
        status: data.status,
        userId: data.user_id,
        user: data.users
      }
    });

  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 