import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'https://db.drawday.app';
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || 'mNjKgq86jnVokcdwBRKkXgrHEoROvR04';

export async function POST(request: NextRequest) {
  try {
    const { image, filename, title } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Missing image data' },
        { status: 400 }
      );
    }

    // Validate image format
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image format. Must be a data URL starting with data:image/' },
        { status: 400 }
      );
    }

    // Extract mime type and base64 data
    const mimeTypeMatch = image.match(/^data:(image\/[^;]+);base64,/);
    if (!mimeTypeMatch) {
      return NextResponse.json(
        { error: 'Invalid image format. Could not extract MIME type' },
        { status: 400 }
      );
    }

    const mimeType = mimeTypeMatch[1];
    const base64Data = image.replace(/^data:image\/[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate filename if not provided
    const fileExtension = mimeType.split('/')[1];
    const finalFilename = filename || `image_${Date.now()}.${fileExtension}`;

    // Create FormData for Directus file upload
    const formData = new FormData();
    const blob = new Blob([buffer], { type: mimeType });
    formData.append('file', blob, finalFilename);

    if (title) {
      formData.append('title', title);
    }

    // Upload to Directus
    const uploadResponse = await fetch(`${DIRECTUS_URL}/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Directus upload failed:', uploadResponse.status, errorText);
      throw new Error(`Directus upload failed: ${uploadResponse.status}`);
    }

    const uploadData = await uploadResponse.json();
    console.log('File uploaded to Directus:', uploadData.data.id);

    return NextResponse.json({
      success: true,
      file: uploadData.data,
      url: `${DIRECTUS_URL}/assets/${uploadData.data.id}`,
    });

  } catch (error) {
    console.error('Image upload error:', error);

    let errorMessage = 'Failed to upload image';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}