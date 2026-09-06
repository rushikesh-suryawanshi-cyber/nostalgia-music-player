const fs = require('fs');
const path = require('path');

// --- 1. WAV Audio Generator ---
function createWavBuffer(sampleRate, durationSec, generateSample) {
  const numChannels = 2;
  const bytesPerSample = 2; // 16-bit
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const totalSamples = Math.floor(sampleRate * durationSec);
  const dataSize = totalSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF identifier
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // 'fmt ' sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bytesPerSample * 8, 34); // BitsPerSample

  // 'data' sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const progress = i / totalSamples;
    // Fade in and fade out envelope (1.5s fade)
    let envelope = 1.0;
    if (t < 1.5) envelope = t / 1.5;
    else if (t > durationSec - 1.5) envelope = Math.max(0, (durationSec - t) / 1.5);

    const [leftVal, rightVal] = generateSample(t, progress);

    const clamp = (v) => Math.max(-1, Math.min(1, v));
    const leftInt16 = Math.floor(clamp(leftVal * envelope) * 32767);
    const rightInt16 = Math.floor(clamp(rightVal * envelope) * 32767);

    buffer.writeInt16LE(leftInt16, offset);
    buffer.writeInt16LE(rightInt16, offset + 2);
    offset += 4;
  }

  return buffer;
}

