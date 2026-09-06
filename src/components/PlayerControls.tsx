"use client";

import React from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
} from "lucide-react";
import { VolumeControl } from "./VolumeControl";

interface PlayerControlsProps {
  isPlaying: boolean;
  isLoading?: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  volume: number;
  isMuted: boolean;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onVolumeChange: (val: number) => void;
  onToggleMute: () => void;
  accentColor: string;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  isShuffle,
  isRepeat,
  volume,
  isMuted,
  onTogglePlay,
  onPrevious,
  onNext,
  onToggleShuffle,
  onToggleRepeat,
  onVolumeChange,
  onToggleMute,
  accentColor,
}) => {
  return (
    <div className="flex items-center justify-between max-w-md mx-auto w-full px-4 pt-1 pb-3">
      {/* Shuffle Button */}
      <button
        onClick={onToggleShuffle}
        aria-label={isShuffle ? "Disable shuffle" : "Enable shuffle"}
        className={`p-2.5 rounded-full transition-all duration-150 ${
          isShuffle
            ? "text-white"
            : "text-white/40 hover:text-white/80"
        }`}
        style={isShuffle ? { color: accentColor } : {}}
        title="Shuffle Memories"
      >
        <Shuffle className="w-4 h-4" />
      </button>

      {/* Main Transport Controls */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Previous Track */}
        <button
          onClick={onPrevious}
          aria-label="Previous track"
          className="p-3 rounded-full text-white/70 hover:text-white transition-all duration-150 active:scale-90 hover:bg-white/5"
          title="Previous Track (Shift+Left or Left)"
        >
          <SkipBack className="w-5 h-5 fill-current" />
        </button>

        {/* Play/Pause Button (Visual Center) */}
        <button
          onClick={onTogglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="relative group p-4 md:p-4.5 rounded-full bg-white text-black transition-all duration-200 active:scale-95 shadow-lg flex items-center justify-center hover:scale-105"
          style={{
            boxShadow: `0 0 25px ${accentColor}50`,
          }}
          title="Play / Pause (Space)"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Play className="w-6 h-6 fill-current ml-0.5" />
          )}
        </button>

        {/* Next Track */}
        <button
          onClick={onNext}
          aria-label="Next track"
          className="p-3 rounded-full text-white/70 hover:text-white transition-all duration-150 active:scale-90 hover:bg-white/5"
          title="Next Track (Shift+Right or Right)"
        >
          <SkipForward className="w-5 h-5 fill-current" />
        </button>
      </div>

      {/* Repeat Button */}
      <button
        onClick={onToggleRepeat}
        aria-label={isRepeat ? "Disable repeat" : "Enable repeat"}
        className={`p-2.5 rounded-full transition-all duration-150 ${
          isRepeat
            ? "text-white"
            : "text-white/40 hover:text-white/80"
        }`}
        style={isRepeat ? { color: accentColor } : {}}
        title="Repeat Memory"
      >
        <Repeat className="w-4 h-4" />
      </button>

      {/* Volume Control */}
      <VolumeControl
        volume={volume}
        isMuted={isMuted}
        onVolumeChange={onVolumeChange}
        onToggleMute={onToggleMute}
        accentColor={accentColor}
      />
    </div>
  );
};
