"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { SONGS } from "@/data/songs";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentlyPlayed } from "@/hooks/useRecentlyPlayed";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { getStorageItem, setStorageItem } from "@/lib/storage";

import { Background } from "./Background";
import { NostalgiaOverlay } from "./NostalgiaOverlay";
import { Header } from "./Header";
import { NowPlaying } from "./NowPlaying";
import { Visualizer } from "./Visualizer";
import { ProgressBar } from "./ProgressBar";
import { PlayerControls } from "./PlayerControls";
import { Timeline } from "./Timeline";
import { PlaylistDrawer } from "./PlaylistDrawer";
import { SettingsPanel } from "./SettingsPanel";
import { AboutPanel } from "./AboutPanel";

const NOSTALGIA_MODE_KEY = "nostalgia_mode_v2";
const SCANLINES_KEY = "nostalgia_scanlines_v2";
const VISUALIZER_KEY = "nostalgia_visualizer_v1";
const MOTION_KEY = "nostalgia_motion_v1";

export const NostalgiaApp: React.FC = () => {
  // Timeline year filter
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isTimelineVisible, setIsTimelineVisible] = useState(true);

  // Modals / Drawers state
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Experience Preferences with lazy initializers
  const prefersReduced = usePrefersReducedMotion();
  const [isNostalgiaMode, setIsNostalgiaMode] = useState<boolean>(() =>
    getStorageItem<boolean>(NOSTALGIA_MODE_KEY, false)
  );
  const [showScanlines, setShowScanlines] = useState<boolean>(() =>
    getStorageItem<boolean>(SCANLINES_KEY, true)
  );
  const [isVisualizerEnabled, setIsVisualizerEnabled] = useState<boolean>(() =>
    getStorageItem<boolean>(VISUALIZER_KEY, true)
  );
  const [isMotionEnabled, setIsMotionEnabled] = useState<boolean>(() =>
    getStorageItem<boolean>(MOTION_KEY, !prefersReduced)
  );

  // Hooks
  const { favoriteIds, toggleFavorite, isFavorite } = useFavorites();
  const { recentSongIds, recordPlay } = useRecentlyPlayed();

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Filter songs by Year if selected
  const activePlaylist = useMemo(() => {
    if (!selectedYear) return SONGS;
    const filtered = SONGS.filter((s) => s.year === selectedYear);
    return filtered.length > 0 ? filtered : SONGS;
  }, [selectedYear]);

  const handleTrackPlay = useCallback(
    (songId: string) => {
      recordPlay(songId);
    },
    [recordPlay]
  );

  // Audio Engine Hook
  const {
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
    analyser,
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
  } = useAudioPlayer(activePlaylist, handleTrackPlay);

  // Fullscreen toggle handler
  const handleToggleFullscreen = useCallback(() => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  // Close all open panels
  const handleCloseModals = useCallback(() => {
    setIsPlaylistOpen(false);
    setIsSettingsOpen(false);
    setIsAboutOpen(false);
  }, []);

  // Keyboard Shortcuts Hook
  useKeyboardShortcuts({
    onTogglePlay: togglePlay,
    onNext: next,
    onPrevious: previous,
    onSeek: seek,
    currentTime,
    duration,
    onVolumeChange: setVolume,
    volume,
    onToggleMute: toggleMute,
    onToggleFullscreen: handleToggleFullscreen,
    onCloseModals: handleCloseModals,
    isEnabled: true,
  });

  // Preference Handlers
  const handleToggleNostalgiaMode = () => {
    setIsNostalgiaMode((prev) => {
      const nextVal = !prev;
      setStorageItem(NOSTALGIA_MODE_KEY, nextVal);
      return nextVal;
    });
  };

  const handleToggleScanlines = () => {
    setShowScanlines((prev) => {
      const nextVal = !prev;
      setStorageItem(SCANLINES_KEY, nextVal);
      return nextVal;
    });
  };

  const handleToggleVisualizer = () => {
    setIsVisualizerEnabled((prev) => {
      const nextVal = !prev;
      setStorageItem(VISUALIZER_KEY, nextVal);
      return nextVal;
    });
  };

  const handleToggleMotion = () => {
    setIsMotionEnabled((prev) => {
      const nextVal = !prev;
      setStorageItem(MOTION_KEY, nextVal);
      return nextVal;
    });
  };

  // Mobile Touch Gestures (Swipe left/right for next/prev)
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Trigger only if horizontal swipe dominates vertical scrolling
    if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        next(); // Swiped left -> next
      } else {
        previous(); // Swiped right -> prev
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const accentColor = currentSong.accent || "#f59e0b";
  const years = [2005, 2006, 2007, 2008, 2009, 2010];

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`relative w-screen h-screen h-[100dvh] flex flex-col justify-between overflow-hidden select-none ${
        isNostalgiaMode ? "nostalgia-tint" : ""
      }`}
    >
      {/* Background Engine */}
      <Background currentSong={currentSong} enableMotion={isMotionEnabled} />

      {/* Vintage CRT / Scanlines / Timestamp Overlay */}
      <NostalgiaOverlay
        isActive={isNostalgiaMode}
        showScanlines={showScanlines}
      />

      {/* Top Header */}
      <Header
        onOpenPlaylist={() => setIsPlaylistOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isNostalgiaMode={isNostalgiaMode}
        onToggleNostalgiaMode={handleToggleNostalgiaMode}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        accentColor={accentColor}
        isTimelineVisible={isTimelineVisible}
        onToggleTimeline={() => setIsTimelineVisible((prev) => !prev)}
      />

      {/* Center: Main Now Playing Area */}
      <main className="flex-1 flex flex-col justify-center items-center my-auto">
        <NowPlaying
          currentSong={currentSong}
          isPlaying={isPlaying}
          isLoading={isLoading}
          isFavorite={isFavorite(currentSong.id)}
          onToggleFavorite={() => toggleFavorite(currentSong.id)}
          onArtworkClick={togglePlay}
          error={error}
          onRetry={retry}
        />

        {/* Subtle Audio Visualizer */}
        <Visualizer
          analyser={analyser}
          isPlaying={isPlaying}
          accentColor={accentColor}
          isEnabled={isVisualizerEnabled}
        />
      </main>

      {/* Bottom Area: Year Timeline, Scrubber & Controls */}
      <footer className="relative z-30 pb-4 sm:pb-6 flex flex-col items-center">
        {/* Subtle Year Scrubber */}
        {isTimelineVisible && (
          <div className="mb-2">
            <Timeline
              years={years}
              selectedYear={selectedYear}
              onSelectYear={(yr) => setSelectedYear(yr)}
              accentColor={accentColor}
            />
          </div>
        )}

        {/* Custom Progress Scrubber */}
        <div className="w-full mb-2">
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={seek}
            accentColor={accentColor}
          />
        </div>

        {/* Player Controls */}
        <PlayerControls
          isPlaying={isPlaying}
          isLoading={isLoading}
          isShuffle={isShuffle}
          isRepeat={isRepeat}
          volume={volume}
          isMuted={isMuted}
          onTogglePlay={togglePlay}
          onPrevious={previous}
          onNext={next}
          onToggleShuffle={toggleShuffle}
          onToggleRepeat={toggleRepeat}
          onVolumeChange={setVolume}
          onToggleMute={toggleMute}
          accentColor={accentColor}
        />
      </footer>

      {/* Playlist Drawer (Desktop Right-Drawer / Mobile Bottom-Sheet) */}
      <PlaylistDrawer
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        currentSong={currentSong}
        isPlaying={isPlaying}
        onSelectSong={(s) => {
          selectSong(s);
          setIsPlaylistOpen(false);
        }}
        favoriteIds={favoriteIds}
        recentSongIds={recentSongIds}
        onToggleFavorite={toggleFavorite}
        accentColor={accentColor}
      />

      {/* Experience Settings Modal */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isNostalgiaMode={isNostalgiaMode}
        onToggleNostalgiaMode={handleToggleNostalgiaMode}
        showScanlines={showScanlines}
        onToggleScanlines={handleToggleScanlines}
        isVisualizerEnabled={isVisualizerEnabled}
        onToggleVisualizer={handleToggleVisualizer}
        isMotionEnabled={isMotionEnabled}
        onToggleMotion={handleToggleMotion}
        accentColor={accentColor}
      />

      {/* About & Keyboard Shortcuts Modal */}
      <AboutPanel
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        accentColor={accentColor}
      />
    </div>
  );
};
