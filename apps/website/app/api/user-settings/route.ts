import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'https://db.drawday.app';

// GET user settings
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    // First, get the current user from the token
    const meResponse = await fetch(`${DIRECTUS_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!meResponse.ok) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const userData = await meResponse.json();
    const userId = userData.data.id;

    // Try to get existing settings
    const response = await fetch(`${DIRECTUS_URL}/items/user_settings?filter[user_id][_eq]=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // No settings found, return defaults
        return NextResponse.json({ data: null });
      }
      throw new Error(`Failed to fetch settings: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ data: data.data?.[0] || null });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// POST/PATCH - Create or update user settings
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    // First, get the current user from the token
    const meResponse = await fetch(`${DIRECTUS_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!meResponse.ok) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const userData = await meResponse.json();
    const userId = userData.data.id;

    const body = await request.json();

    // Check if settings already exist
    const checkResponse = await fetch(`${DIRECTUS_URL}/items/user_settings?filter[user_id][_eq]=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    let settingsId = null;
    if (checkResponse.ok) {
      const existing = await checkResponse.json();
      if (existing.data && existing.data.length > 0) {
        settingsId = existing.data[0].id;
      }
    }

    // Handle image uploads with replacement logic
    if (body.logo_image && body.logo_image.startsWith('data:image/')) {
      // Delete old logo first if exists
      if (settingsId) {
        const existingSettings = await fetch(`${DIRECTUS_URL}/items/user_settings/${settingsId}?fields=logo_image`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (existingSettings.ok) {
          const data = await existingSettings.json();
          const oldImageId = data.data?.logo_image;
          if (oldImageId) {
            await fetch(`${DIRECTUS_URL}/files/${oldImageId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
          }
        }
      }

      // Upload new logo image
      const logoResponse = await uploadImage(body.logo_image, token, 'logo');
      if (logoResponse.id) {
        body.logo_image = logoResponse.id;
      } else {
        delete body.logo_image;
      }
    }

    if (body.banner_image && body.banner_image.startsWith('data:image/')) {
      // Delete old banner first if exists
      if (settingsId) {
        const existingSettings = await fetch(`${DIRECTUS_URL}/items/user_settings/${settingsId}?fields=banner_image`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (existingSettings.ok) {
          const data = await existingSettings.json();
          const oldImageId = data.data?.banner_image;
          if (oldImageId) {
            await fetch(`${DIRECTUS_URL}/files/${oldImageId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
          }
        }
      }

      // Upload new banner image
      const bannerResponse = await uploadImage(body.banner_image, token, 'banner');
      if (bannerResponse.id) {
        body.banner_image = bannerResponse.id;
      } else {
        delete body.banner_image;
      }
    }

    let response;
    if (settingsId) {
      // Update existing settings
      response = await fetch(`${DIRECTUS_URL}/items/user_settings/${settingsId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    } else {
      // Create new settings
      response = await fetch(`${DIRECTUS_URL}/items/user_settings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...body,
          user_id: userId,
        }),
      });
    }

    if (!response.ok) {
      throw new Error(`Failed to save settings: ${response.status}`);
    }

    const data = await response.json();

    // Fetch the complete settings with file info
    const completeSettings = await fetch(`${DIRECTUS_URL}/items/user_settings/${data.data.id || settingsId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (completeSettings.ok) {
      const fullData = await completeSettings.json();
      return NextResponse.json({ data: fullData.data });
    }

    return NextResponse.json({ data: data.data });
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save settings' },
      { status: 500 }
    );
  }
}

// Helper function to upload image
async function uploadImage(dataUrl: string, token: string, type: 'logo' | 'banner') {
  try {
    const mimeTypeMatch = dataUrl.match(/^data:(image\/[^;]+);base64,/);
    if (!mimeTypeMatch) {
      throw new Error('Invalid image format');
    }

    const mimeType = mimeTypeMatch[1];
    const base64Data = dataUrl.replace(/^data:image\/[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const fileExtension = mimeType.split('/')[1];
    const filename = `${type}_${Date.now()}.${fileExtension}`;

    const formData = new FormData();
    const blob = new Blob([buffer], { type: mimeType });
    formData.append('file', blob, filename);
    formData.append('title', `User ${type} image`);

    const response = await fetch(`${DIRECTUS_URL}/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    return { id: null };
  }
}