// Track audio synthesizers: melodic, gentle, nostalgic
const audioTracks = [
  {
    filename: 'song-1.wav',
    title: 'Aankhon Mein Teri (Nostalgia Tribute)',
    duration: 28,
    // Warm romantic guitar arpeggio in D major (D - F# - A - D) + warm pad
    gen: (t) => {
      // Chord progression: D -> Bm -> G -> A (every 4 seconds)
      const chordIndex = Math.floor(t / 4) % 4;
      const chords = [
        [146.83, 220.0, 293.66, 369.99], // D maj (D3, A3, D4, F#4)
        [123.47, 185.0, 246.94, 293.66], // B min (B2, F#3, B3, D4)
        [98.0, 196.0, 246.94, 293.66],  // G maj (G2, G3, B3, D4)
        [110.0, 220.0, 277.18, 329.63], // A maj (A2, A3, C#4, E4)
      ];
      const chord = chords[chordIndex];
      // Arpeggio step (8th notes at 100bpm: 0.25s per note)
      const arpIndex = Math.floor((t % 4) / 0.25) % 4;
      const arpFreq = chord[arpIndex] * (t % 8 > 4 ? 2 : 1);
      const noteTime = t % 0.25;
      const noteEnv = Math.exp(-noteTime * 7);

      // Acoustic pluck (sawtooth + sine blend with fast decay)
      const pluck = (Math.sin(2 * Math.PI * arpFreq * t) + 0.3 * Math.sin(4 * Math.PI * arpFreq * t)) * noteEnv;
      // Warm pad / drone
      const pad = (Math.sin(2 * Math.PI * chord[0] * t) + Math.sin(2 * Math.PI * chord[2] * t)) * 0.15;
      // Gentle vinyl/rain hiss
      const hiss = (Math.random() * 2 - 1) * 0.015;

      const sig = (pluck * 0.35 + pad + hiss) * 0.6;
      return [sig, sig * 0.95 + 0.05 * Math.sin(2 * Math.PI * chord[1] * t)];
    }
  },
  {
    filename: 'song-2.wav',
    title: 'Pehli Baarish (2006 Acoustic Rain)',
    duration: 26,
    // Monsoon melancholic chords in A minor + soft rain ambiance
    gen: (t) => {
      const chords = [
        [110.0, 164.81, 220.0, 261.63], // Am (A2, E3, A3, C4)
        [87.31, 174.61, 220.0, 261.63], // F maj (F2, F3, A3, C4)
        [130.81, 196.0, 261.63, 329.63],// C maj (C3, G3, C4, E4)
        [98.0, 146.83, 196.0, 246.94]   // G maj (G2, D3, G3, B3)
      ];
      const chord = chords[Math.floor(t / 3.5) % 4];
      const noteIndex = Math.floor((t % 3.5) / 0.29) % 4;
      const noteFreq = chord[noteIndex];
      const pluck = Math.sin(2 * Math.PI * noteFreq * t) * Math.exp(-(t % 0.29) * 8);
      const pad = (Math.sin(2 * Math.PI * chord[0] * 0.5 * t) + Math.sin(2 * Math.PI * chord[1] * t)) * 0.12;
      const rain = (Math.random() * 2 - 1) * 0.04 * (1 + 0.3 * Math.sin(t * 0.5));
      const s = (pluck * 0.3 + pad + rain) * 0.6;
      return [s, s * 0.9 + 0.04 * Math.sin(2 * Math.PI * 440 * t)];
    }
  },
  {
    filename: 'song-3.wav',
    title: 'Hostel Terrace Jam (2007)',
    duration: 25,
    // E minor college rock strumming
    gen: (t) => {
      const chords = [
        [82.41, 164.81, 246.94, 329.63], // Em
        [130.81, 196.0, 261.63, 329.63],// C
        [98.0, 146.83, 196.0, 293.66],  // G
        [146.83, 220.0, 293.66, 369.99] // D
      ];
      const chord = chords[Math.floor(t / 3) % 4];
      const beat = (t % 0.5);
      const strum = Math.sin(2 * Math.PI * chord[1] * t) * Math.exp(-beat * 5) * 0.3;
      const bass = Math.sin(2 * Math.PI * chord[0] * t) * 0.2;
      const melody = Math.sin(2 * Math.PI * chord[3] * 1.5 * t) * Math.exp(-(t % 1) * 4) * 0.15;
      const s = (strum + bass + melody) * 0.6;
      return [s * 0.95, s * 1.05];
    }
  },
  {
    filename: 'song-4.wav',
    title: 'Midnight Radio Delhi (2008)',
    duration: 30,
    // Late night FM ambiance, gentle piano / Rhodes chords
    gen: (t) => {
      const chords = [
        [130.81, 164.81, 196.0, 246.94], // Cmaj7
        [110.0, 130.81, 164.81, 220.0],  // Am7
        [87.31, 130.81, 174.61, 220.0],  // Fmaj7
        [98.0, 123.47, 146.83, 196.0]    // G7
      ];
      const chord = chords[Math.floor(t / 5) % 4];
      const noteIdx = Math.floor((t % 5) / 0.62) % 4;
      const f = chord[noteIdx] * 2;
      const note = Math.sin(2 * Math.PI * f * t) * Math.exp(-(t % 0.62) * 3);
      const sub = Math.sin(2 * Math.PI * chord[0] * t) * 0.15;
      const dialHiss = (Math.random() * 2 - 1) * 0.02 * (0.8 + 0.2 * Math.sin(t * 3));
      const s = (note * 0.25 + sub + dialHiss) * 0.7;
      return [s, s * 0.98 + (Math.sin(2 * Math.PI * f * 1.002 * t) * 0.05)];
    }
  },
  {
    filename: 'song-5.wav',
    title: 'Purani Jeans & Monsoons (2005)',
    duration: 27,
    // Nostalgic Ali Haider / Jal inspired acoustic rhythm
    gen: (t) => {
      const chords = [
        [146.83, 220.0, 293.66], // D
        [110.0, 164.81, 220.0],  // A
        [123.47, 185.0, 246.94], // Bm
        [98.0, 146.83, 196.0]    // G
      ];
      const c = chords[Math.floor(t / 3.2) % 4];
      const rhythm = Math.sin(2 * Math.PI * c[2] * t) * Math.exp(-(t % 0.4) * 6);
      const bass = Math.sin(2 * Math.PI * c[0] * t) * 0.22;
      const s = (rhythm * 0.35 + bass) * 0.65;
      return [s, s * 0.95];
    }
  },
  {
    filename: 'song-6.wav',
    title: 'Chandni Chowk Nights (2009)',
    duration: 28,
    // Sufi acoustic mystic vibe (Reet / D minor scale)
    gen: (t) => {
      const root = 146.83; // D3
      const scale = [146.83, 164.81, 174.61, 220.0, 246.94, 293.66, 349.23];
      const note = scale[Math.floor((t * 2) % scale.length)];
      const pluck = Math.sin(2 * Math.PI * note * t) * Math.exp(-(t % 0.5) * 5) * 0.3;
      const drone = (Math.sin(2 * Math.PI * root * t) + Math.sin(2 * Math.PI * root * 1.5 * t)) * 0.16;
      const s = (pluck + drone) * 0.6;
      return [s, s * 0.92];
    }
  },
  {
    filename: 'song-7.wav',
    title: 'Metro Line Sunset (2010)',
    duration: 26,
    // Uplifting Delhi Metro evening ballad (G major)
    gen: (t) => {
      const chords = [98.0, 123.47, 146.83, 196.0]; // G maj
      const step = Math.floor((t * 3) % 4);
      const note = chords[step] * 2;
      const melody = Math.sin(2 * Math.PI * note * t) * Math.exp(-(t % 0.33) * 6) * 0.3;
      const pad = Math.sin(2 * Math.PI * 98 * t) * 0.18;
      const s = (melody + pad) * 0.65;
      return [s, s * 0.97];
    }
  },
  {
    filename: 'song-8.wav',
    title: 'College Canteen Echoes (2007)',
    duration: 25,
    // Euphoria / Strings era energetic acoustic riff
    gen: (t) => {
      const root = 164.81; // E3
      const riff = [164.81, 196.0, 220.0, 246.94, 220.0, 196.0];
      const idx = Math.floor((t * 3.5) % riff.length);
      const sound = Math.sin(2 * Math.PI * riff[idx] * t) * Math.exp(-(t % 0.28) * 7) * 0.35;
      const beat = (Math.sin(2 * Math.PI * 65 * t) * Math.exp(-(t % 0.5) * 12)) * 0.25;
      const s = (sound + beat) * 0.65;
      return [s, s];
    }
  },
  {
    filename: 'song-9.wav',
    title: 'Kasol Valley Breeze (2008)',
    duration: 29,
    // Mountain acoustic, gentle echoing flute-like sine
    gen: (t) => {
      const flute = Math.sin(2 * Math.PI * (329.63 + 8 * Math.sin(t * 3)) * t) * (0.2 + 0.1 * Math.sin(t * 0.8));
      const acoustic = Math.sin(2 * Math.PI * 110 * t) * 0.15;
      const wind = (Math.random() * 2 - 1) * 0.02 * (1 + 0.5 * Math.sin(t * 0.4));
      const s = (flute + acoustic + wind) * 0.7;
      return [s, s * 0.9];
    }
  },
  {
    filename: 'song-10.wav',
    title: 'Late Night Cyber Cafe (2005)',
    duration: 26,
    // Orkut, Winamp & Yahoo Messenger era lo-fi ambient melody
    gen: (t) => {
      const chords = [220.0, 261.63, 329.63, 392.0];
      const n = chords[Math.floor((t * 2) % 4)];
      const synth = (Math.sin(2 * Math.PI * n * t) + 0.2 * Math.sin(4 * Math.PI * n * t)) * Math.exp(-(t % 0.5) * 4) * 0.3;
      const sub = Math.sin(2 * Math.PI * 110 * t) * 0.18;
      const hum = (Math.sin(2 * Math.PI * 50 * t) + (Math.random() * 2 - 1) * 0.01) * 0.05;
      const s = (synth + sub + hum) * 0.65;
      return [s, s * 0.95];
    }
  }
];

