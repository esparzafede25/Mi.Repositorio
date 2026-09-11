"use client";

import React, { useState } from "react";
import { X, Sparkles, Shuffle, Star, Film, Gamepad2, BookOpen, Clock, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface SurpriseMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDetail?: (item: any, type: "movie" | "videogame" | "book") => void;
}

export default function SurpriseMeModal({
  isOpen,
  onClose,
  onSelectDetail,
}: SurpriseMeModalProps) {
  const { error } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<"all" | "movie" | "videogame" | "book">("all");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    item: any;
    timeText: string;
    totalInPool: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleRoll = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/surprise?type=${selectedCategory}`);
      const data = await res.json();
      if (res.ok && data.found) {
        setResult({
          item: data.item,
          timeText: data.timeText,
          totalInPool: data.totalInPool,
        });
      } else {
        error(data.message || "No se encontraron elementos en esta categoría.");
        setResult(null);
      }
    } catch {
      error("Error al buscar recomendación.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", label: "Todo", icon: Sparkles },
    { id: "movie", label: "Película", icon: Film },
    { id: "videogame", label: "Videojuego", icon: Gamepad2 },
    { id: "book", label: "Libro", icon: BookOpen },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 no-print">
      <div className="relative w-full max-w-lg rounded-2xl border border-amber-500/30 bg-[#12151d] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Shuffle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                ¿Qué hago ahora? · Sorpréndeme
              </h3>
              <p className="text-xs text-amber-300/80">
                Recomendación aleatoria de tu propia memoria cultural
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

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2">
            {categories.map((cat) => {
              const CatIcon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id as any);
                    setResult(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                    isSelected
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/10"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <CatIcon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Roll Button */}
          {!result && (
            <div className="text-center py-6 space-y-4">
              <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                Dejá que el azar escoja algo de tu archivo para revisitar hoy, descubrir de nuevo o reflexionar.
              </p>
              <button
                type="button"
                onClick={handleRoll}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-500 hover:opacity-90 text-black font-extrabold text-sm shadow-xl shadow-amber-500/20 transition transform active:scale-95 inline-flex items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    Consultando tu archivo...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black" />
                    ¡Elegir algo al azar!
                  </>
                )}
              </button>
            </div>
          )}

          {/* Result Card */}
          {result && (
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-amber-500/40 space-y-4 animate-in zoom-in-95 duration-300">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Sparkles className="w-4 h-4" />
                {result.item.itemType === "movie" && "¿Qué tal volver a ver hoy?"}
                {result.item.itemType === "videogame" && "¿Qué tal volver a jugar hoy?"}
                {result.item.itemType === "book" && "¿Qué tal volver a leer hoy?"}
              </div>

              <div className="flex gap-4">
                {/* Poster / Cover */}
                <div className="w-24 aspect-[2/3] rounded-xl overflow-hidden bg-black/60 border border-white/10 shrink-0">
                  {result.item.posterUrl || result.item.coverUrl ? (
                    <img
                      src={result.item.posterUrl || result.item.coverUrl}
                      alt={result.item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <Sparkles className="w-6 h-6" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 space-y-2">
                  <h4 className="text-xl font-extrabold text-white leading-tight">
                    {result.item.title}
                  </h4>
                  {result.item.rating && (
                    <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{result.item.rating.toFixed(1)} / 5</span>
                    </div>
                  )}
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    La guardaste <strong>{result.timeText}</strong>.
                  </p>
                  {result.item.notes && (
                    <p className="text-xs text-slate-300 italic line-clamp-2">
                      &ldquo;{result.item.notes}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleRoll}
                  disabled={loading}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Shuffle className="w-3.5 h-3.5" /> Probar otro
                </button>
                {onSelectDetail && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectDetail(result.item, result.item.itemType);
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs transition flex items-center gap-1"
                  >
                    Ver Ficha Completa <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
