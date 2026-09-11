"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Film,
  Gamepad2,
  BookOpen,
  LayoutDashboard,
  Heart,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  Sparkles,
  History,
  Bookmark,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import SoundButton from "@/components/SoundButton";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Main primary links
  const primaryLinks = [
    { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
    { href: "/peliculas", label: "Películas", icon: Film, color: "text-amber-400" },
    { href: "/videojuegos", label: "Videojuegos", icon: Gamepad2, color: "text-cyan-400" },
    { href: "/libros", label: "Libros", icon: BookOpen, color: "text-amber-300" },
    { href: "/momentos", label: "Momentos", icon: Sparkles, color: "text-rose-400" },
    { href: "/historia", label: "Historia", icon: History, color: "text-cyan-300" },
  ];

  // Secondary / biography links
  const moreLinks = [
    { href: "/favoritos", label: "Mis Favoritos", icon: Heart, color: "text-rose-500" },
    { href: "/marcados", label: "Cosas que me marcaron", icon: Sparkles, color: "text-amber-400" },
    { href: "/volver-a", label: "Volver a...", icon: Compass, color: "text-cyan-400" },
    { href: "/listas", label: "Mis Listas", icon: Bookmark, color: "text-amber-300" },
    { href: "/diario", label: "Mi Diario", icon: BookOpen, color: "text-emerald-400" },
    { href: "/estadisticas", label: "Estadísticas & Mi Año", icon: TrendingUp, color: "text-purple-400" },
    { href: "/colaborar", label: "Colaborar (Fede.e3d)", icon: Heart, color: "text-rose-400" },
  ];

  const allNavLinks = [...primaryLinks, ...moreLinks];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0a0c10]/90 backdrop-blur-md no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-3 group transition-transform active:scale-95 shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-cyan-500 p-[1.5px] shadow-lg shadow-amber-500/10">
              <div className="w-full h-full bg-[#0a0c10] rounded-[10px] flex items-center justify-center group-hover:bg-opacity-80 transition">
                <Compass className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="font-extrabold tracking-wider text-base sm:text-lg bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                MI REPOSITORIO
              </span>
              <span className="hidden sm:block text-[9px] tracking-widest text-amber-400/80 font-mono uppercase">
                Biografía Cultural
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          {user && (
            <nav className="hidden lg:flex items-center gap-1">
              {primaryLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-white/15 text-white shadow-inner"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${link.color || ""}`} />
                    {link.label}
                  </Link>
                );
              })}

              {/* "Más" Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 250)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    dropdownOpen || moreLinks.some((l) => l.href === pathname)
                      ? "bg-white/15 text-white"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>Más</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 rounded-2xl bg-[#12151d] border border-white/10 shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50">
                    {moreLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setDropdownOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
                            isActive
                              ? "bg-white/15 text-white"
                              : "text-slate-300 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${link.color || ""}`} />
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>
          )}

          {/* User Profile & Sound Actions (Desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            <SoundButton />
            {user ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/perfil"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition ${
                    pathname === "/perfil"
                      ? "border-amber-500/40 bg-amber-500/10 text-white"
                      : "border-white/10 text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-black uppercase overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                      user.username.charAt(0)
                    )}
                  </div>
                  <span className="text-xs font-semibold">{user.username}</span>
                </Link>

                <button
                  onClick={() => logout()}
                  title="Cerrar sesión"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs text-slate-300 hover:text-white transition"
                >
                  Acceso
                </Link>
                <Link
                  href="/registro"
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition shadow-md shadow-amber-400/20"
                >
                  Crear Cuenta
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu controls */}
          <div className="flex lg:hidden items-center gap-2">
            <SoundButton />
            {user && (
              <Link
                href="/perfil"
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-black uppercase overflow-hidden"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  user.username.charAt(0)
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#0d1017] px-4 pt-3 pb-5 space-y-1 max-h-[85vh] overflow-y-auto">
          {user ? (
            <>
              {allNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium ${
                      isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${link.color || ""}`} />
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between">
                <Link
                  href="/perfil"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-xs text-slate-300 hover:text-white"
                >
                  <User className="w-4 h-4 text-amber-400" />
                  Perfil ({user.username})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded"
                >
                  <LogOut className="w-4 h-4" />
                  Salir
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg border border-white/10 text-slate-200 text-sm font-medium"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/registro"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-sm font-semibold"
              >
                Crear Mi Repositorio
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
