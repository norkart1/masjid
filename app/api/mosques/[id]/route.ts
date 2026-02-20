import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await query('SELECT * FROM mosques WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Mosque not found' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching mosque:', error);
    return NextResponse.json({ error: 'Failed to fetch mosque' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, address, city, country, latitude, longitude, phone, email, website, rating } = body;
    
    const result = await query(
      `UPDATE mosques SET 
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        address = COALESCE($3, address),
        city = COALESCE($4, city),
        country = COALESCE($5, country),
        latitude = COALESCE($6, latitude),
        longitude = COALESCE($7, longitude),
        phone = COALESCE($8, phone),
        email = COALESCE($9, email),
        website = COALESCE($10, website),
        rating = COALESCE($11, rating),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $12
       RETURNING *`,
      [name, description, address, city, country, latitude, longitude, phone, email, website, rating, id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Mosque not found' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating mosque:', error);
    return NextResponse.json({ error: 'Failed to update mosque' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await query('DELETE FROM mosques WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Mosque not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Mosque deleted successfully' });
  } catch (error) {
    console.error('Error deleting mosque:', error);
    return NextResponse.json({ error: 'Failed to delete mosque' }, { status: 500 });
  }
}
