"use client";

import React from "react";
import { Search, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  searchPlaceholder: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  statusOptions: FilterOption[];
  genreFilter: string;
  onGenreChange: (genre: string) => void;
  genreOptions: FilterOption[];
  platformFilter?: string;
  onPlatformChange?: (platform: string) => void;
  platformOptions?: FilterOption[];
  customFilter?: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    options: FilterOption[];
  };
  sortBy: string;
  onSortChange: (sort: string) => void;
  onReset: () => void;
  totalCount: number;
}

export default function FilterBar({
  searchPlaceholder,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  statusOptions,
  genreFilter,
  onGenreChange,
  genreOptions,
  platformFilter,
  onPlatformChange,
  platformOptions,
  customFilter,
  sortBy,
  onSortChange,
  onReset,
  totalCount,
}: FilterBarProps) {
  const hasActiveFilters =
    Boolean(searchQuery) ||
    Boolean(statusFilter) ||
    Boolean(genreFilter) ||
    Boolean(platformFilter) ||
    Boolean(customFilter?.value);

  return (
    <div className="w-full space-y-3 mb-8">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-10 py-2.5 bg-[#12151d] border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-[#12151d] border border-white/10 rounded-xl text-slate-300 text-xs font-medium">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline text-slate-400">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Ordenar por"
              className="bg-transparent border-none text-white text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="recent" className="bg-[#12151d]">Más recientes</option>
              <option value="oldest" className="bg-[#12151d]">Más antiguos</option>
              <option value="rating_desc" className="bg-[#12151d]">Mejor puntuados</option>
              <option value="az" className="bg-[#12151d]">A - Z</option>
              <option value="za" className="bg-[#12151d]">Z - A</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="px-3 py-2 text-xs font-medium text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 rounded-xl border border-amber-500/20 transition flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Filter pills and dropdowns */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
        <span className="text-slate-500 flex items-center gap-1 font-medium mr-1">
          <SlidersHorizontal className="w-3 h-3" /> Filtros:
        </span>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filtrar por estado"
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
            statusFilter
              ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
              : "bg-[#12151d] border-white/10 text-slate-300 hover:border-white/20"
          }`}
        >
          <option value="" className="bg-[#12151d]">Todos los estados</option>
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#12151d]">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Genre filter */}
        <select
          value={genreFilter}
          onChange={(e) => onGenreChange(e.target.value)}
          aria-label="Filtrar por género"
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
            genreFilter
              ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
              : "bg-[#12151d] border-white/10 text-slate-300 hover:border-white/20"
          }`}
        >
          <option value="" className="bg-[#12151d]">Todos los géneros</option>
          {genreOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#12151d]">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Platform filter */}
        {platformOptions && onPlatformChange && (
          <select
            value={platformFilter || ""}
            onChange={(e) => onPlatformChange(e.target.value)}
            aria-label="Filtrar por plataforma"
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
              platformFilter
                ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                : "bg-[#12151d] border-white/10 text-slate-300 hover:border-white/20"
            }`}
          >
            <option value="" className="bg-[#12151d]">Todas las plataformas</option>
            {platformOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#12151d]">
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {/* Custom filter (e.g. platform) */}
        {customFilter && (
          <select
            value={customFilter.value}
            onChange={(e) => customFilter.onChange(e.target.value)}
            aria-label={customFilter.label}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
              customFilter.value
                ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                : "bg-[#12151d] border-white/10 text-slate-300 hover:border-white/20"
            }`}
          >
            <option value="" className="bg-[#12151d]">{customFilter.label}</option>
            {customFilter.options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#12151d]">
                {opt.label}
              </option>
            ))}
          </select>
        )}

        <div className="ml-auto text-xs text-slate-400 font-mono">
          Mostrando <span className="text-white font-bold">{totalCount}</span> elementos
        </div>
      </div>
    </div>
  );
}
