export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export class AudioVisualizerEngine {
  // Pure non-intrusive visualizer engine that never hijacks or distorts audio playback
  private phase = 0;

  public init(): null {
    return null;
  }

  public resumeContext(): void {
    // No-op to prevent AudioContext suspension conflicts
  }

  public getFrequencyData(): Uint8Array {
    const binCount = 32;
    const buffer = new ArrayBuffer(binCount);
    const data = new Uint8Array(buffer);
    this.phase += 0.05;

    for (let i = 0; i < binCount; i++) {
      const v1 = Math.sin(this.phase * 1.5 + i * 0.35);
      const v2 = Math.cos(this.phase * 0.8 + i * 0.2);
      const norm = Math.abs(v1 * 0.6 + v2 * 0.4);
      data[i] = Math.floor(norm * 255);
    }

    return data;
  }
}
