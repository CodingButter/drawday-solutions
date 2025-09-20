import { NextRequest, NextResponse } from 'next/server';

// This endpoint is deprecated - reviews functionality not implemented
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Reviews functionality is not currently implemented.' },
    { status: 501 } // 501 Not Implemented
  );
}
