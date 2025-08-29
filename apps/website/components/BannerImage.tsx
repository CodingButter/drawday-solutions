'use client';

import { useState, useEffect } from 'react';
import { imageStore } from '@/lib/image-utils';

interface BannerImageProps {
  imageId: string;
  className?: string;
}

export function BannerImage({ imageId, className = "w-full h-32 object-cover rounded-lg" }: BannerImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const image = await imageStore.getImage(imageId);
        setImageSrc(image);
      } catch (error) {
        console.error('Error loading banner image:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [imageId]);

  if (loading) {
    return <div className={`${className} bg-gray-800 animate-pulse`} />;
  }

  if (!imageSrc) {
    return <div className={`${className} bg-gray-800 flex items-center justify-center text-gray-500`}>Image not found</div>;
  }

  return <img src={imageSrc} alt="Banner" className={className} />;
}