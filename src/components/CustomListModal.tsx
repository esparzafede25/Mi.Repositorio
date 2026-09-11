"use client";

import React, { useState, useEffect } from "react";
import { X, Bookmark, Loader2, Palette } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { CustomListWithItems } from "@/lib/types";

interface CustomListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (list: CustomListWithItems) => void;
  initialData?: Partial<CustomListWithItems> | null;
}

const COLOR_PRESETS = [
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#ec4899", // Pink
  "#8b5cf6", // Purple
  "#3b82f6", // Blue
  "#06b6d4", // Cyan
  "#10b981", // Emerald
  "#84cc16", // Lime
];

export default function CustomListModal({
  isOpen,
  onClose,
  onSaved,
  initialData,
}: CustomListModalProps) {
  const { success, error } = useToast();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#f59e0b");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setColor(initialData.color || "#f59e0b");
    } else {
      setName("");
      setDescription("");
      setColor("#f59e0b");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error("El nombre de la lista es obligatorio.");
      return;
    }

    setSaving(true);
    try {
      const isEdit = Boolean(initialData?.id);
      const url = isEdit ? `/api/lists/${initialData!.id}` : "/api/lists";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          color,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        success(isEdit ? "Lista actualizada ✓" : "Lista creada ✓");
        onSaved(data.list);
        onClose();
      } else {
        error(data.error || "Error al guardar la lista");
      }
    } catch {
      error("Error de conexión");
    } finally {
      setSaving(false);
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
              <h3 className="text-lg font-bold text-white">
                {initialData?.id ? "Editar Lista" : "Crear Nueva Lista"}
              </h3>
              <p className="text-xs text-amber-300/80">
                Colección temática multiformato
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Nombre de la Lista *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Terror de los 80, Joyas ocultas, Con mi hijo..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Descripción (opcional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explicá el propósito o criterio de esta lista..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500/50 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Palette className="w-4 h-4" /> Color de Identidad
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition transform ${
                    color === c ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#12151d]" : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm shadow-lg shadow-amber-500/20 transition flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {initialData?.id ? "Guardar Cambios" : "Crear Lista"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
