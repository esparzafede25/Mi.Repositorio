export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
}

export type MovieStatus = "Vista" | "Pendiente" | "En pausa";
export type GameStatus = "Terminado" | "En progreso" | "Abandonado" | "Pendiente";
export type BookStatus = "Leído" | "Leyendo" | "Abandonado" | "Pendiente";

export interface MovieItem {
  id: string;
  userId: string;
  title: string;
  originalTitle?: string | null;
  year?: number | null;
  director?: string | null;
  genres?: string | null;
  posterUrl?: string | null;
  watchedDate?: string | null;
  rating?: number | null;
  status: MovieStatus;
  notes?: string | null;
  review?: string | null;
  tags?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VideogameItem {
  id: string;
  userId: string;
  title: string;
  platform?: string | null;
  year?: number | null;
  developer?: string | null;
  genres?: string | null;
  coverUrl?: string | null;
  playedDate?: string | null;
  rating?: number | null;
  status: GameStatus;
  notes?: string | null;
  review?: string | null;
  tags?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookItem {
  id: string;
  userId: string;
  title: string;
  author?: string | null;
  year?: number | null;
  genre?: string | null;
  coverUrl?: string | null;
  readDate?: string | null;
  rating?: number | null;
  status: BookStatus;
  notes?: string | null;
  review?: string | null;
  tags?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityItem {
  id: string;
  userId: string;
  entityType: "movie" | "videogame" | "book";
  entityId: string;
  action: string;
  title: string;
  createdAt: string;
}

export interface StatsData {
  movieCount: number;
  gameCount: number;
  bookCount: number;
  averageRating: number;
  recentActivities: ActivityItem[];
  recentMovies: MovieItem[];
  recentGames: VideogameItem[];
  recentBooks: BookItem[];
}

export interface TmdbMovieResult {
  id: number;
  title: string;
  original_title: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  director?: string;
  genres?: string;
}
