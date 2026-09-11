"use client";

import React, { useState, useEffect } from "react";
import { VideogameItem, GameStatus } from "@/lib/types";
import UploadImage from "./UploadImage";
import RatingStars from "./RatingStars";
import { X, Gamepad2, Calendar, Tag, FileText, Check } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialData?: Partial<VideogameItem> | null;
}

export default function GameModal({
  isOpen,
  onClose,
  onSaved,
  initialData,
}: GameModalProps) {
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("PC");
  const [year, setYear] = useState<string>("");
  const [developer, setDeveloper] = useState("");
  const [genres, setGenres] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [playedDate, setPlayedDate] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [status, setStatus] = useState<GameStatus>("Terminado");
  const [notes, setNotes] = useState("");
  const [review, setReview] = useState("");
  const [tags, setTags] = useState("");

  const isEditing = Boolean(initialData?.id);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setPlatform(initialData.platform || "PC");
      setYear(initialData.year ? initialData.year.toString() : "");
      setDeveloper(initialData.developer || "");
      setGenres(initialData.genres || "");
      setCoverUrl(initialData.coverUrl || "");
      setPlayedDate(
        initialData.playedDate
          ? new Date(initialData.playedDate).toISOString().split("T")[0]
          : ""
      );
      setRating(initialData.rating || 0);
      setStatus((initialData.status as GameStatus) || "Terminado");
      setNotes(initialData.notes || "");
      setReview(initialData.review || "");
      setTags(initialData.tags || "");
    } else {
      setTitle("");
      setPlatform("PC");
      setYear(new Date().getFullYear().toString());
      setDeveloper("");
      setGenres("");
      setCoverUrl("");
      setPlayedDate(new Date().toISOString().split("T")[0]);
      setRating(0);
      setStatus("Terminado");
      setNotes("");
      setReview("");
      setTags("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      error("El título del videojuego es obligatorio");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title,
      platform,
      year: year ? parseInt(year) : null,
      developer,
      genres,
      coverUrl,
      playedDate: playedDate ? new Date(playedDate).toISOString() : null,
      rating: rating > 0 ? rating : null,
      status,
      notes,
      review,
      tags,
    };

    try {
      const url = isEditing ? `/api/videogames/${initialData?.id}` : "/api/videogames";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        success(isEditing ? "Videojuego actualizado correctamente ✓" : "Videojuego guardado correctamente ✓");
        onSaved();
        onClose();
      } else {
        error(data.error || "Ocurrió un error al guardar el videojuego.");
      }
    } catch {
      error("Error de conexión con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-cyan-500/30 bg-[#12151d] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-cyan-500/15 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-400 text-black shadow-lg shadow-cyan-400/20">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isEditing ? "Editar Videojuego" : "Registrar Videojuego"}
              </h3>
              <p className="text-xs text-cyan-400/80 font-mono uppercase tracking-wider">
                Archivo Gamer & Memorias Digitales
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
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Título del Videojuego <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Resident Evil 2, Elden Ring, Hollow Knight"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Año de lanzamiento
              </label>
              <input
                type="number"
                min="1970"
                max="2100"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="1998"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Plataforma
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition"
              >
                <option value="PC" className="bg-[#12151d]">PC / Windows</option>
                <option value="PlayStation 5" className="bg-[#12151d]">PlayStation 5</option>
                <option value="PlayStation 4" className="bg-[#12151d]">PlayStation 4</option>
                <option value="PlayStation 2" className="bg-[#12151d]">PlayStation 2 / Retro</option>
                <option value="Nintendo Switch" className="bg-[#12151d]">Nintendo Switch</option>
                <option value="Xbox Series X/S" className="bg-[#12151d]">Xbox Series X/S</option>
                <option value="Xbox One" className="bg-[#12151d]">Xbox One</option>
                <option value="Retro / Emulador" className="bg-[#12151d]">Retro / Emulador</option>
                <option value="Móvil" className="bg-[#12151d]">Móvil / Tablet</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Desarrollador / Estudio
              </label>
              <input
                type="text"
                value={developer}
                onChange={(e) => setDeveloper(e.target.value)}
                placeholder="Capcom, FromSoftware, Valve"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition"
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
              placeholder="Survival Horror, Acción, RPG, Aventura"
              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition"
            />
          </div>

          {/* Upload cover */}
          <UploadImage
            currentUrl={coverUrl}
            onImageChange={(url) => setCoverUrl(url)}
            label="Carátula / Portada del juego"
            category="game"
          />

          {/* Status, played date, rating */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Estado
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as GameStatus)}
                className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition"
              >
                <option value="Terminado" className="bg-[#12151d]">Terminado</option>
                <option value="En progreso" className="bg-[#12151d]">En progreso</option>
                <option value="Pendiente" className="bg-[#12151d]">Pendiente</option>
                <option value="Abandonado" className="bg-[#12151d]">Abandonado</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Fecha jugado
              </label>
              <input
                type="date"
                value={playedDate}
                onChange={(e) => setPlayedDate(e.target.value)}
                className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition"
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
              <FileText className="w-3.5 h-3.5 text-cyan-400" /> Reseña Personal
            </label>
            <textarea
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Jugabilidad, atmósfera, momentos memorables..."
              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Observaciones (horas jugadas, logros, dificultad)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Jugado con mando DualSense en dificultad Difícil, 45 horas registradas..."
              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-cyan-400" /> Etiquetas
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="obra-maestra, cooperativo, platino, 100%"
              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition"
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
              className="px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-black text-sm font-bold rounded-xl transition active:scale-95 flex items-center gap-2 shadow-lg shadow-cyan-400/20"
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