console.log('Generating 10 WAV audio files...');
const sampleRate = 44100;
const audioDir = path.join(__dirname, '..', 'public', 'audio');
for (const track of audioTracks) {
  const buf = createWavBuffer(sampleRate, track.duration, track.gen);
  const outPath = path.join(audioDir, track.filename);
  fs.writeFileSync(outPath, buf);
  console.log(`✓ Created ${track.filename} (${(buf.length / 1024).toFixed(1)} KB, ${track.duration}s)`);
}

// --- 2. Evocative SVG Artwork & Backgrounds ---
const artworks = [
  {
    id: '1',
    title: 'Aankhon Mein Teri',
    artist: 'KK Tribute Ensemble',
    year: '2007',
    color1: '#d97706', // amber-600
    color2: '#78350f', // amber-900
    accent: '#f59e0b',
    symbol: 'golden-glow',
    scene: 'Retro cinema lights & nostalgic auditorium'
  },
  {
    id: '2',
    title: 'Pehli Baarish',
    artist: 'Monsoon Acoustic',
    year: '2006',
    color1: '#0e7490', // cyan-700
    color2: '#164e63', // cyan-900
    accent: '#38bdf8',
    symbol: 'rain-window',
    scene: 'Rain drops on train glass window'
  },
  {
    id: '3',
    title: 'Hostel Terrace Jam',
    artist: 'The 2007 Batch',
    year: '2007',
    color1: '#ea580c', // orange-600
    color2: '#431407', // orange-950
    accent: '#fb923c',
    symbol: 'terrace-guitar',
    scene: 'Dusk skyline with rooftop guitarists'
  },
  {
    id: '4',
    title: 'Midnight Radio Delhi',
    artist: 'Radio Mirchi Nostalgia',
    year: '2008',
    color1: '#4338ca', // indigo-700
    color2: '#1e1b4b', // indigo-950
    accent: '#818cf8',
    symbol: 'radio-waves',
    scene: 'Late night Delhi flyover & FM frequency tuner'
  },
  {
    id: '5',
    title: 'Purani Jeans & Monsoons',
    artist: 'Canteen Chords',
    year: '2005',
    color1: '#b45309', // amber-700
    color2: '#292524', // stone-800
    accent: '#fbbf24',
    symbol: 'cassette-tape',
    scene: 'TDK 90 cassette tape on wooden table'
  },
  {
    id: '6',
    title: 'Chandni Chowk Nights',
    artist: 'Sufi Echoes',
    year: '2009',
    color1: '#be123c', // rose-700
    color2: '#4c0519', // rose-950
    accent: '#f43f5e',
    symbol: 'sufi-arches',
    scene: 'Old Delhi illuminated minarets and night mist'
  },
  {
    id: '7',
    title: 'Metro Line Sunset',
    artist: 'Blue Line Project',
    year: '2010',
    color1: '#0284c7', // sky-600
    color2: '#0f172a', // slate-900
    accent: '#38bdf8',
    symbol: 'metro-tracks',
    scene: 'Metro elevated tracks at dusk horizon'
  },
  {
    id: '8',
    title: 'College Canteen Echoes',
    artist: 'Rock Euphoria',
    year: '2007',
    color1: '#c2410c', // orange-700
    color2: '#18181b', // zinc-900
    accent: '#f97316',
    symbol: 'vintage-mic',
    scene: 'Shure vintage mic and college festival stage'
  },
  {
    id: '9',
    title: 'Kasol Valley Breeze',
    artist: 'Parvati Acoustic',
    year: '2008',
    color1: '#047857', // emerald-700
    color2: '#064e3b', // emerald-950
    accent: '#34d399',
    symbol: 'pine-mountains',
    scene: 'Pine forests, starry night, bonfire mist'
  },
  {
    id: '10',
    title: 'Late Night Cyber Cafe',
    artist: 'Orkut Era Memories',
    year: '2005',
    color1: '#0f766e', // teal-700
    color2: '#134e4a', // teal-900
    accent: '#2dd4bf',
    symbol: 'crt-monitor',
    scene: 'CRT monitor glow with Winamp visualizer in dark booth'
  }
];

