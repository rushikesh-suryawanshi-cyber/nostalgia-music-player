# NOSTALGIA — Indian 2000s Music Experience

> *"The songs that raised us."*

**NOSTALGIA** is an immersive digital time machine celebrating Indian music culture from approximately 2005 to 2010. Built with Next.js, React 19, TypeScript, Tailwind CSS, and Framer Motion, it departs from conventional streaming dashboards to deliver a cinematic, full-viewport music experience.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:3005](http://localhost:3005)** in your web browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 🎵 How to Add Your Own Songs & Posters

Adding new songs and movie posters is simple and requires only 3 steps:

### Step 1: Place Your Audio File
Place your song file into the audio folder:
* **Folder Path:** `public/audio/`
* **Full Windows Path:** `C:\Users\vicky\Desktop\UI theme\nostalgia\public\audio\`
* **Supported Formats:** `.mp3`, `.wav`, `.m4a`, `.aac`, `.ogg`
* **Example:** `public/audio/tum-se-hi.mp3`

---

### Step 2: Place Your Movie Poster Image
Place your poster or album cover into the artwork folder:
* **Folder Path:** `public/artwork/`
* **Full Windows Path:** `C:\Users\vicky\Desktop\UI theme\nostalgia\public\artwork\`
* **Supported Formats:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`
* **Example:** `public/artwork/jab-we-met.jpg`

> 💡 **Tip:** If you also have a separate wide wallpaper background, you can place it in `public/backgrounds/`. If omitted, the player will automatically use your poster as the background backdrop!

---

### Step 3: Link Them in `src/data/songs.ts`
Open [`src/data/songs.ts`](src/data/songs.ts) and add or edit an entry in the `SONGS` array:

```typescript
{
  id: "2",
  title: "Tum Se Hi",
  artist: "Mohit Chauhan · Pritam",
  album: "Jab We Met",
  year: 2007,
  genre: "Monsoon Romance",
  audioSrc: "/audio/tum-se-hi.mp3",       // <-- filename in public/audio/
  artworkSrc: "/artwork/jab-we-met.jpg",  // <-- filename in public/artwork/
  backgroundSrc: "/artwork/jab-we-met.jpg",
  accent: "#38bdf8",                     // <-- glow & theme color (hex code)
  durationSec: 321,                      // <-- length in seconds (e.g., 5:21 = 321)
  memoryNote: "Pouring rain, station platform in Ratlam, Aditya and Geet's train journey.",
  cast: "Shahid Kapoor · Kareena Kapoor",
  director: "Imtiaz Ali",
},
```

Once saved, the player will hot-reload and display your new song immediately.

---

## 📂 Project Structure

```text
nostalgia/
├── public/
│   ├── audio/              # Store your .mp3, .wav audio tracks here
│   │   ├── ajab-si.mp3
│   │   └── ...
│   ├── artwork/            # Store your movie poster images (.jpg, .png) here
│   │   ├── om-shanti-om.jpg
│   │   └── ...
│   └── backgrounds/        # Optional wide atmospheric backdrops
│
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Google fonts, SEO & viewport configuration
│   │   ├── page.tsx        # Dynamic client entry (SSR-safe)
│   │   └── globals.css     # Dark theme styles, CRT scanlines, custom scrollbars
│   │
│   ├── components/
│   │   ├── NostalgiaApp.tsx       # Master state controller (audio, shortcuts, modals)
│   │   ├── Background.tsx         # Layered cinematic backdrop with ambient color aura
│   │   ├── Header.tsx             # Minimal branding & action triggers
│   │   ├── NowPlaying.tsx         # Theatrical movie poster card & typography
│   │   ├── PlayerControls.tsx     # Transport controls (Play, Pause, Prev, Next, Shuffle, Repeat)
│   │   ├── ProgressBar.tsx        # Drag-and-touch scrub bar with hover time preview
│   │   ├── VolumeControl.tsx      # Desktop slider + mobile popover
│   │   ├── Visualizer.tsx         # Glowing audio frequency visualizer
│   │   ├── Timeline.tsx           # Interactive 2005–2010 year filter
│   │   ├── PlaylistDrawer.tsx     # Categorized slide-over drawer (Bollywood, KK, Indie, etc.)
│   │   ├── PlaylistItem.tsx       # Track row with animated equalizers & favorites
│   │   ├── SettingsPanel.tsx      # Toggles for Nostalgia Mode, scanlines, visualizer
│   │   ├── AboutPanel.tsx         # Tribute story & keyboard shortcut modal
│   │   └── NostalgiaOverlay.tsx   # Vintage CRT scanlines & 2007 VCR timestamp
│   │
│   ├── hooks/
│   │   ├── useAudioPlayer.ts      # Native HTML5 audio engine (no distortion, rock-solid)
│   │   ├── useFavorites.ts        # LocalStorage-backed favorites
│   │   ├── useRecentlyPlayed.ts   # LocalStorage-backed 10-song history
│   │   ├── useKeyboardShortcuts.ts# Accessible global hotkeys
│   │   └── useMediaQuery.ts       # Responsive breakpoint & motion detection
│   │
│   ├── data/
│   │   ├── songs.ts               # Song metadata (titles, artists, paths, cast, colors)
│   │   └── playlists.ts           # Curated playlist categories
│   │
│   └── lib/
│       ├── audio.ts               # Time formatting & visualizer helper
│       ├── storage.ts             # SSR-safe localStorage helper
│       └── colors.ts              # Dynamic color luminance & accent helper
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Space` | Play / Pause |
| `←` / `→` | Seek backward / forward by 5 seconds |
| `Shift` + `←` / `→` | Previous / Next song |
| `↑` / `↓` | Volume up / down by 5% |
| `M` | Mute / Unmute |
| `F` | Toggle Fullscreen mode |
| `Esc` | Close open drawers or modals |

---

## ⚙️ Changing the Port Number

The default port is set to **`3005`** in [`package.json`](package.json).

* **To change it permanently:** Edit `"dev": "next dev -p <PORT>"` in `package.json`.
* **To change it on the fly:**
  ```bash
  npm run dev -- -p 4000
  ```

---

## 🛠️ Technology Stack

* **Framework:** Next.js (App Router, Turbopack)
* **Library:** React 19
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion
* **Icons:** Lucide React
* **Audio Engine:** Native HTML5 Audio API
