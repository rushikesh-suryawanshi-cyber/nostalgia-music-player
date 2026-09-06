"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Clapperboard, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { Song } from "@/data/songs";

interface NowPlayingProps {
  currentSong: Song;
  isPlaying: boolean;
  isLoading: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onArtworkClick?: () => void;
  error?: string | null;
  onRetry?: () => void;
}

export const NowPlaying: React.FC<NowPlayingProps> = ({
  currentSong,
  isPlaying,
  isLoading,
  isFavorite,
  onToggleFavorite,
  onArtworkClick,
  error,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-2 md:py-3 z-20 max-w-xl mx-auto w-full">
      {/* Bollywood Theatrical Movie Poster */}
      <div className="relative mb-4 md:mb-6 group">
        {/* Dynamic ambient backdrop glow */}
        <div
          className="absolute -inset-4 rounded-3xl opacity-40 blur-2xl transition-all duration-700 pointer-events-none"
          style={{
            backgroundColor: currentSong.accent,
          }}
        />

        {/* Theatrical Poster Card (3:4 aspect ratio, rock-solid, zero shaking) */}
        <div
          onClick={onArtworkClick}
          className="relative w-48 h-[270px] sm:w-56 sm:h-[310px] md:w-64 md:h-[345px] rounded-xl overflow-hidden shadow-2xl border border-white/20 hover:border-white/40 cursor-pointer bg-neutral-950 transition-colors duration-200"
        >
          {/* Main Poster Image - completely crisp, no scale distortion */}
          <Image
            src={currentSong.artworkSrc}
            alt={`${currentSong.album} - ${currentSong.title} Bollywood Poster`}
            fill
            sizes="(max-width: 768px) 240px, 280px"
            className="object-cover select-none pointer-events-none"
            priority
          />

          {/* Film Gloss Sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-transparent pointer-events-none" />

          {/* Movie Badge Indicator (with non-intrusive loading indicator) */}
          <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-mono tracking-wider text-white/90 flex items-center gap-1.5 shadow-md">
            {isLoading ? (
              <Loader2 className="w-3 h-3 text-amber-400 animate-spin" />
            ) : (
              <Clapperboard className="w-3 h-3 text-amber-400" />
            )}
            <span>{currentSong.year}</span>
          </div>

          {/* Subtle play/pause indicator on hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <div className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[11px] font-mono tracking-wider text-white/90">
              {isPlaying ? "PAUSE" : "PLAY"}
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner if audio playback failed */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 px-4 py-2 rounded-xl bg-red-950/80 border border-red-800/60 backdrop-blur-md flex items-center gap-3 text-red-200 text-xs shadow-lg"
        >
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="ml-2 flex items-center gap-1 font-semibold text-red-300 hover:text-white underline underline-offset-2 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Try again
            </button>
          )}
        </motion.div>
      )}

      {/* Bollywood Song & Movie Details */}
      <div className="flex flex-col items-center">
        {/* Label: FILM / MOVIE */}
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase"
            style={{ color: currentSong.accent }}
          >
            {currentSong.album} ({currentSong.year})
          </span>
        </div>

        {/* Large Song Title */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSong.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center gap-3 w-full px-2"
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold tracking-tight text-white drop-shadow-md">
              {currentSong.title}
            </h1>

            {/* Favorite Heart Toggle */}
            <button
              onClick={onToggleFavorite}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors duration-150 active:scale-90"
              title={isFavorite ? "Favorited" : "Add to Favorites"}
            >
              <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 ${
                  isFavorite
                    ? "fill-rose-500 text-rose-500 scale-110"
                    : "text-white/40 hover:text-white/80"
                }`}
              />
            </button>
          </motion.div>
        </AnimatePresence>

        {/* Singer / Composer */}
        <p className="text-sm sm:text-base font-medium text-white/85 mt-1 tracking-wide">
          {currentSong.artist}
        </p>

        {/* Star Cast */}
        {currentSong.cast && (
          <p className="text-xs font-normal text-white/50 mt-0.5 tracking-wider">
            Starring: <span className="text-white/75">{currentSong.cast}</span>
          </p>
        )}

        {/* Nostalgic Memory Note Quote */}
        {currentSong.memoryNote && (
          <p className="text-[11px] sm:text-xs italic text-white/45 mt-2.5 max-w-md px-4 leading-relaxed font-sans">
            &ldquo;{currentSong.memoryNote}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
};
