"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Film, Gamepad2, BookOpen, Star, Calendar } from "lucide-react";
import ItemDetailModal from "@/components/ItemDetailModal";

export default function MarcadosPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<"all" | "movie" | "videogame" | "book">("all");

  const [detailItem, setDetailItem] = useState<any>(null);
  const [detailType, setDetailType] = useState<"movie" | "videogame" | "book">("movie");

  const fetchMarkedItems = async () => {
    try {
      const [moviesRes, gamesRes, booksRes] = await Promise.all([
        fetch("/api/movies?markedMe=true"),
        fetch("/api/videogames?markedMe=true"),
        fetch("/api/books?markedMe=true"),
      ]);

      const [moviesData, gamesData, booksData] = await Promise.all([
        moviesRes.json(),
        gamesRes.json(),
        booksRes.json(),
      ]);

      const combined = [
        ...(moviesData.movies || []).map((m: any) => ({ ...m, itemType: "movie" })),
        ...(gamesData.videogames || []).map((g: any) => ({ ...g, itemType: "videogame" })),
        ...(booksData.books || []).map((b: any) => ({ ...b, itemType: "book" })),
      ];

      setItems(combined);
    } catch {
      // Ignorar
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkedItems();
  }, []);

  const filtered = items.filter((i) => (typeFilter === "all" ? true : i.itemType === typeFilter));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Huellas Indelebles
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          COSAS QUE ME MARCARON
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          No todo se mide con una puntuación perfecta. Hay obras con 7/10 que cambiaron tu forma de ver el mundo,
          te acompañaron en momentos difíciles o definieron quién sos.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTypeFilter("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
            typeFilter === "all"
              ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
          }`}
        >
          Todo ({items.length})
        </button>
        <button
          type="button"
          onClick={() => setTypeFilter("movie")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
            typeFilter === "movie"
              ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
          }`}
        >
          <Film className="w-3.5 h-3.5" /> Películas ({items.filter((i) => i.itemType === "movie").length})
        </button>
        <button
          type="button"
          onClick={() => setTypeFilter("videogame")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
            typeFilter === "videogame"
              ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5" /> Videojuegos ({items.filter((i) => i.itemType === "videogame").length})
        </button>
        <button
          type="button"
          onClick={() => setTypeFilter("book")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
            typeFilter === "book"
              ? "bg-amber-400/20 border-amber-400/50 text-amber-300"
              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Libros ({items.filter((i) => i.itemType === "book").length})
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm">
          Cargando obras que te marcaron...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white/[0.02] border border-white/5 space-y-3 p-8">
          <Sparkles className="w-10 h-10 text-amber-400/60 mx-auto" />
          <h3 className="text-base font-bold text-white">No has marcado ninguna obra aún</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            En cualquier ficha tocá el botón &ldquo;Me marcó&rdquo; para agregarla a este espacio personal.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={`${item.itemType}-${item.id}`}
              onClick={() => {
                setDetailItem(item);
                setDetailType(item.itemType);
              }}
              className="group relative cursor-pointer flex flex-col rounded-2xl bg-[#12151d] border border-white/10 hover:border-amber-400/50 shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1.5"
            >
              {/* Image banner */}
              <div className="relative aspect-[16/9] w-full bg-black/60 overflow-hidden">
                {item.posterUrl || item.coverUrl ? (
                  <img
                    src={item.posterUrl || item.coverUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <Sparkles className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#12151d] via-transparent to-transparent opacity-90" />
                <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/70 border border-amber-400/40 text-amber-400 shadow">
                  <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 uppercase tracking-wider font-mono">
                    {item.itemType === "movie" && "🎬 Película"}
                    {item.itemType === "videogame" && "🎮 Videojuego"}
                    {item.itemType === "book" && "📚 Libro"}
                    {item.year && <span>· {item.year}</span>}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  {item.review ? (
                    <p className="text-xs text-slate-300 italic line-clamp-3 leading-relaxed border-l-2 border-amber-500/30 pl-2">
                      &ldquo;{item.review}&rdquo;
                    </p>
                  ) : item.notes ? (
                    <p className="text-xs text-slate-400 italic line-clamp-2 leading-relaxed">
                      &ldquo;{item.notes}&rdquo;
                    </p>
                  ) : null}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  {item.rating ? (
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" /> {item.rating.toFixed(1)}
                    </span>
                  ) : (
                    <span>Sin nota numérica</span>
                  )}
                  <span className="text-amber-400/80 font-medium group-hover:underline">
                    Ver recuerdo →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Detail Modal */}
      <ItemDetailModal
        isOpen={Boolean(detailItem)}
        onClose={() => setDetailItem(null)}
        item={detailItem}
        type={detailType}
        onEdit={() => {}}
        onDelete={() => {
          setDetailItem(null);
          fetchMarkedItems();
        }}
        onItemUpdated={() => fetchMarkedItems()}
      />
    </div>
  );
}
