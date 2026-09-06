"use client";

import { useEffect } from "react";

interface KeyboardShortcutsProps {
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (seconds: number) => void;
  currentTime: number;
  duration: number;
  onVolumeChange: (volume: number) => void;
  volume: number;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onCloseModals: () => void;
  isEnabled?: boolean;
}

export function useKeyboardShortcuts({
  onTogglePlay,
  onNext,
  onPrevious,
  onSeek,
  currentTime,
  duration,
  onVolumeChange,
  volume,
  onToggleMute,
  onToggleFullscreen,
  onCloseModals,
  isEnabled = true,
}: KeyboardShortcutsProps) {
  useEffect(() => {
    if (!isEnabled || typeof window === "undefined") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcut if user is interacting with form controls
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.tagName === "SELECT" ||
          (activeElement as HTMLElement).isContentEditable)
      ) {
        return;
      }

      switch (e.code) {
        case "Space":
          e.preventDefault();
          onTogglePlay();
          break;

        case "ArrowLeft":
          e.preventDefault();
          if (e.shiftKey) {
            onPrevious();
          } else {
            onSeek(Math.max(0, currentTime - 5));
          }
          break;

        case "ArrowRight":
          e.preventDefault();
          if (e.shiftKey) {
            onNext();
          } else {
            onSeek(Math.min(duration, currentTime + 5));
          }
          break;

        case "ArrowUp":
          e.preventDefault();
          onVolumeChange(Math.min(1, volume + 0.05));
          break;

        case "ArrowDown":
          e.preventDefault();
          onVolumeChange(Math.max(0, volume - 0.05));
          break;

        case "KeyM":
          e.preventDefault();
          onToggleMute();
          break;

        case "KeyF":
          e.preventDefault();
          onToggleFullscreen();
          break;

        case "Escape":
          e.preventDefault();
          onCloseModals();
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isEnabled,
    onTogglePlay,
    onNext,
    onPrevious,
    onSeek,
    currentTime,
    duration,
    onVolumeChange,
    volume,
    onToggleMute,
    onToggleFullscreen,
    onCloseModals,
  ]);
}
