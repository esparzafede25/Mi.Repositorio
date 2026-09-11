"use client";

import React, { useEffect, useState, useMemo } from "react";
import { MovieItem } from "@/lib/types";
import MovieCard from "@/components/MovieCard";
import FilterBar from "@/components/FilterBar";
import MovieModal from "@/components/MovieModal";
import TmdbSearchModal from "@/components/TmdbSearchModal";
import ItemDetailModal from "@/components/ItemDetailModal";
import PrintDownloadModal from "@/components/PrintDownloadModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/context/ToastContext";
import { Film, Plus, Search, Printer, Heart, Sparkles, RotateCcw } from "lucide-react";

export default function PeliculasPage() {
  const { success, error } = useToast();
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [markedOnly, setMarkedOnly] = useState(false);
  const [rewatchOnly, setRewatchOnly] = useState(false);

  // Modals
  const [movieModalOpen, setMovieModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Partial<MovieItem> | null>(null);
  const [tmdbModalOpen, setTmdbModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [detailMovie, setDetailMovie] = useState<MovieItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MovieItem | null>(null);

  const fetchMovies = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (statusFilter) params.set("status", statusFilter);
      if (genreFilter) params.set("genre", genreFilter);
      if (sortBy) params.set("sort", sortBy);
      if (favoriteOnly) params.set("favorite", "true");
      if (markedOnly) params.set("markedMe", "true");
      if (rewatchOnly) params.set("rewatch", "true");

      const res = await fetch(`/api/movies?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setMovies(data.movies || []);
      }
    } catch {
      error("Error al cargar películas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [searchQuery, statusFilter, genreFilter, sortBy, favoriteOnly, markedOnly, rewatchOnly]);

  // Extract unique genres for filter options
  const genreOptions = useMemo(() => {
    const genresSet = new Set<string>();
    movies.forEach((m) => {
      if (m.genres) {
        m.genres.split(",").forEach((g) => genresSet.add(g.trim()));
      }
    });
    return Array.from(genresSet).map((g) => ({ value: g, label: g }));
  }, [movies]);

  const statusOptions = [
    { value: "Vista", label: "Vista" },
    { value: "Pendiente", label: "Pendiente" },
    { value: "En pausa", label: "En pausa" },
  ];

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setGenreFilter("");
    setSortBy("recent");
    setFavoriteOnly(false);
    setMarkedOnly(false);
    setRewatchOnly(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch(`/api/movies/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        success("Película eliminada correctamente ✓");
        fetchMovies();
      } else {
        error("No se pudo eliminar la película.");
      }
    } catch {
      error("Error de conexión al eliminar.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSelectTmdb = (tmdbMovie: any) => {
    const year = tmdbMovie.release_date
      ? parseInt(tmdbMovie.release_date.split("-")[0])
      : undefined;

    setEditingMovie({
      title: tmdbMovie.title,
      originalTitle: tmdbMovie.original_title,
      year: year,
      director: tmdbMovie.director || "",
      genres: tmdbMovie.genres || "",
      posterUrl: tmdbMovie.poster_path || "",
      rating: tmdbMovie.vote_average ? Math.min(5, Math.round((tmdbMovie.vote_average / 2) * 10) / 10) : 0,
      notes: tmdbMovie.overview || "",
      status: "Vista",
      watchedDate: new Date().toISOString(),
    });
    setMovieModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header section with Cinema styling */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black flex items-center justify-center shadow-lg shadow-amber-400/20">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Archivo de Películas
            </h1>
            <p className="text-xs text-amber-400 font-mono tracking-wider uppercase">
              Videoteca Personal & Sala Oscura
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Print / Download button */}
          <button
            onClick={() => setPrintModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition shadow-md"
            title="Descargar o imprimir lista para papel"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            Imprimir / Descargar Lista
          </button>

          <button
            onClick={() => setTmdbModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition active:scale-95 shadow-md"
          >
            <Search className="w-4 h-4 text-amber-400" />
            Buscar en TMDB
          </button>
          <button
            onClick={() => {
              setEditingMovie(null);
              setMovieModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition active:scale-95 shadow-lg shadow-amber-400/20"
          >
            <Plus className="w-4 h-4" />
            Agregar Película
          </button>
        </div>
      </div>

      {/* Cultural Quick Filter Toggles */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFavoriteOnly(!favoriteOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
            favoriteOnly
              ? "bg-rose-500/20 border-rose-500/50 text-rose-300"
              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${favoriteOnly ? "fill-rose-500 text-rose-500" : ""}`} />
          Solo Favoritas
        </button>
        <button
          type="button"
          onClick={() => setMarkedOnly(!markedOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
            markedOnly
              ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${markedOnly ? "fill-amber-400 text-amber-400" : ""}`} />
          Solo Me Marcó
        </button>
        <button
          type="button"
          onClick={() => setRewatchOnly(!rewatchOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
            rewatchOnly
              ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Volver a ver
        </button>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        searchPlaceholder="Buscar por título, director, género o etiqueta..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={statusOptions}
        genreFilter={genreFilter}
        onGenreChange={setGenreFilter}
        genreOptions={genreOptions}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={handleResetFilters}
        totalCount={movies.length}
      />

      {/* Grid or Empty state */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-center">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-slate-400">Consultando tu videoteca...</p>
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => setDetailMovie(movie)}
              onEdit={(e) => {
                e.stopPropagation();
                setEditingMovie(movie);
                setMovieModalOpen(true);
              }}
              onDelete={(e) => {
                e.stopPropagation();
                setDeleteTarget(movie);
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🎬"
          title="No se encontraron películas."
          subtitle="Probá cambiando los filtros o agregá una nueva a tu archivo."
          actionText="+ AGREGAR PELÍCULA"
          accentColor="amber"
          onAction={() => {
            setEditingMovie(null);
            setMovieModalOpen(true);
          }}
        />
      )}

      {/* Modals */}
      <MovieModal
        isOpen={movieModalOpen}
        onClose={() => setMovieModalOpen(false)}
        onSaved={fetchMovies}
        initialData={editingMovie}
      />

      <TmdbSearchModal
        isOpen={tmdbModalOpen}
        onClose={() => setTmdbModalOpen(false)}
        onSelectMovie={handleSelectTmdb}
      />

      {/* Print / Download Modal */}
      <PrintDownloadModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        title="Catálogo de Películas"
        items={movies}
        category="movie"
      />

      <ItemDetailModal
        isOpen={Boolean(detailMovie)}
        onClose={() => setDetailMovie(null)}
        item={detailMovie}
        type="movie"
        onEdit={() => {
          setEditingMovie(detailMovie);
          setMovieModalOpen(true);
        }}
        onDelete={() => {
          if (detailMovie) setDeleteTarget(detailMovie);
        }}
        onItemUpdated={() => fetchMovies()}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Eliminar película"
        message={`¿Seguro que querés eliminar "${deleteTarget?.title}" de tu videoteca personal?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
