"use client";

import React, { useState } from "react";
import { MovieItem, VideogameItem, BookItem, MomentItem } from "@/lib/types";
import {
  X,
  Star,
  Calendar,
  Tag,
  Edit2,
  Trash2,
  Film,
  Gamepad2,
  BookOpen,
  FileText,
  Heart,
  RotateCcw,
  Sparkles,
  MapPin,
  Camera,
  Plus,
  Bookmark,
  Users,
} from "lucide-react";
import MomentModal from "@/components/MomentModal";
import AddToListModal from "@/components/AddToListModal";
import UploadImage from "@/components/UploadImage";
import { useToast } from "@/context/ToastContext";

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: (MovieItem | VideogameItem | BookItem) | null;
  type: "movie" | "videogame" | "book";
  onEdit: () => void;
  onDelete: () => void;
  onItemUpdated?: (updated: any) => void;
}

export default function ItemDetailModal({
  isOpen,
  onClose,
  item,
  type,
  onEdit,
  onDelete,
  onItemUpdated,
}: ItemDetailModalProps) {
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<"info" | "moments" | "photos">("info");
  const [momentModalOpen, setMomentModalOpen] = useState(false);
  const [listModalOpen, setListModalOpen] = useState(false);

  // Local optimistic states
  const [isFavorite, setIsFavorite] = useState(Boolean(item?.isFavorite));
  const [markedMe, setMarkedMe] = useState(Boolean(item?.markedMe));
  const [rewatch, setRewatch] = useState(Boolean(item?.rewatch));
  const [personalPhotos, setPersonalPhotos] = useState<string[]>(() => {
    if (!item?.personalPhotos) return [];
    try {
      return JSON.parse(item.personalPhotos);
    } catch {
      return [];
    }
  });
  const [itemMoments, setItemMoments] = useState<MomentItem[]>(item?.moments || []);

  // Update local state when item changes
  React.useEffect(() => {
    if (item) {
      setIsFavorite(Boolean(item.isFavorite));
      setMarkedMe(Boolean(item.markedMe));
      setRewatch(Boolean(item.rewatch));
      setItemMoments(item.moments || []);
      if (item.personalPhotos) {
        try {
          setPersonalPhotos(JSON.parse(item.personalPhotos));
        } catch {
          setPersonalPhotos([]);
        }
      } else {
        setPersonalPhotos([]);
      }
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const typeConfig = {
    movie: {
      label: "Película",
      icon: Film,
      accentText: "text-amber-400",
      accentBg: "bg-amber-400",
      borderGlow: "border-amber-500/30",
      aspectRatio: "aspect-[2/3] max-w-[220px]",
      rewatchLabel: "Volver a ver",
      endpoint: `/api/movies/${item.id}`,
    },
    videogame: {
      label: "Videojuego",
      icon: Gamepad2,
      accentText: "text-cyan-400",
      accentBg: "bg-cyan-400",
      borderGlow: "border-cyan-500/30",
      aspectRatio: "aspect-[3/4] max-w-[220px]",
      rewatchLabel: "Volver a jugar",
      endpoint: `/api/videogames/${item.id}`,
    },
    book: {
      label: "Libro",
      icon: BookOpen,
      accentText: "text-amber-300",
      accentBg: "bg-amber-400",
      borderGlow: "border-amber-500/30",
      aspectRatio: "aspect-[2/3] max-w-[200px]",
      rewatchLabel: "Volver a leer",
      endpoint: `/api/books/${item.id}`,
    },
  }[type];

  const Icon = typeConfig.icon;

  const image =
    ("posterUrl" in item && item.posterUrl) ||
    ("coverUrl" in item && item.coverUrl) ||
    null;

  const creator =
    ("director" in item && item.director ? `Dir. ${item.director}` : null) ||
    ("developer" in item && item.developer ? `Dev. ${item.developer}` : null) ||
    ("author" in item && item.author ? `Por ${item.author}` : null);

  const genres =
    ("genres" in item && item.genres) ||
    ("genre" in item && item.genre) ||
    null;

  const dateConsumed =
    ("watchedDate" in item && item.watchedDate) ||
    ("playedDate" in item && item.playedDate) ||
    ("readDate" in item && item.readDate) ||
    null;

  const dateLabel = {
    movie: "Visto el",
    videogame: "Jugado el",
    book: "Leído el",
  }[type];

  const updateItemField = async (fields: Record<string, any>) => {
    try {
      const res = await fetch(typeConfig.endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (res.ok) {
        const data = await res.json();
        if (onItemUpdated) {
          onItemUpdated(data[type] || data.movie || data.videogame || data.book);
        }
      }
    } catch {
      error("Error al actualizar");
    }
  };

  const toggleFavorite = async () => {
    const nextVal = !isFavorite;
    setIsFavorite(nextVal);
    await updateItemField({ isFavorite: nextVal });
    success(nextVal ? "Agregado a Mis Favoritos ❤️" : "Quitado de favoritos");
  };

  const toggleMarkedMe = async () => {
    const nextVal = !markedMe;
    setMarkedMe(nextVal);
    await updateItemField({ markedMe: nextVal });
    success(nextVal ? "Marcado como 'Me marcó' ✨" : "Quitado de 'Me marcó'");
  };

  const toggleRewatch = async () => {
    const nextVal = !rewatch;
    setRewatch(nextVal);
    await updateItemField({ rewatch: nextVal });
    success(nextVal ? `Agregado a '${typeConfig.rewatchLabel}' 🔄` : "Quitado de 'Volver a...'");
  };

  const handleAddPersonalPhoto = async (photoUrl: string) => {
    if (!photoUrl) return;
    const updatedPhotos = [...personalPhotos, photoUrl];
    setPersonalPhotos(updatedPhotos);
    await updateItemField({ personalPhotos: JSON.stringify(updatedPhotos) });
    success("Foto personal agregada al recuerdo ✓");
  };

  const handleRemovePhoto = async (indexToRemove: number) => {
    const updatedPhotos = personalPhotos.filter((_, idx) => idx !== indexToRemove);
    setPersonalPhotos(updatedPhotos);
    await updateItemField({ personalPhotos: JSON.stringify(updatedPhotos) });
    success("Foto eliminada");
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 no-print">
        <div className={`relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl border ${typeConfig.borderGlow} bg-[#12151d] shadow-2xl overflow-hidden`}>
          {/* Header Bar */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-white/[0.04] to-transparent">
            <div className="flex items-center gap-2">
              <span className={`p-1.5 rounded-lg bg-white/10 ${typeConfig.accentText}`}>
                <Icon className="w-4 h-4" />
              </span>
              <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">
                Ficha Cultural de {typeConfig.label}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setListModalOpen(true)}
                className="p-2 text-slate-400 hover:text-amber-400 hover:bg-white/10 rounded-lg transition"
                title="Agregar a lista"
              >
                <Bookmark className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  onClose();
                  onEdit();
                }}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
                title="Editar"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  onClose();
                  onDelete();
                }}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition ml-1"
                title="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub-navigation Tabs */}
          <div className="flex items-center gap-4 px-6 pt-3 border-b border-white/10 bg-black/30">
            <button
              onClick={() => setActiveTab("info")}
              className={`pb-2.5 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
                activeTab === "info"
                  ? "border-amber-400 text-white"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Ficha y Reseña
            </button>
            <button
              onClick={() => setActiveTab("moments")}
              className={`pb-2.5 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
                activeTab === "moments"
                  ? "border-rose-400 text-white"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-400" /> Mis Momentos ({itemMoments.length})
            </button>
            <button
              onClick={() => setActiveTab("photos")}
              className={`pb-2.5 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
                activeTab === "photos"
                  ? "border-cyan-400 text-white"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-cyan-400" /> Fotos Personales ({personalPhotos.length})
            </button>
          </div>

          {/* Modal Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === "info" && (
              <>
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Poster / Cover */}
                  <div className={`w-full sm:w-auto ${typeConfig.aspectRatio} rounded-xl overflow-hidden bg-black/50 border border-white/10 shrink-0 shadow-xl self-start`}>
                    {image ? (
                      <img
                        src={image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-600 bg-white/[0.02]">
                        <Icon className="w-12 h-12 mb-2" />
                        <span className="text-xs">Sin imagen</span>
                      </div>
                    )}
                  </div>

                  {/* Info and metadata */}
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                          {item.title}
                        </h2>
                        {item.rating ? (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 rounded-full border border-amber-400/30 text-amber-400 text-sm font-bold shrink-0">
                            <Star className="w-4 h-4 fill-amber-400" />
                            <span>{item.rating.toFixed(1)}</span>
                            <span className="text-slate-500 text-xs font-normal">/ 5</span>
                          </div>
                        ) : null}
                      </div>

                      {"originalTitle" in item && item.originalTitle && item.originalTitle !== item.title && (
                        <p className="text-sm text-slate-400 italic mt-0.5">
                          ({item.originalTitle})
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        {item.year && (
                          <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-md text-xs font-mono text-slate-300">
                            {item.year}
                          </span>
                        )}
                        {"platform" in item && item.platform && (
                          <span className="px-2.5 py-0.5 bg-cyan-500/20 border border-cyan-500/40 rounded-md text-xs font-bold text-cyan-300">
                            {item.platform}
                          </span>
                        )}
                        <span className="px-2.5 py-0.5 bg-white/10 rounded-full text-xs font-semibold text-slate-200">
                          {item.status}
                        </span>
                        {item.location && (
                          <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-md text-xs text-emerald-300 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {item.location}
                          </span>
                        )}
                      </div>

                      {creator && (
                        <p className="text-base text-slate-300 font-medium mt-3">
                          {creator}
                        </p>
                      )}

                      {genres && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {genres.split(",").map((g, i) => (
                            <span
                              key={i}
                              className="text-xs text-slate-300 bg-white/[0.06] px-2.5 py-1 rounded-lg border border-white/5"
                            >
                              {g.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {dateConsumed && (
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-4 pt-4 border-t border-white/10">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <span>
                            {dateLabel}:{" "}
                            <strong className="text-slate-200">
                              {new Date(dateConsumed).toLocaleDateString("es-ES", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </strong>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Cultural Action Badges - Interactive Toggles */}
                    <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
                      {/* Favorito */}
                      <button
                        type="button"
                        onClick={toggleFavorite}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                          isFavorite
                            ? "bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-lg shadow-rose-500/10"
                            : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
                        {isFavorite ? "Favorita" : "Marcar Favorita"}
                      </button>

                      {/* Me Marcó */}
                      <button
                        type="button"
                        onClick={toggleMarkedMe}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                          markedMe
                            ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-500/10"
                            : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        <Sparkles className={`w-3.5 h-3.5 ${markedMe ? "fill-amber-400 text-amber-400" : ""}`} />
                        {markedMe ? "Me marcó ✨" : "Me marcó"}
                      </button>

                      {/* Volver a... */}
                      <button
                        type="button"
                        onClick={toggleRewatch}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                          rewatch
                            ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                            : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        {rewatch ? typeConfig.rewatchLabel : `+ ${typeConfig.rewatchLabel}`}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Personal Review Section */}
                {item.review && (
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-amber-400" /> Reseña Personal
                    </h4>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                      {item.review}
                    </div>
                  </div>
                )}

                {/* Notes and Observations */}
                {item.notes && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Notas y observaciones
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed italic bg-black/30 p-3 rounded-lg border border-white/5">
                      {item.notes}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {item.tags && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-3.5 h-3.5 text-slate-500" />
                    {item.tags.split(",").map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-md"
                      >
                        #{t.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "moments" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Recuerdos y Momentos</h4>
                    <p className="text-xs text-slate-400">
                      Experiencias, anécdotas o personas con las que compartiste esta obra.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMomentModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Agregar Momento
                  </button>
                </div>

                {itemMoments.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-3">
                    <Sparkles className="w-8 h-8 text-rose-400/60 mx-auto" />
                    <p className="text-sm text-slate-300 font-medium">
                      Aún no registraste recuerdos para &ldquo;{item.title}&rdquo;.
                    </p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      ¿Dónde estabas cuando la descubriste? ¿Con quién fuiste al cine o compartiste partida?
                    </p>
                    <button
                      type="button"
                      onClick={() => setMomentModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Escribir primer recuerdo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {itemMoments.map((mom) => (
                      <div
                        key={mom.id}
                        className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-bold text-white text-sm">{mom.title}</h5>
                          {mom.date && (
                            <span className="text-[11px] text-slate-400 font-mono">
                              {new Date(mom.date).toLocaleDateString("es-ES")}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {mom.content}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-2 border-t border-white/5">
                          {mom.location && (
                            <span className="flex items-center gap-1 text-cyan-300">
                              <MapPin className="w-3 h-3" /> {mom.location}
                            </span>
                          )}
                          {mom.sharedWith && (
                            <span className="flex items-center gap-1 text-amber-300">
                              <Users className="w-3 h-3" /> {mom.sharedWith}
                            </span>
                          )}
                        </div>
                        {mom.imageUrl && (
                          <div className="mt-2 w-full max-h-48 rounded-lg overflow-hidden border border-white/10">
                            <img src={mom.imageUrl} alt="Foto del recuerdo" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "photos" && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-white">Fotografías Personales</h4>
                  <p className="text-xs text-slate-400">
                    Fotos de tus vacaciones jugando, la entrada del cine, tu ejemplar en la biblioteca, etc.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <UploadImage
                    onImageUploaded={handleAddPersonalPhoto}
                    label="Subir nueva foto personal a esta obra"
                  />
                </div>

                {personalPhotos.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No has agregado fotos personales aún. Subí una arriba para guardarla en tu archivo.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {personalPhotos.map((photo, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-video rounded-xl overflow-hidden bg-black/50 border border-white/10 shadow-md"
                      >
                        <img src={photo} alt="Foto personal" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-1.5 right-1.5 p-1 bg-black/80 hover:bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition shadow"
                          title="Eliminar foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para registrar un nuevo recuerdo vinculado */}
      <MomentModal
        isOpen={momentModalOpen}
        onClose={() => setMomentModalOpen(false)}
        onSaved={(newMoment) => {
          setItemMoments((prev) => [newMoment, ...prev]);
        }}
        associatedItem={{
          type,
          id: item.id,
          title: item.title,
        }}
      />

      {/* Modal para agregar a una lista personalizada */}
      <AddToListModal
        isOpen={listModalOpen}
        onClose={() => setListModalOpen(false)}
        entityType={type}
        entityId={item.id}
        itemTitle={item.title}
      />
    </>
  );
}
