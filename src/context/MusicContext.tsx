"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

export type MusicThemeId = "cinema" | "retro" | "library" | "synthwave";

export interface MusicTheme {
  id: MusicThemeId;
  name: string;
  category: string;
  icon: string;
  description: string;
}

export const MUSIC_THEMES: MusicTheme[] = [
  {
    id: "cinema",
    name: "Nostalgia de Cine (El Padrino / Morricone)",
    category: "Películas",
    icon: "🎬",
    description: "Melodía melancólica clásica inspirada en bandas sonoras cinematográficas.",
  },
  {
    id: "retro",
    name: "Aventura 8-Bit (Zelda & Mario)",
    category: "Videojuegos",
    icon: "🎮",
    description: "Chiptune retro con arpegios clásicos de aventuras de consola.",
  },
  {
    id: "library",
    name: "Biblioteca Lofi & Piano",
    category: "Libros",
    icon: "📚",
    description: "Acordes suaves de piano ambiental ideales para lectura y reflexión.",
  },
  {
    id: "synthwave",
    name: "Blade Runner / Sci-Fi Synth",
    category: "Cine & Gamer",
    icon: "🌌",
    description: "Pads atmosféricos y sintetizadores espaciales retro-futuristas.",
  },
];

interface MusicContextType {
  isPlaying: boolean;
  currentTheme: MusicThemeId;
  volume: number;
  togglePlay: () => void;
  setTheme: (themeId: MusicThemeId) => void;
  setVolume: (volume: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

// Musical note frequencies (in Hz)
const NOTES: Record<string, number> = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0,
  Eb4: 311.13, Bb3: 233.08, Ab3: 207.65, Fs4: 369.99, Cs4: 277.18,
};

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<MusicThemeId>("cinema");
  const [volume, setVolumeState] = useState(0.5);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const stepRef = useRef(0);

