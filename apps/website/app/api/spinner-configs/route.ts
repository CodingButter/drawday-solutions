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

// GET - Fetch user's spinner configurations
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

    // Fetch spinner configs for this user
    const configsResponse = await fetch(
      `${DIRECTUS_URL}/items/spinner_configurations?filter[user_id][_eq]=${user.id}&sort=-is_default,-updated_at`,
      {
        headers: {
          Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
        },
      }
    );

    if (!configsResponse.ok) {
      throw new Error('Failed to fetch spinner configurations');
    }

    const { data: configs } = await configsResponse.json();

    return NextResponse.json({ configs });
  } catch (error: any) {
    console.error('Error fetching spinner configurations:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch spinner configurations' },
      { status: 500 }
    );
  }
}

// POST - Create a new spinner configuration
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

    // If this config is set as default, unset other defaults
    if (body.is_default) {
      // First, get all current defaults
      const currentDefaultsResponse = await fetch(
        `${DIRECTUS_URL}/items/spinner_configurations?filter[user_id][_eq]=${user.id}&filter[is_default][_eq]=true`,
        {
          headers: {
            Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
          },
        }
      );

      if (currentDefaultsResponse.ok) {
        const { data: defaults } = await currentDefaultsResponse.json();

        // Update each default to false
        for (const config of defaults) {
          await fetch(`${DIRECTUS_URL}/items/spinner_configurations/${config.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
            },
            body: JSON.stringify({ is_default: false }),
          });
        }
      }
    }

    // Create spinner configuration
    const configData = {
      user_id: user.id,
      name: body.name,
      description: body.description,
      spinner_type_id: body.spinner_type_id,
      theme_config: body.theme_config || {},
      physics_config: body.physics_config || {},
      sound_config: body.sound_config || {},
      animation_config: body.animation_config || {},
      is_default: body.is_default || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const createResponse = await fetch(`${DIRECTUS_URL}/items/spinner_configurations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
      },
      body: JSON.stringify(configData),
    });

    if (!createResponse.ok) {
      const error = await createResponse.json();
      throw new Error(error.errors?.[0]?.message || 'Failed to create spinner configuration');
    }

    const { data: config } = await createResponse.json();

    return NextResponse.json({ config });
  } catch (error: any) {
    console.error('Error creating spinner configuration:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create spinner configuration' },
      { status: 500 }
    );
  }
}

// PATCH - Update spinner configuration
export async function PATCH(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { configId, updates } = await request.json();

    if (!configId) {
      return NextResponse.json({ error: 'Configuration ID required' }, { status: 400 });
    }

    // Update configuration
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const updateResponse = await fetch(`${DIRECTUS_URL}/items/spinner_configurations/${configId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update spinner configuration');
    }

    const { data: config } = await updateResponse.json();

    return NextResponse.json({ config });
  } catch (error: any) {
    console.error('Error updating spinner configuration:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update spinner configuration' },
      { status: 500 }
    );
  }
}

// DELETE - Delete spinner configuration
export async function DELETE(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const configId = searchParams.get('id');

    if (!configId) {
      return NextResponse.json({ error: 'Configuration ID required' }, { status: 400 });
    }

    const deleteResponse = await fetch(`${DIRECTUS_URL}/items/spinner_configurations/${configId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
      },
    });

    if (!deleteResponse.ok) {
      throw new Error('Failed to delete spinner configuration');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting spinner configuration:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete spinner configuration' },
      { status: 500 }
    );
  }
}
