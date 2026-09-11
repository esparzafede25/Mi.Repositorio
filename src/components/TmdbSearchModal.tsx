"use client";

import React, { useState } from "react";
import { Search, Film, Star, Plus, X, Loader2 } from "lucide-react";
import { TmdbMovieResult } from "@/lib/types";

interface TmdbSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMovie: (movie: Partial<TmdbMovieResult>) => void;
}

export default function TmdbSearchModal({
  isOpen,
  onClose,
  onSelectMovie,
}: TmdbSearchModalProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TmdbMovieResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/tmdb/search?q=${encodeURIComponent(query.trim())}`);
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
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-amber-500/30 bg-[#12151d] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Buscar en Catálogo de Películas</h3>
              <p className="text-xs text-slate-400">
                Seleccioná una película para cargar su información automáticamente y luego personalizarla.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar Form */}
        <div className="p-4 border-b border-white/10 bg-[#0e1017]">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ej: Alien, Blade Runner, Interestelar, El Padrino..."
                className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-bold text-sm rounded-xl transition active:scale-95 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Buscar
            </button>
          </form>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-2" />
              <p className="text-sm text-slate-400">Buscando en la base de películas...</p>
            </div>
          ) : results.length > 0 ? (
            results.map((movie) => {
              const year = movie.release_date ? movie.release_date.split("-")[0] : "";
              return (
                <div
                  key={movie.id}
                  className="flex gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-amber-500/30 transition group"
                >
                  {/* Poster thumbnail */}
                  <div className="w-16 h-24 rounded-lg overflow-hidden bg-black/60 shrink-0 border border-white/10">
                    {movie.poster_path ? (
                      <img
                        src={movie.poster_path}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <Film className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-white group-hover:text-amber-400 transition text-sm sm:text-base">
                          {movie.title}
                        </h4>
                        {movie.vote_average ? (
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-black/60 px-2 py-0.5 rounded-full border border-amber-500/20 shrink-0">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {movie.vote_average}
                          </div>
                        ) : null}
                      </div>

                      <p className="text-xs text-slate-400">
                        {movie.original_title && movie.original_title !== movie.title && (
                          <span className="italic mr-2">({movie.original_title})</span>
                        )}
                        {year && <span className="font-mono">{year}</span>}
                        {movie.director && <span> • Dir. {movie.director}</span>}
                      </p>

                      <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 leading-relaxed">
                        {movie.overview || "Sin descripción disponible."}
                      </p>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        {movie.genres || "Cine"}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectMovie(movie);
                          onClose();
                        }}
                        className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold rounded-lg transition active:scale-95 flex items-center gap-1 shadow-md"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        AGREGAR A MI REPOSITORIO
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : hasSearched ? (
            <div className="py-16 text-center text-slate-400">
              <Film className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="font-semibold text-white">No se encontraron resultados para &ldquo;{query}&rdquo;</p>
              <p className="text-xs mt-1">Podés agregar la película manualmente completando el formulario.</p>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500">
              <Film className="w-12 h-12 mx-auto text-slate-700 mb-3" />
              <p className="text-sm font-medium text-slate-300">Escribí el nombre de una película para buscar</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Probá buscando clásicos como &ldquo;Alien&rdquo;, &ldquo;Blade Runner&rdquo;, &ldquo;Interestelar&rdquo; o &ldquo;El Padrino&rdquo;.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
