"use client";

import { useState, useRef, useEffect } from "react";
import { X, ImageIcon, AlertCircle } from "lucide-react";

export default function ImageUpload({
  value,
  onChange,
  label,
}: {
  value: string | File | null;
  onChange: (fileOrUrl: string | File | null) => void;
  label?: string;
}) {
  const [imgError, setImgError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Buat preview URL jika value berupa File
  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      setImgError(false);
      return () => URL.revokeObjectURL(url);
    } else if (typeof value === "string" && value) {
      setPreviewUrl(value);
      setImgError(false);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Pastikan ukuran di bawah 4MB, mirip batasan uploadthing
      if (file.size > 4 * 1024 * 1024) {
        alert("File is too large. Maximum 4MB.");
        return;
      }
      onChange(file);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setImgError(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const displayName = value instanceof File ? value.name : (typeof value === "string" && value ? value.split("/").pop() : "");

  return (
    <div className="space-y-2">
      {/* ─── Hidden Input ─── */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />

      {/* ─── Image exists & successfully loaded ─── */}
      {previewUrl && !imgError && (
        <div className="space-y-2">
          {/* Preview */}
          <div className="relative inline-block group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt={label || "preview"}
              className="w-full max-w-xs h-40 rounded-xl object-cover border border-gray-200 shadow-sm"
              onError={() => setImgError(true)}
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 rounded-xl transition-all duration-200 flex items-end pointer-events-none">
              <p className="opacity-0 group-hover:opacity-100 text-white text-[10px] px-2 py-1.5 truncate w-full transition-opacity duration-200">
                {displayName}
              </p>
            </div>
            {/* Delete button */}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-all active:scale-90 z-10"
              title="Delete image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Change image button */}
          <div className="relative max-w-xs">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors py-2 px-3 text-xs font-medium text-gray-500 cursor-pointer relative overflow-hidden"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Change image</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Image exists but failed to load ─── */}
      {previewUrl && imgError && (
        <div className="flex flex-col items-center justify-center gap-2 w-full max-w-xs h-40 rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 text-orange-400">
          <AlertCircle className="w-6 h-6" />
          <span className="text-xs text-center px-4">
            Image failed to load
            <br />
            <span className="text-[10px] opacity-70 break-all">{displayName}</span>
          </span>
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs underline text-orange-500 hover:text-orange-700"
          >
            Delete
          </button>
        </div>
      )}

      {/* ─── No image yet — upload area ─── */}
      {!previewUrl && (
        <div className="relative w-full max-w-xs">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="h-40 rounded-xl border-2 border-dashed border-gray-200 hover:border-zinc-400 bg-gray-50 hover:bg-gray-100 transition-all duration-200 flex flex-col items-center justify-center gap-2 text-gray-400 cursor-pointer relative overflow-hidden"
          >
            <ImageIcon className="w-7 h-7" />
            <span className="text-xs font-medium">Click to select image</span>
            <span className="text-[10px] opacity-60">Max 4MB · JPG, PNG, WebP</span>
          </div>
        </div>
      )}
    </div>
  );
}
