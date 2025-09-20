import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    // Check content type to handle both FormData and JSON
    const contentType = request.headers.get('content-type') || '';
    console.log('Compress-image API called with content-type:', contentType);

    let image: string;
    let type: string = 'banner'; // default type
    let quality: number = 80;
    let maxWidth: number = 1200;
    let maxHeight: number = 800;

    if (contentType.includes('multipart/form-data')) {
      // Handle FormData from image-upload component
      const formData = await request.formData();
      const file = formData.get('image') as File;
      quality = parseInt(formData.get('quality') as string) || 80;
      maxWidth = parseInt(formData.get('maxWidth') as string) || 1200;
      maxHeight = parseInt(formData.get('maxHeight') as string) || 800;

      if (!file) {
        return NextResponse.json(
          { error: 'Missing image file' },
          { status: 400 }
        );
      }

      // Convert file to base64 data URL
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64Data = buffer.toString('base64');
      image = `data:${file.type};base64,${base64Data}`;
    } else {
      // Handle JSON from direct API calls
      const body = await request.json();
      image = body.image;
      type = body.type || 'banner';

      if (!image || !type) {
        return NextResponse.json(
          { error: 'Missing image or type parameter' },
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
    }

    // Extract base64 data from data URL for processing
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    let processedBuffer: Buffer;

    if (type === 'logo') {
      // Logo: 75x75 max, PNG format for transparency
      processedBuffer = await sharp(buffer)
        .resize(75, 75, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .png({
          quality: 90,
          compressionLevel: 9,
        })
        .toBuffer();
    } else {
      // Banner or general image: use dynamic dimensions, JPEG for better compression
      processedBuffer = await sharp(buffer)
        .resize(maxWidth, maxHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({
          quality: quality,
          progressive: true,
          mozjpeg: true,
        })
        .toBuffer();
    }

    // Convert back to base64
    const compressedBase64 = processedBuffer.toString('base64');
    const mimeType = type === 'logo' ? 'image/png' : 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${compressedBase64}`;

    // Calculate size reduction
    const originalSize = buffer.length;
    const compressedSize = processedBuffer.length;
    const reduction = Math.round((1 - compressedSize / originalSize) * 100);

    console.log(`Image compression: ${type} - Original: ${originalSize} bytes, Compressed: ${compressedSize} bytes, Reduction: ${reduction}%`);

    return NextResponse.json({
      compressed: dataUrl, // Use 'compressed' key that image-upload component expects
      image: dataUrl,     // Keep 'image' for backward compatibility
      originalSize,
      compressedSize,
      reduction: `${reduction}%`,
    });
  } catch (error) {
    console.error('Image compression error:', error);

    // Provide more specific error message
    let errorMessage = 'Failed to compress image';
    if (error instanceof Error) {
      if (error.message.includes('libspng')) {
        errorMessage = 'Invalid PNG image format';
      } else if (error.message.includes('JSON')) {
        errorMessage = 'Invalid request format';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}