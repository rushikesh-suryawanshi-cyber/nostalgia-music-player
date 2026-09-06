"use client";

import { useState, useCallback } from "react";
import { getStorageItem, setStorageItem } from "@/lib/storage";

const STORAGE_KEY = "nostalgia_recently_played_v1";
const MAX_HISTORY = 10;

export function useRecentlyPlayed() {
  const [recentSongIds, setRecentSongIds] = useState<string[]>(() =>
    getStorageItem<string[]>(STORAGE_KEY, ["1"])
  );

  const recordPlay = useCallback((songId: string) => {
    setRecentSongIds((prev) => {
      if (prev[0] === songId) return prev;
      const filtered = prev.filter((id) => id !== songId);
      const next = [songId, ...filtered].slice(0, MAX_HISTORY);
      setStorageItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return {
    recentSongIds,
    recordPlay,
  };
}
