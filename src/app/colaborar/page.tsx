"use client";

import React, { useState } from "react";
import { Heart, Copy, Check, Sparkles, Coffee, ShieldCheck, CreditCard } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function ColaborarPage() {
  const { success } = useToast();
  const [copied, setCopied] = useState(false);

  const ALIAS = "Fede.e3d";

  const handleCopyAlias = async () => {
    try {
      await navigator.clipboard.writeText(ALIAS);
      setCopied(true);
      success("Alias copiado ✓");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = ALIAS;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      success("Alias copiado ✓");
      setTimeout(() => setCopied(false), 3000);
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
          COLABORAR
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
          Si este proyecto te resulta útil y querés ayudar a mantenerlo y seguir desarrollándolo, podés colaborar económicamente.
        </p>
      </div>

      {/* Main Contribution Card */}
      <div className="relative rounded-3xl bg-[#12151d] border border-white/10 p-8 sm:p-10 shadow-2xl overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md mx-auto space-y-6">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 inline-flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Coffee className="w-4 h-4 text-amber-400" />
            Transferencia Directa
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Alias de Transferencia
            </span>
            <div className="p-4 rounded-2xl bg-black/60 border border-white/15 flex items-center justify-between gap-4">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 tracking-wider font-mono">
                {ALIAS}
              </span>
              <button
                type="button"
                onClick={handleCopyAlias}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 flex items-center gap-2 shadow-lg ${
                  copied
                    ? "bg-emerald-500 text-white shadow-emerald-500/25"
                    : "bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-black shadow-amber-400/20"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Alias copiado ✓
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    COPIAR ALIAS
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Podés realizar tu aporte desde cualquier billetera virtual o cuenta bancaria pegando el alias.
            Cada colaboración permite financiar servidores, almacenamiento y nuevas funcionalidades.
          </p>
        </div>

        {/* Future Integrations Architecture Preview */}
        <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-white font-semibold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Soporte Independiente
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              La plataforma continuará siendo libre de publicidad molesta y orientada al usuario.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-white font-semibold text-xs">
              <CreditCard className="w-4 h-4 text-cyan-400" />
              Integraciones Futuras
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Estructura lista para soportar pasarelas de pago automatizadas como Mercado Pago o Stripe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
