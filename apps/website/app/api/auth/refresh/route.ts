import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'https://db.drawday.app';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refresh_token } = body;

    if (!refresh_token) {
      return NextResponse.json(
        { error: 'Refresh token required' },
        { status: 400 }
      );
    }

    const refreshResponse = await fetch(`${DIRECTUS_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token,
      }),
    });

    if (!refreshResponse.ok) {
      const error = await refreshResponse.json();
      return NextResponse.json(
        { error: error.errors?.[0]?.message || 'Token refresh failed' },
        { status: refreshResponse.status }
      );
    }

    const refreshData = await refreshResponse.json();

    return NextResponse.json({
      success: true,
      tokens: refreshData.data,
    });
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}