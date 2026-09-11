"use client";

import React, { useState, useEffect } from "react";
import { MovieItem, MovieStatus } from "@/lib/types";
import UploadImage from "./UploadImage";
import RatingStars from "./RatingStars";
import { X, Film, Calendar, Tag, FileText, Check } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface MovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialData?: Partial<MovieItem> | null;
}

export default function MovieModal({
  isOpen,
  onClose,
  onSaved,
  initialData,
}: MovieModalProps) {
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [year, setYear] = useState<string>("");
  const [director, setDirector] = useState("");
  const [genres, setGenres] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [watchedDate, setWatchedDate] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [status, setStatus] = useState<MovieStatus>("Vista");
  const [notes, setNotes] = useState("");
  const [review, setReview] = useState("");
  const [tags, setTags] = useState("");

  const isEditing = Boolean(initialData?.id);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setOriginalTitle(initialData.originalTitle || "");
      setYear(initialData.year ? initialData.year.toString() : "");
      setDirector(initialData.director || "");
      setGenres(initialData.genres || "");
      setPosterUrl(initialData.posterUrl || "");
      setWatchedDate(
        initialData.watchedDate
          ? new Date(initialData.watchedDate).toISOString().split("T")[0]
          : ""
      );
      setRating(initialData.rating || 0);
      setStatus((initialData.status as MovieStatus) || "Vista");
      setNotes(initialData.notes || "");
      setReview(initialData.review || "");
      setTags(initialData.tags || "");
    } else {
      setTitle("");
      setOriginalTitle("");
      setYear(new Date().getFullYear().toString());
      setDirector("");
      setGenres("");
      setPosterUrl("");
      setWatchedDate(new Date().toISOString().split("T")[0]);
      setRating(0);
      setStatus("Vista");
      setNotes("");
      setReview("");
      setTags("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      error("El título es obligatorio");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title,
      originalTitle,
      year: year ? parseInt(year) : null,
      director,
      genres,
      posterUrl,
      watchedDate: watchedDate ? new Date(watchedDate).toISOString() : null,
      rating: rating > 0 ? rating : null,
      status,
      notes,
      review,
      tags,
    };

    try {
      const url = isEditing ? `/api/movies/${initialData?.id}` : "/api/movies";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        success(isEditing ? "Película actualizada correctamente ✓" : "Película agregada correctamente ✓");
        onSaved();
        onClose();
      } else {
        error(data.error || "Ocurrió un error al guardar la película.");
      }
    } catch {
      error("Error de conexión con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-amber-500/30 bg-[#12151d] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-500/15 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-400 text-black shadow-lg shadow-amber-400/20">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isEditing ? "Editar Película" : "Agregar Película al Archivo"}
              </h3>
              <p className="text-xs text-amber-400/80 font-mono uppercase tracking-wider">
                Archivo Cinematográfico
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Main info row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Título <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Blade Runner"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Año
              </label>
              <input
                type="number"
                min="1880"
                max="2100"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="1982"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Título Original (opcional)
              </label>
              <input
                type="text"
                value={originalTitle}
                onChange={(e) => setOriginalTitle(e.target.value)}
                placeholder="Blade Runner: The Final Cut"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Director
              </label>
              <input
                type="text"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                placeholder="Ridley Scott"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Géneros (separados por coma)
            </label>
            <input
              type="text"
              value={genres}
              onChange={(e) => setGenres(e.target.value)}
              placeholder="Ciencia Ficción, Neo-Noir, Cyberpunk"
              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          {/* Upload poster */}
          <UploadImage
            currentUrl={posterUrl}
            onImageChange={(url) => setPosterUrl(url)}
            label="Póster de la película"
            category="movie"
          />

          {/* Status, watched date, rating */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Estado
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MovieStatus)}
                className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition"
              >
                <option value="Vista" className="bg-[#12151d]">Vista</option>
                <option value="Pendiente" className="bg-[#12151d]">Pendiente</option>
                <option value="En pausa" className="bg-[#12151d]">En pausa</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> Fecha en que la vio
              </label>
              <input
                type="date"
                value={watchedDate}
                onChange={(e) => setWatchedDate(e.target.value)}
                className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Calificación
              </label>
              <div className="pt-1.5">
                <RatingStars
                  value={rating}
                  onChange={(val) => setRating(val)}
                  size="md"
                />
              </div>
            </div>
          </div>

          {/* Personal review and notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-amber-400" /> Reseña Personal
            </label>
            <textarea
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="¿Qué te hizo sentir? ¿Por qué es inolvidable para vos?"
              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Observaciones / Datos técnicos
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Vista en pantalla IMAX, edición de corte del director..."
              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-amber-400" /> Etiquetas
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="favoritas, 80s, rewatch, cinefilia"
              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-white/5 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black text-sm font-bold rounded-xl transition active:scale-95 flex items-center gap-2 shadow-lg shadow-amber-400/20"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {isEditing ? "Guardar Cambios" : "Guardar en Mi Repositorio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
