"use client";

import React, { useEffect, useState, useMemo } from "react";
import { BookItem } from "@/lib/types";
import BookCard from "@/components/BookCard";
import FilterBar from "@/components/FilterBar";
import BookModal from "@/components/BookModal";
import BookSearchModal, { BookSearchResult } from "@/components/BookSearchModal";
import ItemDetailModal from "@/components/ItemDetailModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/context/ToastContext";
import { BookOpen, Plus, Sparkles } from "lucide-react";

export default function LibrosPage() {
  const { success, error } = useToast();
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  // Modals
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Partial<BookItem> | null>(null);
  const [detailBook, setDetailBook] = useState<BookItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BookItem | null>(null);

  const fetchBooks = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (statusFilter) params.set("status", statusFilter);
      if (genreFilter) params.set("genre", genreFilter);
      if (authorFilter) params.set("author", authorFilter);
      if (sortBy) params.set("sort", sortBy);

      const res = await fetch(`/api/books?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setBooks(data.books || []);
      }
    } catch {
      error("Error al cargar libros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchQuery, statusFilter, genreFilter, authorFilter, sortBy]);

  // Unique genres
  const genreOptions = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => {
      if (b.genre) {
        b.genre.split(",").forEach((item) => set.add(item.trim()));
      }
    });
    return Array.from(set).map((g) => ({ value: g, label: g }));
  }, [books]);

  // Unique authors
  const authorOptions = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => {
      if (b.author) set.add(b.author.trim());
    });
    return Array.from(set).map((a) => ({ value: a, label: a }));
  }, [books]);

  const statusOptions = [
    { value: "Leído", label: "Leído" },
    { value: "Leyendo", label: "Leyendo" },
    { value: "Pendiente", label: "Pendiente" },
    { value: "Abandonado", label: "Abandonado" },
  ];

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setGenreFilter("");
    setAuthorFilter("");
    setSortBy("recent");
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch(`/api/books/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        success("Libro eliminado de tu biblioteca correctamente ✓");
        fetchBooks();
      } else {
        error("No se pudo eliminar el libro.");
      }
    } catch {
      error("Error de conexión al eliminar.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSelectBook = (book: BookSearchResult) => {
    setEditingBook({
      title: book.title,
      author: book.author,
      year: book.year || undefined,
      genre: book.genre,
      coverUrl: book.coverUrl,
      notes: book.description || "",
      status: "Leído",
      readDate: new Date().toISOString(),
      rating: 0,
    });
    setBookModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header with Literary aesthetic */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-black flex items-center justify-center shadow-lg shadow-amber-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 font-serif">
              Biblioteca & Archivo Literario
            </h1>
            <p className="text-xs text-amber-300/80 font-mono tracking-wider uppercase">
              Fichas Bibliográficas & Memorias de Lectura
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSearchModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition active:scale-95 shadow-md"
          >
            <Sparkles className="w-4 h-4 text-rose-400" />
            Buscar en Catálogo
          </button>
          <button
            onClick={() => {
              setEditingBook(null);
              setBookModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition active:scale-95 shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            Registrar Manual
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <FilterBar
        searchPlaceholder="Buscar por título, autor, género o notas..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={statusOptions}
        genreFilter={genreFilter}
        onGenreChange={setGenreFilter}
        genreOptions={genreOptions}
        customFilter={
          authorOptions.length > 0
            ? {
                label: "Todos los autores",
                value: authorFilter,
                onChange: setAuthorFilter,
                options: authorOptions,
              }
            : undefined
        }
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={handleResetFilters}
        totalCount={books.length}
      />

      {/* Grid or Empty */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-center">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-slate-400">Consultando los estantes de tu biblioteca...</p>
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => setDetailBook(book)}
              onEdit={(e) => {
                e.stopPropagation();
                setEditingBook(book);
                setBookModalOpen(true);
              }}
              onDelete={(e) => {
                e.stopPropagation();
                setDeleteTarget(book);
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="📚"
          title="Todavía no agregaste ningún libro."
          subtitle="Empezá a construir tu archivo literario con tus lecturas más queridas."
          actionText="+ REGISTRAR LIBRO"
          accentColor="amber"
          onAction={() => {
            setEditingBook(null);
            setBookModalOpen(true);
          }}
        />
      )}

      {/* Modals */}
      <BookModal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        onSaved={fetchBooks}
        initialData={editingBook}
      />

      <ItemDetailModal
        isOpen={Boolean(detailBook)}
        onClose={() => setDetailBook(null)}
        item={detailBook}
        type="book"
        onEdit={() => {
          setEditingBook(detailBook);
          setBookModalOpen(true);
        }}
        onDelete={() => {
          if (detailBook) setDeleteTarget(detailBook);
        }}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Eliminar libro"
        message={`¿Seguro que querés eliminar "${deleteTarget?.title}" de tu biblioteca personal?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      <BookSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectBook={handleSelectBook}
      />
    </div>
  );
}
