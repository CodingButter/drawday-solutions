import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated (you can add more checks here)
    const token = request.cookies.get('token') || request.headers.get('authorization');

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Path to the extension ZIP file
    const extensionPath = path.join(
      process.cwd(),
      '../../apps/extension/drawday-spinner-extension.zip'
    );

    try {
      const file = await readFile(extensionPath);

      return new NextResponse(file as any, {
        status: 200,
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': 'attachment; filename="drawday-spinner-extension.zip"',
          'Content-Length': file.length.toString(),
        },
      });
    } catch (fileError) {
      console.error('Extension file not found:', fileError);
      return NextResponse.json(
        { error: 'Extension file not found. Please build the extension first.' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to download extension' }, { status: 500 });
  }
}
