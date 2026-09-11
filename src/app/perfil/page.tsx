"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import UploadImage from "@/components/UploadImage";
import { User, Mail, Calendar, Film, Gamepad2, BookOpen, Save, Loader2, Sparkles } from "lucide-react";
import { StatsData } from "@/lib/types";

export default function PerfilPage() {
  const { user, refreshUser } = useAuth();
  const { success, error } = useToast();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setBio(user.bio || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setStats(data);
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, bio, avatar }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        success("Perfil actualizado correctamente ✓");
        await refreshUser();
      } else {
        error(data.error || "No se pudo actualizar el perfil.");
      }
    } catch {
      error("Error de conexión con el servidor.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="relative rounded-3xl bg-[#12151d] border border-white/10 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar display */}
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-amber-400/50 bg-[#0a0c10] shadow-xl shrink-0 flex items-center justify-center">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl font-extrabold text-amber-400 uppercase">
                {user.username.charAt(0)}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {user.username}
              </h1>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-400 font-mono">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Miembro desde{" "}
                {new Date(user.createdAt).toLocaleDateString("es-ES", {
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>

            <p className="text-sm text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-4 h-4 text-slate-500" />
              {user.email}
            </p>

            <p className="text-sm text-slate-300 italic pt-1 leading-relaxed">
              &ldquo;{user.bio || "Explorador cultural y archivista personal."}&rdquo;
            </p>
          </div>
        </div>

        {/* Stats summary banner */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-2xl font-black text-amber-400 font-mono">
              {stats ? stats.movieCount : 0}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
              Películas
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-2xl font-black text-cyan-400 font-mono">
              {stats ? stats.gameCount : 0}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
              Videojuegos
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-2xl font-black text-rose-400 font-mono">
              {stats ? stats.bookCount : 0}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
              Libros
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="rounded-3xl bg-[#12151d] border border-white/10 p-6 sm:p-8 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-amber-400" />
          Editar Información de Perfil
        </h2>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar Upload */}
          <UploadImage
            currentUrl={avatar}
            onImageChange={setAvatar}
            label="Avatar de usuario (Archivo o URL)"
            category="avatar"
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Nombre de Usuario
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Biografía personal / Manifiesto cultural
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Contá brevemente tus gustos cinematográficos, literarios o videojuegos preferidos..."
              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black text-sm font-bold rounded-xl transition active:scale-95 flex items-center gap-2 shadow-lg shadow-amber-400/20"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
