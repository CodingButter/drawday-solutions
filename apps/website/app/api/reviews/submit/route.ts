import { NextRequest, NextResponse } from 'next/server';

// Reviews functionality not implemented
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Reviews functionality is not currently implemented.' },
    { status: 501 }
  );
}
