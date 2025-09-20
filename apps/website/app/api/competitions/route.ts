import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://db.drawday.app';
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || 'mNjKgq86jnVokcdwBRKkXgrHEoROvR04';

// Helper function to get admin token
async function getAdminToken(): Promise<string> {
  // Use the static admin token directly
  return DIRECTUS_ADMIN_TOKEN;
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

// GET - Fetch competitions for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user info from token
    const userResponse = await fetch(`${DIRECTUS_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { data: user } = await userResponse.json();

    // Get admin token to fetch competitions
    const adminToken = await getAdminToken();

    // Fetch competitions for this user
    const competitionsResponse = await fetch(
      `${DIRECTUS_URL}/items/competitions?filter[user_id][_eq]=${user.id}`,
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      }
    );

    if (!competitionsResponse.ok) {
      throw new Error('Failed to fetch competitions');
    }

    const { data: competitions } = await competitionsResponse.json();
    
    // Parse JSON fields for each competition
    const parsedCompetitions = competitions.map((comp: any) => {
      let participants = [];
      let winners = [];

      // Handle participants_data - could be JSON string, base64, or already an array
      if (comp.participants_data) {
        try {
          if (typeof comp.participants_data === 'string') {
            // More robust base64 detection
            const isBase64 = /^[A-Za-z0-9+/]+=*$/.test(comp.participants_data) &&
                             comp.participants_data.length % 4 === 0 &&
                             !comp.participants_data.startsWith('[') &&
                             !comp.participants_data.startsWith('{');

            if (isBase64) {
              try {
                const decoded = Buffer.from(comp.participants_data, 'base64').toString('utf-8');
                participants = JSON.parse(decoded);
              } catch (decodeError) {
                console.error('Base64 decode error:', decodeError);
                // If base64 decode fails, try direct JSON parse
                participants = JSON.parse(comp.participants_data);
              }
            } else {
              // Direct JSON parse
              participants = JSON.parse(comp.participants_data);
            }
          } else if (Array.isArray(comp.participants_data)) {
            participants = comp.participants_data;
          }
        } catch (error) {
          console.error('Failed to parse participants_data:', error, comp.participants_data?.substring(0, 50));
          participants = [];
        }
      }

      // Handle winners_data similarly
      if (comp.winners_data) {
        try {
          if (typeof comp.winners_data === 'string') {
            // More robust base64 detection
            const isBase64 = /^[A-Za-z0-9+/]+=*$/.test(comp.winners_data) &&
                             comp.winners_data.length % 4 === 0 &&
                             !comp.winners_data.startsWith('[') &&
                             !comp.winners_data.startsWith('{');

            if (isBase64) {
              try {
                const decoded = Buffer.from(comp.winners_data, 'base64').toString('utf-8');
                winners = JSON.parse(decoded);
              } catch (decodeError) {
                console.error('Base64 decode error for winners:', decodeError);
                winners = JSON.parse(comp.winners_data);
              }
            } else {
              winners = JSON.parse(comp.winners_data);
            }
          } else if (Array.isArray(comp.winners_data)) {
            winners = comp.winners_data;
          }
        } catch (error) {
          console.error('Failed to parse winners_data:', error, comp.winners_data?.substring(0, 50));
          winners = [];
        }
      }

      return {
        ...comp,
        participants,
        winners,
        bannerImageId: comp.banner_image, // Map Directus field to frontend field
      };
    });
    
    return NextResponse.json({ competitions: parsedCompetitions });
  } catch (error: any) {
    console.error('Error fetching competitions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch competitions' },
      { status: 500 }
    );
  }
}

// POST - Create a new competition
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user info from token
    const userResponse = await fetch(`${DIRECTUS_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { data: user } = await userResponse.json();
    const body = await request.json();
    
    // Get admin token to create competition
    const adminToken = await getAdminToken();

    // Create competition with user_id
    const competitionData = {
      name: body.name,
      participants_data: body.participants ? JSON.stringify(body.participants) : null,
      winners_data: body.winners ? JSON.stringify(body.winners) : null,
      banner_image: body.bannerImageId || null,
      user_id: user.id,
      created_at: new Date().toISOString(),
      status: 'active',
    };

    const createResponse = await fetch(`${DIRECTUS_URL}/items/competitions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify(competitionData),
    });

    if (!createResponse.ok) {
      const error = await createResponse.json();
      throw new Error(error.errors?.[0]?.message || 'Failed to create competition');
    }

    const { data: competition } = await createResponse.json();

    // Map the response to match frontend expectations
    const mappedCompetition = {
      ...competition,
      participants: competition.participants_data ? JSON.parse(competition.participants_data) : [],
      winners: competition.winners_data ? JSON.parse(competition.winners_data) : [],
      bannerImageId: competition.banner_image,
    };

    return NextResponse.json({ competition: mappedCompetition });
  } catch (error: any) {
    console.error('Error creating competition:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create competition' },
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}