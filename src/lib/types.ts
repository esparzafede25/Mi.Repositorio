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
  isFavorite?: boolean;
  markedMe?: boolean;
  rewatch?: boolean;
  favoriteOrder?: number | null;
  personalPhotos?: string | null;
  location?: string | null;
  createdAt: string;
  updatedAt: string;
  moments?: MomentItem[];
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
  isFavorite?: boolean;
  markedMe?: boolean;
  rewatch?: boolean;
  favoriteOrder?: number | null;
  personalPhotos?: string | null;
  location?: string | null;
  createdAt: string;
  updatedAt: string;
  moments?: MomentItem[];
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
  isFavorite?: boolean;
  markedMe?: boolean;
  rewatch?: boolean;
  favoriteOrder?: number | null;
  personalPhotos?: string | null;
  location?: string | null;
  createdAt: string;
  updatedAt: string;
  moments?: MomentItem[];
}

export interface ActivityItem {
  id: string;
  userId: string;
  entityType: "movie" | "videogame" | "book" | "moment" | "journal" | "list";
  entityId: string;
  action: string;
  title: string;
  createdAt: string;
}

export interface MomentItem {
  id: string;
  userId: string;
  title: string;
  content: string;
  date?: string | null;
  location?: string | null;
  sharedWith?: string | null;
  imageUrl?: string | null;
  movieId?: string | null;
  videogameId?: string | null;
  bookId?: string | null;
  createdAt: string;
  updatedAt: string;
  movie?: { id: string; title: string; posterUrl?: string | null; year?: number | null } | null;
  videogame?: { id: string; title: string; coverUrl?: string | null; year?: number | null; platform?: string | null } | null;
  book?: { id: string; title: string; coverUrl?: string | null; year?: number | null; author?: string | null } | null;
}

export interface JournalEntryItem {
  id: string;
  userId: string;
  title: string;
  content: string;
  date: string;
  images?: string | null;
  movieId?: string | null;
  videogameId?: string | null;
  bookId?: string | null;
  createdAt: string;
  updatedAt: string;
  movie?: { id: string; title: string; posterUrl?: string | null; year?: number | null } | null;
  videogame?: { id: string; title: string; coverUrl?: string | null; year?: number | null } | null;
  book?: { id: string; title: string; coverUrl?: string | null; year?: number | null } | null;
}

export interface CustomListItem {
  id: string;
  listId: string;
  entityType: "movie" | "videogame" | "book";
  entityId: string;
  order: number;
  createdAt: string;
  movie?: MovieItem;
  videogame?: VideogameItem;
  book?: BookItem;
}

export interface CustomListWithItems {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  color?: string | null;
  createdAt: string;
  updatedAt: string;
  items: CustomListItem[];
}

export interface TimelineMilestone {
  id: string;
  type: "movie" | "videogame" | "book" | "moment" | "journal";
  title: string;
  subtitle?: string | null;
  dateStr: string;
  year: number;
  decade: string;
  image?: string | null;
  rating?: number | null;
  tags?: string | null;
  notes?: string | null;
  isFavorite?: boolean;
  markedMe?: boolean;
  location?: string | null;
  sharedWith?: string | null;
}

export interface StatsData {
  movieCount: number;
  gameCount: number;
  bookCount: number;
  momentCount: number;
  listCount: number;
  favoriteCount: number;
  markedCount: number;
  averageRating: number;
  recentActivities: ActivityItem[];
  recentMovies: MovieItem[];
  recentGames: VideogameItem[];
  recentBooks: BookItem[];
  recentMoments?: MomentItem[];
  markedItems?: (MovieItem | VideogameItem | BookItem)[];
  rewatchItems?: (MovieItem | VideogameItem | BookItem)[];
  todayHistory?: {
    yearsAgo: number;
    type: "movie" | "videogame" | "book" | "moment";
    title: string;
    rating?: number | null;
    status?: string | null;
    date: string;
  }[];
  movieGenres?: { name: string; count: number }[];
  movieDirectors?: { name: string; count: number }[];
  gamePlatforms?: { name: string; count: number }[];
  gameGenres?: { name: string; count: number }[];
  bookAuthors?: { name: string; count: number }[];
  bookGenres?: { name: string; count: number }[];
  culturalProfile?: string;
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
