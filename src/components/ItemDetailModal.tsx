"use client";

import React from "react";
import { MovieItem, VideogameItem, BookItem } from "@/lib/types";
import {
  X,
  Star,
  Calendar,
  Tag,
  Edit2,
  Trash2,
  Film,
  Gamepad2,
  BookOpen,
  FileText,
  User,
} from "lucide-react";

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: (MovieItem | VideogameItem | BookItem) | null;
  type: "movie" | "videogame" | "book";
  onEdit: () => void;
  onDelete: () => void;
}

export default function ItemDetailModal({
  isOpen,
  onClose,
  item,
  type,
  onEdit,
  onDelete,
}: ItemDetailModalProps) {
  if (!isOpen || !item) return null;

  const typeConfig = {
    movie: {
      label: "Película",
      icon: Film,
      accentText: "text-amber-400",
      accentBg: "bg-amber-400",
      borderGlow: "border-amber-500/30",
      aspectRatio: "aspect-[2/3] max-w-[240px]",
    },
    videogame: {
      label: "Videojuego",
      icon: Gamepad2,
      accentText: "text-cyan-400",
      accentBg: "bg-cyan-400",
      borderGlow: "border-cyan-500/30",
      aspectRatio: "aspect-[3/4] max-w-[240px]",
    },
    book: {
      label: "Libro",
      icon: BookOpen,
      accentText: "text-amber-300",
      accentBg: "bg-amber-400",
      borderGlow: "border-amber-500/30",
      aspectRatio: "aspect-[2/3] max-w-[220px]",
    },
  }[type];

  const Icon = typeConfig.icon;

  // Polymorphic getters
  const image =
    ("posterUrl" in item && item.posterUrl) ||
    ("coverUrl" in item && item.coverUrl) ||
    null;

  const creator =
    ("director" in item && item.director ? `Dir. ${item.director}` : null) ||
    ("developer" in item && item.developer ? `Dev. ${item.developer}` : null) ||
    ("author" in item && item.author ? `Por ${item.author}` : null);

  const genres =
    ("genres" in item && item.genres) ||
    ("genre" in item && item.genre) ||
    null;

  const dateConsumed =
    ("watchedDate" in item && item.watchedDate) ||
    ("playedDate" in item && item.playedDate) ||
    ("readDate" in item && item.readDate) ||
    null;

  const dateLabel = {
    movie: "Visto el",
    videogame: "Jugado el",
    book: "Leído el",
  }[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border ${typeConfig.borderGlow} bg-[#12151d] shadow-2xl overflow-hidden`}>
        {/* Header bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-white/[0.04] to-transparent">
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-lg bg-white/10 ${typeConfig.accentText}`}>
              <Icon className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">
              Ficha de {typeConfig.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit();
              }}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
              title="Editar"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete();
              }}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition ml-2"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal content body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Image display */}
            <div className={`w-full sm:w-auto ${typeConfig.aspectRatio} rounded-xl overflow-hidden bg-black/50 border border-white/10 shrink-0 shadow-xl self-start`}>
              {image ? (
                <img
                  src={image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-600 bg-white/[0.02]">
                  <Icon className="w-12 h-12 mb-2" />
                  <span className="text-xs">Sin imagen</span>
                </div>
              )}
            </div>

            {/* Info and metadata */}
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                    {item.title}
                  </h2>
                  {item.rating ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 rounded-full border border-amber-400/30 text-amber-400 text-sm font-bold shrink-0">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{item.rating.toFixed(1)}</span>
                      <span className="text-slate-500 text-xs font-normal">/ 5</span>
                    </div>
                  ) : null}
                </div>

                {"originalTitle" in item && item.originalTitle && item.originalTitle !== item.title && (
                  <p className="text-sm text-slate-400 italic mt-0.5">
                    ({item.originalTitle})
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {item.year && (
                    <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-md text-xs font-mono text-slate-300">
                      {item.year}
                    </span>
                  )}
                  {"platform" in item && item.platform && (
                    <span className="px-2.5 py-0.5 bg-cyan-500/20 border border-cyan-500/40 rounded-md text-xs font-bold text-cyan-300">
                      {item.platform}
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 bg-white/10 rounded-full text-xs font-semibold text-slate-200">
                    {item.status}
                  </span>
                </div>

                {creator && (
                  <p className="text-base text-slate-300 font-medium mt-3">
                    {creator}
                  </p>
                )}

                {genres && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {genres.split(",").map((g, i) => (
                      <span
                        key={i}
                        className="text-xs text-slate-300 bg-white/[0.06] px-2.5 py-1 rounded-lg border border-white/5"
                      >
                        {g.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {dateConsumed && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-4 pt-4 border-t border-white/10">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>
                      {dateLabel}:{" "}
                      <strong className="text-slate-200">
                        {new Date(dateConsumed).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </strong>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Personal Review section */}
          {item.review && (
            <div className="mt-6 pt-5 border-t border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-400" /> Reseña Personal
              </h4>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                {item.review}
              </div>
            </div>
          )}

          {/* Observations and Notes */}
          {item.notes && (
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Notas y observaciones
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed italic bg-black/30 p-3 rounded-lg border border-white/5">
                {item.notes}
              </p>
            </div>
          )}

          {/* Tags */}
          {item.tags && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              {item.tags.split(",").map((t, idx) => (
                <span
                  key={idx}
                  className="text-[11px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-md"
                >
                  #{t.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
