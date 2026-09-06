"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Heart, Clock, Sparkles } from "lucide-react";
import { Song, SONGS } from "@/data/songs";
import { PLAYLIST_CATEGORIES } from "@/data/playlists";
import { PlaylistItem } from "./PlaylistItem";

interface PlaylistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: Song;
  isPlaying: boolean;
  onSelectSong: (song: Song) => void;
  favoriteIds: string[];
  recentSongIds: string[];
  onToggleFavorite: (songId: string) => void;
  accentColor: string;
}

export const PlaylistDrawer: React.FC<PlaylistDrawerProps> = ({
  isOpen,
  onClose,
  currentSong,
  isPlaying,
  onSelectSong,
  favoriteIds,
  recentSongIds,
  onToggleFavorite,
  accentColor,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Determine filtered songs based on category/tab and search query
  const displayedSongs = useMemo(() => {
    let list: Song[] = [];

    if (selectedCategory === "favorites") {
      list = SONGS.filter((s) => favoriteIds.includes(s.id));
    } else if (selectedCategory === "recent") {
      list = recentSongIds
        .map((id) => SONGS.find((s) => s.id === id))
        .filter((s): s is Song => Boolean(s));
    } else {
      const cat = PLAYLIST_CATEGORIES.find((c) => c.id === selectedCategory);
      if (cat) {
        list = SONGS.filter((s) => cat.songIds.includes(s.id));
      } else {
        list = SONGS;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.artist.toLowerCase().includes(q) ||
          s.album.toLowerCase().includes(q) ||
          String(s.year).includes(q)
      );
    }

    return list;
  }, [selectedCategory, favoriteIds, recentSongIds, searchQuery]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Container: Responsive (Right drawer on desktop, Bottom sheet on mobile) */}
          <motion.aside
            aria-label="Playlist drawer"
            initial={{ x: "100%", y: 0 }}
            animate={{ x: 0, y: 0 }}
            exit={{ x: "100%", y: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] md:w-[460px] bg-neutral-950/95 border-l border-white/10 flex flex-col shadow-2xl backdrop-blur-xl"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex flex-col">
                <span className="text-xs font-mono tracking-widest text-white/40 uppercase">
                  ARCHIVES & MEMORIES
                </span>
                <h2 className="text-lg font-serif font-bold text-white tracking-wide">
                  Soundtrack of 2005–2010
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close drawer"
                className="p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors duration-150"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-white/5">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Search memory, artist, year..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/25 focus:bg-white/10 transition-colors"
                />
              </div>
            </div>

            {/* Categories & Smart Tabs */}
            <div className="px-4 py-3 border-b border-white/5 overflow-x-auto no-scrollbar flex items-center gap-1.5">
              {/* Category Pills */}
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 border flex items-center gap-1.5 ${
                  selectedCategory === "all"
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Sparkles className="w-3 h-3" />
                All
              </button>

              <button
                onClick={() => setSelectedCategory("favorites")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 border flex items-center gap-1.5 ${
                  selectedCategory === "favorites"
                    ? "bg-rose-600 text-white border-rose-500"
                    : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Heart className="w-3 h-3 fill-current" />
                Favorites ({favoriteIds.length})
              </button>

              <button
                onClick={() => setSelectedCategory("recent")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 border flex items-center gap-1.5 ${
                  selectedCategory === "recent"
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Clock className="w-3 h-3" />
                Recent
              </button>

              {PLAYLIST_CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 border ${
                    selectedCategory === cat.id
                      ? "bg-white text-black border-white"
                      : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Song List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {displayedSongs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center text-white/40">
                  <p className="text-sm">No memories found</p>
                  <p className="text-xs mt-1">Try another category or search filter</p>
                </div>
              ) : (
                displayedSongs.map((song, index) => (
                  <PlaylistItem
                    key={song.id}
                    song={song}
                    index={index}
                    isActive={currentSong.id === song.id}
                    isPlaying={isPlaying}
                    isFavorite={favoriteIds.includes(song.id)}
                    onSelect={(s) => {
                      onSelectSong(s);
                    }}
                    onToggleFavorite={onToggleFavorite}
                    accentColor={accentColor}
                  />
                ))
              )}
            </div>

            {/* Drawer Footer: Current Playing Mini Bar */}
            <div className="p-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-white/50 px-5">
              <span>{displayedSongs.length} memories in queue</span>
              <span className="font-mono">NOSTALGIA HI-FI</span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
