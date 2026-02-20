import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test database connection
    const result = await query('SELECT NOW()');
    
    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json(
        { status: 'database_error', message: 'Database query returned no results' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: result.rows[0].now,
      message: 'Database connection successful',
    });
  } catch (error) {
    console.error('[v0] Health check failed:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
