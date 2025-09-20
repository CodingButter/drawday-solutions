import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://db.drawday.app';
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

// Helper to extract token from request
function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  const cookie = request.cookies.get('directus_auth_token');
  return cookie?.value || null;
}

// GET - Fetch user's column mappings
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get user info from token
    const userResponse = await fetch(`${DIRECTUS_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { data: user } = await userResponse.json();

    // Fetch column mappings for this user
    const mappingsResponse = await fetch(
      `${DIRECTUS_URL}/items/column_mappings?filter[user_id][_eq]=${user.id}&sort=-is_default,-last_used_at`,
      {
        headers: {
          Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
        },
      }
    );

    if (!mappingsResponse.ok) {
      throw new Error('Failed to fetch column mappings');
    }

    const { data: mappings } = await mappingsResponse.json();

    return NextResponse.json({ mappings });
  } catch (error: any) {
    console.error('Error fetching column mappings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch column mappings' },
      { status: 500 }
    );
  }
}

// POST - Create a new column mapping
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get user info from token
    const userResponse = await fetch(`${DIRECTUS_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { data: user } = await userResponse.json();
    const body = await request.json();

    // If this mapping is set as default, unset other defaults
    if (body.is_default) {
      await fetch(`${DIRECTUS_URL}/items/column_mappings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
        },
        body: JSON.stringify({
          query: {
            filter: {
              user_id: { _eq: user.id },
              is_default: { _eq: true },
            },
          },
          data: { is_default: false },
        }),
      });
    }

    // Create column mapping
    const mappingData = {
      user_id: user.id,
      name: body.name,
      description: body.description,
      mapping_config: body.mapping_config,
      file_type: body.file_type || 'csv',
      delimiter: body.delimiter || ',',
      has_headers: body.has_headers !== false,
      is_default: body.is_default || false,
      usage_count: 0,
      created_at: new Date().toISOString(),
    };

    const createResponse = await fetch(`${DIRECTUS_URL}/items/column_mappings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
      },
      body: JSON.stringify(mappingData),
    });

    if (!createResponse.ok) {
      const error = await createResponse.json();
      throw new Error(error.errors?.[0]?.message || 'Failed to create column mapping');
    }

    const { data: mapping } = await createResponse.json();

    return NextResponse.json({ mapping });
  } catch (error: any) {
    console.error('Error creating column mapping:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create column mapping' },
      { status: 500 }
    );
  }
}

// PATCH - Update usage count when mapping is used
export async function PATCH(request: NextRequest) {
  try {
    const { mappingId } = await request.json();

    if (!mappingId) {
      return NextResponse.json({ error: 'Mapping ID required' }, { status: 400 });
    }

    // Update usage count and last_used_at
    const updateResponse = await fetch(`${DIRECTUS_URL}/items/column_mappings/${mappingId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
      },
      body: JSON.stringify({
        usage_count: { _inc: 1 },
        last_used_at: new Date().toISOString(),
      }),
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update column mapping usage');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating column mapping:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update column mapping' },
      { status: 500 }
    );
  }
}
