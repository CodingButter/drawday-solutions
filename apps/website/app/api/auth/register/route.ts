import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'https://db.drawday.app';
const DIRECTUS_ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@drawday.app';
const DIRECTUS_ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'Speed4Dayz1!';

// Get admin token for user creation
async function getAdminToken(): Promise<string | null> {
  try {
    console.log('Attempting admin login with email:', DIRECTUS_ADMIN_EMAIL);

    const loginBody = {
      email: DIRECTUS_ADMIN_EMAIL,
      password: DIRECTUS_ADMIN_PASSWORD,
    };

    const loginResponse = await fetch(`${DIRECTUS_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginBody),
    });

    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      console.error('Failed to authenticate as admin. Status:', loginResponse.status);
      console.error('Error response:', errorText);
      return null;
    }

    const { data } = await loginResponse.json();
    console.log('Admin login successful, got token');
    return data.access_token;
  } catch (error) {
    console.error('Error getting admin token:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, first_name, last_name } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get admin token for creating user
    const adminToken = await getAdminToken();

    if (!adminToken) {
      console.error('Could not obtain admin token for user creation');
      return NextResponse.json(
        { error: 'Registration service temporarily unavailable' },
        { status: 503 }
      );
    }

    // Create user with admin token
    const userData = {
      email,
      password,
      first_name: first_name || '',
      last_name: last_name || '',
      role: '142098df-c517-4b47-9826-c6d3a1d72e46', // User role
      status: 'active', // Set to active immediately since we handle verification separately
    };

    console.log('Creating user with data:', JSON.stringify(userData, null, 2));

    const registerResponse = await fetch(`${DIRECTUS_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify(userData),
    });

    if (!registerResponse.ok) {
      const error = await registerResponse.json();
      console.error('User creation failed:', {
        status: registerResponse.status,
        error: error,
      });
      return NextResponse.json(
        { error: error.errors?.[0]?.message || 'Registration failed' },
        { status: registerResponse.status }
      );
    }

    const createdUser = await registerResponse.json();

    // Automatically log in the user after registration
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
      // Registration succeeded but login failed - still return success
      return NextResponse.json({
        success: true,
        message: 'Registration successful. Please log in.',
        user: createdUser.data
      });
    }

    const loginData = await loginResponse.json();

    return NextResponse.json({
      success: true,
      user: createdUser.data,
      tokens: loginData.data,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}