import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://db.drawday.app';
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

// POST - Upload file to Directus
export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();

    // Forward the upload to Directus with admin token
    const uploadResponse = await fetch(`${DIRECTUS_URL}/files`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      console.error('Directus upload failed:', error);
      throw new Error('Failed to upload file to Directus');
    }

    const result = await uploadResponse.json();
    console.log('File uploaded to Directus:', result.data.id);

    return NextResponse.json({
      fileId: result.data.id,
      filename: result.data.filename_download,
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload file' }, { status: 500 });
  }
}