function generateArtworkSvg(art) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${art.color1}" />
      <stop offset="100%" stop-color="${art.color2}" />
    </linearGradient>
    <radialGradient id="discGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2a2a2a" />
      <stop offset="60%" stop-color="#141414" />
      <stop offset="100%" stop-color="#050505" />
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="${art.accent}" stop-opacity="0.4" />
      <stop offset="100%" stop-color="${art.accent}" stop-opacity="0" />
    </radialGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.08 0" />
    </filter>
  </defs>

  <!-- Base background -->
  <rect width="800" height="800" fill="url(#bgGrad)" />

  <!-- Atmospheric Glow circles -->
  <circle cx="400" cy="400" r="380" fill="url(#glow)" />
  <circle cx="200" cy="180" r="220" fill="${art.accent}" opacity="0.15" />
  <circle cx="650" cy="620" r="280" fill="${art.accent}" opacity="0.12" />

  <!-- Tactile Vinyl / CD grooves overlay -->
  <g opacity="0.35">
    <circle cx="400" cy="400" r="320" fill="none" stroke="#ffffff" stroke-width="1" stroke-dasharray="4 8" />
    <circle cx="400" cy="400" r="280" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.6" />
    <circle cx="400" cy="400" r="240" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-dasharray="2 6" />
    <circle cx="400" cy="400" r="180" fill="none" stroke="#ffffff" stroke-width="0.6" />
    <circle cx="400" cy="400" r="120" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="6 12" />
  </g>

  <!-- Central Disc Label -->
  <circle cx="400" cy="400" r="130" fill="url(#discGrad)" stroke="${art.accent}" stroke-width="2.5" />
  <circle cx="400" cy="400" r="28" fill="#000000" stroke="#444" stroke-width="4" />

  <!-- Stylized Retro Graphics -->
  <g transform="translate(400, 400)" opacity="0.85">
    <path d="M -90,-90 L 90,-90 L 90,90 L -90,90 Z" fill="none" stroke="${art.accent}" stroke-width="1" stroke-dasharray="8 4" opacity="0.4" />
    <path d="M 0,-70 Q 70,0 0,70 Q -70,0 0,-70" fill="none" stroke="${art.accent}" stroke-width="1.5" opacity="0.7" />
    <circle cx="0" cy="0" r="6" fill="${art.accent}" />
  </g>

  <!-- Typography: Authentic 2000s CD Jewel Case styling -->
  <g fill="#ffffff">
    <!-- Top badge -->
    <rect x="60" y="55" width="130" height="26" rx="4" fill="#000000" fill-opacity="0.4" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1"/>
    <text x="125" y="72" font-family="sans-serif" font-size="11" font-weight="700" letter-spacing="2" fill="#e2e8f0" text-anchor="middle">CD SINGLE · ${art.year}</text>

    <!-- Nostalgia Watermark -->
    <text x="740" y="75" font-family="sans-serif" font-size="13" font-weight="800" letter-spacing="4" fill="${art.accent}" text-anchor="end" opacity="0.85">NOSTALGIA</text>

    <!-- Bottom metadata card -->
    <rect x="60" y="650" width="680" height="95" rx="12" fill="#000000" fill-opacity="0.45" stroke="#ffffff" stroke-opacity="0.15" stroke-width="1"/>
    
    <text x="90" y="692" font-family="Georgia, serif" font-size="28" font-weight="700" fill="#ffffff">${art.title}</text>
    <text x="90" y="722" font-family="sans-serif" font-size="15" font-weight="500" letter-spacing="1" fill="#cbd5e1">${art.artist} · <tspan fill="${art.accent}">${art.year}</tspan></text>
    
    <!-- Audio Waveform decorative icon -->
    <g transform="translate(640, 680)" stroke="${art.accent}" stroke-width="3" stroke-linecap="round">
      <line x1="0" y1="20" x2="0" y2="4" />
      <line x1="12" y1="25" x2="12" y2="0" />
      <line x1="24" y1="28" x2="24" y2="-8" />
      <line x1="36" y1="23" x2="36" y2="2" />
      <line x1="48" y1="21" x2="48" y2="6" />
    </g>
  </g>

  <!-- Film grain pass -->
  <rect width="800" height="800" filter="url(#grain)" opacity="0.7" />

  <!-- Subtle Vignette border -->
  <rect x="2" y="2" width="796" height="796" fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="3" rx="16" />
