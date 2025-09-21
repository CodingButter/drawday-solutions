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

    // For now, return a default set of spinner configurations
    // This can be replaced with actual Directus fetching when the collection exists
    const configs = [
      {
        id: '1',
        name: 'Default Slot Machine',
        description: 'Classic slot machine spinner',
        spinner_type_id: 'slot_machine',
        theme_config: {
          backgroundColor: '#1a1a1a',
          nameColor: '#ffffff',
          ticketColor: '#ffffff',
        },
        physics_config: {
          spinDuration: 'medium',
          decelerationSpeed: 'medium',
        },
        is_default: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ];

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

    const body = await request.json();

    // For now, just return a mock created configuration
    // This can be replaced with actual Directus creation when the collection exists
    const config = {
      id: Date.now().toString(),
      name: body.name || 'New Configuration',
      description: body.description || '',
      spinner_type_id: body.spinner_type_id || 'slot_machine',
      theme_config: body.theme_config || {},
      physics_config: body.physics_config || {},
      sound_config: body.sound_config || {},
      animation_config: body.animation_config || {},
      is_default: body.is_default || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

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
