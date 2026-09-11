"use client";

import React, { useEffect, useState } from "react";
import { JournalEntryItem } from "@/lib/types";
import JournalModal from "@/components/JournalModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import {
  BookOpen,
  Plus,
  Calendar,
  Film,
  Gamepad2,
  Edit2,
  Trash2,
  Sparkles,
} from "lucide-react";

export default function DiarioPage() {
  const { success, error } = useToast();
  const [entries, setEntries] = useState<JournalEntryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Partial<JournalEntryItem> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<JournalEntryItem | null>(null);

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/journal");
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
      }
    } catch {
      error("Error al cargar el diario");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/journal/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        success("Entrada eliminada ✓");
        fetchEntries();
      } else {
        error("No se pudo eliminar la entrada");
      }
    } catch {
      error("Error de conexión");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Bitácora Cultural Libre
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            MI DIARIO
          </h1>
          <p className="text-sm text-slate-300 max-w-lg leading-relaxed">
            Escribí libremente sobre lo que viste, jugaste o leíste.
            Un registro de reflexiones a lo largo de los años.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingEntry(null);
            setModalOpen(true);
          }}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-sm shadow-xl shadow-amber-500/20 transition transform active:scale-95 inline-flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Nueva Entrada
        </button>
      </div>

      {/* Entries List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm">
          Cargando tu diario...
        </div>
      ) : entries.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white/[0.02] border border-white/5 space-y-4 max-w-md mx-auto p-8">
          <BookOpen className="w-12 h-12 text-amber-400/60 mx-auto" />
          <h3 className="text-lg font-bold text-white">Tu diario está en blanco</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            &ldquo;Hoy terminé esta película y me hizo acordar...&rdquo;. Empezá a registrar tus pensamientos cuando una obra te resuena.
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingEntry(null);
              setModalOpen(true);
            }}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-xs transition inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Escribir primera entrada
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="group relative rounded-2xl bg-[#12151d] border border-white/10 hover:border-amber-500/30 p-6 shadow-xl transition-all space-y-4"
            >
              {/* Header metadata */}
              <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <span className="flex items-center gap-1 text-xs font-mono text-amber-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(entry.date).toLocaleDateString("es-ES", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <h2 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                    {entry.title}
                  </h2>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEntry(entry);
                      setModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
                    title="Editar entrada"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(entry)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition"
                    title="Eliminar entrada"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Linked Cultural Work Badge */}
              {(entry.movie || entry.videogame || entry.book) && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-300">
                  {entry.movie && (
                    <>
                      <Film className="w-4 h-4 text-amber-400" />
                      <span>Obra asociada: <strong className="text-white">{entry.movie.title}</strong></span>
                    </>
                  )}
                  {entry.videogame && (
                    <>
                      <Gamepad2 className="w-4 h-4 text-cyan-400" />
                      <span>Obra asociada: <strong className="text-white">{entry.videogame.title}</strong></span>
                    </>
                  )}
                  {entry.book && (
                    <>
                      <BookOpen className="w-4 h-4 text-amber-300" />
                      <span>Obra asociada: <strong className="text-white">{entry.book.title}</strong></span>
                    </>
                  )}
                </div>
              )}

              {/* Text Body */}
              <div className="text-sm text-slate-200 font-serif leading-relaxed whitespace-pre-wrap">
                {entry.content}
              </div>

              {/* Image attachment if any */}
              {entry.images && (
                <div className="pt-2">
                  <div className="max-w-md rounded-xl overflow-hidden border border-white/10 shadow-lg">
                    <img src={entry.images} alt={entry.title} className="w-full h-auto object-cover" />
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* Modal */}
      <JournalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={() => fetchEntries()}
        initialData={editingEntry}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="¿Eliminar esta entrada de diario?"
        message={`¿Estás seguro de que deseas eliminar la entrada "${deleteTarget?.title}"?`}
        confirmLabel="Eliminar Entrada"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
