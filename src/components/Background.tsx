"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Song } from "@/data/songs";
import { hexToRgb, rgbToCss } from "@/lib/colors";

interface BackgroundProps {
  currentSong: Song;
  enableMotion?: boolean;
}

export const Background: React.FC<BackgroundProps> = ({
  currentSong,
}) => {
  const accentRgb = hexToRgb(currentSong.accent || "#f59e0b");

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#070709] pointer-events-none select-none">
      {/* Dynamic Background Image cross-fade */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentSong.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Completely stationary, rock-solid background */}
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${currentSong.backgroundSrc || currentSong.artworkSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Crisp Depth Tint (subtle dark veil without heavy blur) */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[6px]" />

      {/* Dynamic Accent Color Aura radiating softly from center */}
      <div
        className="absolute inset-0 transition-colors duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${rgbToCss(
            accentRgb,
            0.2
          )} 0%, transparent 75%)`,
        }}
      />

      {/* Dark Cinematic Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 35%, rgba(0, 0, 0, 0.65) 75%, rgba(0, 0, 0, 0.95) 100%)",
        }}
      />

      {/* Top & Bottom Gradient shadows for crisp legibility */}
      <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-black/85 via-black/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
    </div>
  );
};
