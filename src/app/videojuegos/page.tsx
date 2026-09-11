"use client";

import React, { useEffect, useState, useMemo } from "react";
import { VideogameItem } from "@/lib/types";
import GameCard from "@/components/GameCard";
import FilterBar from "@/components/FilterBar";
import GameModal from "@/components/GameModal";
import ItemDetailModal from "@/components/ItemDetailModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/context/ToastContext";
import { Gamepad2, Plus } from "lucide-react";

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

  // Modals
  const [gameModalOpen, setGameModalOpen] = useState(false);
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
  }, [searchQuery, statusFilter, genreFilter, platformFilter, sortBy]);

  // Unique genres & platforms
  const genreOptions = useMemo(() => {
    const set = new Set<string>();
    games.forEach((g) => {
      if (g.genres) {
        g.genres.split(",").forEach((item) => set.add(item.trim()));
      }
    });
    return Array.from(set).map((g) => ({ value: g, label: g }));
  }, [games]);

  const platformOptions = [
    { value: "PC", label: "PC / Windows" },
    { value: "PlayStation 5", label: "PlayStation 5" },
    { value: "PlayStation 4", label: "PlayStation 4" },
    { value: "PlayStation 2", label: "PlayStation 2 / Retro" },
    { value: "Nintendo Switch", label: "Nintendo Switch" },
    { value: "Xbox Series X/S", label: "Xbox Series X/S" },
    { value: "Xbox One", label: "Xbox One" },
    { value: "Retro / Emulador", label: "Retro / Emulador" },
    { value: "Móvil", label: "Móvil / Tablet" },
  ];

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

        <button
          onClick={() => {
            setEditingGame(null);
            setGameModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-bold transition active:scale-95 shadow-lg shadow-cyan-400/20"
        >
          <Plus className="w-4 h-4" />
          Registrar Videojuego
        </button>
      </div>

      {/* Filter and Search */}
      <FilterBar
        searchPlaceholder="Buscar por título, desarrollador, plataforma, género..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={statusOptions}
        genreFilter={genreFilter}
        onGenreChange={setGenreFilter}
        genreOptions={genreOptions}
        customFilter={{
          label: "Todas las plataformas",
          value: platformFilter,
          onChange: setPlatformFilter,
          options: platformOptions,
        }}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={handleResetFilters}
        totalCount={games.length}
      />

      {/* Grid or Empty */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-slate-400">Cargando base de videojuegos...</p>
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
          title="Todavía no agregaste ningún videojuego."
          subtitle="Empezá a construir tu archivo gamer y llevá registro de tus victorias."
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
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Eliminar videojuego"
        message={`¿Seguro que querés eliminar "${deleteTarget?.title}" de tu colección de juegos?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
