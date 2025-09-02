/**
 * Image Upload Component
 *
 * Purpose: Reusable component for image uploads with drag-and-drop support,
 * preview, and file validation.
 */

"use client";

import React, { useRef, useState, DragEvent } from "react";
import { Button } from "./button";
import { cn } from "../lib/utils";
import { Image as ImageIcon, Upload, Trash2 } from "lucide-react";

interface ImageUploadProps {
  value?: string; // Base64 encoded image
  onChange: (value: string | undefined) => void;
  onError?: (error: string) => void;
  maxSize?: number; // In bytes
  accept?: string;
  className?: string;
  height?: string;
  width?: string;
  placeholder?: React.ReactNode;
  compact?: boolean; // For smaller UI in lists
  loading?: boolean; // For async loading states
  compress?: boolean; // Whether to compress images (default: true)
  compressionOptions?: {
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
  };
}

export function ImageUpload({
  value,
  onChange,
  onError,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = "image/*",
  className,
  height = "h-32",
  width = "w-full",
  placeholder,
  compact = false,
  loading = false,
  compress = true,
  compressionOptions = {
    quality: 80,
    maxWidth: 1200,
    maxHeight: 800,
  },
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const compressImage = async (file: File): Promise<string> => {
    // Check if we're in a browser environment and have access to the API
    if (typeof window !== 'undefined' && compress) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('quality', compressionOptions.quality?.toString() || '80');
        formData.append('maxWidth', compressionOptions.maxWidth?.toString() || '1200');
        formData.append('maxHeight', compressionOptions.maxHeight?.toString() || '800');

        const response = await fetch('/api/compress-image', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          return data.compressed;
        }
      } catch (error) {
        console.warn('Image compression failed, using original:', error);
      }
    }
    
    // Fallback to uncompressed base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (file: File) => {
    // Validate file size
    if (file.size > maxSize) {
      onError?.(
        `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`,
      );
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      onError?.("Only image files are allowed");
      return;
    }

    setIsProcessing(true);
    try {
      const result = await compressImage(file);
      onChange(result);
    } catch (error) {
      onError?.("Failed to process image");
      console.error('Image processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Only set dragging to false if we're leaving the component entirely
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith("image/"));

    if (imageFile) {
      handleFileUpload(imageFile);
    } else {
      onError?.("Please drop an image file");
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (loading || isProcessing) {
    return (
      <div
        className={cn(
          "relative border-2 border-dashed border-border rounded flex items-center justify-center",
          width,
          height,
          className,
        )}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            {isProcessing ? "Processing..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (value) {
    return (
      <div
        className={cn(
          "relative group border-2 border-transparent hover:border-dashed hover:border-primary/50 rounded overflow-hidden transition-all",
          isDragging && "border-primary bg-primary/10",
          width,
          height,
          className,
        )}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        <img
          src={value}
          alt="Uploaded image"
          className="w-full h-full object-cover"
        />

        {/* Overlay on hover/drag */}
        <div
          className={cn(
            "absolute inset-0 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2",
            isDragging && "opacity-100",
          )}
        >
          {isDragging ? (
            <div className="text-white text-center">
              <Upload className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Drop to replace</p>
            </div>
          ) : (
            <>
              <Button
                size="icon"
                variant="secondary"
                className={compact ? "h-8 w-8" : "h-10 w-10"}
                onClick={() => fileInputRef.current?.click()}
                type="button"
                title="Replace image"
              >
                <Upload className={compact ? "h-4 w-4" : "h-5 w-5"} />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                className={compact ? "h-8 w-8" : "h-10 w-10"}
                onClick={handleRemove}
                type="button"
                title="Remove image"
              >
                <Trash2 className={compact ? "h-4 w-4" : "h-5 w-5"} />
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded transition-all",
        isDragging ? "border-primary bg-primary/10" : "border-border",
        width,
        height,
        className,
      )}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        {placeholder ||
          (compact ? (
            // Compact mode - just icon, no text
            <div className="flex flex-col items-center justify-center">
              <ImageIcon className="h-6 w-6" />
              {isDragging && <p className="text-xs mt-1">Drop</p>}
            </div>
          ) : (
            // Normal mode - icon with text
            <>
              <ImageIcon className="h-8 w-8 mb-2" />
              <p className="text-sm">
                {isDragging ? "Drop image here" : "Drop or click to upload"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Max size: {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </>
          ))}
      </button>
    </div>
  );
}
