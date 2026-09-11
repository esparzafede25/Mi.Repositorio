"use client";

import React, { useState, useRef, useEffect } from "react";
import { useMusic, MUSIC_THEMES, MusicThemeId } from "@/context/MusicContext";
import { Volume2, VolumeX, Music, Sliders, ChevronDown, Check } from "lucide-react";

export default function SoundButton() {
  const { isPlaying, currentTheme, volume, togglePlay, setTheme, setVolume } = useMusic();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const activeThemeObj = MUSIC_THEMES.find((t) => t.id === currentTheme);

  return (
    <div className="relative inline-flex items-center" ref={menuRef}>
      {/* Quick ON / OFF Button */}
      <div className="flex items-center bg-black/40 border border-white/10 rounded-full p-1 shadow-md hover:border-amber-400/40 transition">
        <button
          type="button"
          onClick={togglePlay}
          title={isPlaying ? "Silenciar música de fondo" : "Activar música de fondo clásica"}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition active:scale-95 ${
            isPlaying
              ? "bg-gradient-to-r from-amber-400 to-amber-300 text-black shadow-md shadow-amber-400/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              {/* Equalizer animation */}
              <span className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 bg-black rounded-full animate-bounce [animation-delay:0ms] h-full" />
                <span className="w-0.5 bg-black rounded-full animate-bounce [animation-delay:150ms] h-2" />
                <span className="w-0.5 bg-black rounded-full animate-bounce [animation-delay:300ms] h-3" />
              </span>
              <span className="hidden sm:inline text-[11px] font-bold uppercase">Sonido ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline text-[11px]">Sonido OFF</span>
            </>
          )}
        </button>

        {/* Theme Settings Trigger */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          title="Elegir tema musical y volumen"
          className="p-1 px-1.5 text-slate-400 hover:text-amber-400 hover:bg-white/5 rounded-full transition text-xs flex items-center gap-1"
        >
          <span className="text-xs">{activeThemeObj?.icon || "🎵"}</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Floating Theme Selector Dropdown */}
      {menuOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-[#12151d] border border-white/15 p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Música Clásica
              </span>
            </div>
            <button
              onClick={togglePlay}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isPlaying
                  ? "bg-amber-400/15 text-amber-300 border-amber-400/30"
                  : "bg-white/5 text-slate-400 border-white/10"
              }`}
            >
              {isPlaying ? "REPRODUCIENDO" : "EN PAUSA"}
            </button>
          </div>

          {/* Volume Control */}
          <div className="py-3 border-b border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Sliders className="w-3 h-3" /> Volumen
              </span>
              <span className="font-mono text-white">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Themes List */}
          <div className="pt-3 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
              Seleccionar Banda Sonora
            </span>
            {MUSIC_THEMES.map((t) => {
              const isSelected = currentTheme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTheme(t.id);
                    if (!isPlaying) togglePlay();
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition flex items-start gap-2.5 ${
                    isSelected
                      ? "bg-amber-400/10 border-amber-400/40 text-white"
                      : "bg-white/[0.02] border-white/5 text-slate-300 hover:bg-white/5 hover:border-white/10"
                  }`}
                >
                  <span className="text-lg shrink-0 mt-0.5">{t.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">{t.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {t.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
