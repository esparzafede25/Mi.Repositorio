"use client";

import React, { useState, useEffect } from "react";
import { BookItem, BookStatus } from "@/lib/types";
import UploadImage from "./UploadImage";
import RatingStars from "./RatingStars";
import { X, BookOpen, Calendar, Tag, FileText, Check } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialData?: Partial<BookItem> | null;
}

export default function BookModal({
  isOpen,
  onClose,
  onSaved,
  initialData,
}: BookModalProps) {
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState<string>("");
  const [genre, setGenre] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [readDate, setReadDate] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [status, setStatus] = useState<BookStatus>("Leído");
  const [notes, setNotes] = useState("");
  const [review, setReview] = useState("");
  const [tags, setTags] = useState("");

  const isEditing = Boolean(initialData?.id);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setAuthor(initialData.author || "");
      setYear(initialData.year ? initialData.year.toString() : "");
      setGenre(initialData.genre || "");
      setCoverUrl(initialData.coverUrl || "");
      setReadDate(
        initialData.readDate
          ? new Date(initialData.readDate).toISOString().split("T")[0]
          : ""
      );
      setRating(initialData.rating || 0);
      setStatus((initialData.status as BookStatus) || "Leído");
      setNotes(initialData.notes || "");
      setReview(initialData.review || "");
      setTags(initialData.tags || "");
    } else {
      setTitle("");
      setAuthor("");
      setYear(new Date().getFullYear().toString());
      setGenre("");
      setCoverUrl("");
      setReadDate(new Date().toISOString().split("T")[0]);
      setRating(0);
      setStatus("Leído");
      setNotes("");
      setReview("");
      setTags("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      error("El título del libro es obligatorio");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title,
      author,
      year: year ? parseInt(year) : null,
      genre,
      coverUrl,
      readDate: readDate ? new Date(readDate).toISOString() : null,
      rating: rating > 0 ? rating : null,
      status,
      notes,
      review,
      tags,
    };

    try {
      const url = isEditing ? `/api/books/${initialData?.id}` : "/api/books";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        success(isEditing ? "Libro actualizado correctamente ✓" : "Libro guardado en tu archivo personal ✓");
        onSaved();
        onClose();
      } else {
        error(data.error || "Ocurrió un error al guardar el libro.");
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
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-600/15 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-black shadow-lg shadow-amber-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-serif">
                {isEditing ? "Editar Ficha Bibliográfica" : "Registrar Nuevo Libro"}
              </h3>
              <p className="text-xs text-amber-300/80 font-mono uppercase tracking-wider">
                Biblioteca & Archivo Literario
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-serif">
                Título del Libro <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: 1984, Ficciones, Cien años de soledad"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Año de publicación
              </label>
              <input
                type="number"
                min="0"
                max="2100"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="1949"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Autor / Autora
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="George Orwell, Jorge Luis Borges"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Género literario
              </label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Distopía, Ficción filosófica, Ensayo"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
              />
            </div>
          </div>

          {/* Upload cover */}
          <UploadImage
            currentUrl={coverUrl}
            onImageChange={(url) => setCoverUrl(url)}
            label="Portada del libro"
            category="book"
          />

          {/* Status, read date, rating */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Estado
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BookStatus)}
                className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition"
              >
                <option value="Leído" className="bg-[#12151d]">Leído</option>
                <option value="Leyendo" className="bg-[#12151d]">Leyendo</option>
                <option value="Pendiente" className="bg-[#12151d]">Pendiente</option>
                <option value="Abandonado" className="bg-[#12151d]">Abandonado</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> Fecha de lectura
              </label>
              <input
                type="date"
                value={readDate}
                onChange={(e) => setReadDate(e.target.value)}
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

          {/* Review & Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-amber-400" /> Reseña y Reflexión Personal
            </label>
            <textarea
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Citas favoritas, impacto de las ideas, prosa del autor..."
              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition font-serif"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Observaciones (editorial, traducción, páginas)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Edición tapa dura Alianza Editorial, 320 págs..."
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
              placeholder="literatura-universal, clasico, no-ficcion"
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
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black text-sm font-bold rounded-xl transition active:scale-95 flex items-center gap-2 shadow-lg shadow-amber-500/20"
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
