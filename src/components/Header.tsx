"use client";

import React from "react";
import {
  ListMusic,
  Info,
  Sliders,
  Maximize2,
  Minimize2,
  Radio,
  Tv,
} from "lucide-react";

interface HeaderProps {
  onOpenPlaylist: () => void;
  onOpenAbout: () => void;
  onOpenSettings: () => void;
  isNostalgiaMode: boolean;
  onToggleNostalgiaMode: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  accentColor: string;
  isTimelineVisible: boolean;
  onToggleTimeline: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPlaylist,
  onOpenAbout,
  onOpenSettings,
  isNostalgiaMode,
  onToggleNostalgiaMode,
  isFullscreen,
  onToggleFullscreen,
  accentColor,
  isTimelineVisible,
  onToggleTimeline,
}) => {
  return (
    <header className="relative z-30 flex items-center justify-between px-6 py-5 md:px-10 md:py-7">
      {/* Left: Branding */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-sm md:text-base font-bold tracking-[0.25em] text-white/95 uppercase">
            NOSTALGIA
          </span>
          <span
            className="w-1.5 h-1.5 rounded-full transition-colors duration-500"
            style={{ backgroundColor: accentColor }}
          />
        </div>
        <span className="text-[10px] md:text-[11px] font-medium tracking-[0.18em] text-white/40 uppercase mt-0.5">
          The songs that raised us
        </span>
      </div>

      {/* Right: Tactile Action Controls */}
      <nav aria-label="Quick Actions" className="flex items-center gap-1.5 md:gap-3">
        {/* Nostalgia Mode Quick Switcher */}
        <button
          onClick={onToggleNostalgiaMode}
          aria-label="Toggle Nostalgia Mode CRT effect"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium tracking-wider transition-all duration-200 border ${
            isNostalgiaMode
              ? "bg-amber-500/20 text-amber-200 border-amber-500/40 shadow-sm shadow-amber-500/10"
              : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
          }`}
          title="Toggle Vintage CRT Nostalgia Mode"
        >
          <Tv className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">NOSTALGIA MODE</span>
        </button>

        {/* Timeline Toggle */}
        <button
          onClick={onToggleTimeline}
          aria-label="Toggle Year Timeline"
          className={`p-2.5 rounded-full text-white/70 hover:text-white transition-colors duration-150 border ${
            isTimelineVisible
              ? "bg-white/15 border-white/25 text-white"
              : "bg-white/5 border-white/10 hover:bg-white/10"
          }`}
          title="Timeline (2005–2010)"
        >
          <Radio className="w-4 h-4" />
        </button>

        {/* Playlist Drawer Button */}
        <button
          onClick={onOpenPlaylist}
          aria-label="Open Memories Playlist"
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 border border-white/15 text-white/90 hover:bg-white/20 hover:text-white transition-all duration-200 shadow-sm"
          title="Memories Playlist"
        >
          <ListMusic className="w-4 h-4" />
          <span className="text-xs font-medium tracking-wider uppercase hidden sm:inline">
            Memories
          </span>
        </button>

        {/* Settings Panel Button */}
        <button
          onClick={onOpenSettings}
          aria-label="Open Settings"
          className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors duration-150"
          title="Experience Settings"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* About Panel Button */}
        <button
          onClick={onOpenAbout}
          aria-label="About Nostalgia"
          className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors duration-150"
          title="About & Shortcuts"
        >
          <Info className="w-4 h-4" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors duration-150 hidden md:flex"
          title="Fullscreen (F)"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
      </nav>
    </header>
  );
};
