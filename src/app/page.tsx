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
  History,
  Heart,
  Bookmark,
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
          Biografía Cultural Personal
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
          No es simplemente una base de datos o un catálogo. Es el lugar donde registrar no solo
          qué obras consumiste, sino cuáles fueron importantes para tu vida, con quién las compartiste y qué recuerdos tenés asociados.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            href={user ? "/dashboard" : "/registro"}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-black font-bold text-base shadow-xl shadow-amber-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            {user ? "Ir a Mi Repositorio" : "CREAR MI REPOSITORIO"} <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href={user ? "/dashboard" : "/login"}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-base transition-all transform active:scale-95"
          >
            {user ? "Ver Portada" : "Entrar a Mi Cuenta"}
          </Link>
        </div>
      </section>

      {/* Cultural Columns Preview - 5 Dimensions */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Cinema */}
          <Link
            href="/peliculas"
            className="group relative rounded-2xl p-5 bg-[#12151d]/90 border border-amber-500/20 hover:border-amber-500/60 transition-all duration-300 shadow-xl hover:shadow-amber-500/10 block cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Film className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors mb-1">
              🎬 Películas
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              Fichas cinematográficas, pósters, fecha de visionado y buscador de TMDB.
            </p>
          </Link>

          {/* Video Games */}
          <Link
            href="/videojuegos"
            className="group relative rounded-2xl p-5 bg-[#12151d]/90 border border-cyan-500/20 hover:border-cyan-500/60 transition-all duration-300 shadow-xl hover:shadow-cyan-500/10 block cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-1">
              🎮 Videojuegos
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              Plataformas (PC, PS, Switch, Xbox, Retro), carátulas y horas invertidas.
            </p>
          </Link>

          {/* Books */}
          <Link
            href="/libros"
            className="group relative rounded-2xl p-5 bg-[#12151d]/90 border border-amber-400/20 hover:border-amber-400/60 transition-all duration-300 shadow-xl hover:shadow-amber-400/10 block cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors mb-1">
              📚 Libros
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              Fichas de autor, estanterías, citas favoritas y reflexiones de lectura.
            </p>
          </Link>

          {/* Moments */}
          <Link
            href="/momentos"
            className="group relative rounded-2xl p-5 bg-[#12151d]/90 border border-rose-500/20 hover:border-rose-500/60 transition-all duration-300 shadow-xl hover:shadow-rose-500/10 block cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors mb-1">
              ✨ Momentos
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              Álbum de recuerdos: con quién lo viste, anécdotas y fotos personales.
            </p>
          </Link>

          {/* History */}
          <Link
            href="/historia"
            className="group relative rounded-2xl p-5 bg-[#12151d]/90 border border-cyan-400/20 hover:border-cyan-400/60 transition-all duration-300 shadow-xl hover:shadow-cyan-400/10 block cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <History className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-1">
              ⏳ Historia
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              Línea de tiempo cultural cronológica por años y décadas reales.
            </p>
          </Link>
        </div>
      </section>

      {/* Collaboration banner */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 my-8">
        <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-rose-500/10 via-[#12151d] to-amber-500/10 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl backdrop-blur-md">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
              <Heart className="w-3.5 h-3.5 fill-rose-500/30" />
              Apoyar el Proyecto
            </div>
            <h3 className="text-xl font-bold text-white">¿Te resulta útil Mi Repositorio?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
              Podés colaborar económicamente para mantener el servidor y seguir desarrollando nuevas funciones.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-slate-400">
              <span>Titular: <strong className="text-white">Federico Esparza</strong></span>
              <span>•</span>
              <span>Alias: <strong className="text-amber-400 font-mono">Fede.e3d</strong></span>
            </div>
          </div>
          <Link
            href="/colaborar"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-wider transition active:scale-95 shadow-lg shadow-rose-500/20 shrink-0 flex items-center gap-2"
          >
            <Heart className="w-4 h-4 fill-white" />
            Colaborar Ahora
          </Link>
        </div>
      </section>

      {/* Philosophy Quote */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 my-10 text-center border-t border-b border-white/10 py-8">
        <blockquote className="text-base sm:text-xl font-light italic text-slate-300 leading-relaxed font-serif">
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
