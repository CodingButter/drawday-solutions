import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://db.drawday.app';
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

// GET - Proxy Directus assets with authentication
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: assetId } = await params;

    if (!assetId) {
      return NextResponse.json({ error: 'Asset ID required' }, { status: 400 });
    }

    // Build headers - use admin token if available, otherwise try without auth
    const headers: HeadersInit = {};
    if (DIRECTUS_ADMIN_TOKEN) {
      headers.Authorization = `Bearer ${DIRECTUS_ADMIN_TOKEN}`;
    }

    // Fetch the asset from Directus
    const response = await fetch(`${DIRECTUS_URL}/assets/${assetId}`, {
      headers,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
      }
      throw new Error(`Failed to fetch asset: ${response.status}`);
    }

    // Get the content type from the response
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    // Stream the image data
    const imageBuffer = await response.arrayBuffer();

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error: any) {
    console.error('Error fetching asset:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch asset' }, { status: 500 });
  }
}
