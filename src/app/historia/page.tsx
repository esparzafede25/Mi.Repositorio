"use client";

import React, { useEffect, useState, useMemo } from "react";
import { TimelineMilestone } from "@/lib/types";
import {
  Clock,
  Film,
  Gamepad2,
  BookOpen,
  Sparkles,
  Calendar,
  Star,
  Heart,
  MapPin,
  Users,
  Filter,
} from "lucide-react";

export default function HistoriaPage() {
  const [milestones, setMilestones] = useState<TimelineMilestone[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [decades, setDecades] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // View modes: "all" | "year" | "decade"
  const [viewMode, setViewMode] = useState<"year" | "decade" | "all">("year");
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [selectedDecade, setSelectedDecade] = useState<string | "all">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const fetchTimeline = async () => {
    try {
      const res = await fetch("/api/timeline");
      if (res.ok) {
        const data = await res.json();
        setMilestones(data.milestones || []);
        setYears(data.years || []);
        setDecades(data.decades || []);
      }
    } catch {
      // Ignorar
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  // Filtered milestones
  const filteredMilestones = useMemo(() => {
    return milestones.filter((m) => {
      if (typeFilter !== "all" && m.type !== typeFilter) return false;
      if (viewMode === "year" && selectedYear !== "all" && m.year !== selectedYear) return false;
      if (viewMode === "decade" && selectedDecade !== "all" && m.decade !== selectedDecade) return false;
      return true;
    });
  }, [milestones, typeFilter, viewMode, selectedYear, selectedDecade]);

  // Grouping for year view
  const groupedByYear = useMemo(() => {
    const map: Record<number, TimelineMilestone[]> = {};
    filteredMilestones.forEach((m) => {
      if (!map[m.year]) map[m.year] = [];
      map[m.year].push(m);
    });
    return map;
  }, [filteredMilestones]);

  // Grouping for decade view
  const groupedByDecade = useMemo(() => {
    const map: Record<string, TimelineMilestone[]> = {};
    filteredMilestones.forEach((m) => {
      if (!map[m.decade]) map[m.decade] = [];
      map[m.decade].push(m);
    });
    return map;
  }, [filteredMilestones]);

  const sortedYears = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a);

  const sortedDecades = Object.keys(groupedByDecade).sort((a, b) => (b > a ? 1 : -1));

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "movie":
        return <Film className="w-4 h-4 text-amber-400" />;
      case "videogame":
        return <Gamepad2 className="w-4 h-4 text-cyan-400" />;
      case "book":
        return <BookOpen className="w-4 h-4 text-amber-300" />;
      case "moment":
        return <Sparkles className="w-4 h-4 text-rose-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Clock className="w-3.5 h-3.5 text-cyan-400" /> Línea de Tiempo Cultural
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          MI HISTORIA
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Un recorrido cronológico construido a partir de tus fechas y momentos reales.
          Cada obra es una estación en el mapa de tu vida.
        </p>
      </div>

      {/* Control Bar: View Modes & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setViewMode("year")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === "year"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Por Año
          </button>
          <button
            type="button"
            onClick={() => setViewMode("decade")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === "decade"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Por Década
          </button>
          <button
            type="button"
            onClick={() => setViewMode("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === "all"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Todo Cronológico
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {viewMode === "year" && years.length > 0 && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
            >
              <option value="all">Todos los años ({years.length})</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  Año {y}
                </option>
              ))}
            </select>
          )}

          {viewMode === "decade" && decades.length > 0 && (
            <select
              value={selectedDecade}
              onChange={(e) => setSelectedDecade(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
            >
              <option value="all">Todas las décadas</option>
              {decades.map((d) => (
                <option key={d} value={d}>
                  Década de los {d}
                </option>
              ))}
            </select>
          )}

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
          >
            <option value="all">Todo formato</option>
            <option value="movie">🎬 Películas</option>
            <option value="videogame">🎮 Videojuegos</option>
            <option value="book">📚 Libros</option>
            <option value="moment">✨ Momentos</option>
          </select>
        </div>
      </div>

      {/* Timeline Stream */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm">
          Construyendo tu línea de tiempo...
        </div>
      ) : filteredMilestones.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white/[0.02] border border-white/5 space-y-3 p-8">
          <Clock className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Sin registros temporales</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Agregá fechas a tus películas, videojuegos, libros o recuerdos para que aparezcan en tu historia.
          </p>
        </div>
      ) : (
        <div className="relative border-l-2 border-white/10 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
          {viewMode === "year" &&
            sortedYears.map((year) => (
              <div key={year} className="relative space-y-4">
                {/* Year Marker */}
                <div className="sticky top-20 z-10 -ml-[35px] sm:-ml-[51px] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 text-black font-extrabold text-xs flex items-center justify-center shadow-lg shadow-cyan-500/20 border-2 border-[#0a0c10]">
                    {year.toString().slice(-2)}
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-[#12151d] border border-cyan-500/40 text-cyan-300 font-extrabold text-base shadow">
                    {year}
                  </span>
                </div>

                {/* Milestones inside this year */}
                <div className="space-y-3 pt-2">
                  {groupedByYear[year].map((item) => renderMilestoneCard(item))}
                </div>
              </div>
            ))}

          {viewMode === "decade" &&
            sortedDecades.map((decade) => (
              <div key={decade} className="relative space-y-4">
                {/* Decade Marker */}
                <div className="sticky top-20 z-10 -ml-[35px] sm:-ml-[51px] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-black font-extrabold text-xs flex items-center justify-center shadow-lg shadow-amber-500/20 border-2 border-[#0a0c10]">
                    {decade.slice(0, 2)}
                  </div>
                  <span className="px-3.5 py-1 rounded-xl bg-[#12151d] border border-amber-500/40 text-amber-300 font-extrabold text-base shadow">
                    Década {decade}
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  {groupedByDecade[decade].map((item) => renderMilestoneCard(item))}
                </div>
              </div>
            ))}

          {viewMode === "all" && (
            <div className="space-y-3">
              {filteredMilestones.map((item) => renderMilestoneCard(item))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  function renderMilestoneCard(item: TimelineMilestone) {
    return (
      <div
        key={`${item.type}-${item.id}`}
        className="group relative flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-[#12151d] border border-white/10 hover:border-white/20 transition-all shadow-md"
      >
        {/* Thumbnail if present */}
        {item.image && (
          <div className="w-16 h-22 sm:w-20 sm:h-28 rounded-xl overflow-hidden bg-black/50 border border-white/10 shrink-0 self-start">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-white/10">{getTypeIcon(item.type)}</span>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              {item.type === "movie" && "Película"}
              {item.type === "videogame" && "Videojuego"}
              {item.type === "book" && "Libro"}
              {item.type === "moment" && "Momento"}
            </span>
            {item.isFavorite && <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />}
            {item.markedMe && <Sparkles className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
          </div>

          <div className="flex items-start justify-between gap-2">
            <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              {item.title}
            </h4>
            {item.rating && (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-400 shrink-0">
                <Star className="w-3 h-3 fill-amber-400" /> {item.rating.toFixed(1)}
              </span>
            )}
          </div>

          {item.subtitle && (
            <p className="text-xs text-slate-400">{item.subtitle}</p>
          )}

          {item.notes && (
            <p className="text-xs text-slate-300 italic pt-1 leading-relaxed border-l-2 border-white/10 pl-2">
              &ldquo;{item.notes}&rdquo;
            </p>
          )}

          <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 font-mono">
              <Calendar className="w-3 h-3 text-slate-500" />
              {new Date(item.dateStr).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            {item.location && (
              <span className="flex items-center gap-1 text-cyan-300">
                <MapPin className="w-3 h-3" /> {item.location}
              </span>
            )}
            {item.sharedWith && (
              <span className="flex items-center gap-1 text-amber-300">
                <Users className="w-3 h-3" /> {item.sharedWith}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
}
