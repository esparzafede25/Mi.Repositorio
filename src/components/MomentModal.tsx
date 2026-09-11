"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, MapPin, Users, Image as ImageIcon, Loader2, Sparkles, Film, Gamepad2, BookOpen } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import UploadImage from "@/components/UploadImage";
import { MomentItem, MovieItem, VideogameItem, BookItem } from "@/lib/types";

interface MomentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (moment: MomentItem) => void;
  initialData?: Partial<MomentItem> | null;
  associatedItem?: {
    type: "movie" | "videogame" | "book";
    id: string;
    title: string;
  } | null;
}

export default function MomentModal({
  isOpen,
  onClose,
  onSaved,
  initialData,
  associatedItem,
}: MomentModalProps) {
  const { success, error } = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [location, setLocation] = useState("");
  const [sharedWith, setSharedWith] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  // Associated item IDs
  const [movieId, setMovieId] = useState<string | null>(null);
  const [videogameId, setVideogameId] = useState<string | null>(null);
  const [bookId, setBookId] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setContent(initialData.content || "");
      setDate(
        initialData.date
          ? new Date(initialData.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0]
      );
      setLocation(initialData.location || "");
      setSharedWith(initialData.sharedWith || "");
      setImageUrl(initialData.imageUrl || "");
      setMovieId(initialData.movieId || null);
      setVideogameId(initialData.videogameId || null);
      setBookId(initialData.bookId || null);
    } else {
      setTitle("");
      setContent("");
      setDate(new Date().toISOString().split("T")[0]);
      setLocation("");
      setSharedWith("");
      setImageUrl("");
      setMovieId(associatedItem?.type === "movie" ? associatedItem.id : null);
      setVideogameId(associatedItem?.type === "videogame" ? associatedItem.id : null);
      setBookId(associatedItem?.type === "book" ? associatedItem.id : null);
    }
  }, [initialData, associatedItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      error("El título del recuerdo es obligatorio.");
      return;
    }
    if (!content.trim()) {
      error("Por favor escribí el recuerdo o memoria.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
        location: location.trim() || null,
        sharedWith: sharedWith.trim() || null,
        imageUrl: imageUrl.trim() || null,
        movieId,
        videogameId,
        bookId,
      };

      const isEdit = Boolean(initialData?.id);
      const url = isEdit ? `/api/moments/${initialData!.id}` : "/api/moments";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        success(isEdit ? "Momento actualizado ✓" : "¡Momento guardado en tu historia! ✓");
        onSaved(data.moment);
        onClose();
      } else {
        error(data.error || "Error al guardar momento");
      }
    } catch {
      error("Error de conexión al guardar recuerdo");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl border border-rose-500/30 bg-[#12151d] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {initialData?.id ? "Editar Momento" : "Registrar un Momento"}
              </h3>
              <p className="text-xs text-rose-300/80">
                Tu biografía cultural viva
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Associated Item Badge */}
        {associatedItem && (
          <div className="px-6 py-2.5 bg-white/[0.03] border-b border-white/5 flex items-center gap-2 text-xs text-slate-300">
            {associatedItem.type === "movie" && <Film className="w-4 h-4 text-amber-400" />}
            {associatedItem.type === "videogame" && <Gamepad2 className="w-4 h-4 text-cyan-400" />}
            {associatedItem.type === "book" && <BookOpen className="w-4 h-4 text-amber-300" />}
            <span>Asociado a:</span>
            <strong className="text-white font-semibold">{associatedItem.title}</strong>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Título del Momento *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: La primera vez que vi Jurassic Park con mi viejo"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/60 transition text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              El recuerdo / La memoria *
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tenía unos 10 años y la escena del T-Rex me dejó fascinado... Salimos del cine hablando del tema toda la noche."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/60 transition text-sm leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-rose-400" /> Fecha
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rose-500/60 transition text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Lugar
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej: Cine Belgrano, La Plata"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/60 transition text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-amber-400" /> Compartido con
              </label>
              <input
                type="text"
                value={sharedWith}
                onChange={(e) => setSharedWith(e.target.value)}
                placeholder="Ej: Con mi viejo y mi hermano"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/60 transition text-xs"
              />
            </div>
          </div>

          {/* Fotografía personal del momento */}
          <div className="pt-2 border-t border-white/10">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-emerald-400" /> Fotografía personal (opcional)
            </label>
            <UploadImage
              currentImageUrl={imageUrl}
              onImageUploaded={(url) => setImageUrl(url)}
              label="Subir foto del recuerdo (entrada de cine, foto familiar, etc.)"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-rose-500/20 transition flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {initialData?.id ? "Guardar Cambios" : "Guardar Recuerdo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
