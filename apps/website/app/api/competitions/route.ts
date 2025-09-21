import { NextRequest, NextResponse } from 'next/server';

// This route is now deprecated - competitions are stored locally
// Only kept for backward compatibility and banner handling

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error:
        'Competitions are now stored locally. Use banner upload endpoints for banner management.',
      deprecated: true,
    },
    { status: 410 } // Gone
  );
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      error: 'Competitions are now stored locally. Use local storage APIs.',
      deprecated: true,
    },
    { status: 410 } // Gone
  );
}

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
