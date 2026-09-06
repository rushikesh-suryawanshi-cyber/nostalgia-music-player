"use client";

import { useState, useCallback } from "react";
import { getStorageItem, setStorageItem } from "@/lib/storage";

const STORAGE_KEY = "nostalgia_favorites_v1";

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() =>
    getStorageItem<string[]>(STORAGE_KEY, ["1", "5"])
  );

  const toggleFavorite = useCallback((songId: string) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId];
      setStorageItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (songId: string) => favoriteIds.includes(songId),
    [favoriteIds]
  );

  return {
    favoriteIds,
    toggleFavorite,
    isFavorite,
  };
}
