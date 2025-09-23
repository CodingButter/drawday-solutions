import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://db.drawday.app';
const DIRECTUS_ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@drawday.app';
const DIRECTUS_ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'Speed4Dayz1!';

// Helper function to get admin token
async function getAdminToken(): Promise<string> {
  const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: DIRECTUS_ADMIN_EMAIL,
      password: DIRECTUS_ADMIN_PASSWORD,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to authenticate as admin');
  }
  const { data } = await response.json();
  return data.access_token;
}

// Helper to extract token from request
function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  const cookie = request.cookies.get('directus_auth_token');
  return cookie?.value || null;
}

// GET - Fetch a specific competition
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get admin token to fetch competition
    const adminToken = await getAdminToken();

    // Fetch the competition
    const competitionResponse = await fetch(`${DIRECTUS_URL}/items/competitions/${params.id}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    if (!competitionResponse.ok) {
      if (competitionResponse.status === 404) {
        return NextResponse.json({ error: 'Competition not found' }, { status: 404 });
      }
      throw new Error('Failed to fetch competition');
    }

    const { data: competition } = await competitionResponse.json();

    // Verify the user owns this competition
    const userResponse = await fetch(`${DIRECTUS_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { data: user } = await userResponse.json();

    if (competition.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ competition });
  } catch (error: any) {
    console.error('Error fetching competition:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch competition' },
      { status: 500 }
    );
  }
}

// PATCH - Update a competition
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Get admin token
    const adminToken = await getAdminToken();

    // First check if the competition exists and belongs to the user
    const checkResponse = await fetch(`${DIRECTUS_URL}/items/competitions/${params.id}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    if (!checkResponse.ok) {
      if (checkResponse.status === 404) {
        return NextResponse.json({ error: 'Competition not found' }, { status: 404 });
      }
      throw new Error('Failed to fetch competition');
    }

    const { data: existingCompetition } = await checkResponse.json();

    if (existingCompetition.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();

    // Map frontend field names to Directus field names
    // ONLY update metadata, NOT participant data
    const updateData: any = {
      date_updated: new Date().toISOString(),
    };

    if (body.name !== undefined) updateData.name = body.name;
    // Store only counts, not actual participant data
    if (body.participantCount !== undefined) updateData.participant_count = body.participantCount;
    if (body.winnersCount !== undefined) updateData.winners_count = body.winnersCount;
    if (body.status !== undefined) updateData.status = body.status;

    // Log what we're updating
    console.log('Updating competition:', params.id, 'with:', updateData);

    // Update the competition
    const updateResponse = await fetch(`${DIRECTUS_URL}/items/competitions/${params.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      throw new Error(error.errors?.[0]?.message || 'Failed to update competition');
    }

    const { data: competition } = await updateResponse.json();

    return NextResponse.json({ competition });
  } catch (error: any) {
    console.error('Error updating competition:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update competition' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a competition
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Get admin token
    const adminToken = await getAdminToken();

    // First check if the competition exists and belongs to the user
    const checkResponse = await fetch(`${DIRECTUS_URL}/items/competitions/${params.id}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    if (!checkResponse.ok) {
      if (checkResponse.status === 404) {
        return NextResponse.json({ error: 'Competition not found' }, { status: 404 });
      }
      throw new Error('Failed to fetch competition');
    }

    const { data: existingCompetition } = await checkResponse.json();

    if (existingCompetition.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the competition
    const deleteResponse = await fetch(`${DIRECTUS_URL}/items/competitions/${params.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    if (!deleteResponse.ok) {
      const error = await deleteResponse.json();
      throw new Error(error.errors?.[0]?.message || 'Failed to delete competition');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting competition:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete competition' },
      { status: 500 }
    );
  }
}

// OPTIONS - Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
