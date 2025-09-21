import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://db.drawday.app';
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

// Configure route segment to handle large payloads
export const runtime = 'nodejs'; // Use Node.js runtime for better performance
export const maxDuration = 60; // Maximum allowed duration for Vercel Hobby (60 seconds)

// Helper function to get admin token
async function getAdminToken(): Promise<string> {
  // Use the static admin token directly
  return DIRECTUS_ADMIN_TOKEN;
}

// Helper function to create competition in Directus
async function createCompetitionInDirectus(adminToken: string, competitionData: any) {
  const requestBody = JSON.stringify(competitionData);
  console.log(`Sending request to Directus (${(requestBody.length / 1024 / 1024).toFixed(2)} MB)`);

  const createResponse = await fetch(`${DIRECTUS_URL}/items/competitions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: requestBody,
    signal: AbortSignal.timeout(55000),
  });

  if (!createResponse.ok) {
    let errorMessage = 'Failed to create competition';
    try {
      const error = await createResponse.json();
      errorMessage = error.errors?.[0]?.message || error.message || errorMessage;
    } catch {
      errorMessage = `Server returned ${createResponse.status}: ${createResponse.statusText}`;
    }
    console.error('Directus error:', errorMessage);
    throw new Error(errorMessage);
  }

  const { data: competition } = await createResponse.json();

  // Map the response
  let participants = [];
  if (competition.participants_data) {
    try {
      participants = JSON.parse(competition.participants_data);
    } catch (parseError) {
      console.error('Failed to parse participants from response:', parseError);
      participants = [];
    }
  }

  return {
    ...competition,
    participants,
    winners: competition.winners_data ? JSON.parse(competition.winners_data) : [],
    bannerImageId: competition.banner_image,
  };
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

    // Get admin token to fetch competitions
    const adminToken = await getAdminToken();

    // Fetch competitions for this user
    const competitionsResponse = await fetch(
      `${DIRECTUS_URL}/items/competitions?filter[user_id][_eq]=${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    if (!competitionsResponse.ok) {
      throw new Error('Failed to fetch competitions');
    }

    const { data: competitions } = await competitionsResponse.json();

    // Debug: log the raw competitions data
    if (competitions.length > 0) {
      console.log('Raw competition data (first item):', {
        id: competitions[0].id,
        banner_image_id: competitions[0].banner_image_id,
        created_at: competitions[0].created_at,
        date_created: competitions[0].date_created,
      });
    }

    // Parse JSON fields for each competition
    const parsedCompetitions = competitions.map((comp: any) => {
      let participants = [];
      let winners = [];

      // Handle participants_data - could be JSON string, base64, or already an array
      if (comp.participants_data) {
        try {
          if (typeof comp.participants_data === 'string') {
            // More robust base64 detection
            const isBase64 =
              /^[A-Za-z0-9+/]+=*$/.test(comp.participants_data) &&
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
          console.error(
            'Failed to parse participants_data:',
            error,
            comp.participants_data?.substring(0, 50)
          );
          participants = [];
        }
      }

      // Handle winners_data similarly
      if (comp.winners_data) {
        try {
          if (typeof comp.winners_data === 'string') {
            // More robust base64 detection
            const isBase64 =
              /^[A-Za-z0-9+/]+=*$/.test(comp.winners_data) &&
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
          console.error(
            'Failed to parse winners_data:',
            error,
            comp.winners_data?.substring(0, 50)
          );
          winners = [];
        }
      }

      // Remove redundant fields and map to frontend format
      const {
        banner_image,
        banner_image_id, // Remove this from spread since we're mapping it
        created_at,
        date_created,
        ...cleanComp
      } = comp;

      return {
        ...cleanComp,
        participants,
        winners,
        bannerImageId: banner_image_id || null, // Map Directus field to frontend field
        createdAt: created_at || date_created, // Map Directus timestamp fields
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

    // Parse the request body with proper error handling for large payloads
    let body;
    try {
      body = await request.json();
    } catch (parseError: any) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body or payload too large' },
        { status: 400 }
      );
    }

    // Log the size of participants array
    if (body.participants) {
      console.log(`Creating competition with ${body.participants.length} participants`);

      // For very large datasets, consider compression
      if (body.participants.length > 10000) {
        console.log('Large dataset detected, will store as compressed JSON');
      }
    }

    // Get admin token to create competition
    const adminToken = await getAdminToken();

    // Create competition with user_id
    // For large participant lists, we need to handle them specially
    let participantsData = null;
    let participantsCount = 0;

    if (body.participants) {
      participantsCount = body.participants.length;

      try {
        const jsonStr = JSON.stringify(body.participants);
        const sizeInMB = jsonStr.length / (1024 * 1024);

        console.log(`Processing ${participantsCount} participants (${sizeInMB.toFixed(2)} MB)`);

        // Directus has a ~1.8MB payload limit (safe limit is ~10,000 participants)
        if (participantsCount > 10000) {
          console.log(`Large dataset detected: ${participantsCount} participants`);

          // For datasets > 10,000 participants, we need to chunk or compress the data
          // Option 1: Store in chunks (not implemented yet)
          // Option 2: Compress using gzip (more complex)
          // Option 3: Store summary and use file storage

          // For now, we'll truncate and warn the user
          const truncatedParticipants = body.participants.slice(0, 10000);
          participantsData = JSON.stringify(truncatedParticipants);

          console.warn(`⚠️ Truncated participants list from ${participantsCount} to 10,000 due to Directus payload limits`);

          // Return a warning in the response
          const competition = await createCompetitionInDirectus(
            adminToken,
            {
              name: body.name,
              participants_data: participantsData,
              winners_data: body.winners ? JSON.stringify(body.winners) : null,
              banner_image_id: body.bannerImageId || null,
              user_id: user.id,
              created_at: new Date().toISOString(),
              status: 'active',
            }
          );

          return NextResponse.json({
            competition,
            warning: `Competition created with only the first 10,000 participants. Directus has a payload limit of ~1.8MB. Original count: ${participantsCount}`
          });
        } else {
          // Standard processing for datasets under 10,000
          participantsData = jsonStr;
        }
      } catch (stringifyError: any) {
        console.error('Failed to stringify participants:', stringifyError);
        return NextResponse.json(
          { error: 'Failed to process participants data' },
          { status: 400 }
        );
      }
    }

    // Skip if we already handled the large dataset case above
    if (participantsCount <= 10000) {
      const competitionData = {
        name: body.name,
        participants_data: participantsData,
        winners_data: body.winners ? JSON.stringify(body.winners) : null,
        banner_image_id: body.bannerImageId || null,
        user_id: user.id,
        created_at: new Date().toISOString(),
        status: 'active',
      };

      // Log the request size
      const requestBody = JSON.stringify(competitionData);
      console.log(`Sending request to Directus (${(requestBody.length / 1024 / 1024).toFixed(2)} MB)`);

      const createResponse = await fetch(`${DIRECTUS_URL}/items/competitions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: requestBody,
        // Add timeout for large requests
        signal: AbortSignal.timeout(55000), // 55 seconds (less than maxDuration)
      });

      if (!createResponse.ok) {
        let errorMessage = 'Failed to create competition';
        try {
          const error = await createResponse.json();
          errorMessage = error.errors?.[0]?.message || error.message || errorMessage;
        } catch {
          errorMessage = `Server returned ${createResponse.status}: ${createResponse.statusText}`;
        }
        console.error('Directus error:', errorMessage);
        throw new Error(errorMessage);
      }

      const { data: competition } = await createResponse.json();

      // Map the response to match frontend expectations
      let participants = [];
      if (competition.participants_data) {
        try {
          // Check if it's base64 encoded
          const isBase64 = /^[A-Za-z0-9+/]+=*$/.test(competition.participants_data) &&
                          competition.participants_data.length % 4 === 0 &&
                          !competition.participants_data.startsWith('[');

          if (isBase64) {
            const decoded = Buffer.from(competition.participants_data, 'base64').toString('utf-8');
            participants = JSON.parse(decoded);
          } else {
            participants = JSON.parse(competition.participants_data);
          }
        } catch (parseError) {
          console.error('Failed to parse participants from response:', parseError);
          participants = [];
        }
      }

      const mappedCompetition = {
        ...competition,
        participants,
        winners: competition.winners_data ? JSON.parse(competition.winners_data) : [],
        bannerImageId: competition.banner_image,
      };

      return NextResponse.json({ competition: mappedCompetition });
    }
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
