"use client";

import React, { useState } from "react";
import { Heart, Copy, Check, Sparkles, Coffee, ShieldCheck, CreditCard, User, Wallet } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function ColaborarPage() {
  const { success } = useToast();
  const [copiedAlias, setCopiedAlias] = useState(false);
  const [copiedNombre, setCopiedNombre] = useState(false);

  const ALIAS = "Fede.e3d";
  const TITULAR = "Federico Esparza";

  const copyToClipboard = async (text: string, type: "alias" | "nombre") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "alias") {
        setCopiedAlias(true);
        success("Alias 'Fede.e3d' copiado ✓");
        setTimeout(() => setCopiedAlias(false), 2500);
      } else {
        setCopiedNombre(true);
        success("Nombre 'Federico Esparza' copiado ✓");
        setTimeout(() => setCopiedNombre(false), 2500);
      }
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      if (type === "alias") {
        setCopiedAlias(true);
        success("Alias copiado ✓");
        setTimeout(() => setCopiedAlias(false), 2500);
      } else {
        setCopiedNombre(true);
        success("Nombre copiado ✓");
        setTimeout(() => setCopiedNombre(false), 2500);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 mb-2 shadow-xl shadow-rose-500/10">
          <Heart className="w-8 h-8 fill-rose-500/20" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          COLABORAR CON EL PROYECTO
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
          Si este repositorio cultural te resulta útil y querés apoyar su desarrollo, mantenimiento y nuevos features, podés realizar un aporte directo.
        </p>
      </div>

      {/* Main Contribution Card */}
      <div className="relative rounded-3xl bg-[#12151d] border border-white/10 p-8 sm:p-10 shadow-2xl overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md mx-auto space-y-6">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 inline-flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Wallet className="w-4 h-4 text-amber-400" />
            Transferencia por Alias / CVU
          </div>

          {/* Alias Box */}
          <div className="space-y-2 text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Alias de Transferencia
            </span>
            <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/30 flex items-center justify-between gap-4 shadow-inner">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-amber-400 tracking-wider font-mono">
                  {ALIAS}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">Billeteras virtuales y cuentas bancarias</p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(ALIAS, "alias")}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 flex items-center gap-2 shadow-lg shrink-0 ${
                  copiedAlias
                    ? "bg-emerald-500 text-white shadow-emerald-500/25"
                    : "bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-black shadow-amber-400/20"
                }`}
              >
                {copiedAlias ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copiado ✓
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar Alias
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Owner / Titular Box */}
          <div className="space-y-2 text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" /> Titular de la cuenta
            </span>
            <div className="p-4 rounded-2xl bg-black/60 border border-white/15 flex items-center justify-between gap-4">
              <div>
                <span className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                  {TITULAR}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">Dueño y desarrollador del repositorio</p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(TITULAR, "nombre")}
                className={`px-3.5 py-2 rounded-xl font-medium text-xs transition-all active:scale-95 flex items-center gap-1.5 border shrink-0 ${
                  copiedNombre
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                    : "bg-white/10 hover:bg-white/15 border-white/15 text-slate-300 hover:text-white"
                }`}
              >
                {copiedNombre ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar Nombre
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed text-center pt-2">
            Podés realizar tu aporte desde Mercado Pago, Ualá, Lemon, banco tradicional o cualquier billetera. Todo aporte ayuda a costear servidores, APIs de datos y la expansión de la plataforma.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-white font-semibold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Independiente y Sin Publicidad
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              El repositorio se mantendrá limpio, rápido, sin anuncios invasivos y enfocado en la memoria cultural.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-white font-semibold text-xs">
              <Coffee className="w-4 h-4 text-amber-400" />
              Nuevas Funcionalidades
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Permite añadir más integraciones (búsquedas avanzadas, estadísticas gráficas, exportación e importación).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
