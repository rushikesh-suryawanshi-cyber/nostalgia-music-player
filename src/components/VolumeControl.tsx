"use client";

import React, { useState } from "react";
import { Volume2, Volume1, VolumeX } from "lucide-react";

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  accentColor: string;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
  accentColor,
}) => {
  const [showMobileSlider, setShowMobileSlider] = useState(false);

  const effectiveVolume = isMuted ? 0 : volume;

  const VolumeIcon =
    effectiveVolume === 0 ? VolumeX : effectiveVolume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="relative flex items-center gap-2">
      {/* Volume Icon Button */}
      <button
        onClick={() => {
          onToggleMute();
        }}
        onDoubleClick={() => setShowMobileSlider((prev) => !prev)}
        aria-label={isMuted ? "Unmute" : "Mute"}
        className="p-2 rounded-full text-white/60 hover:text-white transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-white/30"
        title="Volume (Mute / Unmute: M)"
      >
        <VolumeIcon className="w-4 h-4" />
      </button>

      {/* Desktop Slider */}
      <div className="hidden md:flex items-center w-20">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={effectiveVolume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          aria-label="Volume slider"
          className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
          style={{
            accentColor: accentColor,
          }}
        />
      </div>

      {/* Mobile Popover Slider */}
      {showMobileSlider && (
        <div className="md:hidden absolute bottom-12 left-1/2 -translate-x-1/2 p-3 rounded-xl bg-neutral-900/90 border border-white/15 backdrop-blur-md shadow-xl flex items-center gap-2 w-36 z-50 animate-in fade-in zoom-in-95">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={effectiveVolume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            aria-label="Mobile volume slider"
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none"
            style={{ accentColor: accentColor }}
          />
        </div>
      )}
    </div>
  );
};
