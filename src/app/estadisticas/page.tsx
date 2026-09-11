"use client";

import React, { useEffect, useState, useMemo } from "react";
import { StatsData } from "@/lib/types";
import {
  TrendingUp,
  Film,
  Gamepad2,
  BookOpen,
  Sparkles,
  Heart,
  Bookmark,
  Calendar,
  Star,
  Brain,
  Compass,
  ArrowRight,
  PieChart,
} from "lucide-react";

export default function EstadisticasPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState<{
    movies: any[];
    games: any[];
    books: any[];
  }>({ movies: [], games: [], books: [] });

  // "Mi Año" state
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [statsRes, moviesRes, gamesRes, booksRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/movies"),
          fetch("/api/videogames"),
          fetch("/api/books"),
        ]);

        const [statsData, moviesData, gamesData, booksData] = await Promise.all([
          statsRes.json(),
          moviesRes.json(),
          gamesRes.json(),
          booksRes.json(),
        ]);

        setStats(statsData);
        setAllData({
          movies: moviesData.movies || [],
          games: gamesData.videogames || [],
          books: booksData.books || [],
        });
      } catch {
        // Ignorar
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  // Compute "Mi Año" dynamically
  const yearSummary = useMemo(() => {
    const getYear = (d: any) => {
      const dateVal = d.watchedDate || d.playedDate || d.readDate || d.createdAt;
      return new Date(dateVal).getFullYear();
    };

    const yearMovies = allData.movies.filter((m) => getYear(m) === selectedYear);
    const yearGames = allData.games.filter((g) => getYear(g) === selectedYear);
    const yearBooks = allData.books.filter((b) => getYear(b) === selectedYear);

    const allYearItems = [
      ...yearMovies.map((m) => ({ ...m, type: "movie" })),
      ...yearGames.map((g) => ({ ...g, type: "videogame" })),
      ...yearBooks.map((b) => ({ ...b, type: "book" })),
    ];

    const favorites = allYearItems.filter((i) => i.isFavorite).length;

    // Highest rated item
    const rated = allYearItems.filter((i) => i.rating);
    rated.sort((a, b) => b.rating - a.rating);
    const highestRated = rated[0] || null;

    // Top genre in this year
    const genreCounts: Record<string, number> = {};
    allYearItems.forEach((i) => {
      const gStr = i.genres || i.genre;
      if (gStr) {
        gStr.split(",").forEach((sub: string) => {
          const trimmed = sub.trim();
          if (trimmed) genreCounts[trimmed] = (genreCounts[trimmed] || 0) + 1;
        });
      }
    });

    const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    return {
      movieCount: yearMovies.length,
      gameCount: yearGames.length,
      bookCount: yearBooks.length,
      total: allYearItems.length,
      favorites,
      highestRated,
      topGenre,
      items: allYearItems.slice(0, 6),
    };
  }, [allData, selectedYear]);

  // Available years from data
  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>();
    yearsSet.add(new Date().getFullYear());
    const checkItem = (item: any) => {
      const dateVal = item.watchedDate || item.playedDate || item.readDate || item.createdAt;
      if (dateVal) yearsSet.add(new Date(dateVal).getFullYear());
    };
    allData.movies.forEach(checkItem);
    allData.games.forEach(checkItem);
    allData.books.forEach(checkItem);
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [allData]);

  if (loading || !stats) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center text-slate-400">
        Analizando tu trayectoria cultural...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> Métricas y Huella Cultural
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          MIS ESTADÍSTICAS
        </h1>
        <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
          Datos reales consolidados de tu archivo personal. Tus hábitos, géneros preferidos,
          autores predilectos y evolución a lo largo del tiempo.
        </p>
      </div>

      {/* General Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-[#12151d] border border-amber-500/30 space-y-1">
          <Film className="w-5 h-5 text-amber-400 mb-2" />
          <span className="text-2xl font-black text-white">{stats.movieCount}</span>
          <span className="text-xs text-slate-400 block font-medium">Películas</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#12151d] border border-cyan-500/30 space-y-1">
          <Gamepad2 className="w-5 h-5 text-cyan-400 mb-2" />
          <span className="text-2xl font-black text-white">{stats.gameCount}</span>
          <span className="text-xs text-slate-400 block font-medium">Videojuegos</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#12151d] border border-amber-400/30 space-y-1">
          <BookOpen className="w-5 h-5 text-amber-300 mb-2" />
          <span className="text-2xl font-black text-white">{stats.bookCount}</span>
          <span className="text-xs text-slate-400 block font-medium">Libros</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#12151d] border border-rose-500/30 space-y-1">
          <Sparkles className="w-5 h-5 text-rose-400 mb-2" />
          <span className="text-2xl font-black text-white">{stats.momentCount}</span>
          <span className="text-xs text-slate-400 block font-medium">Momentos</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#12151d] border border-white/10 space-y-1">
          <Heart className="w-5 h-5 text-rose-500 mb-2" />
          <span className="text-2xl font-black text-white">{stats.favoriteCount}</span>
          <span className="text-xs text-slate-400 block font-medium">Favoritos</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#12151d] border border-white/10 space-y-1">
          <Star className="w-5 h-5 text-amber-400 mb-2" />
          <span className="text-2xl font-black text-white">{stats.averageRating}</span>
          <span className="text-xs text-slate-400 block font-medium">Promedio ★</span>
        </div>
      </div>

      {/* MI PERFIL CULTURAL (Generado Algorítmicamente) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-cyan-500/10 border border-amber-500/30 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">MI PERFIL CULTURAL</h2>
            <p className="text-xs text-amber-200/80">
              Diagnóstico de afinidad basado en tus datos reales
            </p>
          </div>
        </div>

        <blockquote className="text-base sm:text-lg text-slate-200 font-serif italic leading-relaxed pl-4 border-l-2 border-amber-400">
          &ldquo;{stats.culturalProfile || "Continuá agregando películas, videojuegos y libros para afilar tu diagnóstico cultural."}&rdquo;
        </blockquote>
      </section>

      {/* MI AÑO (Selector Anual Interactivo) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#12151d] border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <h2 className="text-2xl font-black text-white">MI AÑO CULTURAL</h2>
            </div>
            <p className="text-xs text-slate-400">
              Seleccioná un año para ver tu resumen anual automático
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Año:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 rounded-xl bg-black/60 border border-amber-500/40 text-amber-400 font-bold text-sm focus:outline-none"
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Year Metric Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-3xl font-black text-white">{yearSummary.total}</span>
            <span className="text-xs text-slate-400 block">Obras consumidas en {selectedYear}</span>
            <span className="text-[11px] text-slate-500 block">
              {yearSummary.movieCount} pelis · {yearSummary.gameCount} juegos · {yearSummary.bookCount} libros
            </span>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-3xl font-black text-rose-400">{yearSummary.favorites}</span>
            <span className="text-xs text-slate-400 block">Obras marcadas Favoritas</span>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-xl font-bold text-amber-300 line-clamp-1">
              {yearSummary.topGenre || "Diversos"}
            </span>
            <span className="text-xs text-slate-400 block">Género más consumido</span>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-base font-bold text-white line-clamp-1">
              {yearSummary.highestRated?.title || "-"}
            </span>
            <span className="text-xs text-amber-400 block flex items-center gap-1">
              {yearSummary.highestRated?.rating ? `★ ${yearSummary.highestRated.rating.toFixed(1)}/5` : ""}
              <span className="text-slate-400">Mejor puntuado del año</span>
            </span>
          </div>
        </div>
      </section>

      {/* Visual Chart Distributions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Películas: Géneros y Directores */}
        <div className="p-6 rounded-2xl bg-[#12151d] border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Film className="w-4 h-4 text-amber-400" /> Cine: Géneros Principales
          </h3>
          <div className="space-y-3 pt-2">
            {(stats.movieGenres || []).slice(0, 5).map((g) => {
              const max = stats.movieGenres?.[0]?.count || 1;
              const pct = Math.round((g.count / max) * 100);
              return (
                <div key={g.name} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>{g.name}</span>
                    <span className="font-mono text-slate-400">{g.count}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Videojuegos: Plataformas y Géneros */}
        <div className="p-6 rounded-2xl bg-[#12151d] border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-cyan-400" /> Gaming: Plataformas
          </h3>
          <div className="space-y-3 pt-2">
            {(stats.gamePlatforms || []).slice(0, 5).map((p) => {
              const max = stats.gamePlatforms?.[0]?.count || 1;
              const pct = Math.round((p.count / max) * 100);
              return (
                <div key={p.name} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>{p.name}</span>
                    <span className="font-mono text-slate-400">{p.count}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Libros: Autores y Géneros */}
        <div className="p-6 rounded-2xl bg-[#12151d] border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-300" /> Libros: Autores
          </h3>
          <div className="space-y-3 pt-2">
            {(stats.bookAuthors || []).slice(0, 5).map((a) => {
              const max = stats.bookAuthors?.[0]?.count || 1;
              const pct = Math.round((a.count / max) * 100);
              return (
                <div key={a.name} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>{a.name}</span>
                    <span className="font-mono text-slate-400">{a.count}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-200 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Preparación para IA Futura */}
      <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-amber-400/70 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-white">Recomendaciones Inteligentes (Próximamente)</h4>
            <p className="text-xs text-slate-400">
              La arquitectura de datos de tu archivo está preparada para conectar modelos de inteligencia artificial y recibir sugerencias personalizadas basadas en tus obras que te marcaron.
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold shrink-0">
          En preparación
        </span>
      </section>
    </div>
  );
}
