"use client";

import React from "react";
import Image from "next/image";
import { Heart, Volume2 } from "lucide-react";
import { Song } from "@/data/songs";
import { formatTime } from "@/lib/audio";

interface PlaylistItemProps {
  song: Song;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  isFavorite: boolean;
  onSelect: (song: Song) => void;
  onToggleFavorite: (songId: string) => void;
  accentColor: string;
}

export const PlaylistItem: React.FC<PlaylistItemProps> = ({
  song,
  index,
  isActive,
  isPlaying,
  isFavorite,
  onSelect,
  onToggleFavorite,
  accentColor,
}) => {
  return (
    <div
      onClick={() => onSelect(song)}
      className={`group flex items-center justify-between p-2.5 sm:p-3 rounded-xl cursor-pointer transition-all duration-150 select-none border ${
        isActive
          ? "bg-white/10 border-white/20 shadow-sm"
          : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/5"
      }`}
    >
      {/* Left: Index / Equalizer & Thumbnail & Info */}
      <div className="flex items-center gap-3 min-w-0 pr-2">
        {/* Track Number or Animated Equalizer */}
        <div className="w-6 flex items-center justify-center text-xs font-mono text-white/40 group-hover:text-white/70">
          {isActive && isPlaying ? (
            <div className="flex items-end gap-0.5 h-3.5">
              <span
                className="w-1 bg-white rounded-full animate-pulse"
                style={{ height: "60%", backgroundColor: accentColor }}
              />
              <span
                className="w-1 bg-white rounded-full animate-pulse"
                style={{
                  height: "100%",
                  animationDelay: "0.15s",
                  backgroundColor: accentColor,
                }}
              />
              <span
                className="w-1 bg-white rounded-full animate-pulse"
                style={{
                  height: "40%",
                  animationDelay: "0.3s",
                  backgroundColor: accentColor,
                }}
              />
            </div>
          ) : isActive ? (
            <Volume2 className="w-3.5 h-3.5 text-white/90" style={{ color: accentColor }} />
          ) : (
            <span>{String(index + 1).padStart(2, "0")}</span>
          )}
        </div>

        {/* Thumbnail */}
        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-neutral-900">
          <Image
            src={song.artworkSrc}
            alt={song.title}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>

        {/* Title & Artist */}
        <div className="flex flex-col min-w-0">
          <span
            className={`text-sm font-medium truncate ${
              isActive ? "text-white font-semibold" : "text-white/85 group-hover:text-white"
            }`}
          >
            {song.title}
          </span>
          <span className="text-xs text-white/40 truncate">
            {song.artist} · <span className="text-white/60">{song.year}</span>
          </span>
        </div>
      </div>

      {/* Right: Duration & Favorite */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Duration */}
        <span className="text-xs font-mono text-white/40">
          {formatTime(song.durationSec || 28)}
        </span>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(song.id);
          }}
          aria-label={isFavorite ? "Remove favorite" : "Add to favorites"}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors duration-150"
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-150 ${
              isFavorite
                ? "fill-rose-500 text-rose-500 scale-110"
                : "text-white/20 group-hover:text-white/50 hover:scale-110"
            }`}
          />
        </button>
      </div>
    </div>
  );
};
