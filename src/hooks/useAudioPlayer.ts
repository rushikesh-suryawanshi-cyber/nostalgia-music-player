"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Song, SONGS } from "@/data/songs";
import { getStorageItem, setStorageItem } from "@/lib/storage";

const VOLUME_STORAGE_KEY = "nostalgia_volume_v1";
const SHUFFLE_STORAGE_KEY = "nostalgia_shuffle_v1";
const REPEAT_STORAGE_KEY = "nostalgia_repeat_v1";

export function useAudioPlayer(
  playlist: Song[] = SONGS,
  onTrackPlay?: (songId: string) => void
) {
  const [currentSongId, setCurrentSongId] = useState<string>(() => SONGS[0]?.id || "1");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(SONGS[0]?.durationSec || 242);
  const [volume, setVolumeState] = useState<number>(() =>
    getStorageItem<number>(VOLUME_STORAGE_KEY, 0.85)
  );
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(() =>
    getStorageItem<boolean>(SHUFFLE_STORAGE_KEY, false)
  );
  const [isRepeat, setIsRepeat] = useState<boolean>(() =>
    getStorageItem<boolean>(REPEAT_STORAGE_KEY, false)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Find the current song object across all SONGS
  const currentSong =
    SONGS.find((s) => s.id === currentSongId) || SONGS[0];

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isRepeatRef = useRef(isRepeat);
  const isShuffleRef = useRef(isShuffle);
  const playlistRef = useRef(playlist);
  const currentSongRef = useRef(currentSong);
  const onTrackPlayRef = useRef(onTrackPlay);

  // Keep refs up-to-date
  useEffect(() => {
    isRepeatRef.current = isRepeat;
  }, [isRepeat]);

  useEffect(() => {
    isShuffleRef.current = isShuffle;
  }, [isShuffle]);

  useEffect(() => {
    playlistRef.current = playlist.length > 0 ? playlist : SONGS;
  }, [playlist]);

  useEffect(() => {
    currentSongRef.current = currentSong;
  }, [currentSong]);

  useEffect(() => {
    onTrackPlayRef.current = onTrackPlay;
  }, [onTrackPlay]);

  // Helper: Play a specific song directly
  const loadAndPlaySong = useCallback(
    async (song: Song, autoPlay = true) => {
      let audio = audioRef.current;
      if (!audio && typeof window !== "undefined") {
        audio = new Audio();
        audioRef.current = audio;
      }
      if (!audio) return;

      setError(null);
      setCurrentSongId(song.id);
      setCurrentTime(0);
      setDuration(song.durationSec || 242);

      // Only reassign src if different
      const currentSrc = audio.src.replace(window.location.origin, "");
      if (currentSrc !== song.audioSrc) {
        audio.src = song.audioSrc;
        audio.load();
      }

      if (autoPlay) {
        setIsLoading(true);
        try {
          await audio.play();
          setIsPlaying(true);
          setIsLoading(false);
          onTrackPlayRef.current?.(song.id);
        } catch (err: unknown) {
          setIsLoading(false);
          if ((err as Error)?.name !== "AbortError") {
            console.warn("Audio play restriction or error:", err);
            setIsPlaying(false);
          }
        }
      }
    },
    []
  );

  // Next Track
  const next = useCallback(() => {
    const list = playlistRef.current.length > 0 ? playlistRef.current : SONGS;
    const currentIndex = list.findIndex((s) => s.id === currentSongRef.current.id);

    let nextIndex = 0;
    if (isShuffleRef.current && list.length > 1) {
      nextIndex = Math.floor(Math.random() * list.length);
      if (nextIndex === currentIndex) {
        nextIndex = (nextIndex + 1) % list.length;
      }
    } else {
      nextIndex = (currentIndex + 1) % list.length;
    }

    const nextSong = list[nextIndex] || SONGS[0];
    loadAndPlaySong(nextSong, true);
  }, [loadAndPlaySong]);

  // Previous Track
  const previous = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    const list = playlistRef.current.length > 0 ? playlistRef.current : SONGS;
    const currentIndex = list.findIndex((s) => s.id === currentSongRef.current.id);
    const prevIndex = (currentIndex - 1 + list.length) % list.length;
    const prevSong = list[prevIndex] || SONGS[0];
    loadAndPlaySong(prevSong, true);
  }, [loadAndPlaySong]);

  // Initialize audio element once on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio();
    audio.preload = "auto";
    audio.volume = volume;
    audio.src = currentSongRef.current.audioSrc;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
      setIsLoading(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      if (isRepeatRef.current) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        next();
      }
    };

    const handleError = () => {
      console.warn("Audio element error on src:", audio.src);
      setIsLoading(false);
      setIsPlaying(false);
      setError("Unable to play this memory.");
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.src = "";
    };
  }, [next, volume]);

  // Play
  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setError(null);
    setIsLoading(true);

    // Ensure audio src is loaded
    if (!audio.src || !audio.src.includes(currentSong.audioSrc)) {
      audio.src = currentSong.audioSrc;
      audio.load();
    }

    try {
      await audio.play();
      setIsPlaying(true);
      setIsLoading(false);
      onTrackPlayRef.current?.(currentSong.id);
    } catch (err: unknown) {
      setIsLoading(false);
      if ((err as Error)?.name !== "AbortError") {
        console.warn("Playback blocked by browser:", err);
        setIsPlaying(false);
      }
    }
  }, [currentSong]);

  // Pause
  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsPlaying(false);
    audio.pause();
  }, []);

  // Toggle Play
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && !audio.paused) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  // Seek
  const seek = useCallback((timeInSeconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const clampedTime = Math.max(0, Math.min(timeInSeconds, audio.duration || duration));
    audio.currentTime = clampedTime;
    setCurrentTime(clampedTime);
  }, [duration]);

  // Set Volume
  const setVolume = useCallback((newVolume: number) => {
    const audio = audioRef.current;
    const clamped = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clamped);
    setIsMuted(clamped === 0);
    setStorageItem(VOLUME_STORAGE_KEY, clamped);

    if (audio) {
      audio.volume = clamped;
    }
  }, []);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      const restored = volume > 0 ? volume : 0.85;
      audio.volume = restored;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  // Toggle Shuffle
  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => {
      const nextVal = !prev;
      setStorageItem(SHUFFLE_STORAGE_KEY, nextVal);
      return nextVal;
    });
  }, []);

  // Toggle Repeat
  const toggleRepeat = useCallback(() => {
    setIsRepeat((prev) => {
      const nextVal = !prev;
      setStorageItem(REPEAT_STORAGE_KEY, nextVal);
      return nextVal;
    });
  }, []);

  // Select Song Directly from playlist
  const selectSong = useCallback(
    (song: Song) => {
      loadAndPlaySong(song, true);
    },
    [loadAndPlaySong]
  );

  // Retry playback if errored
  const retry = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setError(null);
    audio.load();
    play();
  }, [play]);

  return {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    isLoading,
    error,
    analyser: null,
    play,
    pause,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    selectSong,
    retry,
  };
}
