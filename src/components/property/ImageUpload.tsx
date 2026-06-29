"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface ImageFile {
  file: File;
  preview: string;
}

interface ImageUploadProps {
  onImagesSelected: (files: File[]) => void;
  existingImages?: string[]; // URLs of existing images
  maxImages?: number;
}

export default function ImageUpload({
  onImagesSelected,
  existingImages = [],
  maxImages = 5,
}: ImageUploadProps) {
  const [images, setImages] = useState<ImageFile[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const totalImages = images.length + acceptedFiles.length;
      if (totalImages > maxImages) {
        alert(`Maximum ${maxImages} images allowed.`);
        return;
      }

      const newImages = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      const updated = [...images, ...newImages];
      setImages(updated);
      onImagesSelected(updated.map((i) => i.file));
    },
    [images, maxImages, onImagesSelected],
  );

  function removeImage(index: number) {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onImagesSelected(updated.map((i) => i.file));
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        Photos ({images.length}/{maxImages})
      </label>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-emerald-500 bg-emerald-50"
            : "border-gray-300 hover:border-emerald-400"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-500 text-sm">
          {isDragActive
            ? "Drop images here..."
            : "Drag & drop photos, or click to select"}
        </p>
        <p className="text-gray-400 text-xs mt-1">
          JPEG, PNG, or WebP — max 5MB each
        </p>
      </div>

      {/* Existing images + new previews */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-3">
        {existingImages.map((url, i) => (
          <div key={`existing-${i}`} className="relative group">
            <img
              src={url}
              alt={`Property photo ${i + 1}`}
              className="w-full h-24 object-cover rounded-lg border"
            />
          </div>
        ))}
        {images.map((img, i) => (
          <div key={i} className="relative group">
            <img
              src={img.preview}
              alt={`Upload ${i + 1}`}
              className="w-full h-24 object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
