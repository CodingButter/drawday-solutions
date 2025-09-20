import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'https://db.drawday.app';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (authHeader) {
      // Attempt to revoke the token with Directus
      await fetch(`${DIRECTUS_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    // Even if Directus logout fails, we still return success
    // since the client will clear local storage anyway
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  }
}