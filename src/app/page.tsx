"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Film,
  Gamepad2,
  BookOpen,
  ArrowRight,
  Compass,
  Star,
  Sparkles,
  ShieldCheck,
  Layers,
  History,
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[25%] w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-8 backdrop-blur-md shadow-lg shadow-amber-500/5">
          <Sparkles className="w-3.5 h-3.5" />
          Archivo Cultural Personal
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto">
          Tu historia también se cuenta con lo que{" "}
          <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-cyan-400 bg-clip-text text-transparent">
            viste, jugaste y leíste.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Construí tu propia biografía cultural. Un repositorio vivo donde registrar, puntuar
          y revivir tus películas, videojuegos y libros favoritos con memoria, detalle y estilo.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-black font-bold text-base shadow-xl shadow-amber-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            {user ? "Ir a Mi Repositorio" : "Entrar a Mi Repositorio"} <ArrowRight className="w-5 h-5" />
          </Link>
          {!user && (
            <Link
              href="/registro"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-base transition-all transform active:scale-95"
            >
              Crear Cuenta Gratis
            </Link>
          )}
        </div>
      </section>

      {/* Cultural Columns Preview */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cinema */}
          <Link
            href="/peliculas"
            className="group relative rounded-2xl p-6 bg-[#12151d]/90 border border-amber-500/20 hover:border-amber-500/60 transition-all duration-300 shadow-xl hover:shadow-amber-500/10 block cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Film className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">🎬 Películas</h2>
              <span className="text-xs font-mono text-amber-400">Cinematografía</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Pósters verticales, directores, fecha de visionado y búsqueda instantánea conectada a la API de TMDB.
            </p>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
              <span>Buscador TMDB</span>
              <span>•</span>
              <span>Reseñas de autor</span>
              <span>•</span>
              <span>Filtros por género</span>
            </div>
          </Link>

          {/* Video Games */}
          <Link
            href="/videojuegos"
            className="group relative rounded-2xl p-6 bg-[#12151d]/90 border border-cyan-500/20 hover:border-cyan-500/60 transition-all duration-300 shadow-xl hover:shadow-cyan-500/10 block cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">🎮 Videojuegos</h2>
              <span className="text-xs font-mono text-cyan-400">Gamer Archive</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Carátulas, plataformas (PC, PS5, Switch, Xbox, Retro), desarrolladores, horas de juego y estados de completitud.
            </p>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
              <span>Plataformas</span>
              <span>•</span>
              <span>Terminado / En curso</span>
              <span>•</span>
              <span>Subida de covers</span>
            </div>
          </Link>

          {/* Books */}
          <Link
            href="/libros"
            className="group relative rounded-2xl p-6 bg-[#12151d]/90 border border-rose-500/20 hover:border-rose-500/60 transition-all duration-300 shadow-xl hover:shadow-rose-500/10 block cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-white font-serif group-hover:text-rose-300 transition-colors">📚 Libros</h2>
              <span className="text-xs font-mono text-rose-400">Biblioteca</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Fichas bibliográficas, autores, citas favoritas, reflexiones personales y fechas de lectura preservadas para siempre.
            </p>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
              <span>Citas & Reflexión</span>
              <span>•</span>
              <span>Lomos editoriales</span>
              <span>•</span>
              <span>Historial</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Philosophy banner */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 my-12 text-center border-t border-b border-white/10 py-10">
        <blockquote className="text-lg sm:text-xl font-light italic text-slate-300 leading-relaxed">
          &ldquo;No es solamente guardar títulos. Es edificar una memoria palpable de tus pasiones,
          las historias que te transformaron y las horas que te marcaron.&rdquo;
        </blockquote>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 border-t border-white/5">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-400" />
          <span>MI REPOSITORIO © {new Date().getFullYear()} — Archivo Cultural Personal</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/colaborar" className="hover:text-amber-400 transition">
            Colaborar
          </Link>
          <Link href="/login" className="hover:text-white transition">
            Acceso
          </Link>
          <Link href="/registro" className="hover:text-white transition">
            Registrarse
          </Link>
        </div>
      </footer>
    </div>
  );
}