  // Load preferences
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("mr_music_theme") as MusicThemeId;
      if (savedTheme && MUSIC_THEMES.some((t) => t.id === savedTheme)) {
        setCurrentTheme(savedTheme);
      }
      const savedVol = localStorage.getItem("mr_music_vol");
      if (savedVol) {
        setVolumeState(parseFloat(savedVol));
      }
    } catch {
      // Ignorar
    }
  }, []);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const gain = ctx.createGain();
      gain.gain.value = volume * 0.25; // Nivel agradable
      gain.connect(ctx.destination);
      audioCtxRef.current = ctx;
      gainNodeRef.current = gain;
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return { ctx: audioCtxRef.current, masterGain: gainNodeRef.current! };
  };

  const playNote = (
    freq: number,
    duration: number,
    type: OscillatorType = "sine",
    detune = 0
  ) => {
    if (!audioCtxRef.current || !gainNodeRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.detune.setValueAtTime(detune, ctx.currentTime);

    // Envelope
    noteGain.gain.setValueAtTime(0.001, ctx.currentTime);
    noteGain.gain.exponentialRampToValueAtTime(0.8, ctx.currentTime + 0.05);
    noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(noteGain);
    noteGain.connect(gainNodeRef.current);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  };

  const scheduleNextStep = () => {
    if (!isPlaying) return;
    const { ctx } = getAudioContext();
    const step = stepRef.current;

    if (currentTheme === "cinema") {
      // Melodía nostálgica estilo El Padrino / Nino Rota en C menor
      const melody = [
        { note: NOTES.C4, dur: 0.5 },
        { note: NOTES.Eb4, dur: 0.5 },
        { note: NOTES.G4, dur: 0.8 },
        { note: NOTES.F4, dur: 0.4 },
        { note: NOTES.Eb4, dur: 0.4 },
        { note: NOTES.D4, dur: 0.8 },
        { note: NOTES.Bb3, dur: 0.4 },
        { note: NOTES.D4, dur: 0.4 },
        { note: NOTES.C4, dur: 1.2 },
        { note: NOTES.G3, dur: 0.4 },
        { note: NOTES.C4, dur: 0.8 },
        { note: NOTES.Eb4, dur: 0.8 },
        { note: NOTES.D4, dur: 0.6 },
        { note: NOTES.C4, dur: 1.4 },
      ];

      const item = melody[step % melody.length];
      playNote(item.note, item.dur * 0.9, "triangle");
      // Acorde armónico de violín suave en octava baja
      if (step % 3 === 0) {
        playNote(item.note * 0.5, item.dur * 1.5, "sine", 3);
      }

      stepRef.current = (step + 1) % melody.length;
      timerRef.current = window.setTimeout(scheduleNextStep, item.dur * 850);
    } else if (currentTheme === "retro") {
      // Chiptune estilo Zelda & Mario (Onda cuadrada y bajo)
      const retroArp = [
        { lead: NOTES.C4, bass: NOTES.C3 },
        { lead: NOTES.E4, bass: NOTES.G3 },
        { lead: NOTES.G4, bass: NOTES.C3 },
        { lead: NOTES.C5, bass: NOTES.E3 },
        { lead: NOTES.B4, bass: NOTES.G3 },
        { lead: NOTES.G4, bass: NOTES.B3 },
        { lead: NOTES.A4, bass: NOTES.F3 },
        { lead: NOTES.F4, bass: NOTES.C3 },
        { lead: NOTES.D4, bass: NOTES.D3 },
        { lead: NOTES.F4, bass: NOTES.A3 },
        { lead: NOTES.G4, bass: NOTES.G3 },
        { lead: NOTES.B4, bass: NOTES.D3 },
      ];

      const current = retroArp[step % retroArp.length];
      playNote(current.lead, 0.18, "square");
      playNote(current.bass, 0.22, "triangle");

      stepRef.current = (step + 1) % retroArp.length;
      timerRef.current = window.setTimeout(scheduleNextStep, 220);
    } else if (currentTheme === "library") {
      // Lofi piano ambiental (acordes tranquilos)
      const lofiChords = [
        [NOTES.C4, NOTES.E4, NOTES.G4, NOTES.B4],
        [NOTES.A3, NOTES.C4, NOTES.E4, NOTES.G4],
        [NOTES.F3, NOTES.A3, NOTES.C4, NOTES.E4],
        [NOTES.G3, NOTES.B3, NOTES.D4, NOTES.F4],
      ];

      const chord = lofiChords[Math.floor(step / 4) % lofiChords.length];
      const note = chord[step % chord.length];

      playNote(note, 0.8, "sine");
      if (step % 4 === 0) {
        playNote(chord[0] * 0.5, 1.6, "triangle");
      }

      stepRef.current = step + 1;
      timerRef.current = window.setTimeout(scheduleNextStep, 450);
    } else {
      // Synthwave / Cyberpunk
      const synthNotes = [
        NOTES.A3, NOTES.C4, NOTES.E4, NOTES.A4,
        NOTES.F3, NOTES.A3, NOTES.C4, NOTES.F4,
        NOTES.G3, NOTES.B3, NOTES.D4, NOTES.G4,
        NOTES.E3, NOTES.G3, NOTES.B3, NOTES.E4,
      ];

      const n = synthNotes[step % synthNotes.length];
      playNote(n, 0.28, "sawtooth", 5);
      playNote(n * 0.5, 0.35, "sine");

      stepRef.current = (step + 1) % synthNotes.length;
      timerRef.current = window.setTimeout(scheduleNextStep, 260);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      stepRef.current = 0;
      scheduleNextStep();
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentTheme]);

  const togglePlay = () => {
    getAudioContext();
    setIsPlaying((prev) => !prev);
  };

  const setTheme = (themeId: MusicThemeId) => {
    setCurrentTheme(themeId);
    try {
      localStorage.setItem("mr_music_theme", themeId);
    } catch {}
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(val * 0.25, audioCtxRef.current.currentTime);
    }
    try {
      localStorage.setItem("mr_music_vol", val.toString());
    } catch {}
  };

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        currentTheme,
        volume,
        togglePlay,
        setTheme,
        setVolume,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic debe usarse dentro de MusicProvider");
  return ctx;
}
