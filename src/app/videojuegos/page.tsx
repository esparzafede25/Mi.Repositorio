"use client";

import React, { useEffect, useState, useMemo } from "react";
import { VideogameItem } from "@/lib/types";
import GameCard from "@/components/GameCard";
import FilterBar from "@/components/FilterBar";
import GameModal from "@/components/GameModal";
import GameSearchModal, { GameSearchResult } from "@/components/GameSearchModal";
import ItemDetailModal from "@/components/ItemDetailModal";
import PrintDownloadModal from "@/components/PrintDownloadModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/context/ToastContext";
import { Gamepad2, Plus, Sparkles, Printer, Heart, RotateCcw } from "lucide-react";

export default function VideojuegosPage() {
  const { success, error } = useToast();
  const [games, setGames] = useState<VideogameItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [markedOnly, setMarkedOnly] = useState(false);
  const [rewatchOnly, setRewatchOnly] = useState(false);

  // Modals
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Partial<VideogameItem> | null>(null);
  const [detailGame, setDetailGame] = useState<VideogameItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VideogameItem | null>(null);

  const fetchGames = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (statusFilter) params.set("status", statusFilter);
      if (genreFilter) params.set("genre", genreFilter);
      if (platformFilter) params.set("platform", platformFilter);
      if (sortBy) params.set("sort", sortBy);
      if (favoriteOnly) params.set("favorite", "true");
      if (markedOnly) params.set("markedMe", "true");
      if (rewatchOnly) params.set("rewatch", "true");

      const res = await fetch(`/api/videogames?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setGames(data.videogames || []);
      }
    } catch {
      error("Error al cargar videojuegos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [searchQuery, statusFilter, genreFilter, platformFilter, sortBy, favoriteOnly, markedOnly, rewatchOnly]);

  // Unique genres & platforms
  const genreOptions = useMemo(() => {
    const genresSet = new Set<string>();
    games.forEach((g) => {
      if (g.genres) {
        g.genres.split(",").forEach((genre) => genresSet.add(genre.trim()));
      }
    });
    return Array.from(genresSet).map((g) => ({ value: g, label: g }));
  }, [games]);

  const platformOptions = useMemo(() => {
    const platSet = new Set<string>();
    games.forEach((g) => {
      if (g.platform) platSet.add(g.platform.trim());
    });
    return Array.from(platSet).map((p) => ({ value: p, label: p }));
  }, [games]);

  const statusOptions = [
    { value: "Terminado", label: "Terminado" },
    { value: "En progreso", label: "En progreso" },
    { value: "Pendiente", label: "Pendiente" },
    { value: "Abandonado", label: "Abandonado" },
  ];

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setGenreFilter("");
    setPlatformFilter("");
    setSortBy("recent");
    setFavoriteOnly(false);
    setMarkedOnly(false);
    setRewatchOnly(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch(`/api/videogames/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        success("Videojuego eliminado correctamente ✓");
        fetchGames();
      } else {
        error("No se pudo eliminar el videojuego.");
      }
    } catch {
      error("Error de conexión al eliminar.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSelectGame = (game: GameSearchResult) => {
    setEditingGame({
      title: game.title,
      platform: game.platform,
      year: game.year || undefined,
      developer: game.developer,
      genres: game.genres,
      coverUrl: game.coverUrl,
      notes: game.description || "",
      status: "Terminado",
      playedDate: new Date().toISOString(),
      rating: 0,
    });
    setGameModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header with Gamer aesthetics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-400 text-black flex items-center justify-center shadow-lg shadow-cyan-400/20">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Archivo de Videojuegos
            </h1>
            <p className="text-xs text-cyan-400 font-mono tracking-wider uppercase">
              Colección Gamer & Catálogo Digital
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
            <Printer className="w-4 h-4 text-cyan-400" />
            Imprimir / Descargar Lista
          </button>

          <button
            onClick={() => setSearchModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition active:scale-95 shadow-md"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Buscar en Catálogo
          </button>
          <button
            onClick={() => {
              setEditingGame(null);
              setGameModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-bold transition active:scale-95 shadow-lg shadow-cyan-400/20"
          >
            <Plus className="w-4 h-4" />
            Registrar Manual
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
          Solo Favoritos
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
          Volver a Jugar
        </button>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        searchPlaceholder="Buscar por título, desarrollador, plataforma..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={statusOptions}
        genreFilter={genreFilter}
        onGenreChange={setGenreFilter}
        genreOptions={genreOptions}
        platformFilter={platformFilter}
        onPlatformChange={setPlatformFilter}
        platformOptions={platformOptions}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={handleResetFilters}
        totalCount={games.length}
      />

      {/* Grid or Empty state */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-slate-400">Accediendo a tu juegoteca...</p>
        </div>
      ) : games.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onClick={() => setDetailGame(game)}
              onEdit={(e) => {
                e.stopPropagation();
                setEditingGame(game);
                setGameModalOpen(true);
              }}
              onDelete={(e) => {
                e.stopPropagation();
                setDeleteTarget(game);
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🎮"
          title="No se encontraron videojuegos."
          subtitle="Probá cambiando los filtros o sumá un nuevo título."
          actionText="+ REGISTRAR VIDEOJUEGO"
          accentColor="cyan"
          onAction={() => {
            setEditingGame(null);
            setGameModalOpen(true);
          }}
        />
      )}

      {/* Modals */}
      <GameModal
        isOpen={gameModalOpen}
        onClose={() => setGameModalOpen(false)}
        onSaved={fetchGames}
        initialData={editingGame}
      />

      <GameSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectGame={handleSelectGame}
      />

      {/* Print / Download Modal */}
      <PrintDownloadModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        title="Catálogo de Videojuegos"
        items={games}
        category="videogame"
      />

      <ItemDetailModal
        isOpen={Boolean(detailGame)}
        onClose={() => setDetailGame(null)}
        item={detailGame}
        type="videogame"
        onEdit={() => {
          setEditingGame(detailGame);
          setGameModalOpen(true);
        }}
        onDelete={() => {
          if (detailGame) setDeleteTarget(detailGame);
        }}
        onItemUpdated={() => fetchGames()}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Eliminar videojuego"
        message={`¿Seguro que querés eliminar "${deleteTarget?.title}" de tu colección personal?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