</svg>`;
}

function generateBackgroundSvg(art) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="${art.color2}" />
      <stop offset="60%" stop-color="#0a0a0f" />
      <stop offset="100%" stop-color="#020204" />
    </linearGradient>
    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${art.color1}" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <filter id="bgGrain">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0" />
    </filter>
  </defs>

  <rect width="1920" height="1080" fill="url(#skyGrad)" />
  <circle cx="960" cy="540" r="700" fill="url(#centerGlow)" />

  <!-- Abstract atmospheric geometry: rainy silhouettes / city horizon / cassette tapes -->
  <g opacity="0.15" stroke="${art.accent}" stroke-width="1">
    <line x1="0" y1="780" x2="1920" y2="780" stroke-width="2" />
    <line x1="0" y1="840" x2="1920" y2="840" stroke-width="1.5" stroke-dasharray="10 20" />
    <line x1="0" y1="920" x2="1920" y2="920" stroke-width="1" />
    <!-- Distant city blocks / memory silhouettes -->
    <rect x="250" y="650" width="80" height="130" fill="${art.color2}" />
    <rect x="340" y="610" width="110" height="170" fill="${art.color2}" />
    <rect x="460" y="680" width="70" height="100" fill="${art.color2}" />
    <rect x="1420" y="630" width="90" height="150" fill="${art.color2}" />
    <rect x="1530" y="590" width="130" height="190" fill="${art.color2}" />
    <rect x="1680" y="660" width="80" height="120" fill="${art.color2}" />
  </g>

  <!-- Film grain -->
  <rect width="1920" height="1080" filter="url(#bgGrain)" opacity="0.8" />
  
  <!-- Vignette -->
  <radialGradient id="vignette" cx="50%" cy="50%" r="60%">
    <stop offset="70%" stop-color="#000000" stop-opacity="0" />
    <stop offset="100%" stop-color="#000000" stop-opacity="0.85" />
  </radialGradient>
  <rect width="1920" height="1080" fill="url(#vignette)" />
</svg>`;
}

console.log('Generating artwork and backgrounds...');
const artworkDir = path.join(__dirname, '..', 'public', 'artwork');
const bgDir = path.join(__dirname, '..', 'public', 'backgrounds');

for (const art of artworks) {
  const artSvg = generateArtworkSvg(art);
  fs.writeFileSync(path.join(artworkDir, `song-${art.id}.svg`), artSvg);

  const bgSvg = generateBackgroundSvg(art);
  fs.writeFileSync(path.join(bgDir, `bg-${art.id}.svg`), bgSvg);
}

// Generate a standalone high performance SVG grain overlay
const grainSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <filter id="noise">
    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="200" height="200" filter="url(#noise)" opacity="0.08"/>
</svg>`;
fs.writeFileSync(path.join(__dirname, '..', 'public', 'grain.svg'), grainSvg);

console.log('✓ Successfully generated all 10 audio WAV files, 10 artworks, 10 backgrounds, and grain overlay!');
