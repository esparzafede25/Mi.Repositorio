"use client";

import React from "react";
import { MovieItem } from "@/lib/types";
import { Film, Star, Clock, MoreVertical, Edit2, Trash2 } from "lucide-react";

interface MovieCardProps {
  movie: MovieItem;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export default function MovieCard({
  movie,
  onClick,
  onEdit,
  onDelete,
}: MovieCardProps) {
  const statusStyles: Record<string, string> = {
    Vista: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    Pendiente: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    "En pausa": "bg-sky-500/20 text-sky-400 border-sky-500/30",
  };

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer flex flex-col rounded-2xl overflow-hidden bg-[#12151d] border border-white/10 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 transform hover:-translate-y-1.5"
    >
      {/* Poster Container (Aspect Ratio 2:3) */}
      <div className="relative aspect-[2/3] w-full bg-[#0a0c10] overflow-hidden">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=400&auto=format&fit=crop";
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-[#181c26] to-[#0d0f17]">
            <Film className="w-12 h-12 text-slate-600 mb-2 group-hover:text-amber-400/80 transition-colors" />
            <span className="text-xs text-slate-400 font-medium line-clamp-2">
              {movie.title}
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Status Badge */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className={`px-2 py-0.5 text-[11px] font-bold rounded-full border backdrop-blur-md shadow-md ${
              statusStyles[movie.status] || "bg-slate-800 text-slate-300 border-white/10"
            }`}
          >
            {movie.status}
          </span>
        </div>

        {/* Rating Badge */}
        {movie.rating ? (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/80 border border-amber-500/40 text-amber-400 text-xs font-bold backdrop-blur-md shadow-md">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        ) : null}

        {/* Quick action buttons (hover) */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(e);
            }}
            className="p-1.5 bg-black/80 hover:bg-amber-400 hover:text-black text-white rounded-lg border border-white/20 backdrop-blur-md transition shadow-md"
            title="Editar película"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(e);
            }}
            className="p-1.5 bg-black/80 hover:bg-rose-600 text-white rounded-lg border border-white/20 backdrop-blur-md transition shadow-md"
            title="Eliminar película"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Information metadata */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-[#12151d]">
        <div>
          <div className="flex items-start justify-between gap-1 mb-1">
            <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
              {movie.title}
            </h4>
            {movie.year && (
              <span className="text-xs text-slate-400 font-mono shrink-0">
                {movie.year}
              </span>
            )}
          </div>
          {movie.director && (
            <p className="text-xs text-slate-400 line-clamp-1 italic mb-1.5">
              Dir. {movie.director}
            </p>
          )}
        </div>

        {movie.genres && (
          <div className="flex flex-wrap gap-1 mt-2">
            {movie.genres.split(",").slice(0, 2).map((g, idx) => (
              <span
                key={idx}
                className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5"
              >
                {g.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
