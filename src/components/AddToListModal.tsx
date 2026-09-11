"use client";

import React, { useEffect, useState } from "react";
import { X, ListPlus, Check, Plus, Loader2, Bookmark } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { CustomListWithItems } from "@/lib/types";

interface AddToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: "movie" | "videogame" | "book";
  entityId: string;
  itemTitle: string;
}

export default function AddToListModal({
  isOpen,
  onClose,
  entityType,
  entityId,
  itemTitle,
}: AddToListModalProps) {
  const { success, error } = useToast();
  const [lists, setLists] = useState<CustomListWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [newListName, setNewListName] = useState("");
  const [creating, setCreating] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  const fetchLists = async () => {
    try {
      const res = await fetch("/api/lists");
      if (res.ok) {
        const data = await res.json();
        setLists(data.lists || []);
      }
    } catch {
      // Ignorar
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLists();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddToList = async (listId: string) => {
    setAddingId(listId);
    try {
      const res = await fetch(`/api/lists/${listId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_item",
          entityType,
          entityId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        success("¡Agregado a la lista correctamente! ✓");
        fetchLists();
      } else {
        error(data.error || "No se pudo agregar");
      }
    } catch {
      error("Error de conexión");
    } finally {
      setAddingId(null);
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    setCreating(true);
    try {
      const res = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newListName.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        success("Lista creada ✓");
        setNewListName("");
        // Add item to the newly created list immediately
        if (data.list?.id) {
          await handleAddToList(data.list.id);
        } else {
          fetchLists();
        }
      } else {
        error(data.error || "Error al crear lista");
      }
    } catch {
      error("Error de conexión");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#12151d] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Agregar a una Lista</h3>
              <p className="text-xs text-slate-400 truncate max-w-[220px]">
                {itemTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Quick create list */}
          <form onSubmit={handleCreateList} className="flex gap-2">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Nueva lista (ej: Películas para ver con mi hijo)..."
              className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500/50"
            />
            <button
              type="submit"
              disabled={creating || !newListName.trim()}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold rounded-xl text-xs flex items-center gap-1 transition shrink-0"
            >
              {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Crear
            </button>
          </form>

          {/* List selection */}
          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {loading ? (
              <div className="py-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Cargando listas...
              </div>
            ) : lists.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                Aún no creaste ninguna lista personal. ¡Creá una arriba!
              </div>
            ) : (
              lists.map((list) => {
                const isAlreadyIn = list.items.some(
                  (i) => i.entityType === entityType && i.entityId === entityId
                );

                return (
                  <button
                    key={list.id}
                    type="button"
                    disabled={isAlreadyIn || addingId === list.id}
                    onClick={() => handleAddToList(list.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition ${
                      isAlreadyIn
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: list.color || "#f59e0b" }}
                      />
                      <div>
                        <span className="text-sm font-semibold block">{list.name}</span>
                        <span className="text-[10px] text-slate-400">
                          {list.items.length} {list.items.length === 1 ? "obra" : "obras"}
                        </span>
                      </div>
                    </div>
                    {isAlreadyIn ? (
                      <span className="text-xs flex items-center gap-1 text-emerald-400 font-medium">
                        <Check className="w-4 h-4" /> En la lista
                      </span>
                    ) : addingId === list.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    ) : (
                      <span className="text-xs text-amber-400 hover:underline">
                        + Agregar
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="p-4 bg-black/40 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs text-slate-300 hover:text-white transition"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
}
