"use client";

import React, { useState, useRef, useCallback } from "react";
import { formatTime } from "@/lib/audio";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
  accentColor: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
  accentColor,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const activeProgress = isDragging
    ? dragProgress
    : duration > 0
    ? Math.min(1, Math.max(0, currentTime / duration))
    : 0;

  const calculateProgressFromEvent = useCallback(
    (clientX: number): number => {
      const track = trackRef.current;
      if (!track) return 0;
      const rect = track.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const pct = clickX / rect.width;
      return Math.max(0, Math.min(1, pct));
    },
    []
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    const p = calculateProgressFromEvent(e.clientX);
    setDragProgress(p);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = calculateProgressFromEvent(e.clientX);
    setHoverPosition(p);
    if (isDragging) {
      setDragProgress(p);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      const p = calculateProgressFromEvent(e.clientX);
      onSeek(p * duration);
      setIsDragging(false);
    }
  };

  const handlePointerLeave = () => {
    setHoverPosition(null);
    if (isDragging) {
      setIsDragging(false);
      onSeek(dragProgress * duration);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Desktop layout: time on left, track center, duration right */}
      {/* Mobile layout: track first, times underneath */}
      <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-4">
        {/* Current Time - Hidden on mobile top, shown bottom */}
        <span className="hidden md:inline-block w-10 text-right text-xs font-mono tracking-wider text-white/50">
          {formatTime(isDragging ? dragProgress * duration : currentTime)}
        </span>

        {/* Progress Track Container */}
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          className="relative flex-1 py-3 cursor-pointer group select-none touch-none"
          role="slider"
          aria-label="Audio progress bar"
          aria-valuemin={0}
          aria-valuemax={Math.floor(duration)}
          aria-valuenow={Math.floor(isDragging ? dragProgress * duration : currentTime)}
        >
          {/* Base Track */}
          <div className="h-1 w-full rounded-full bg-white/15 overflow-hidden transition-all duration-200 group-hover:h-1.5">
            {/* Active Fill Track */}
            <div
              className="h-full rounded-full transition-[width] duration-75"
              style={{
                width: `${activeProgress * 100}%`,
                backgroundColor: accentColor,
              }}
            />
          </div>

          {/* Draggable Knob */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-md transition-transform duration-150 group-hover:scale-125"
            style={{
              left: `${activeProgress * 100}%`,
              boxShadow: `0 0 10px ${accentColor}`,
            }}
          />

          {/* Hover Time Bubble */}
          {hoverPosition !== null && !isDragging && (
            <div
              className="absolute -top-6 -translate-x-1/2 pointer-events-none px-1.5 py-0.5 rounded bg-black/80 border border-white/10 text-[10px] font-mono text-white/90 shadow-sm"
              style={{ left: `${hoverPosition * 100}%` }}
            >
              {formatTime(hoverPosition * duration)}
            </div>
          )}
        </div>

        {/* Duration - Hidden on mobile top, shown bottom */}
        <span className="hidden md:inline-block w-10 text-left text-xs font-mono tracking-wider text-white/50">
          {formatTime(duration)}
        </span>

        {/* Mobile Times (underneath track) */}
        <div className="flex md:hidden items-center justify-between text-[11px] font-mono tracking-wider text-white/40 px-0.5">
          <span>
            {formatTime(isDragging ? dragProgress * duration : currentTime)}
          </span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};
