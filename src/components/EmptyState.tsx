"use client";

import React from "react";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  icon: string | React.ReactNode;
  title: string;
  subtitle: string;
  actionText?: string;
  onAction?: () => void;
  accentColor?: "amber" | "cyan" | "emerald";
}

export default function EmptyState({
  icon,
  title,
  subtitle,
  actionText,
  onAction,
  accentColor = "amber",
}: EmptyStateProps) {
  const buttonStyles = {
    amber: "bg-amber-400 hover:bg-amber-300 text-black shadow-amber-500/20",
    cyan: "bg-cyan-400 hover:bg-cyan-300 text-black shadow-cyan-500/20",
    emerald: "bg-emerald-400 hover:bg-emerald-300 text-black shadow-emerald-500/20",
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-10 sm:p-16 my-8 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent text-center">
      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl mb-4 shadow-xl shadow-black/40">
        {typeof icon === "string" ? icon : icon}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm sm:text-base max-w-md mb-6 italic">
        &ldquo;{subtitle}&rdquo;
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 transform active:scale-95 shadow-lg ${buttonStyles[accentColor]}`}
        >
          <Plus className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
}
