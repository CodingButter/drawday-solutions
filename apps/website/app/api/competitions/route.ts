import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://db.drawday.app';

// GET /api/competitions - Get all competitions metadata for the current user
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await fetch(
      `${DIRECTUS_URL}/items/competitions?filter[status][_eq]=active&sort=-date_created`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      throw new Error('Failed to fetch competitions');
    }

    const { data } = await response.json();

    // Transform the data - only return metadata, NO participant data
    const competitions = data.map((comp: any) => ({
      id: comp.id,
      name: comp.name,
      participantCount: comp.participant_count || 0,
      winnersCount: comp.winners_count || 0,
      createdAt: comp.date_created,
      updatedAt: comp.date_updated,
      status: comp.status,
      userId: comp.user_created,
    }));

    return NextResponse.json({ competitions });
  } catch (error: any) {
    console.error('Error fetching competitions:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// POST /api/competitions - Create a new competition (metadata only)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, participantCount = 0 } = body;

    if (!name) {
      return NextResponse.json({ error: 'Competition name is required' }, { status: 400 });
    }

    // Store only metadata in Directus, NOT the actual participant data
    const competitionData = {
      name,
      participant_count: participantCount,
      winners_count: 0,
      status: 'active',
    };

    const response = await fetch(`${DIRECTUS_URL}/items/competitions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(competitionData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const error = await response.json();
      throw new Error(error.errors?.[0]?.message || 'Failed to create competition');
    }

    const { data } = await response.json();

    return NextResponse.json({
      competition: {
        id: data.id,
        name: data.name,
        participantCount: data.participant_count,
        winnersCount: data.winners_count,
        createdAt: data.date_created,
        status: data.status,
      },
    });
  } catch (error: any) {
    console.error('Error creating competition:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/competitions/[id] - Update competition metadata
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract ID from URL path
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];

    if (!id || id === 'competitions') {
      return NextResponse.json({ error: 'Competition ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const updateData: any = {};

    // Only update metadata fields
    if (body.name !== undefined) updateData.name = body.name;
    if (body.participantCount !== undefined) updateData.participant_count = body.participantCount;
    if (body.winnersCount !== undefined) updateData.winners_count = body.winnersCount;
    if (body.status !== undefined) updateData.status = body.status;

    const response = await fetch(`${DIRECTUS_URL}/items/competitions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const error = await response.json();
      throw new Error(error.errors?.[0]?.message || 'Failed to update competition');
    }

    const { data } = await response.json();

    return NextResponse.json({
      competition: {
        id: data.id,
        name: data.name,
        participantCount: data.participant_count,
        winnersCount: data.winners_count,
        createdAt: data.date_created,
        updatedAt: data.date_updated,
        status: data.status,
      },
    });
  } catch (error: any) {
    console.error('Error updating competition:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/competitions/[id] - Delete a competition
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract ID from URL path
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];

    if (!id || id === 'competitions') {
      return NextResponse.json({ error: 'Competition ID is required' }, { status: 400 });
    }

    const response = await fetch(`${DIRECTUS_URL}/items/competitions/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      throw new Error('Failed to delete competition');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting competition:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
