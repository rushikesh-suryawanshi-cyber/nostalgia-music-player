"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tv, Eye, Waves, Sparkles } from "lucide-react";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isNostalgiaMode: boolean;
  onToggleNostalgiaMode: () => void;
  showScanlines: boolean;
  onToggleScanlines: () => void;
  isVisualizerEnabled: boolean;
  onToggleVisualizer: () => void;
  isMotionEnabled: boolean;
  onToggleMotion: () => void;
  accentColor: string;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  isNostalgiaMode,
  onToggleNostalgiaMode,
  showScanlines,
  onToggleScanlines,
  isVisualizerEnabled,
  onToggleVisualizer,
  isMotionEnabled,
  onToggleMotion,
  accentColor,
}) => {
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
            className="fixed inset-x-4 top-20 max-w-md mx-auto z-50 rounded-2xl bg-neutral-950/95 border border-white/15 p-6 shadow-2xl backdrop-blur-xl"
            style={{
              boxShadow: `0 0 45px -10px ${accentColor}25`,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                  PREFERENCES
                </span>
                <h3 className="text-lg font-serif font-bold text-white tracking-wide">
                  Experience Settings
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Close settings"
                className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Settings Toggles List */}
            <div className="py-4 space-y-4">
              {/* Nostalgia Mode */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-300">
                    <Tv className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">Nostalgia Mode</span>
                    <span className="text-xs text-white/40">
                      Warm analog grade &amp; 2007 VCR timestamp
                    </span>
                  </div>
                </div>
                <button
                  onClick={onToggleNostalgiaMode}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                    isNostalgiaMode ? "bg-amber-500" : "bg-white/20"
                  }`}
                  role="switch"
                  aria-checked={isNostalgiaMode}
                >
                  <motion.div
                    layout
                    className="w-4 h-4 rounded-full bg-white shadow-sm"
                    animate={{ x: isNostalgiaMode ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* CRT Scanlines */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-300">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">CRT Scanlines</span>
                    <span className="text-xs text-white/40">
                      Subtle horizontal monitor lines
                    </span>
                  </div>
                </div>
                <button
                  onClick={onToggleScanlines}
                  disabled={!isNostalgiaMode}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                    !isNostalgiaMode
                      ? "opacity-30 cursor-not-allowed bg-white/10"
                      : showScanlines
                      ? "bg-amber-500"
                      : "bg-white/20"
                  }`}
                  role="switch"
                  aria-checked={showScanlines}
                >
                  <motion.div
                    layout
                    className="w-4 h-4 rounded-full bg-white shadow-sm"
                    animate={{ x: showScanlines && isNostalgiaMode ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* Audio Visualizer */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-300">
                    <Waves className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">Audio Visualizer</span>
                    <span className="text-xs text-white/40">
                      Glow frequency wave responding to sound
                    </span>
                  </div>
                </div>
                <button
                  onClick={onToggleVisualizer}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                    isVisualizerEnabled ? "bg-white" : "bg-white/20"
                  }`}
                  role="switch"
                  aria-checked={isVisualizerEnabled}
                >
                  <motion.div
                    layout
                    className={`w-4 h-4 rounded-full shadow-sm ${
                      isVisualizerEnabled ? "bg-black" : "bg-white"
                    }`}
                    animate={{ x: isVisualizerEnabled ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* Background Motion & Drift */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">Background Drift</span>
                    <span className="text-xs text-white/40">
                      Gentle Ken-Burns slow zoom effect
                    </span>
                  </div>
                </div>
                <button
                  onClick={onToggleMotion}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                    isMotionEnabled ? "bg-white" : "bg-white/20"
                  }`}
                  role="switch"
                  aria-checked={isMotionEnabled}
                >
                  <motion.div
                    layout
                    className={`w-4 h-4 rounded-full shadow-sm ${
                      isMotionEnabled ? "bg-black" : "bg-white"
                    }`}
                    animate={{ x: isMotionEnabled ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>

            {/* Footer notice */}
            <div className="pt-3 border-t border-white/10 text-center">
              <span className="text-[11px] text-white/40">
                Preferences are automatically saved to your browser.
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
