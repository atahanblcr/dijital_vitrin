import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';

interface ImageUploaderProps {
  images: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onChange, maxFiles = 7 }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...images, ...acceptedFiles].slice(0, maxFiles);
      onChange(newFiles);
    },
    [images, maxFiles, onChange]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': []
    },
    maxFiles: maxFiles - images.length,
    disabled: images.length >= maxFiles
  });

  const removeImage = (index: number) => {
    const newFiles = images.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-400'
        } ${isDragReject ? 'border-red-500 bg-red-50' : ''} ${
          images.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">
          Görselleri sürükle bırak veya <span className="text-orange-500 font-medium">tıkla seç</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          JPG, PNG, WebP — Maks. 5MB (Kalan: {maxFiles - images.length})
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((file, idx) => (
            <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${idx}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {idx === 0 && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded font-medium shadow-sm">
                  ANA GÖRSEL
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
