"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { StatsData, MovieItem, VideogameItem, BookItem, MomentItem } from "@/lib/types";
import MovieCard from "@/components/MovieCard";
import GameCard from "@/components/GameCard";
import BookCard from "@/components/BookCard";
import ItemDetailModal from "@/components/ItemDetailModal";
import MovieModal from "@/components/MovieModal";
import GameModal from "@/components/GameModal";
import BookModal from "@/components/BookModal";
import MomentModal from "@/components/MomentModal";
import SurpriseMeModal from "@/components/SurpriseMeModal";
import PrintDownloadModal from "@/components/PrintDownloadModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import {
  Film,
  Gamepad2,
  BookOpen,
  Star,
  Clock,
  Plus,
  ArrowRight,
  Sparkles,
  Heart,
  RotateCcw,
  Printer,
  Shuffle,
  Calendar,
  Compass,
  History,
  Bookmark,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [movieModalOpen, setMovieModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<MovieItem | null>(null);

  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<VideogameItem | null>(null);

  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookItem | null>(null);

  const [momentModalOpen, setMomentModalOpen] = useState(false);
  const [surpriseModalOpen, setSurpriseModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  // Detail modal
  const [detailItem, setDetailItem] = useState<(MovieItem | VideogameItem | BookItem) | null>(null);
  const [detailType, setDetailType] = useState<"movie" | "videogame" | "book">("movie");

  // Deletion confirm
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    type: "movie" | "videogame" | "book";
    title: string;
  } | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      console.error("Error al cargar estadísticas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      const endpoint = {
        movie: `/api/movies/${deleteTarget.id}`,
        videogame: `/api/videogames/${deleteTarget.id}`,
        book: `/api/books/${deleteTarget.id}`,
      }[deleteTarget.type];

      const res = await fetch(endpoint, { method: "DELETE" });
      if (res.ok) {
        success("Elemento eliminado correctamente ✓");
        fetchStats();
      } else {
        error("No se pudo eliminar el elemento.");
      }
    } catch {
      error("Error de conexión al eliminar.");
    } finally {
      setDeleteTarget(null);
    }
  };

  // Compile all items for general print catalog
  const allCollectionItems: any[] = [
    ...(stats?.recentMovies || []),
    ...(stats?.recentGames || []),
    ...(stats?.recentBooks || []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Welcome Cover Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest font-mono">
              <Compass className="w-3.5 h-3.5 text-amber-400" /> Biografía Cultural Viva
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            MI REPOSITORIO
          </h1>
          <p className="text-base text-slate-300 font-serif italic">
            &ldquo;Tu historia cultural.&rdquo;
          </p>
          <p className="text-xs text-slate-400">
            Archivo personal de <strong className="text-white">{user?.username}</strong>
          </p>
        </div>

        {/* Global Quick Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setSurpriseModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition active:scale-95 shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            <Shuffle className="w-4 h-4 text-amber-400" /> Sorpréndeme
          </button>

          <button
            type="button"
            onClick={() => setPrintModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition cursor-pointer"
            title="Descargar o imprimir lista física de tu repositorio"
          >
            <Printer className="w-4 h-4 text-slate-300" /> Imprimir Repositorio
          </button>

          <button
            type="button"
            onClick={() => setMomentModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> + Momento
          </button>

          <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />

          <button
            onClick={() => {
              setEditingMovie(null);
              setMovieModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition active:scale-95 shadow-md shadow-amber-400/20"
          >
            <Plus className="w-3.5 h-3.5" /> Película
          </button>
          <button
            onClick={() => {
              setEditingGame(null);
              setGameModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-bold transition active:scale-95 shadow-md shadow-cyan-400/20"
          >
            <Plus className="w-3.5 h-3.5" /> Juego
          </button>
          <button
            onClick={() => {
              setEditingBook(null);
              setBookModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-300 hover:bg-amber-200 text-black text-xs font-bold transition active:scale-95 shadow-md shadow-amber-300/20"
          >
            <Plus className="w-3.5 h-3.5" /> Libro
          </button>
        </div>
      </div>

      {/* Primary 4 Cultural Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Movies Stat */}
        <Link
          href="/peliculas"
          className="group p-5 rounded-2xl bg-[#12151d] border border-white/10 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🎬</span>
            <span className="text-xs text-amber-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Ver <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white font-mono mb-1">
            {stats ? stats.movieCount : "0"}
          </div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Películas
          </div>
        </Link>

        {/* Videogames Stat */}
        <Link
          href="/videojuegos"
          className="group p-5 rounded-2xl bg-[#12151d] border border-white/10 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🎮</span>
            <span className="text-xs text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Ver <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white font-mono mb-1">
            {stats ? stats.gameCount : "0"}
          </div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Videojuegos
          </div>
        </Link>

        {/* Books Stat */}
        <Link
          href="/libros"
          className="group p-5 rounded-2xl bg-[#12151d] border border-white/10 hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-400/10 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">📚</span>
            <span className="text-xs text-amber-300 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Ver <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white font-mono mb-1">
            {stats ? stats.bookCount : "0"}
          </div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Libros
          </div>
        </Link>

        {/* Moments Stat */}
        <Link
          href="/momentos"
          className="group p-5 rounded-2xl bg-[#12151d] border border-white/10 hover:border-rose-500/40 hover:shadow-lg hover:shadow-rose-500/10 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">✨</span>
            <span className="text-xs text-rose-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Ver <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white font-mono mb-1">
            {stats ? stats.momentCount : "0"}
          </div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Momentos
          </div>
        </Link>
      </div>

      {/* RECUERDOS DEL PASADO: "HOY HACE..." */}
      {stats?.todayHistory && stats.todayHistory.length > 0 && (
        <section className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent border border-amber-500/30 space-y-4">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-amber-400">
            <History className="w-4 h-4" /> Recuerdos Históricos · Hoy Hace...
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.todayHistory.map((h, i) => (
              <div key={i} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-xs">
                  Hace {h.yearsAgo} {h.yearsAgo === 1 ? "año" : "años"}
                </span>
                <p className="text-sm text-slate-200 pt-1">
                  Agregaste o terminaste <strong className="text-white">{h.title}</strong>
                </p>
                {h.rating && (
                  <span className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {h.rating.toFixed(1)}/5
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* COSAS QUE TE MARCARON */}
      {stats?.markedItems && stats.markedItems.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Cosas que te marcaron
              </h2>
            </div>
            <Link
              href="/marcados"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              Ver todas ({stats.markedCount}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {stats.markedItems.map((item: any) => {
              const cover = item.posterUrl || item.coverUrl;
              return (
                <div
                  key={`${item.itemType}-${item.id}`}
                  onClick={() => {
                    setDetailItem(item);
                    setDetailType(item.itemType);
                  }}
                  className="group relative cursor-pointer rounded-xl overflow-hidden bg-[#12151d] border border-white/10 hover:border-amber-400/50 transition transform hover:-translate-y-1"
                >
                  <div className="aspect-[2/3] w-full bg-black/50 overflow-hidden">
                    {cover ? (
                      <img src={cover} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <Sparkles className="w-6 h-6" />
                      </div>
                    )}
                    <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 text-amber-400">
                      <Sparkles className="w-3 h-3 fill-amber-400" />
                    </div>
                  </div>
                  <div className="p-2">
                    <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                    <span className="text-[10px] text-slate-400">{item.year || ""}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* VOLVER A... */}
      {stats?.rewatchItems && stats.rewatchItems.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Volver a...
              </h2>
            </div>
            <Link
              href="/volver-a"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {stats.rewatchItems.map((item: any) => {
              const cover = item.posterUrl || item.coverUrl;
              return (
                <div
                  key={`${item.itemType}-${item.id}`}
                  onClick={() => {
                    setDetailItem(item);
                    setDetailType(item.itemType);
                  }}
                  className="group relative cursor-pointer rounded-xl overflow-hidden bg-[#12151d] border border-white/10 hover:border-cyan-400/50 transition transform hover:-translate-y-1"
                >
                  <div className="aspect-[2/3] w-full bg-black/50 overflow-hidden">
                    {cover ? (
                      <img src={cover} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <RotateCcw className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                    <span className="text-[10px] text-cyan-300">
                      {item.itemType === "movie" && "Volver a ver"}
                      {item.itemType === "videogame" && "Volver a jugar"}
                      {item.itemType === "book" && "Volver a leer"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ÚLTIMOS AGREGADOS: Movies, Games, Books Preview */}
      <div className="space-y-8">
        {/* Películas Recientes */}
        {stats && stats.recentMovies && stats.recentMovies.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Películas Recientes
                </h2>
              </div>
              <Link
                href="/peliculas"
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                Ver todas <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.recentMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={() => {
                    setDetailItem(movie);
                    setDetailType("movie");
                  }}
                  onEdit={(e) => {
                    e.stopPropagation();
                    setEditingMovie(movie);
                    setMovieModalOpen(true);
                  }}
                  onDelete={(e) => {
                    e.stopPropagation();
                    setDeleteTarget({ id: movie.id, type: "movie", title: movie.title });
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Videojuegos Recientes */}
        {stats && stats.recentGames && stats.recentGames.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Videojuegos Recientes
                </h2>
              </div>
              <Link
                href="/videojuegos"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                Ver todos <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.recentGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onClick={() => {
                    setDetailItem(game);
                    setDetailType("videogame");
                  }}
                  onEdit={(e) => {
                    e.stopPropagation();
                    setEditingGame(game);
                    setGameModalOpen(true);
                  }}
                  onDelete={(e) => {
                    e.stopPropagation();
                    setDeleteTarget({ id: game.id, type: "videogame", title: game.title });
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Libros Recientes */}
        {stats && stats.recentBooks && stats.recentBooks.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-300" />
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Libros Recientes
                </h2>
              </div>
              <Link
                href="/libros"
                className="text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1"
              >
                Ver todos <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.recentBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => {
                    setDetailItem(book);
                    setDetailType("book");
                  }}
                  onEdit={(e) => {
                    e.stopPropagation();
                    setEditingBook(book);
                    setBookModalOpen(true);
                  }}
                  onDelete={(e) => {
                    e.stopPropagation();
                    setDeleteTarget({ id: book.id, type: "book", title: book.title });
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Modals */}
      <MovieModal
        isOpen={movieModalOpen}
        onClose={() => setMovieModalOpen(false)}
        onSaved={fetchStats}
        initialData={editingMovie}
      />

      <GameModal
        isOpen={gameModalOpen}
        onClose={() => setGameModalOpen(false)}
        onSaved={fetchStats}
        initialData={editingGame}
      />

      <BookModal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        onSaved={fetchStats}
        initialData={editingBook}
      />

      <MomentModal
        isOpen={momentModalOpen}
        onClose={() => setMomentModalOpen(false)}
        onSaved={fetchStats}
      />

      <SurpriseMeModal
        isOpen={surpriseModalOpen}
        onClose={() => setSurpriseModalOpen(false)}
        onSelectDetail={(item, type) => {
          setDetailItem(item);
          setDetailType(type);
        }}
      />

      <PrintDownloadModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        title="Catálogo Completo de Mi Repositorio"
        items={allCollectionItems}
        category="all"
      />

      <ItemDetailModal
        isOpen={Boolean(detailItem)}
        onClose={() => setDetailItem(null)}
        item={detailItem}
        type={detailType}
        onEdit={() => {
          if (detailType === "movie") {
            setEditingMovie(detailItem as MovieItem);
            setMovieModalOpen(true);
          } else if (detailType === "videogame") {
            setEditingGame(detailItem as VideogameItem);
            setGameModalOpen(true);
          } else if (detailType === "book") {
            setEditingBook(detailItem as BookItem);
            setBookModalOpen(true);
          }
        }}
        onDelete={() => {
          if (detailItem) {
            setDeleteTarget({ id: detailItem.id, type: detailType, title: detailItem.title });
          }
        }}
        onItemUpdated={() => fetchStats()}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que deseas eliminar "${deleteTarget?.title}" de tu repositorio?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
