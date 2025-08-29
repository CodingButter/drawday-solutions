import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const quality = parseInt(formData.get('quality') as string) || 80;
    const maxWidth = parseInt(formData.get('maxWidth') as string) || 1200;
    const maxHeight = parseInt(formData.get('maxHeight') as string) || 800;
    
    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Compress and resize the image
    const compressedBuffer = await sharp(buffer)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
    
    // Convert to base64
    const base64 = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
    
    // Return the compressed image
    return NextResponse.json({ 
      compressed: base64,
      originalSize: buffer.length,
      compressedSize: compressedBuffer.length,
      compressionRatio: ((1 - compressedBuffer.length / buffer.length) * 100).toFixed(2)
    });
  } catch (error) {
    console.error('Image compression error:', error);
    return NextResponse.json({ error: 'Failed to compress image' }, { status: 500 });
  }
}