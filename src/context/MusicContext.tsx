"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

export type MusicThemeId = "cinema_original" | "retro_original" | "library_original" | "synth_original";

export interface MusicTheme {
  id: MusicThemeId;
  name: string;
  category: string;
  icon: string;
  description: string;
}

export const MUSIC_THEMES: MusicTheme[] = [
  {
    id: "cinema_original",
    name: "Ecos del Celuloide (Original)",
    category: "Películas",
    icon: "🎬",
    description: "Composición original neo-clásica melancólica para violonchelo y cuerdas ambientales.",
  },
  {
    id: "retro_original",
    name: "Crónicas de 16-Bit (Original)",
    category: "Videojuegos",
    icon: "🎮",
    description: "Tema original de fantasía y aventura retro con arpegios de 16-bit y bajo melódico.",
  },
  {
    id: "library_original",
    name: "Páginas en la Penumbra (Original)",
    category: "Libros",
    icon: "📚",
    description: "Armonía original de piano y acordes acústicos suaves ideales para lectura y reflexión.",
  },
  {
    id: "synth_original",
    name: "Horizonte Cósmico (Original)",
    category: "Cine & Gamer",
    icon: "🌌",
    description: "Sintetizador analógico original con pads etéreos y textura retro-futurista.",
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

// Frecuencias exactas afinadas en La 440 Hz
const NOTES: Record<string, number> = {
  C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.0, A2: 110.0, B2: 123.47,
  C3: 130.81, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, Fs3: 185.0, G3: 196.0, Ab3: 207.65, A3: 220.0, Bb3: 233.08, B3: 246.94,
  C4: 261.63, Cs4: 277.18, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.0, Ab4: 415.3, A4: 440.0, Bb4: 466.16, B4: 493.88,
  C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0,
};

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<MusicThemeId>("cinema_original");
  const [volume, setVolumeState] = useState(0.4);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const stepRef = useRef(0);

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
    } catch {}
  }, []);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();

      // Master lowpass filter para dar calidez y evitar agudos metálicos
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 2600;
      filter.Q.value = 1.0;

      const masterGain = ctx.createGain();
      masterGain.gain.value = volume * 0.22;

      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      audioCtxRef.current = ctx;
      filterNodeRef.current = filter;
      masterGainRef.current = masterGain;
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const playVoice = (
    freq: number,
    duration: number,
    type: OscillatorType = "sine",
    gainLevel = 0.5,
    attack = 0.08,
    detune = 0
  ) => {
    if (!audioCtxRef.current || !filterNodeRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.detune.setValueAtTime(detune, ctx.currentTime);

    // Envolvente ADSR suave sin chasquidos
    const now = ctx.currentTime;
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(gainLevel, now + attack);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(noteGain);
    noteGain.connect(filterNodeRef.current);

    osc.start(now);
    osc.stop(now + duration);
  };

  const scheduleNextStep = () => {
    if (!isPlaying) return;
    initAudio();
    const step = stepRef.current;

    if (currentTheme === "cinema_original") {
      // "Ecos del Celuloide": Composición original melancólica en Re menor con cuerdas cálidas
      const cinemaMotif = [
        { mel: NOTES.D4, bass: NOTES.D3, dur: 1.2 },
        { mel: NOTES.F4, bass: NOTES.A2, dur: 0.8 },
        { mel: NOTES.A4, bass: NOTES.F3, dur: 1.4 },
        { mel: NOTES.G4, bass: NOTES.G3, dur: 0.9 },
        { mel: NOTES.F4, bass: NOTES.D3, dur: 0.7 },
        { mel: NOTES.E4, bass: NOTES.A2, dur: 1.1 },
        { mel: NOTES.D4, bass: NOTES.Bb2, dur: 1.5 },
        { mel: NOTES.Cs4, bass: NOTES.A2, dur: 1.0 },
      ];

      const item = cinemaMotif[step % cinemaMotif.length];
      playVoice(item.mel, item.dur * 1.1, "triangle", 0.45, 0.12, 2);
      playVoice(item.mel * 1.002, item.dur * 1.1, "sine", 0.3, 0.15, -3); // Chorus
      playVoice(item.bass, item.dur * 1.8, "sine", 0.35, 0.2); // Bajo suave

      stepRef.current = (step + 1) % cinemaMotif.length;
      timerRef.current = window.setTimeout(scheduleNextStep, item.dur * 950);
    } else if (currentTheme === "retro_original") {
      // "Crónicas de 16-Bit": Aventura original fantástica con pulso retro en Fa mayor
      const retroMotif = [
        { lead: NOTES.F4, sub: NOTES.A4, bass: NOTES.F3 },
        { lead: NOTES.C5, sub: NOTES.F4, bass: NOTES.C3 },
        { lead: NOTES.Bb4, sub: NOTES.D5, bass: NOTES.Bb2 },
        { lead: NOTES.A4, sub: NOTES.C5, bass: NOTES.F3 },
        { lead: NOTES.G4, sub: NOTES.Bb4, bass: NOTES.C3 },
        { lead: NOTES.A4, sub: NOTES.C5, bass: NOTES.F3 },
        { lead: NOTES.F4, sub: NOTES.A4, bass: NOTES.A2 },
        { lead: NOTES.C4, sub: NOTES.F4, bass: NOTES.C3 },
      ];

      const item = retroMotif[step % retroMotif.length];
      playVoice(item.lead, 0.22, "square", 0.22, 0.02);
      playVoice(item.sub, 0.22, "triangle", 0.18, 0.03, 3);
      playVoice(item.bass, 0.35, "triangle", 0.3, 0.04);

      stepRef.current = (step + 1) % retroMotif.length;
      timerRef.current = window.setTimeout(scheduleNextStep, 250);
    } else if (currentTheme === "library_original") {
      // "Páginas en la Penumbra": Acordes originales de piano/rhodes reposado en Sol mayor
      const pianoChords = [
        [NOTES.G3, NOTES.B3, NOTES.D4, NOTES.Fs4], // Gmaj7
        [NOTES.E3, NOTES.G3, NOTES.B3, NOTES.D4],  // Em7
        [NOTES.C3, NOTES.E3, NOTES.G3, NOTES.B3],  // Cmaj7
        [NOTES.D3, NOTES.Fs3, NOTES.A3, NOTES.C4], // D7
      ];

      const chordIdx = Math.floor(step / 3) % pianoChords.length;
      const currentChord = pianoChords[chordIdx];
      const arpeggioNote = currentChord[step % currentChord.length];

      playVoice(arpeggioNote, 1.1, "sine", 0.38, 0.05);
      if (step % 3 === 0) {
        // Tónica profunda
        playVoice(currentChord[0] * 0.5, 2.2, "triangle", 0.32, 0.1);
      }

      stepRef.current = step + 1;
      timerRef.current = window.setTimeout(scheduleNextStep, 480);
    } else {
      // "Horizonte Cósmico": Pads retrofuturistas en La menor
      const synthChords = [
        [NOTES.A3, NOTES.C4, NOTES.E4, NOTES.G4],
        [NOTES.F3, NOTES.A3, NOTES.C4, NOTES.E4],
        [NOTES.D3, NOTES.F3, NOTES.A3, NOTES.C4],
        [NOTES.E3, NOTES.G3, NOTES.B3, NOTES.D4],
      ];

      const chord = synthChords[Math.floor(step / 4) % synthChords.length];
      const note = chord[step % chord.length];

      playVoice(note, 0.7, "sawtooth", 0.18, 0.1, 4);
      playVoice(note * 0.5, 0.8, "sine", 0.25, 0.12, -4);

      stepRef.current = step + 1;
      timerRef.current = window.setTimeout(scheduleNextStep, 320);
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
    initAudio();
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
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(val * 0.22, audioCtxRef.current.currentTime);
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
