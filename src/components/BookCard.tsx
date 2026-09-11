"use client";

import React from "react";
import { BookItem } from "@/lib/types";
import { BookOpen, Star, Edit2, Trash2 } from "lucide-react";

interface BookCardProps {
  book: BookItem;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export default function BookCard({
  book,
  onClick,
  onEdit,
  onDelete,
}: BookCardProps) {
  const statusStyles: Record<string, string> = {
    Leído: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    Leyendo: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    Pendiente: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Abandonado: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  };

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer flex flex-col rounded-2xl overflow-hidden bg-[#12151d] border border-white/10 hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 transform hover:-translate-y-1.5"
    >
      {/* Book cover (Aspect ratio 2:3) */}
      <div className="relative aspect-[2/3] w-full bg-[#0a0c10] overflow-hidden">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop";
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-[#1c1815] to-[#120f0d]">
            <BookOpen className="w-12 h-12 text-amber-700/60 mb-2 group-hover:text-amber-400/80 transition-colors" />
            <span className="text-xs text-amber-200/60 font-serif line-clamp-2">
              {book.title}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Status badge */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className={`px-2 py-0.5 text-[11px] font-bold rounded-full border backdrop-blur-md shadow-md ${
              statusStyles[book.status] || "bg-slate-800 text-slate-300 border-white/10"
            }`}
          >
            {book.status}
          </span>
        </div>

        {/* Rating */}
        {book.rating ? (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/80 border border-amber-400/40 text-amber-300 text-xs font-bold backdrop-blur-md shadow-md">
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>{book.rating.toFixed(1)}</span>
          </div>
        ) : null}

        {/* Action buttons (hover) */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(e);
            }}
            className="p-1.5 bg-black/80 hover:bg-amber-400 hover:text-black text-white rounded-lg border border-white/20 backdrop-blur-md transition shadow-md"
            title="Editar libro"
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
            title="Eliminar libro"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Book info */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-[#12151d]">
        <div>
          <div className="flex items-start justify-between gap-1 mb-1">
            <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-amber-300 transition-colors font-serif">
              {book.title}
            </h4>
            {book.year && (
              <span className="text-xs text-slate-400 font-mono shrink-0">
                {book.year}
              </span>
            )}
          </div>
          {book.author && (
            <p className="text-xs text-slate-300 line-clamp-1 italic mb-1.5">
              Por {book.author}
            </p>
          )}
        </div>

        {book.genre && (
          <div className="mt-2">
            <span className="text-[10px] text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/10">
              {book.genre}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
