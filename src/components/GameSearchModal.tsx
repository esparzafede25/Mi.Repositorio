"use client";

import React, { useState } from "react";
import { Search, Gamepad2, Cpu, Calendar, Plus, X, Loader2 } from "lucide-react";

export interface GameSearchResult {
  id: string;
  title: string;
  platform: string;
  year: number;
  developer: string;
  genres: string;
  coverUrl: string;
  description?: string;
}

interface GameSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGame: (game: GameSearchResult) => void;
}

export default function GameSearchModal({
  isOpen,
  onClose,
  onSelectGame,
}: GameSearchModalProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GameSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/videogames/search?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (res.ok && data.results) {
        setResults(data.results);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-cyan-500/30 bg-[#12151d] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Buscar en Catálogo de Videojuegos</h3>
              <p className="text-xs text-slate-400">
                Buscá títulos clásicos y modernos para autocompletar carátula, estudio, plataforma y género.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input form */}
        <form onSubmit={handleSearch} className="p-4 border-b border-white/5 bg-black/30">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: Zelda, Dark Souls, Mario 64, Chrono Trigger, Cyberpunk..."
              autoFocus
              className="w-full pl-10 pr-28 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-1.5 px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black text-xs font-bold rounded-lg transition active:scale-95 flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Buscar"}
            </button>
          </div>
        </form>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-white/5">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-2" />
              <p className="text-sm text-slate-400">Consultando base de videojuegos...</p>
            </div>
          ) : results.length > 0 ? (
            results.map((game) => (
              <div
                key={game.id}
                className="flex gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 transition group"
              >
                {/* Cover thumbnail */}
                <div className="w-16 h-24 rounded-lg overflow-hidden bg-black/60 shrink-0 border border-white/10 shadow-md">
                  {game.coverUrl ? (
                    <img
                      src={game.coverUrl}
                      alt={game.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-cyan-950/20">
                      <Gamepad2 className="w-6 h-6 text-cyan-400/40" />
                      <span className="text-[9px] text-slate-500 mt-1">Sin cover</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white group-hover:text-cyan-300 transition text-sm sm:text-base">
                      {game.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-1">
                      {game.platform && (
                        <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-medium text-[11px]">
                          {game.platform}
                        </span>
                      )}
                      {game.developer && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Cpu className="w-3 h-3 text-cyan-400" /> {game.developer}
                        </span>
                      )}
                      {game.year && (
                        <span className="font-mono text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {game.year}
                        </span>
                      )}
                    </div>

                    {game.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                        {game.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {game.genres}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectGame(game);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold rounded-lg transition active:scale-95 flex items-center gap-1 shadow-md shadow-cyan-500/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      AGREGAR A MI REPOSITORIO
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : hasSearched ? (
            <div className="py-16 text-center text-slate-400">
              <Gamepad2 className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="font-semibold text-white">No se encontraron resultados para &ldquo;{query}&rdquo;</p>
              <p className="text-xs mt-1">Podés agregar el videojuego manualmente con el formulario.</p>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500">
              <Gamepad2 className="w-12 h-12 mx-auto text-slate-700 mb-3" />
              <p className="text-sm font-medium text-slate-300">Escribí el nombre de un videojuego para buscar</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Probá con &ldquo;Zelda&rdquo;, &ldquo;Dark Souls&rdquo;, &ldquo;Elden Ring&rdquo;, &ldquo;Final Fantasy&rdquo; o &ldquo;Doom&rdquo;.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
