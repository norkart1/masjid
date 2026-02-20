import { query } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Only allow this endpoint in development or with a setup token
    const authHeader = request.headers.get('authorization');
    const setupToken = process.env.SETUP_TOKEN || 'setup-token';
    
    if (authHeader !== `Bearer ${setupToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if admin user exists
    const adminExists = await query('SELECT * FROM admin WHERE username = $1', ['admin']);
    
    if (adminExists.rows.length > 0) {
      return NextResponse.json({
        message: 'Admin user already exists',
        initialized: true,
      });
    }

    // Hash the default password
    const hashedPassword = await hashPassword('12345');

    // Insert admin user
    await query(
      'INSERT INTO admin (username, password_hash) VALUES ($1, $2)',
      ['admin', hashedPassword]
    );

    // Insert sample mosques
    await query(
      `INSERT INTO mosques (name, description, address, city, country, latitude, longitude, phone, email, website)
       VALUES 
         ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10),
         ($11, $12, $13, $14, $15, $16, $17, $18, $19, $20),
         ($21, $22, $23, $24, $25, $26, $27, $28, $29, $30)
       ON CONFLICT DO NOTHING`,
      [
        'Al-Haram Mosque', 'Grand mosque in the heart of the city', '123 Main Street', 'New York', 'USA', 40.7128, -74.0060, '+1-212-555-0100', 'info@alharam.org', 'https://alharam.org',
        'Sultan Mosque', 'Beautiful mosque with traditional architecture', '456 Central Ave', 'San Francisco', 'USA', 37.7749, -122.4194, '+1-415-555-0200', 'contact@sultan.org', 'https://sultan.org',
        'Faisal Mosque', 'Large mosque serving the community', '789 Park Boulevard', 'Los Angeles', 'USA', 34.0522, -118.2437, '+1-213-555-0300', 'admin@faisal.org', 'https://faisal.org'
      ]
    );

    return NextResponse.json({
      message: 'Setup completed successfully',
      admin: { username: 'admin', password: '12345' },
      initialized: true,
    });
  } catch (error) {
    console.error('[v0] Setup error:', error);
    return NextResponse.json(
      { error: 'Setup failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
