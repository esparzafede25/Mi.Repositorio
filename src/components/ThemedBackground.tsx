"use client";

import React from "react";
import { usePathname } from "next/navigation";

// Curated high-res imagery for thematic collages
const MOVIE_BW_IMAGES = [
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80", // Film camera & reel
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80", // Cinema seats classic
  "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=600&q=80", // Movie projector vintage
  "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80", // Dark cinema hall
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80", // Classic film countdown
  "https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=600&q=80", // Theater cinema screen
  "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=600&q=80", // Vintage movie theater
  "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80", // Old film strip
];

const GAME_IMAGES = [
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80", // Retro gaming hardware
  "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80", // Arcade neon
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80", // Gaming controller
  "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=600&q=80", // Retro GameBoy
  "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80", // Neon arcade sticks
  "https://images.unsplash.com/photo-1612287233207-6a1656f48a1c?auto=format&fit=crop&w=600&q=80", // Pixel / retro console
  "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80", // Cyberpunk neon glow
  "https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?auto=format&fit=crop&w=600&q=80", // Joystick & games
];

const BOOK_IMAGES = [
  "https://images.unsplash.com/photo-1507842229451-79b1be8d62ee?auto=format&fit=crop&w=600&q=80", // Library shelves
  "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80", // Book pages
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80", // Antique books stack
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80", // Vintage library reading
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80", // Books open
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80", // Open novel pages
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80", // Grand library
  "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80", // Literary books
];

const MIXED_IMAGES = [
  MOVIE_BW_IMAGES[0], GAME_IMAGES[0], BOOK_IMAGES[0],
  MOVIE_BW_IMAGES[2], GAME_IMAGES[1], BOOK_IMAGES[2],
  MOVIE_BW_IMAGES[4], GAME_IMAGES[4], BOOK_IMAGES[4],
  MOVIE_BW_IMAGES[6], GAME_IMAGES[6], BOOK_IMAGES[6],
];

export default function ThemedBackground() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isMovies = pathname.startsWith("/peliculas");
  const isGames = pathname.startsWith("/videojuegos");
  const isBooks = pathname.startsWith("/libros");

  // Choose images according to route
  let images = MIXED_IMAGES;
  let customStyle = "";
  let glowColor = "rgba(245, 158, 11, 0.08)";

  if (isMovies) {
    images = MOVIE_BW_IMAGES;
    customStyle = "grayscale contrast-125 brightness-75";
    glowColor = "rgba(255, 255, 255, 0.05)";
  } else if (isGames) {
    images = GAME_IMAGES;
    customStyle = "hue-rotate-15 contrast-110";
    glowColor = "rgba(6, 182, 212, 0.1)";
  } else if (isBooks) {
    images = BOOK_IMAGES;
    customStyle = "sepia-[0.35] brightness-90";
    glowColor = "rgba(245, 158, 11, 0.08)";
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Moving Collage Columns */}
      <div className="absolute inset-0 flex justify-around gap-6 opacity-[0.08] sm:opacity-[0.11] transform -rotate-3 scale-110">
        {/* Column 1 - Moving Down */}
        <div className="flex flex-col gap-6 animate-marquee-down">
          {[...images, ...images].map((img, i) => (
            <div
              key={`c1-${i}`}
              className="w-44 sm:w-56 h-64 sm:h-80 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0 shadow-2xl"
            >
              <img
                src={img}
                alt="Fondo cultural"
                className={`w-full h-full object-cover ${customStyle}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Column 2 - Moving Up */}
        <div className="hidden sm:flex flex-col gap-6 animate-marquee-up">
          {[...images.slice(2), ...images, ...images.slice(0, 2)].map((img, i) => (
            <div
              key={`c2-${i}`}
              className="w-44 sm:w-56 h-64 sm:h-80 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0 shadow-2xl"
            >
              <img
                src={img}
                alt="Fondo cultural"
                className={`w-full h-full object-cover ${customStyle}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Column 3 - Moving Down */}
        <div className="hidden md:flex flex-col gap-6 animate-marquee-down">
          {[...images.slice(4), ...images, ...images.slice(0, 4)].map((img, i) => (
            <div
              key={`c3-${i}`}
              className="w-44 sm:w-56 h-64 sm:h-80 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0 shadow-2xl"
            >
              <img
                src={img}
                alt="Fondo cultural"
                className={`w-full h-full object-cover ${customStyle}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Column 4 - Moving Up */}
        <div className="hidden lg:flex flex-col gap-6 animate-marquee-up">
          {[...images.slice(1), ...images, ...images.slice(0, 1)].map((img, i) => (
            <div
              key={`c4-${i}`}
              className="w-44 sm:w-56 h-64 sm:h-80 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0 shadow-2xl"
            >
              <img
                src={img}
                alt="Fondo cultural"
                className={`w-full h-full object-cover ${customStyle}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dark Vignette & Radial Overlays for maximum text readability */}
      <div className="absolute inset-0 bg-[#0a0c10]/85 backdrop-blur-[2px]" />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${glowColor} 0%, transparent 70%)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c10] via-transparent to-[#0a0c10]" />
    </div>
  );
}
