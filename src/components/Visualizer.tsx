"use client";

import React, { useEffect, useRef } from "react";
import { hexToRgb, rgbToCss } from "@/lib/colors";

interface VisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  accentColor: string;
  isEnabled?: boolean;
}

export const Visualizer: React.FC<VisualizerProps> = ({
  analyser,
  isPlaying,
  accentColor,
  isEnabled = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isEnabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isDocumentHidden = document.hidden;
    const handleVisibilityChange = () => {
      isDocumentHidden = document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const rgb = hexToRgb(accentColor);
    const barCount = 32;
    let fallbackPhase = 0;

    const render = () => {
      if (!isDocumentHidden) {
        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);

        let dataArray: Uint8Array | null = null;
        if (analyser && isPlaying) {
          const buffer = new ArrayBuffer(analyser.frequencyBinCount);
          dataArray = new Uint8Array(buffer);
          analyser.getByteFrequencyData(dataArray as unknown as Uint8Array<ArrayBuffer>);
        }

        const barWidth = width / barCount;
        const spacing = 2;
        const actualBarWidth = Math.max(1.5, barWidth - spacing);

        for (let i = 0; i < barCount; i++) {
          let normalizedHeight = 0.08; // Idle gentle baseline

          if (isPlaying) {
            if (dataArray && dataArray.length > 0) {
              // Map index to low-mid frequency bands
              const dataIdx = Math.floor((i / barCount) * Math.min(48, dataArray.length));
              const rawVal = dataArray[dataIdx] || 0;
              normalizedHeight = Math.max(0.1, rawVal / 255);
            } else {
              // Smooth procedural organic breathing fallback
              const wave1 = Math.sin(fallbackPhase + i * 0.25);
              const wave2 = Math.cos(fallbackPhase * 0.8 + i * 0.4);
              normalizedHeight = 0.15 + 0.35 * Math.abs(wave1 * 0.6 + wave2 * 0.4);
            }
          }

          const barHeight = Math.max(3, normalizedHeight * height * 0.85);
          const x = i * barWidth + spacing / 2;
          const y = (height - barHeight) / 2;

          // Gentle gradient for each bar
          const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
          gradient.addColorStop(0, rgbToCss(rgb, 0.85));
          gradient.addColorStop(1, rgbToCss(rgb, 0.2));

          ctx.fillStyle = gradient;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(x, y, actualBarWidth, barHeight, 2);
          } else {
            ctx.rect(x, y, actualBarWidth, barHeight);
          }
          ctx.fill();
        }

        fallbackPhase += 0.04;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [analyser, isPlaying, accentColor, isEnabled]);

  if (!isEnabled) return null;

  return (
    <div className="w-full flex justify-center items-center py-1">
      <canvas
        ref={canvasRef}
        width={320}
        height={36}
        className="w-48 sm:w-64 h-7 opacity-85 transition-opacity duration-300"
        aria-hidden="true"
      />
    </div>
  );
};
