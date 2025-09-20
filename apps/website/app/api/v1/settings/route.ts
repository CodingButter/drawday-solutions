import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://db.drawday.app';

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

    // Get user settings
    const settingsResponse = await fetch(
      `${DIRECTUS_URL}/items/user_settings?filter[user_id][_eq]=${user.id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!settingsResponse.ok) {
      throw new Error('Failed to fetch settings');
    }

    const { data: settings } = await settingsResponse.json();

    return NextResponse.json({ settings: settings[0] || null });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// POST - Update user settings
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

    // Update or create settings
    const settingsData = {
      ...body,
      user_id: user.id,
      updated_at: new Date().toISOString(),
    };

    // Try to update existing settings first
    const existingResponse = await fetch(
      `${DIRECTUS_URL}/items/user_settings?filter[user_id][_eq]=${user.id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    let response;
    if (existingResponse.ok) {
      const { data: existing } = await existingResponse.json();
      if (existing.length > 0) {
        // Update existing
        response = await fetch(`${DIRECTUS_URL}/items/user_settings/${existing[0].id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(settingsData),
        });
      } else {
        // Create new
        response = await fetch(`${DIRECTUS_URL}/items/user_settings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(settingsData),
        });
      }
    }

    if (!response || !response.ok) {
      const error = await response?.json();
      throw new Error(error?.errors?.[0]?.message || 'Failed to update settings');
    }

    const { data: settings } = await response.json();

    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update settings' },
      { status: 500 }
    );
  }
}