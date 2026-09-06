"use client";

import React, { useState, useEffect } from "react";

interface NostalgiaOverlayProps {
  isActive: boolean;
  showScanlines?: boolean;
}

export const NostalgiaOverlay: React.FC<NostalgiaOverlayProps> = ({
  isActive,
  showScanlines = true,
}) => {
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    if (!isActive) return;

    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setTimestamp(`SEP 04 2007 · ${hours}:${minutes}:${seconds} SP`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 select-none overflow-hidden">
      {/* Warm Analog Color Grading Tint */}
      <div className="absolute inset-0 bg-amber-900/10 mix-blend-color" />

      {/* Subtle CRT Scanlines */}
      {showScanlines && <div className="absolute inset-0 scanlines opacity-20" />}

      {/* Subtle CRT screen curved vignette */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 75%, rgba(0, 0, 0, 0.6) 100%)",
        }}
      />

      {/* Retro Camcorder / VCR On-Screen Display positioned tastefully below header */}
      <div className="absolute top-20 left-6 font-mono text-[10px] tracking-widest text-amber-300/70 uppercase drop-shadow hidden md:block">
        <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />
        REC ● PLAY
      </div>

      <div className="absolute top-20 right-6 font-mono text-[10px] tracking-widest text-amber-300/60 uppercase drop-shadow hidden md:block">
        TAPE 01 · HI-FI
      </div>

      <div className="absolute bottom-2 left-6 font-mono text-[10px] tracking-wider text-amber-300/60 uppercase drop-shadow hidden md:block">
        {timestamp}
      </div>
    </div>
  );
};
