"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { StatsData, MovieItem, VideogameItem, BookItem } from "@/lib/types";
import MovieCard from "@/components/MovieCard";
import GameCard from "@/components/GameCard";
import BookCard from "@/components/BookCard";
import ItemDetailModal from "@/components/ItemDetailModal";
import MovieModal from "@/components/MovieModal";
import GameModal from "@/components/GameModal";
import BookModal from "@/components/BookModal";
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
  TrendingUp,
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest font-mono">
              BIOGRAFÍA CULTURAL
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            MI REPOSITORIO
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Bienvenido, <span className="text-white font-semibold">{user?.username}</span>. Este es tu archivo personal.
          </p>
        </div>

        {/* Quick Add Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setEditingMovie(null);
              setMovieModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition active:scale-95 shadow-md shadow-amber-400/20"
          >
            <Plus className="w-3.5 h-3.5" /> Película
          </button>
          <button
            onClick={() => {
              setEditingGame(null);
              setGameModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-bold transition active:scale-95 shadow-md shadow-cyan-400/20"
          >
            <Plus className="w-3.5 h-3.5" /> Videojuego
          </button>
          <button
            onClick={() => {
              setEditingBook(null);
              setBookModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-400 hover:bg-rose-300 text-black text-xs font-bold transition active:scale-95 shadow-md shadow-rose-400/20"
          >
            <Plus className="w-3.5 h-3.5" /> Libro
          </button>
        </div>
      </div>

      {/* Real Stats Cards */}
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
          className="group p-5 rounded-2xl bg-[#12151d] border border-white/10 hover:border-rose-500/40 hover:shadow-lg hover:shadow-rose-500/10 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">📚</span>
            <span className="text-xs text-rose-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
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

        {/* Average Rating */}
        <div className="p-5 rounded-2xl bg-[#12151d] border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <span className="text-[11px] text-slate-500 font-mono">PROMEDIO</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono mb-1 flex items-baseline gap-1">
            {stats ? stats.averageRating : "0"}
            <span className="text-xs text-slate-500 font-normal">/ 5.0</span>
          </div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Calificación Media
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="rounded-2xl bg-[#12151d] border border-white/10 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Actividad Reciente</h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">Línea de tiempo cultural</span>
        </div>

        {stats?.recentActivities && stats.recentActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stats.recentActivities.map((act) => {
              const icon = {
                movie: "🎬",
                videogame: "🎮",
                book: "📚",
              }[act.entityType] || "✨";

              return (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{icon}</span>
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        <span className="text-amber-400 font-semibold">{act.action}</span>{" "}
                        &ldquo;{act.title}&rdquo;
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 shrink-0 font-mono">
                    {new Date(act.createdAt).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 text-sm">
            Aún no registraste ninguna actividad. ¡Comenzá agregando tu primera película, videojuego o libro!
          </div>
        )}
      </div>

      {/* Latest Movies Section */}
      {stats?.recentMovies && stats.recentMovies.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white">Últimas Películas Agregadas</h2>
            </div>
            <Link
              href="/peliculas"
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition"
            >
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
        </div>
      )}

      {/* Latest Games Section */}
      {stats?.recentGames && stats.recentGames.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Últimos Videojuegos Registrados</h2>
            </div>
            <Link
              href="/videojuegos"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition"
            >
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
        </div>
      )}

      {/* Latest Books Section */}
      {stats?.recentBooks && stats.recentBooks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-rose-400" />
              <h2 className="text-xl font-bold text-white">Últimos Libros en tu Biblioteca</h2>
            </div>
            <Link
              href="/libros"
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition"
            >
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
        </div>
      )}

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
            setDeleteTarget({
              id: detailItem.id,
              type: detailType,
              title: detailItem.title,
            });
          }
        }}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Confirmar eliminación"
        message={`¿Seguro que querés eliminar "${deleteTarget?.title}" de tu repositorio?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
