"use client";

import React from "react";
import { motion } from "framer-motion";

interface TimelineProps {
  years: number[];
  selectedYear: number | null; // null means All
  onSelectYear: (year: number | null) => void;
  accentColor: string;
}

export const Timeline: React.FC<TimelineProps> = ({
  years,
  selectedYear,
  onSelectYear,
  accentColor,
}) => {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 px-4 py-2 z-20">
      <div className="flex items-center gap-1 p-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
        {/* 'All' Option */}
        <button
          onClick={() => onSelectYear(null)}
          className={`relative px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-mono tracking-wider transition-all duration-200 ${
            selectedYear === null
              ? "text-white font-bold"
              : "text-white/40 hover:text-white/80"
          }`}
        >
          {selectedYear === null && (
            <motion.div
              layoutId="timeline-indicator"
              className="absolute inset-0 rounded-full bg-white/15 border border-white/20"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">ALL</span>
        </button>

        {/* Individual Years */}
        {years.map((year) => {
          const isSelected = selectedYear === year;
          return (
            <button
              key={year}
              onClick={() => onSelectYear(year)}
              className={`relative px-2 sm:px-3 py-1 rounded-full text-[11px] font-mono tracking-wider transition-all duration-200 ${
                isSelected
                  ? "text-white font-bold"
                  : "text-white/40 hover:text-white/80"
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="timeline-indicator"
                  className="absolute inset-0 rounded-full border"
                  style={{
                    backgroundColor: `${accentColor}25`,
                    borderColor: `${accentColor}50`,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{year}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
