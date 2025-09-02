import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const { image, type } = await request.json();
    
    if (!image || !type) {
      return NextResponse.json(
        { error: 'Missing image or type parameter' },
        { status: 400 }
      );
    }

    // Extract base64 data from data URL
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
    } else if (type === 'banner') {
      // Banner: 300x200 max (landscape), JPEG for better compression
      processedBuffer = await sharp(buffer)
        .resize(300, 200, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ 
          quality: 85,
          progressive: true,
          mozjpeg: true,
        })
        .toBuffer();
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "logo" or "banner"' },
        { status: 400 }
      );
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
      image: dataUrl,
      originalSize,
      compressedSize,
      reduction: `${reduction}%`,
    });
  } catch (error) {
    console.error('Image compression error:', error);
    return NextResponse.json(
      { error: 'Failed to compress image' },
      { status: 500 }
    );
  }
}