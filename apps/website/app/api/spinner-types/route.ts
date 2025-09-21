import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://db.drawday.app';
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

// GET - Fetch all spinner types
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(
      `${DIRECTUS_URL}/items/spinner_types?filter[is_active][_eq]=true&sort=sort_order`,
      {
        headers: {
          Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch spinner types');
    }

    const { data: spinnerTypes } = await response.json();

    return NextResponse.json({ spinnerTypes });
  } catch (error: any) {
    console.error('Error fetching spinner types:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch spinner types' },
      { status: 500 }
    );
  }
}
