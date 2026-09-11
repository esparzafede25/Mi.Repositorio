"use client";

import React, { useEffect, useState } from "react";
import { MomentItem } from "@/lib/types";
import MomentModal from "@/components/MomentModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import {
  Sparkles,
  Plus,
  Calendar,
  MapPin,
  Users,
  Search,
  Film,
  Gamepad2,
  BookOpen,
  Edit2,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";

export default function MomentosPage() {
  const { success, error } = useToast();
  const [moments, setMoments] = useState<MomentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMoment, setEditingMoment] = useState<Partial<MomentItem> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MomentItem | null>(null);

  const fetchMoments = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      const res = await fetch(`/api/moments?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setMoments(data.moments || []);
      }
    } catch {
      error("Error al cargar momentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoments();
  }, [searchQuery]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/moments/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        success("Recuerdo eliminado ✓");
        fetchMoments();
      } else {
        error("No se pudo eliminar el momento.");
      }
    } catch {
      error("Error de conexión");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" /> Álbum de Memoria Cultural
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            MIS MOMENTOS
          </h1>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            &ldquo;Tu historia también se cuenta con lo que viste, jugaste y leíste.&rdquo;
            Las personas, los lugares y las anécdotas que quedaron unidas a tus obras favoritas.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingMoment(null);
            setModalOpen(true);
          }}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-xl shadow-rose-500/20 transition transform active:scale-95 inline-flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Registrar Nuevo Momento
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar momentos por título, lugar, personas..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500/50"
        />
      </div>

      {/* Moments Feed / Album Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm">
          Cargando tus momentos...
        </div>
      ) : moments.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white/[0.02] border border-white/5 space-y-4 max-w-lg mx-auto p-8">
          <Sparkles className="w-12 h-12 text-rose-400/60 mx-auto" />
          <h3 className="text-lg font-bold text-white">Tu álbum de momentos está vacío</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Comenzá a registrar esos instantes únicos: la película que fuiste a ver con tu viejo, el juego que terminaste con amigos durante las vacaciones o el libro que leíste en un viaje inolvidable.
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingMoment(null);
              setModalOpen(true);
            }}
            className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs transition inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Crear mi primer momento
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {moments.map((mom) => (
            <div
              key={mom.id}
              className="group relative flex flex-col rounded-2xl bg-[#12151d] border border-white/10 hover:border-rose-500/40 shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image preview if exists */}
              {mom.imageUrl && (
                <div className="relative aspect-video w-full bg-black/60 overflow-hidden border-b border-white/10">
                  <img
                    src={mom.imageUrl}
                    alt={mom.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12151d] via-transparent to-transparent opacity-80" />
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-extrabold text-white group-hover:text-rose-300 transition-colors leading-snug">
                      {mom.title}
                    </h3>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMoment(mom);
                          setModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(mom)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Associated Cultural Item Badge */}
                  {(mom.movie || mom.videogame || mom.book) && (
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
                      {mom.movie && (
                        <>
                          <Film className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Obra: <strong className="text-white">{mom.movie.title}</strong></span>
                        </>
                      )}
                      {mom.videogame && (
                        <>
                          <Gamepad2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>Obra: <strong className="text-white">{mom.videogame.title}</strong></span>
                        </>
                      )}
                      {mom.book && (
                        <>
                          <BookOpen className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                          <span>Obra: <strong className="text-white">{mom.book.title}</strong></span>
                        </>
                      )}
                    </div>
                  )}

                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-serif italic pt-1">
                    &ldquo;{mom.content}&rdquo;
                  </p>
                </div>

                {/* Metadata Footer: Date, Location, People */}
                <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  {mom.date && (
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-rose-400" />
                      {new Date(mom.date).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  )}
                  {mom.location && (
                    <span className="flex items-center gap-1 text-cyan-300">
                      <MapPin className="w-3.5 h-3.5" />
                      {mom.location}
                    </span>
                  )}
                  {mom.sharedWith && (
                    <span className="flex items-center gap-1 text-amber-300">
                      <Users className="w-3.5 h-3.5" />
                      {mom.sharedWith}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Crear/Editar Momento */}
      <MomentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={() => fetchMoments()}
        initialData={editingMoment}
      />

      {/* Confirmación Borrado */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="¿Eliminar este momento?"
        message={`¿Estás seguro de que deseas eliminar el recuerdo "${deleteTarget?.title}"?`}
        confirmLabel="Eliminar Recuerdo"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
