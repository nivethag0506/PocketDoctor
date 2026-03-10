import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/init-db';

export async function GET() {
  try {
    const result = await initializeDatabase();
    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully!',
      data: result
    });
  } catch (error) {
    console.error('Error setting up database:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to setup database',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
