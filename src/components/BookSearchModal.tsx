"use client";

import React, { useState } from "react";
import { Search, BookOpen, User, Calendar, Plus, X, Loader2 } from "lucide-react";

export interface BookSearchResult {
  id: string;
  title: string;
  author: string;
  year: number | null;
  genre: string;
  coverUrl: string;
  description?: string;
}

interface BookSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBook: (book: BookSearchResult) => void;
}

export default function BookSearchModal({
  isOpen,
  onClose,
  onSelectBook,
}: BookSearchModalProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BookSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/books/search?q=${encodeURIComponent(query.trim())}`);
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
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-rose-500/30 bg-[#12151d] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-rose-500/10 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Buscar en Catálogo de Libros</h3>
              <p className="text-xs text-slate-400">
                Buscá por título o autor para cargar la portada y datos bibliográficos automáticamente.
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
              placeholder="Ej: 1984, Cien Años de Soledad, Borges, Rayuela..."
              autoFocus
              className="w-full pl-10 pr-28 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 transition"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-1.5 px-4 py-1.5 bg-rose-500 hover:bg-rose-400 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition active:scale-95 flex items-center gap-1.5 shadow-md shadow-rose-500/20"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Buscar"}
            </button>
          </div>
        </form>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-white/5">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-rose-400 animate-spin mb-2" />
              <p className="text-sm text-slate-400">Consultando catálogo literario...</p>
            </div>
          ) : results.length > 0 ? (
            results.map((book) => (
              <div
                key={book.id}
                className="flex gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-rose-500/30 transition group"
              >
                {/* Book cover thumbnail */}
                <div className="w-16 h-24 rounded-lg overflow-hidden bg-black/60 shrink-0 border border-white/10 shadow-md">
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-rose-950/20">
                      <BookOpen className="w-6 h-6 text-rose-400/40" />
                      <span className="text-[9px] text-slate-500 mt-1">Sin cover</span>
                    </div>
                  )}
                </div>

                {/* Book Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white group-hover:text-rose-300 transition text-sm sm:text-base">
                      {book.title}
                    </h4>

                    <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-2">
                      {book.author && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <User className="w-3 h-3 text-rose-400" /> {book.author}
                        </span>
                      )}
                      {book.year && (
                        <span className="font-mono text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {book.year}
                        </span>
                      )}
                    </p>

                    {book.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                        {book.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 truncate max-w-[200px]">
                      {book.genre || "Literatura"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectBook(book);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold rounded-lg transition active:scale-95 flex items-center gap-1 shadow-md shadow-rose-500/20"
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
              <BookOpen className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="font-semibold text-white">No se encontraron libros para &ldquo;{query}&rdquo;</p>
              <p className="text-xs mt-1">Podés agregar el libro manualmente completando el formulario.</p>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500">
              <BookOpen className="w-12 h-12 mx-auto text-slate-700 mb-3" />
              <p className="text-sm font-medium text-slate-300">Escribí el título o autor del libro</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Probá buscando obras como &ldquo;El Aleph&rdquo;, &ldquo;1984&rdquo;, &ldquo;Fahrenheit 451&rdquo; o &ldquo;El Señor de los Anillos&rdquo;.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
