"use client";

import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, X, Link as LinkIcon, Check } from "lucide-react";

interface UploadImageProps {
  currentUrl?: string | null;
  onImageChange: (url: string) => void;
  label?: string;
  category?: "movie" | "game" | "book" | "avatar";
}

export default function UploadImage({
  currentUrl,
  onImageChange,
  label = "Imagen de portada / póster",
  category = "movie",
}: UploadImageProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onImageChange(data.url);
      } else {
        setErrorMsg(data.error || "Error al subir la imagen");
      }
    } catch {
      setErrorMsg("Error de conexión con el servidor al subir imagen");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleApplyManualUrl = () => {
    if (manualUrlInput.trim()) {
      onImageChange(manualUrlInput.trim());
      setManualMode(false);
      setManualUrlInput("");
    }
  };

  const aspectRatios = {
    movie: "aspect-[2/3] max-w-[140px]",
    game: "aspect-[3/4] max-w-[140px]",
    book: "aspect-[2/3] max-w-[130px]",
    avatar: "w-24 h-24 rounded-full",
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setManualMode(!manualMode)}
          className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
        >
          <LinkIcon className="w-3 h-3" />
          {manualMode ? "Subir archivo" : "Pegar URL web"}
        </button>
      </div>

      {manualMode ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={manualUrlInput}
            onChange={(e) => setManualUrlInput(e.target.value)}
            placeholder="https://ejemplo.com/poster.jpg"
            className="flex-1 px-3 py-2 text-sm bg-black/40 border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
          />
          <button
            type="button"
            onClick={handleApplyManualUrl}
            className="px-3 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold rounded-xl flex items-center gap-1 transition"
          >
            <Check className="w-4 h-4" /> Aplicar
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          {currentUrl ? (
            <div className={`relative ${aspectRatios[category]} rounded-xl overflow-hidden border border-white/20 bg-black/50 shrink-0 shadow-lg group`}>
              <img
                src={currentUrl}
                alt="Vista previa"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=400&auto=format&fit=crop";
                }}
              />
              <button
                type="button"
                onClick={() => onImageChange("")}
                className="absolute top-1 right-1 p-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition shadow-md"
                title="Eliminar imagen"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed border-white/20 hover:border-amber-400/60 rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] transition text-center ${
                category === "avatar" ? "w-24 h-24 rounded-full" : "w-full py-6"
              }`}
            >
              {isUploading ? (
                <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs text-slate-300 font-medium">Subir archivo</span>
                  <span className="text-[10px] text-slate-500">JPG, PNG o WEBP (máx. 5MB)</span>
                </>
              )}
            </div>
          )}

          {currentUrl && (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 transition"
              >
                {isUploading ? "Subiendo..." : "Cambiar archivo"}
              </button>
              <button
                type="button"
                onClick={() => onImageChange("")}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition text-left"
              >
                Quitar imagen
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {errorMsg && (
        <p className="text-xs text-rose-400 mt-1 font-medium">{errorMsg}</p>
      )}
    </div>
  );
}
