"use client";

import React from "react";
import { VideogameItem } from "@/lib/types";
import { Gamepad2, Star, Edit2, Trash2 } from "lucide-react";

interface GameCardProps {
  game: VideogameItem;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export default function GameCard({
  game,
  onClick,
  onEdit,
  onDelete,
}: GameCardProps) {
  const statusStyles: Record<string, string> = {
    Terminado: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "En progreso": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    Pendiente: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    Abandonado: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  };

  const getPlatformBadge = (platform?: string | null) => {
    if (!platform) return null;
    const p = platform.toLowerCase();
    if (p.includes("pc")) return "bg-blue-600/30 text-blue-300 border-blue-500/40";
    if (p.includes("ps") || p.includes("playstation")) return "bg-indigo-600/30 text-indigo-300 border-indigo-500/40";
    if (p.includes("xbox")) return "bg-emerald-600/30 text-emerald-300 border-emerald-500/40";
    if (p.includes("switch") || p.includes("nintendo")) return "bg-red-600/30 text-red-300 border-red-500/40";
    return "bg-slate-700/40 text-slate-300 border-slate-600/40";
  };

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer flex flex-col rounded-2xl overflow-hidden bg-[#12151d] border border-white/10 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 transform hover:-translate-y-1.5"
    >
      {/* Cover container (Aspect ratio 3:4) */}
      <div className="relative aspect-[3/4] w-full bg-[#0a0c10] overflow-hidden">
        {game.coverUrl ? (
          <img
            src={game.coverUrl}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop";
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-[#161c28] to-[#0d1017]">
            <Gamepad2 className="w-12 h-12 text-slate-600 mb-2 group-hover:text-cyan-400/80 transition-colors" />
            <span className="text-xs text-slate-400 font-medium line-clamp-2">
              {game.title}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Platform badge top left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {game.platform && (
            <span
              className={`px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md border backdrop-blur-md shadow-md ${getPlatformBadge(
                game.platform
              )}`}
            >
              {game.platform}
            </span>
          )}
        </div>

        {/* Status badge */}
        <div className="absolute top-2.5 right-2.5">
          <span
            className={`px-2 py-0.5 text-[11px] font-bold rounded-full border backdrop-blur-md shadow-md ${
              statusStyles[game.status] || "bg-slate-800 text-slate-300 border-white/10"
            }`}
          >
            {game.status}
          </span>
        </div>

        {/* Rating */}
        {game.rating ? (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/80 border border-cyan-500/40 text-cyan-400 text-xs font-bold backdrop-blur-md shadow-md">
            <Star className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
            <span>{game.rating.toFixed(1)}</span>
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
            className="p-1.5 bg-black/80 hover:bg-cyan-400 hover:text-black text-white rounded-lg border border-white/20 backdrop-blur-md transition shadow-md"
            title="Editar videojuego"
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
            title="Eliminar videojuego"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Game info */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-[#12151d]">
        <div>
          <div className="flex items-start justify-between gap-1 mb-1">
            <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">
              {game.title}
            </h4>
            {game.year && (
              <span className="text-xs text-slate-400 font-mono shrink-0">
                {game.year}
              </span>
            )}
          </div>
          {game.developer && (
            <p className="text-xs text-slate-400 line-clamp-1 italic mb-1.5">
              Dev. {game.developer}
            </p>
          )}
        </div>

        {game.genres && (
          <div className="flex flex-wrap gap-1 mt-2">
            {game.genres.split(",").slice(0, 2).map((g, idx) => (
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
