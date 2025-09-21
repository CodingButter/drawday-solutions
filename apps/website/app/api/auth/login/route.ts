import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'https://db.drawday.app';

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch (parseError: any) {
    console.error('Error parsing request body:', parseError);
    return NextResponse.json(
      { error: 'Invalid JSON in request body', details: parseError.message },
      { status: 400 }
    );
  }

  try {
    const { email, password } = body;

    console.log('Login attempt for:', email);

    // Authenticate with Directus
    const loginResponse = await fetch(`${DIRECTUS_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!loginResponse.ok) {
      const error = await loginResponse.json();
      return NextResponse.json(
        { error: error.errors?.[0]?.message || 'Login failed' },
        { status: loginResponse.status }
      );
    }

    const loginData = await loginResponse.json();
    const { access_token, expires, refresh_token } = loginData.data;

    // Get user details with all fields - first get the user ID from the token
    const meResponse = await fetch(`${DIRECTUS_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!meResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch user details' },
        { status: meResponse.status }
      );
    }

    const meData = await meResponse.json();
    const userId = meData.data.id;

    // Use the admin token directly to fetch full user data
    const adminToken = process.env.DIRECTUS_ADMIN_TOKEN;

    // Fetch full user data with admin token
    const userResponse = await fetch(`${DIRECTUS_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    if (!userResponse.ok) {
      // Fall back to limited user data
      return NextResponse.json({
        success: true,
        access_token,
        expires,
        refresh_token,
        user: { id: userId, email },
      });
    }

    const userData = await userResponse.json();

    return NextResponse.json({
      success: true,
      access_token,
      expires,
      refresh_token,
      user: userData.data,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    console.error('Stack trace:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
