import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const country = searchParams.get('country');
    const limit = searchParams.get('limit') || '100';
    
    let queryText = 'SELECT * FROM mosques WHERE 1=1';
    const params: any[] = [];
    
    if (city) {
      queryText += ' AND city ILIKE $' + (params.length + 1);
      params.push(`%${city}%`);
    }
    
    if (country) {
      queryText += ' AND country ILIKE $' + (params.length + 1);
      params.push(`%${country}%`);
    }
    
    queryText += ' LIMIT $' + (params.length + 1);
    params.push(parseInt(limit));
    
    const result = await query(queryText, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching mosques:', error);
    return NextResponse.json({ error: 'Failed to fetch mosques' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, address, city, country, latitude, longitude, phone, email, website } = body;
    
    // Validate required fields
    if (!name || !address || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const result = await query(
      `INSERT INTO mosques (name, description, address, city, country, latitude, longitude, phone, email, website)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [name, description || null, address, city || null, country || null, latitude, longitude, phone || null, email || null, website || null]
    );
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating mosque:', error);
    return NextResponse.json({ error: 'Failed to create mosque' }, { status: 500 });
  }
}
