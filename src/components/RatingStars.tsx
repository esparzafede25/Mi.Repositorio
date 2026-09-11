"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  value?: number | null;
  onChange?: (val: number) => void;
  max?: number;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function RatingStars({
  value = 0,
  onChange,
  max = 5,
  readOnly = false,
  size = "md",
}: RatingStarsProps) {
  const [hoverVal, setHoverVal] = useState<number | null>(null);
  const currentVal = hoverVal ?? (value || 0);

  const starSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, idx) => {
        const starNumber = idx + 1;
        const isFilled = currentVal >= starNumber;

        return (
          <button
            type="button"
            key={starNumber}
            disabled={readOnly}
            onClick={() => onChange && onChange(starNumber)}
            onMouseEnter={() => !readOnly && setHoverVal(starNumber)}
            onMouseLeave={() => !readOnly && setHoverVal(null)}
            className={`transition-transform duration-150 ${
              !readOnly ? "cursor-pointer hover:scale-110" : "cursor-default"
            }`}
          >
            <Star
              className={`${starSizes[size]} transition-colors ${
                isFilled
                  ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
                  : "text-slate-600 fill-slate-800/40"
              }`}
            />
          </button>
        );
      })}
      {value ? (
        <span className="ml-1 text-xs font-semibold text-amber-400/90 font-mono">
          {value.toFixed(1)}
        </span>
      ) : null}
    </div>
  );
}
