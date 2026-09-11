"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, BookOpen, Loader2, Sparkles, Image as ImageIcon, Film, Gamepad2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import UploadImage from "@/components/UploadImage";
import { JournalEntryItem, MovieItem, VideogameItem, BookItem } from "@/lib/types";

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (entry: JournalEntryItem) => void;
  initialData?: Partial<JournalEntryItem> | null;
}

export default function JournalModal({
  isOpen,
  onClose,
  onSaved,
  initialData,
}: JournalModalProps) {
  const { success, error } = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [images, setImages] = useState("");
  const [saving, setSaving] = useState(false);

  // Available user works for linking
  const [userMovies, setUserMovies] = useState<MovieItem[]>([]);
  const [userGames, setUserGames] = useState<VideogameItem[]>([]);
  const [userBooks, setUserBooks] = useState<BookItem[]>([]);
  const [linkedEntityType, setLinkedEntityType] = useState<"none" | "movie" | "videogame" | "book">("none");
  const [linkedEntityId, setLinkedEntityId] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      // Load user items to link
      Promise.all([
        fetch("/api/movies").then((r) => r.json()).then((d) => setUserMovies(d.movies || [])),
        fetch("/api/videogames").then((r) => r.json()).then((d) => setUserGames(d.videogames || [])),
        fetch("/api/books").then((r) => r.json()).then((d) => setUserBooks(d.books || [])),
      ]).catch(() => {});

      if (initialData) {
        setTitle(initialData.title || "");
        setContent(initialData.content || "");
        setDate(
          initialData.date
            ? new Date(initialData.date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0]
        );
        setImages(initialData.images || "");
        if (initialData.movieId) {
          setLinkedEntityType("movie");
          setLinkedEntityId(initialData.movieId);
        } else if (initialData.videogameId) {
          setLinkedEntityType("videogame");
          setLinkedEntityId(initialData.videogameId);
        } else if (initialData.bookId) {
          setLinkedEntityType("book");
          setLinkedEntityId(initialData.bookId);
        } else {
          setLinkedEntityType("none");
          setLinkedEntityId("");
        }
      } else {
        setTitle("");
        setContent("");
        setDate(new Date().toISOString().split("T")[0]);
        setImages("");
        setLinkedEntityType("none");
        setLinkedEntityId("");
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      error("Título y contenido requeridos.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
        images: images.trim() || null,
        movieId: linkedEntityType === "movie" ? linkedEntityId : null,
        videogameId: linkedEntityType === "videogame" ? linkedEntityId : null,
        bookId: linkedEntityType === "book" ? linkedEntityId : null,
      };

      const isEdit = Boolean(initialData?.id);
      const url = isEdit ? `/api/journal/${initialData!.id}` : "/api/journal";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        success(isEdit ? "Entrada actualizada ✓" : "Entrada guardada en tu diario ✓");
        onSaved(data.entry);
        onClose();
      } else {
        error(data.error || "Error al guardar entrada");
      }
    } catch {
      error("Error de conexión al guardar diario");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl border border-amber-500/30 bg-[#12151d] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-500/15 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {initialData?.id ? "Editar Entrada de Diario" : "Escribir en Mi Diario"}
              </h3>
              <p className="text-xs text-amber-300/80">
                Reflexiones y vivencias culturales
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Título de la Entrada *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Reflexión al terminar esta historia..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> Fecha
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Texto Libre de la Entrada *
            </label>
            <textarea
              required
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribí libremente qué sentiste, con qué lo asociaste o por qué fue importante para vos en este momento..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500/50 leading-relaxed"
            />
          </div>

          {/* Vincular a una obra cultural */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Vincular a una obra de tu repositorio (opcional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                value={linkedEntityType}
                onChange={(e) => {
                  setLinkedEntityType(e.target.value as any);
                  setLinkedEntityId("");
                }}
                className="px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
              >
                <option value="none">Sin vincular</option>
                <option value="movie">🎬 Película</option>
                <option value="videogame">🎮 Videojuego</option>
                <option value="book">📚 Libro</option>
              </select>

              {linkedEntityType !== "none" && (
                <select
                  value={linkedEntityId}
                  onChange={(e) => setLinkedEntityId(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
                >
                  <option value="">Seleccionar título...</option>
                  {linkedEntityType === "movie" &&
                    userMovies.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title} ({m.year || "s/f"})
                      </option>
                    ))}
                  {linkedEntityType === "videogame" &&
                    userGames.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title} ({g.platform || "Juego"})
                      </option>
                    ))}
                  {linkedEntityType === "book" &&
                    userBooks.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title} ({b.author || "Libro"})
                      </option>
                    ))}
                </select>
              )}
            </div>
          </div>

          {/* Imagen adjunta */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-emerald-400" /> Imagen adjunta (opcional)
            </label>
            <UploadImage
              currentImageUrl={images}
              onImageUploaded={(url) => setImages(url)}
              label="Subir fotografía o imagen para esta entrada"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm shadow-lg shadow-amber-500/20 transition flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {initialData?.id ? "Actualizar Entrada" : "Publicar en Diario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
