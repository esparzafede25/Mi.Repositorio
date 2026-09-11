"use client";

import React, { useEffect, useState } from "react";
import { CustomListWithItems, MovieItem, VideogameItem, BookItem } from "@/lib/types";
import CustomListModal from "@/components/CustomListModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import PrintDownloadModal from "@/components/PrintDownloadModal";
import ItemDetailModal from "@/components/ItemDetailModal";
import { useToast } from "@/context/ToastContext";
import {
  Bookmark,
  Plus,
  Edit2,
  Trash2,
  Printer,
  Film,
  Gamepad2,
  BookOpen,
  Star,
  X,
  Sparkles,
} from "lucide-react";

export default function ListasPage() {
  const { success, error } = useToast();
  const [lists, setLists] = useState<CustomListWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeListId, setActiveListId] = useState<string | null>(null);

  // Modals
  const [listModalOpen, setListModalOpen] = useState(false);
  const [editingList, setEditingList] = useState<Partial<CustomListWithItems> | null>(null);
  const [deleteListTarget, setDeleteListTarget] = useState<CustomListWithItems | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  // Detail Modal
  const [detailItem, setDetailItem] = useState<any>(null);
  const [detailType, setDetailType] = useState<"movie" | "videogame" | "book">("movie");

  const fetchLists = async () => {
    try {
      const res = await fetch("/api/lists");
      if (res.ok) {
        const data = await res.json();
        const loadedLists = data.lists || [];
        setLists(loadedLists);
        if (!activeListId && loadedLists.length > 0) {
          setActiveListId(loadedLists[0].id);
        }
      }
    } catch {
      error("Error al cargar listas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const currentList = lists.find((l) => l.id === activeListId) || lists[0] || null;

  const handleRemoveItem = async (itemId: string) => {
    if (!currentList) return;
    try {
      const res = await fetch(`/api/lists/${currentList.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove_item", itemId }),
      });
      if (res.ok) {
        success("Elemento quitado de la lista");
        fetchLists();
      }
    } catch {
      error("Error al quitar elemento");
    }
  };

  const handleDeleteListConfirm = async () => {
    if (!deleteListTarget) return;
    try {
      const res = await fetch(`/api/lists/${deleteListTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        success("Lista eliminada ✓");
        setActiveListId(null);
        fetchLists();
      } else {
        error("No se pudo eliminar la lista");
      }
    } catch {
      error("Error de conexión");
    } finally {
      setDeleteListTarget(null);
    }
  };

  // Convert list items to generic array for PrintDownloadModal
  const printableItems: any[] = (currentList?.items || [])
    .map((i) => i.movie || i.videogame || i.book)
    .filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Bookmark className="w-3.5 h-3.5 text-amber-400" /> Colecciones Personalizadas
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            MIS LISTAS
          </h1>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            Creá tus propias selecciones temáticas multiformato (películas, juegos y libros juntos).
            Podés imprimirlas o descargarlas cuando quieras.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingList(null);
            setListModalOpen(true);
          }}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-sm shadow-xl shadow-amber-500/20 transition transform active:scale-95 inline-flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Crear Nueva Lista
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm">
          Cargando tus listas...
        </div>
      ) : lists.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white/[0.02] border border-white/5 space-y-4 max-w-md mx-auto p-8">
          <Bookmark className="w-12 h-12 text-amber-400/60 mx-auto" />
          <h3 className="text-lg font-bold text-white">No tenés listas aún</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Creá listas como &ldquo;Terror de los 80&rdquo;, &ldquo;Juegos pendientes&rdquo; o &ldquo;Lecturas para el verano&rdquo; y agrupá tus obras favoritas.
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingList(null);
              setListModalOpen(true);
            }}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-xs transition inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Crear mi primera lista
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with lists */}
          <div className="lg:col-span-1 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Tus Listas ({lists.length})
            </h3>
            {lists.map((list) => {
              const isActive = list.id === currentList?.id;
              return (
                <button
                  key={list.id}
                  type="button"
                  onClick={() => setActiveListId(list.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition ${
                    isActive
                      ? "bg-white/10 border-amber-500/50 text-white shadow-md"
                      : "bg-white/[0.02] border-white/5 hover:bg-white/5 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: list.color || "#f59e0b" }}
                    />
                    <span className="text-sm font-semibold truncate">{list.name}</span>
                  </div>
                  <span className="text-xs text-slate-400 px-2 py-0.5 rounded-md bg-white/5 font-mono">
                    {list.items.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Current List Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {currentList && (
              <>
                {/* List Header Card */}
                <div className="p-6 rounded-2xl bg-[#12151d] border border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: currentList.color || "#f59e0b" }}
                        />
                        <h2 className="text-2xl font-black text-white">{currentList.name}</h2>
                      </div>
                      {currentList.description && (
                        <p className="text-xs text-slate-400 max-w-lg">
                          {currentList.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPrintModalOpen(true)}
                        className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition flex items-center gap-1.5"
                        title="Imprimir o descargar esta lista"
                      >
                        <Printer className="w-4 h-4 text-amber-400" /> Imprimir / Descargar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingList(currentList);
                          setListModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
                        title="Editar lista"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteListTarget(currentList)}
                        className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition"
                        title="Eliminar lista"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Items in this list */}
                {currentList.items.length === 0 ? (
                  <div className="py-12 text-center rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <p className="text-sm text-slate-300 font-medium">Esta lista está vacía aún</p>
                    <p className="text-xs text-slate-500">
                      Entrá a cualquier película, videojuego o libro y tocá el icono de marcador para sumarlo a esta lista.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentList.items.map((listItem) => {
                      const entity = listItem.movie || listItem.videogame || listItem.book;
                      if (!entity) return null;

                      const cover =
                        ("posterUrl" in entity && entity.posterUrl) ||
                        ("coverUrl" in entity && entity.coverUrl);

                      return (
                        <div
                          key={listItem.id}
                          className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-[#12151d] border border-white/10 hover:border-white/20 transition"
                        >
                          <div
                            onClick={() => {
                              setDetailItem(entity);
                              setDetailType(listItem.entityType as any);
                            }}
                            className="flex items-center gap-3.5 cursor-pointer flex-1 min-w-0"
                          >
                            {cover && (
                              <div className="w-12 h-16 rounded-lg overflow-hidden bg-black/60 shrink-0 border border-white/10">
                                <img src={cover} alt={entity.title} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono uppercase text-slate-400">
                                  {listItem.entityType === "movie" && "🎬 Película"}
                                  {listItem.entityType === "videogame" && "🎮 Videojuego"}
                                  {listItem.entityType === "book" && "📚 Libro"}
                                </span>
                              </div>
                              <h4 className="text-base font-bold text-white truncate hover:text-amber-400 transition-colors">
                                {entity.title}
                              </h4>
                              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                                {entity.year && <span>{entity.year}</span>}
                                {entity.rating && (
                                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                                    <Star className="w-3 h-3 fill-amber-400" /> {entity.rating.toFixed(1)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(listItem.id)}
                            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition shrink-0"
                            title="Quitar de la lista"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal Crear/Editar Lista */}
      <CustomListModal
        isOpen={listModalOpen}
        onClose={() => setListModalOpen(false)}
        onSaved={() => fetchLists()}
        initialData={editingList}
      />

      {/* Modal Imprimir / Descargar Lista */}
      <PrintDownloadModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        title={currentList?.name || "Mi Lista"}
        items={printableItems}
        category="all"
      />

      {/* Confirmar Borrado de Lista */}
      <ConfirmDialog
        isOpen={Boolean(deleteListTarget)}
        title="¿Eliminar esta lista?"
        message={`¿Estás seguro de que deseas eliminar la lista "${deleteListTarget?.name}"? Sus obras asociadas no se borrarán.`}
        confirmLabel="Eliminar Lista"
        onConfirm={handleDeleteListConfirm}
        onCancel={() => setDeleteListTarget(null)}
      />

      {/* Detail Modal */}
      <ItemDetailModal
        isOpen={Boolean(detailItem)}
        onClose={() => setDetailItem(null)}
        item={detailItem}
        type={detailType}
        onEdit={() => {}}
        onDelete={() => {
          setDetailItem(null);
          fetchLists();
        }}
        onItemUpdated={() => fetchLists()}
      />
    </div>
  );
}
