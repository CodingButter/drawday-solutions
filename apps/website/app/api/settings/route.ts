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

// GET - Fetch user settings
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

    // Get admin token to fetch settings
    const adminToken = await getAdminToken();

    // Try to fetch user settings
    const settingsResponse = await fetch(
      `${DIRECTUS_URL}/items/user_settings?filter[user_id][_eq]=${user.id}`,
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      }
    );

    if (!settingsResponse.ok) {
      // If user_settings collection doesn't exist or no settings found, return defaults
      return NextResponse.json({ 
        settings: {
          spinDuration: 'medium',
          decelerationSpeed: 'medium',
          theme: {
            primaryColor: '#8B5CF6',
            backgroundColor: '#1a1a1a',
            brandingEnabled: true,
          }
        }
      });
    }

    const { data: settings } = await settingsResponse.json();
    
    // If no settings exist for user, return defaults
    if (!settings || settings.length === 0) {
      return NextResponse.json({ 
        settings: {
          spinDuration: 'medium',
          decelerationSpeed: 'medium',
          theme: {
            primaryColor: '#8B5CF6',
            backgroundColor: '#1a1a1a',
            brandingEnabled: true,
          }
        }
      });
    }
    
    return NextResponse.json({ settings: settings[0] });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    // Return default settings on error
    return NextResponse.json({ 
      settings: {
        spinDuration: 'medium',
        decelerationSpeed: 'medium',
        theme: {
          primaryColor: '#8B5CF6',
          backgroundColor: '#1a1a1a',
          brandingEnabled: true,
        }
      }
    });
  }
}

// POST - Create or update user settings
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
    
    // Get admin token
    const adminToken = await getAdminToken();

    // Check if settings already exist for this user
    const checkResponse = await fetch(
      `${DIRECTUS_URL}/items/user_settings?filter[user_id][_eq]=${user.id}`,
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      }
    );

    let settingsId = null;
    if (checkResponse.ok) {
      const { data: existingSettings } = await checkResponse.json();
      if (existingSettings && existingSettings.length > 0) {
        settingsId = existingSettings[0].id;
      }
    }

    if (settingsId) {
      // Update existing settings
      const updateResponse = await fetch(
        `${DIRECTUS_URL}/items/user_settings/${settingsId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            ...body,
            updated_at: new Date().toISOString(),
          }),
        }
      );

      if (!updateResponse.ok) {
        const error = await updateResponse.json();
        throw new Error(error.errors?.[0]?.message || 'Failed to update settings');
      }

      const { data: settings } = await updateResponse.json();
      return NextResponse.json({ settings });
    } else {
      // Create new settings
      const createResponse = await fetch(`${DIRECTUS_URL}/items/user_settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          ...body,
          user_id: user.id,
          created_at: new Date().toISOString(),
        }),
      });

      if (!createResponse.ok) {
        const error = await createResponse.json();
        // If collection doesn't exist, return success with default settings
        if (error.errors?.[0]?.message?.includes('user_settings')) {
          return NextResponse.json({ 
            settings: {
              ...body,
              user_id: user.id,
            }
          });
        }
        throw new Error(error.errors?.[0]?.message || 'Failed to create settings');
      }

      const { data: settings } = await createResponse.json();
      return NextResponse.json({ settings });
    }
  } catch (error: any) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save settings' },
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