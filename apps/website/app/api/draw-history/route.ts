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

// GET - Fetch draw history for a raffle
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const raffleId = searchParams.get('raffleId');
    const limit = searchParams.get('limit') || '50';

    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Build the query URL
    let queryUrl = `${DIRECTUS_URL}/items/draw_history?sort=-drawn_at&limit=${limit}`;
    if (raffleId) {
      queryUrl += `&filter[raffle_id][_eq]=${raffleId}`;
    }

    // Fetch draw history
    const historyResponse = await fetch(queryUrl, {
      headers: {
        Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
      },
    });

    if (!historyResponse.ok) {
      throw new Error('Failed to fetch draw history');
    }

    const { data: history } = await historyResponse.json();

    return NextResponse.json({ history });
  } catch (error: any) {
    console.error('Error fetching draw history:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch draw history' },
      { status: 500 }
    );
  }
}

// POST - Record a new draw
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

    // Create draw history record
    const drawData = {
      raffle_id: body.raffle_id,
      spinner_type: body.spinner_type,
      participant_data: body.participant_data,
      winner_data: body.winner_data,
      spin_duration: body.spin_duration,
      draw_number: body.draw_number,
      drawn_at: new Date().toISOString(),
      drawn_by: user.id,
      metadata: body.metadata || {},
    };

    const createResponse = await fetch(`${DIRECTUS_URL}/items/draw_history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
      },
      body: JSON.stringify(drawData),
    });

    if (!createResponse.ok) {
      const error = await createResponse.json();
      throw new Error(error.errors?.[0]?.message || 'Failed to record draw');
    }

    const { data: draw } = await createResponse.json();

    // Update raffle's last_draw_at
    await fetch(`${DIRECTUS_URL}/items/raffles/${body.raffle_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
      },
      body: JSON.stringify({
        last_draw_at: new Date().toISOString(),
        total_draws: { _inc: 1 },
      }),
    });

    return NextResponse.json({ draw });
  } catch (error: any) {
    console.error('Error recording draw:', error);
    return NextResponse.json({ error: error.message || 'Failed to record draw' }, { status: 500 });
  }
}

// DELETE - Delete a draw record (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const drawId = searchParams.get('id');

    if (!drawId) {
      return NextResponse.json({ error: 'Draw ID required' }, { status: 400 });
    }

    // Soft delete by updating status
    const updateResponse = await fetch(`${DIRECTUS_URL}/items/draw_history/${drawId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
      },
      body: JSON.stringify({
        status: 'deleted',
        deleted_at: new Date().toISOString(),
      }),
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to delete draw record');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting draw:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete draw' }, { status: 500 });
  }
}
