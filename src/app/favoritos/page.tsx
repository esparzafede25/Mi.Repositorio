"use client";

import React, { useEffect, useState } from "react";
import { MovieItem, VideogameItem, BookItem } from "@/lib/types";
import {
  Heart,
  Film,
  Gamepad2,
  BookOpen,
  ArrowUp,
  ArrowDown,
  Star,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import ItemDetailModal from "@/components/ItemDetailModal";

export default function FavoritosPage() {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<"movies" | "videogames" | "books">("movies");

  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [videogames, setVideogames] = useState<VideogameItem[]>([]);
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Detail Modal
  const [detailItem, setDetailItem] = useState<any>(null);
  const [detailType, setDetailType] = useState<"movie" | "videogame" | "book">("movie");

  const fetchFavorites = async () => {
    try {
      const res = await fetch("/api/favorites");
      if (res.ok) {
        const data = await res.json();
        setMovies(data.movies || []);
        setVideogames(data.videogames || []);
        setBooks(data.books || []);
      }
    } catch {
      error("Error al cargar favoritos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const movePriority = async (
    category: "movie" | "videogame" | "book",
    index: number,
    direction: "up" | "down"
  ) => {
    const listMap = {
      movie: [...movies],
      videogame: [...videogames],
      book: [...books],
    };

    const targetList = listMap[category];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= targetList.length) return;

    // Swap
    const temp = targetList[index];
    targetList[index] = targetList[newIndex];
    targetList[newIndex] = temp;

    // Optimistic state
    if (category === "movie") setMovies(targetList as MovieItem[]);
    if (category === "videogame") setVideogames(targetList as VideogameItem[]);
    if (category === "book") setBooks(targetList as BookItem[]);

    try {
      const orderedIds = targetList.map((item) => item.id);
      const res = await fetch("/api/favorites", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, orderedIds }),
      });
      if (res.ok) {
        success("Orden de ranking guardado ✓");
      }
    } catch {
      error("Error al persistir orden");
      fetchFavorites();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> Rankings Personales
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          MIS FAVORITOS
        </h1>
        <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
          Tus obras predilectas organizadas en 3 podios independientes.
          Podés ajustar el orden de prioridad con las flechas para reflejar tu ranking personal.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("movies")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === "movies"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10"
              : "text-slate-400 hover:text-white bg-white/5"
          }`}
        >
          <Film className="w-4 h-4 text-amber-400" /> Películas Favoritas ({movies.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("videogames")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === "videogames"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10"
              : "text-slate-400 hover:text-white bg-white/5"
          }`}
        >
          <Gamepad2 className="w-4 h-4 text-cyan-400" /> Videojuegos Favoritos ({videogames.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("books")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === "books"
              ? "bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-lg shadow-amber-500/10"
              : "text-slate-400 hover:text-white bg-white/5"
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-300" /> Libros Favoritos ({books.length})
        </button>
      </div>

      {/* Rankings List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm">
          Cargando favoritos...
        </div>
      ) : (
        <div className="space-y-3">
          {activeTab === "movies" && renderRankingList(movies, "movie")}
          {activeTab === "videogames" && renderRankingList(videogames, "videogame")}
          {activeTab === "books" && renderRankingList(books, "book")}
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
          fetchFavorites();
        }}
        onItemUpdated={() => fetchFavorites()}
      />
    </div>
  );

  function renderRankingList(items: any[], category: "movie" | "videogame" | "book") {
    if (items.length === 0) {
      return (
        <div className="py-16 text-center rounded-3xl bg-white/[0.02] border border-white/5 space-y-3 p-8">
          <Heart className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No tenés favoritos en esta categoría aún</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Abrí cualquier ficha y tocá &ldquo;Marcar Favorita&rdquo; con el corazón para sumarla a este podio.
          </p>
        </div>
      );
    }

    return items.map((item, index) => {
      const isTop3 = index < 3;
      const rankBadgeColor =
        index === 0
          ? "bg-amber-400 text-black border-amber-300 shadow-amber-400/30"
          : index === 1
          ? "bg-slate-300 text-black border-white shadow-white/20"
          : index === 2
          ? "bg-amber-700 text-white border-amber-600"
          : "bg-white/10 text-slate-300 border-white/10";

      return (
        <div
          key={item.id}
          className={`flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#12151d] border transition-all ${
            index === 0 ? "border-amber-500/50 shadow-lg shadow-amber-500/10" : "border-white/10 hover:border-white/20"
          }`}
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Position Badge */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm border shrink-0 shadow-md ${rankBadgeColor}`}
            >
              #{index + 1}
            </div>

            {/* Poster / Cover */}
            {(item.posterUrl || item.coverUrl) && (
              <div
                onClick={() => {
                  setDetailItem(item);
                  setDetailType(category);
                }}
                className="w-12 h-16 rounded-lg overflow-hidden bg-black/50 shrink-0 border border-white/10 cursor-pointer"
              >
                <img
                  src={item.posterUrl || item.coverUrl}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform"
                />
              </div>
            )}

            <div
              onClick={() => {
                setDetailItem(item);
                setDetailType(category);
              }}
              className="cursor-pointer min-w-0 flex-1"
            >
              <h4 className="text-base font-bold text-white truncate hover:text-amber-400 transition-colors">
                {item.title}
              </h4>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                {item.year && <span>{item.year}</span>}
                {item.director && <span>Dir. {item.director}</span>}
                {item.platform && <span>{item.platform}</span>}
                {item.author && <span>{item.author}</span>}
                {item.rating && (
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3 h-3 fill-amber-400" /> {item.rating.toFixed(1)}
                  </span>
                )}
                {item.markedMe && (
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Me marcó
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Reorder Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => movePriority(category, index, "up")}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300 hover:text-white transition"
              title="Subir en el ranking"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={index === items.length - 1}
              onClick={() => movePriority(category, index, "down")}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300 hover:text-white transition"
              title="Bajar en el ranking"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    });
  }
}
