"use client";

import React, { useEffect, useState } from "react";
import { RotateCcw, Film, Gamepad2, BookOpen, Star, CheckCircle2 } from "lucide-react";
import ItemDetailModal from "@/components/ItemDetailModal";
import { useToast } from "@/context/ToastContext";

export default function VolverAPage() {
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState<"all" | "movie" | "videogame" | "book">("all");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [detailItem, setDetailItem] = useState<any>(null);
  const [detailType, setDetailType] = useState<"movie" | "videogame" | "book">("movie");

  const fetchRewatchItems = async () => {
    try {
      const [moviesRes, gamesRes, booksRes] = await Promise.all([
        fetch("/api/movies?rewatch=true"),
        fetch("/api/videogames?rewatch=true"),
        fetch("/api/books?rewatch=true"),
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
    fetchRewatchItems();
  }, []);

  const handleMarkAsDone = async (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    const endpoint = {
      movie: `/api/movies/${item.id}`,
      videogame: `/api/videogames/${item.id}`,
      book: `/api/books/${item.id}`,
    }[item.itemType as "movie" | "videogame" | "book"];

    try {
      await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewatch: false }),
      });
      success("¡Completado! Quitado de Volver a...");
      setItems((prev) => prev.filter((i) => !(i.id === item.id && i.itemType === item.itemType)));
    } catch {
      // Ignorar
    }
  };

  const filtered = items.filter((i) => (activeTab === "all" ? true : i.itemType === activeTab));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" /> Reencuentros Culturales
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          VOLVER A...
        </h1>
        <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
          Tus obras pendientes para redescubrir: películas que querés volver a ver,
          videojuegos que querés volver a jugar y libros a los que querés volver a entrar.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
            activeTab === "all"
              ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
          }`}
        >
          Todo ({items.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("movie")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
            activeTab === "movie"
              ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
          }`}
        >
          <Film className="w-3.5 h-3.5" /> Volver a Ver ({items.filter((i) => i.itemType === "movie").length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("videogame")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
            activeTab === "videogame"
              ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5" /> Volver a Jugar ({items.filter((i) => i.itemType === "videogame").length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("book")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
            activeTab === "book"
              ? "bg-amber-400/20 border-amber-400/50 text-amber-300"
              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Volver a Leer ({items.filter((i) => i.itemType === "book").length})
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm">
          Cargando tu lista de reencuentros...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white/[0.02] border border-white/5 space-y-3 p-8">
          <RotateCcw className="w-10 h-10 text-cyan-400/60 mx-auto" />
          <h3 className="text-base font-bold text-white">No tenés obras marcadas para volver a consumir</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            En cualquier ficha tocá &ldquo;Volver a ver / jugar / leer&rdquo; para agregarlo a esta lista central.
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
              className="group relative cursor-pointer flex flex-col rounded-2xl bg-[#12151d] border border-white/10 hover:border-cyan-500/50 shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1.5"
            >
              <div className="relative aspect-[16/9] w-full bg-black/60 overflow-hidden">
                {item.posterUrl || item.coverUrl ? (
                  <img
                    src={item.posterUrl || item.coverUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <RotateCcw className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#12151d] via-transparent to-transparent opacity-90" />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-300">
                    {item.itemType === "movie" && "🎬 Volver a ver"}
                    {item.itemType === "videogame" && "🎮 Volver a jugar"}
                    {item.itemType === "book" && "📚 Volver a leer"}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  {item.year && <p className="text-xs text-slate-400">{item.year}</p>}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  {item.rating ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" /> {item.rating.toFixed(1)}
                    </span>
                  ) : <span />}

                  <button
                    type="button"
                    onClick={(e) => handleMarkAsDone(e, item)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 text-xs font-semibold transition flex items-center gap-1 border border-white/10"
                    title="Marcar como ya revisitado"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ya lo revisité
                  </button>
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
          fetchRewatchItems();
        }}
        onItemUpdated={() => fetchRewatchItems()}
      />
    </div>
  );
}
