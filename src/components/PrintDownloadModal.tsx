"use client";

import React, { useState } from "react";
import { MovieItem, VideogameItem, BookItem } from "@/lib/types";
import {
  Printer,
  Download,
  X,
  FileText,
  CheckCircle2,
  ListOrdered,
  Sparkles,
  Share2,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface PrintDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: (MovieItem | VideogameItem | BookItem)[];
  category: "movie" | "videogame" | "book" | "all";
}

export default function PrintDownloadModal({
  isOpen,
  onClose,
  title,
  items,
  category,
}: PrintDownloadModalProps) {
  const { success } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const generateTextContent = () => {
    const lines: string[] = [];
    lines.push("==================================================");
    lines.push("          MI REPOSITORIO - ARCHIVO CULTURAL       ");
    lines.push(`               ${title.toUpperCase()}            `);
    lines.push(`  Fecha de exportación: ${new Date().toLocaleDateString("es-ES")}`);
    lines.push(`  Total de elementos registrados: ${items.length}`);
    lines.push("==================================================\n");

    items.forEach((item, index) => {
      const year = item.year ? ` (${item.year})` : "";
      const rating = item.rating ? ` [${item.rating.toFixed(1)}/5]` : "";
      const status = item.status ? ` - Estado: ${item.status}` : "";
      let creator = "";
      if ("director" in item && item.director) creator = ` | Dir: ${item.director}`;
      if ("platform" in item && item.platform) creator = ` | Plataforma: ${item.platform}`;
      if ("author" in item && item.author) creator = ` | Autor: ${item.author}`;

      lines.push(`${index + 1}. [ ] ${item.title}${year}${rating}${status}${creator}`);
      if (item.notes) lines.push(`   Notas: ${item.notes}`);
      if (item.tags) lines.push(`   Etiquetas: ${item.tags}`);
      lines.push("");
    });

    lines.push("--------------------------------------------------");
    lines.push("Generado desde MI REPOSITORIO - Tu historia cultural");
    return lines.join("\n");
  };

  const handleDownloadTxt = () => {
    const content = generateTextContent();
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mi-repositorio-${category}-${new Date().toISOString().split("T")[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    success("Lista descargada en formato .txt ✓");
  };

  const handleDownloadMarkdown = () => {
    const lines: string[] = [];
    lines.push(`# MI REPOSITORIO: ${title}\n`);
    lines.push(`*Fecha de exportación: ${new Date().toLocaleDateString("es-ES")} | Total: ${items.length} obras*\n`);
    lines.push("| # | Título | Año | Creador / Plataforma | Puntuación | Estado |");
    lines.push("|---|---|---|---|---|---|");

    items.forEach((item, idx) => {
      let creator = "-";
      if ("director" in item && item.director) creator = item.director;
      if ("platform" in item && item.platform) creator = item.platform;
      if ("author" in item && item.author) creator = item.author;

      const rating = item.rating ? `${item.rating.toFixed(1)}/5` : "-";
      lines.push(`| ${idx + 1} | **${item.title}** | ${item.year || "-"} | ${creator} | ${rating} | ${item.status} |`);
    });

    const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mi-repositorio-${category}-${new Date().toISOString().split("T")[0]}.md`;
    link.click();
    URL.revokeObjectURL(url);
    success("Lista descargada en formato Markdown (.md) ✓");
  };

  const handleCopyClipboard = async () => {
    const text = generateTextContent();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    success("Lista copiada al portapapeles ✓");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      {/* Modal interactivo */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 no-print">
        <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#12151d] shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">
                  Descargar o Imprimir Lista
                </h3>
                <p className="text-xs text-slate-400">
                  {title} ({items.length} {items.length === 1 ? "elemento" : "elementos"})
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

          {/* Options Body */}
          <div className="p-6 space-y-4">
            <p className="text-sm text-slate-300 leading-relaxed">
              Podés imprimir una copia física de tu colección con casillas para marcar a mano, o descargarla en archivo para tener un respaldo local.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Option 1: Print / Save PDF */}
              <button
                type="button"
                onClick={handlePrint}
                className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-white transition text-center group cursor-pointer"
              >
                <Printer className="w-7 h-7 text-amber-400 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="font-bold text-sm block">Imprimir Catálogo</span>
                  <span className="text-[11px] text-amber-200/70">Formato físico o PDF</span>
                </div>
              </button>

              {/* Option 2: Download TXT */}
              <button
                type="button"
                onClick={handleDownloadTxt}
                className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition text-center group cursor-pointer"
              >
                <Download className="w-7 h-7 text-cyan-400 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="font-bold text-sm block">Descargar .TXT</span>
                  <span className="text-[11px] text-slate-400">Texto plano formateado</span>
                </div>
              </button>

              {/* Option 3: Download Markdown */}
              <button
                type="button"
                onClick={handleDownloadMarkdown}
                className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition text-center group cursor-pointer"
              >
                <FileText className="w-7 h-7 text-emerald-400 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="font-bold text-sm block">Descargar Markdown</span>
                  <span className="text-[11px] text-slate-400">Tabla estructurada (.md)</span>
                </div>
              </button>

              {/* Option 4: Copy to Clipboard */}
              <button
                type="button"
                onClick={handleCopyClipboard}
                className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition text-center group cursor-pointer"
              >
                {copied ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                ) : (
                  <Share2 className="w-7 h-7 text-rose-400 group-hover:scale-110 transition-transform" />
                )}
                <div>
                  <span className="font-bold text-sm block">
                    {copied ? "¡Copiado!" : "Copiar Texto"}
                  </span>
                  <span className="text-[11px] text-slate-400">Para notas o mensajes</span>
                </div>
              </button>
            </div>
          </div>

          <div className="p-4 bg-black/40 border-t border-white/10 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/10 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Printable Sheet View: Only rendered by browser when window.print() is called */}
      <div className="printable-catalog hidden print:block text-black bg-white p-8 font-serif">
        <div className="border-b-2 border-black pb-4 mb-6 text-center">
          <h1 className="text-2xl font-bold uppercase tracking-widest text-black">
            MI REPOSITORIO — ARCHIVO CULTURAL PERSONAL
          </h1>
          <h2 className="text-lg italic text-black/80 mt-1">
            {title} ({items.length} obras registradas)
          </h2>
          <p className="text-xs text-black/60 mt-1">
            Fecha de impresión: {new Date().toLocaleDateString("es-ES")}
          </p>
        </div>

        <div className="space-y-4">
          {items.map((item, idx) => {
            let creator = "";
            if ("director" in item && item.director) creator = `Dir. ${item.director}`;
            if ("platform" in item && item.platform) creator = `${item.platform}`;
            if ("author" in item && item.author) creator = `Por ${item.author}`;

            return (
              <div
                key={item.id || idx}
                className="flex items-start gap-3 py-2 border-b border-gray-300 break-inside-avoid"
              >
                <div className="w-5 h-5 border-2 border-black rounded mt-0.5 shrink-0 flex items-center justify-center font-mono text-xs">
                  {/* Casilla de verificación para marcar a mano */}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-bold text-base text-black">
                      {idx + 1}. {item.title} {item.year ? `(${item.year})` : ""}
                    </span>
                    <span className="text-sm font-mono font-bold text-black/80">
                      {item.rating ? `★ ${item.rating.toFixed(1)}/5` : ""}
                    </span>
                  </div>
                  <div className="text-xs text-black/70 flex gap-4 mt-0.5">
                    {creator && <span>{creator}</span>}
                    <span>Estado: {item.status}</span>
                    {item.isFavorite && <span className="font-bold">[Favorito]</span>}
                    {item.markedMe && <span className="font-bold">[Me Marcó]</span>}
                  </div>
                  {item.notes && (
                    <p className="text-xs italic text-black/80 mt-1 pl-2 border-l border-gray-400">
                      &ldquo;{item.notes}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-4 border-t border-black/40 text-center text-xs text-black/60">
          Documento impreso desde Mi Repositorio · &ldquo;Tu historia también se cuenta con lo que viste, jugaste y leíste.&rdquo;
        </div>
      </div>
    </>
  );
}
