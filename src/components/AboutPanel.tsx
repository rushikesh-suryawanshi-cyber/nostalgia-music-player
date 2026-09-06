"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard } from "lucide-react";

interface AboutPanelProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor: string;
}

export const AboutPanel: React.FC<AboutPanelProps> = ({
  isOpen,
  onClose,
  accentColor,
}) => {
  const shortcuts = [
    { key: "Space", desc: "Play / Pause" },
    { key: "← / →", desc: "Seek backward / forward 5s" },
    { key: "Shift + ← / →", desc: "Previous / Next memory" },
    { key: "↑ / ↓", desc: "Volume up / down" },
    { key: "M", desc: "Toggle Mute" },
    { key: "F", desc: "Toggle Fullscreen" },
    { key: "Esc", desc: "Close panels / Return" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-16 max-w-lg mx-auto z-50 rounded-2xl bg-neutral-950/95 border border-white/15 p-6 md:p-8 shadow-2xl backdrop-blur-xl max-h-[85vh] overflow-y-auto"
            style={{
              boxShadow: `0 0 50px -10px ${accentColor}30`,
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold tracking-[0.25em] text-white uppercase">
                    NOSTALGIA
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-mono border"
                    style={{
                      borderColor: `${accentColor}40`,
                      color: accentColor,
                      backgroundColor: `${accentColor}15`,
                    }}
                  >
                    v1.0
                  </span>
                </div>
                <span className="text-xs font-medium tracking-widest text-white/50 uppercase mt-0.5">
                  The songs that raised us.
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close about modal"
                className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Narrative / Tribute */}
            <div className="py-5 space-y-4 text-sm text-white/75 leading-relaxed font-sans">
              <p>
                A small digital time machine for the music, places, and feelings we
                remember from Indian youth culture between <strong>2005 and 2010</strong>.
              </p>
              <p className="text-white/60 text-xs">
                Before algorithms chose our moods, music arrived through scratched
                CDs traded in school bags, TDK cassettes rewound with Nataraj pencils,
                late-night FM dedications under blankets, and acoustic chords
                screamed from hostel terraces.
              </p>
            </div>

            {/* Keyboard Shortcuts Table */}
            <div className="pt-2 pb-5 border-t border-white/10">
              <div className="flex items-center gap-2 mb-3 text-xs font-mono text-white/50 uppercase tracking-wider">
                <Keyboard className="w-3.5 h-3.5" />
                <span>Keyboard Controls</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {shortcuts.map((sc) => (
                  <div
                    key={sc.key}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 text-xs"
                  >
                    <span className="text-white/50">{sc.desc}</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[11px] text-white/90 border border-white/10">
                      {sc.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>

            {/* Demonstration & Royalty-Free Disclaimer */}
            <div className="pt-4 border-t border-white/10 text-[11px] text-white/40 space-y-1">
              <p>
                <strong>Audio Note:</strong> The audio tracks in this demonstration are
                original, royalty-free acoustic and ambient synthesizers crafted as
                nostalgic tributes to the era. The architecture is ready for personal MP3
                libraries.
              </p>
            </div>

            {/* Footer */}
            <div className="pt-4 text-center">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-white/90 transition-colors"
              >
                Enter Memory
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
