import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface NeumorphicImageUploaderProps {
  label?: string;
  currentValue: string;
  onUploadSuccess: (url: string) => void;
  id?: string;
}

export default function NeumorphicImageUploader({
  label = "Upload Image Asset",
  currentValue,
  onUploadSuccess,
  id = "neumorphic-img-uploader"
}: NeumorphicImageUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const readFileAsDataUrl = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Local FileReader failed."));
      reader.readAsDataURL(file);
    });
  };

  const handleFile = async (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a JPG, PNG, WebP, or GIF image.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("Please upload an image smaller than 8MB.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const base64data = await readFileAsDataUrl(file);
      
      const ownerToken = sessionStorage.getItem("owner_token") || "";
      const res = await fetch("/api/portfolio/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-owner-token": ownerToken
        },
        body: JSON.stringify({
          name: file.name,
          base64: base64data
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image. (Access Denied)");
      }

      onUploadSuccess(data.url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileSelectorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2" id={`${id}-wrapper`}>
      <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 font-bold mb-1">
        {label}
      </label>

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={triggerFileSelect}
        className={`relative w-full min-h-[110px] rounded-2xl cursor-pointer transition-all duration-300 p-4 border-2 border-dashed flex flex-col items-center justify-center text-center ${
          isDragActive
            ? "border-teal-500 bg-teal-50/40 shadow-neu-in"
            : "border-stone-300/80 bg-[#EBF2FA] shadow-neu-in hover:shadow-neu-out-sm hover:border-teal-400"
        }`}
        id={id}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileSelectorChange}
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          id={`${id}-input`}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <Loader2 className="h-6 w-6 text-teal-600 animate-spin" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-teal-700">Saving Photo to Server...</span>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center justify-center space-y-1.5 animate-in fade-in duration-300">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-700">Photo Uploaded Successfully!</span>
            <span className="text-[9px] font-mono text-stone-400 select-all font-bold px-1.5 bg-white rounded border border-stone-200">{currentValue}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-1.5">
            <div className="w-9 h-9 rounded-full bg-white/70 shadow-neu-out border border-white flex items-center justify-center text-stone-500">
              <UploadCloud className="h-4.5 w-4.5" />
            </div>
            
            <div className="text-stone-600 font-medium text-xs">
              Drag & Drop file here, or <span className="text-teal-600 font-bold underline">browse files</span>
            </div>
            
            <p className="text-[9px] font-mono uppercase tracking-wider text-stone-400">
              Supports PNG, JPG, WebP, GIF (Max 8MB)
            </p>
          </div>
        )}

        {/* Small Floating Current Image Thumbnail preview if value exists */}
        {currentValue && !loading && (
          <div
            className="absolute right-3.5 bottom-3.5 w-11 h-11 rounded-xl border border-white bg-stone-100 shadow-neu-out overflow-hidden flex items-center justify-center group"
            onClick={(e) => e.stopPropagation()}
            id={`${id}-preview-badge`}
          >
            <img
              src={currentValue}
              alt="Uploaded Asset"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // If invalid url, display generic image icon
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <ImageIcon className="h-4 w-4 text-stone-300 absolute pointer-events-none" />
          </div>
        )}
      </div>

      {error && (
        <div 
          className="p-2 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-bold flex items-center gap-1.5 animate-in fade-in"
          id={`${id}-error`}
        >
          <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
