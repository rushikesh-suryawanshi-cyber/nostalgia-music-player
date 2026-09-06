const fs = require('fs');
const path = require('path');

const posters = [
  {
    id: '1',
    film: 'OM SHANTI OM',
    year: '2007',
    director: 'A FARAH KHAN FILM',
    music: 'MUSIC: VISHAL - SHEKHAR · LYRICS: JAVED AKHTAR',
    stars: 'SHAH RUKH KHAN · DEEPIKA PADUKONE',
    songTitle: 'AANKHON MEIN TERI',
    singer: 'SUNG BY KK',
    tagline: 'FOR SOME DREAMS, ONE LIFETIME IS NOT ENOUGH',
    theme1: '#881337', // rose-900 / royal maroon
    theme2: '#4c0519', // rose-950
    accent: '#fbbf24', // sparkling gold
    subAccent: '#f43f5e',
    symbolType: 'retro-cinema',
  },
  {
    id: '2',
    film: 'JAB WE MET',
    year: '2007',
    director: 'AN IMTIAZ ALI FILM',
    music: 'MUSIC: PRITAM · LYRICS: IRSHAD KAMIL',
    stars: 'SHAHID KAPOOR · KAREENA KAPOOR',
    songTitle: 'TUM SE HI',
    singer: 'SUNG BY MOHIT CHAUHAN',
    tagline: "IT'S ALL ABOUT LOVING YOUR LIFE",
    theme1: '#0369a1', // sky-700
    theme2: '#082f49', // sky-950
    accent: '#38bdf8', // rain cyan
    subAccent: '#f59e0b', // station amber
    symbolType: 'train-rain',
  },
  {
    id: '3',
    film: 'LIFE IN A... METRO',
    year: '2007',
    director: 'AN ANURAG BASU FILM',
    music: 'MUSIC: PRITAM & METRO BAND',
    stars: 'KAY KAY MENON · SHILPA SHETTY · IRRFAN KHAN',
    songTitle: 'IN DINO',
    singer: 'SUNG BY SOHAM CHAKRABORTY',
    tagline: 'WHEN SOULS COLLIDE IN THE CITY OF DREAMS',
    theme1: '#c2410c', // orange-700
    theme2: '#262626', // neutral-800
    accent: '#fb923c',
    subAccent: '#ef4444',
    symbolType: 'mumbai-metro',
  },
  {
    id: '4',
    film: 'JANNAT',
    year: '2008',
    director: 'A KUNAL DESHMUKH FILM',
    music: 'MUSIC: PRITAM · VISESH FILMS',
    stars: 'EMRAAN HASHMI · SONAL CHAUHAN',
    songTitle: 'ZARA SA',
    singer: 'SUNG BY KK',
    tagline: 'IN SEARCH OF HEAVEN... TO TOUCH THE SKY',
    theme1: '#312e81', // indigo-900
    theme2: '#0f172a', // slate-900
    accent: '#818cf8',
    subAccent: '#38bdf8',
    symbolType: 'neon-city',
  },
  {
    id: '5',
    film: 'WAKE UP SID',
    year: '2009',
    director: 'DIRECTED BY AYAN MUKERJI',
    music: 'MUSIC: AMIT TRIVEDI · DHARMA PRODUCTIONS',
    stars: 'RANBIR KAPOOR · KONKONA SENSHARMA',
    songTitle: 'IKTARA',
    singer: 'SUNG BY KAVITA SETH & TOCHI RAINA',
    tagline: 'A COMING OF AGE MONSOON STORY',
    theme1: '#b45309', // amber-700
    theme2: '#451a03', // amber-950
    accent: '#fde047', // warm yellow
    subAccent: '#fb923c',
    symbolType: 'terrace-monsoon',
  },
  {
    id: '6',
    film: 'DELHI-6',
    year: '2009',
    director: 'A RAKEYSH OMPRAKASH MEHRA FILM',
    music: 'MUSIC: A. R. RAHMAN · LYRICS: PRASOON JOSHI',
    stars: 'ABHISHEK BACHCHAN · SONAM KAPOOR',
    songTitle: 'REHNA TU & MASAKALI',
    singer: 'SUNG BY MOHIT CHAUHAN',
    tagline: 'NO PLACE LIKE HOME · PIN CODE 110006',
    theme1: '#9f1239', // rose-800
    theme2: '#2b0914', // deep maroon
    accent: '#fb7185',
    subAccent: '#f59e0b',
    symbolType: 'pigeon-haveli',
  },
  {
    id: '7',
    film: 'ROCK ON!!',
    year: '2008',
    director: 'AN ABHISHEK KAPOOR FILM',
    music: 'MUSIC: SHANKAR - EHSAAN - LOY',
    stars: 'FARHAN AKHTAR · ARJUN RAMPAL · PURAB KOHLI',
    songTitle: 'PICHLE SAAT DINON MEIN',
    singer: 'SUNG BY FARHAN AKHTAR',
    tagline: 'LIVE YOUR DREAM... ONE MORE TIME',
    theme1: '#dc2626', // red-600
    theme2: '#171717', // neutral-900
    accent: '#f87171',
    subAccent: '#ffffff',
    symbolType: 'electric-guitar',
  },
  {
    id: '8',
    film: 'JAANE TU... YA JAANE NA',
    year: '2008',
    director: 'AN AAMIR KHAN PRODUCTION · DIR. ABBAS TYREWALA',
    music: 'MUSIC: A. R. RAHMAN · LYRICS: ABBAS TYREWALA',
    stars: 'IMRAN KHAN · GENELIA D\'SOUZA',
    songTitle: 'KABHI KABHI ADITI',
    singer: 'SUNG BY RASHID ALI',
    tagline: 'EVERY LOVE STORY BEGINS WITH FRIENDSHIP',
    theme1: '#0d9488', // teal-600
    theme2: '#134e4a', // teal-900
    accent: '#facc15', // bright yellow
    subAccent: '#38bdf8',
    symbolType: 'college-friends',
  },
  {
    id: '9',
    film: 'GANGSTER',
    year: '2006',
    director: 'DIRECTED BY ANURAG BASU · VISESH FILMS',
    music: 'MUSIC: PRITAM · LYRICS: SAYEED QUADRI',
    stars: 'EMRAAN HASHMI · KANGANA RANAUT · SHINEY AHUJA',
    songTitle: 'YA ALI & TU HI MERI SHAB HAI',
    singer: 'SUNG BY ZUBEEN GARG & KK',
    tagline: 'A LOVE STORY THAT BLEEDS PASSION',
    theme1: '#15803d', // green-700
    theme2: '#052e16', // green-950
    accent: '#4ade80',
    subAccent: '#e11d48',
    symbolType: 'noir-umbrella',
  },
  {
    id: '10',
    film: 'GHAJINI',
    year: '2008',
    director: 'AN A. R. MURUGADOSS FILM · GEETHA ARTS',
    music: 'MUSIC: A. R. RAHMAN · LYRICS: PRASOON JOSHI',
    stars: 'AAMIR KHAN · ASIN · JIAH KHAN',
    songTitle: 'GUZARISH & KAISE MUJHE',
    singer: 'SUNG BY JAVED ALI & BENNY DAYAL',
    tagline: 'SOME MEMORIES NEVER DIE',
    theme1: '#0891b2', // cyan-600
    theme2: '#083344', // cyan-950
    accent: '#67e8f9',
    subAccent: '#f59e0b',
    symbolType: 'polaroid-camera',
  }
];

function generatePosterArt(p) {
  // 600 x 800 Vertical Indian Bollywood Theatrical Poster
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <defs>
    <linearGradient id="bg_${p.id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${p.theme1}" />
      <stop offset="50%" stop-color="${p.theme2}" />
      <stop offset="100%" stop-color="#050508" />
    </linearGradient>

    <radialGradient id="stageGlow_${p.id}" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="${p.accent}" stop-opacity="0.4" />
      <stop offset="70%" stop-color="${p.accent}" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="50%" stop-color="#fef08a" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>

    <filter id="cinematicShine">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.8"/>
    </filter>
  </defs>

  <!-- Background base -->
  <rect width="600" height="800" fill="url(#bg_${p.id})" />
  <circle cx="300" cy="360" r="280" fill="url(#stageGlow_${p.id})" />

  <!-- Theatrical Double Border -->
  <rect x="16" y="16" width="568" height="768" rx="8" fill="none" stroke="${p.accent}" stroke-width="1.5" stroke-opacity="0.6"/>
  <rect x="22" y="22" width="556" height="756" rx="6" fill="none" stroke="#ffffff" stroke-width="0.75" stroke-opacity="0.3"/>

  <!-- Top Banner: Production House & Release Year -->
  <g transform="translate(300, 52)" text-anchor="middle">
    <rect x="-180" y="-18" width="360" height="24" rx="4" fill="#000000" fill-opacity="0.55" stroke="${p.accent}" stroke-opacity="0.3" stroke-width="1"/>
    <text y="-2" font-family="'Trebuchet MS', sans-serif" font-size="10" font-weight="700" letter-spacing="3" fill="#ffffff">ORIGINAL CINEMATHEQUE · ${p.year}</text>
  </g>

  <!-- Director Banner -->
  <text x="300" y="90" font-family="Georgia, serif" font-size="12" font-style="italic" letter-spacing="2" fill="${p.accent}" text-anchor="middle" opacity="0.9">${p.director}</text>

  <!-- Star Cast Header -->
  <text x="300" y="112" font-family="sans-serif" font-size="13" font-weight="700" letter-spacing="3" fill="#e2e8f0" text-anchor="middle" filter="url(#cinematicShine)">${p.stars}</text>

  <!-- Central Movie Visual Scene Graphics -->
  <g transform="translate(300, 310)">
    <!-- Aura disc backdrop -->
    <circle cx="0" cy="0" r="140" fill="#000000" fill-opacity="0.5" stroke="${p.accent}" stroke-width="2" stroke-dasharray="8 4" opacity="0.6" />
    <circle cx="0" cy="0" r="125" fill="${p.theme1}" fill-opacity="0.35" />

    <!-- Specific Iconic Visual Silhouette / Motif based on symbolType -->
    ${
      p.symbolType === 'retro-cinema'
        ? `<!-- Om Shanti Om Retro Bollywood Marquee -->
           <circle cx="0" cy="-20" r="60" fill="none" stroke="${p.accent}" stroke-width="2"/>
           <polygon points="0,-75 14,-35 55,-35 22,-10 35,30 0,6 -35,30 -22,-10 -55,-35 -14,-35" fill="${p.accent}" opacity="0.8"/>
           <path d="M -80,50 Q 0,10 80,50" stroke="${p.accent}" stroke-width="3" fill="none"/>
           <text y="75" font-family="Georgia, serif" font-size="12" font-weight="700" letter-spacing="4" fill="#fef08a" text-anchor="middle">★ RETRO SUPERSTAR ★</text>`
        : p.symbolType === 'train-rain'
        ? `<!-- Jab We Met Train & Rain -->
           <path d="M -70,30 L -50,-40 L 50,-40 L 70,30 Z" fill="#0f172a" stroke="${p.accent}" stroke-width="2.5"/>
           <circle cx="-35" cy="0" r="14" fill="${p.subAccent}" opacity="0.9"/>
           <circle cx="35" cy="0" r="14" fill="${p.subAccent}" opacity="0.9"/>
           <line x1="-90" y1="38" x2="90" y2="38" stroke="#ffffff" stroke-width="2"/>
           <line x1="-100" y1="48" x2="100" y2="48" stroke="#ffffff" stroke-width="3"/>
           <!-- Rain streaks -->
           <line x1="-40" y1="-80" x2="-50" y2="-50" stroke="${p.accent}" stroke-width="1.5" stroke-linecap="round"/>
           <line x1="20" y1="-85" x2="10" y2="-55" stroke="${p.accent}" stroke-width="1.5" stroke-linecap="round"/>
           <line x1="-10" y1="-70" x2="-20" y2="-40" stroke="${p.accent}" stroke-width="1.5" stroke-linecap="round"/>
           <text y="75" font-family="Georgia, serif" font-size="11" font-weight="700" letter-spacing="3" fill="${p.accent}" text-anchor="middle">RATLAM RAILWAY · MONSOON</text>`
        : p.symbolType === 'mumbai-metro'
        ? `<!-- Life in a Metro Skyline & Taxi -->
           <rect x="-65" y="-50" width="30" height="70" fill="#1e293b" stroke="${p.accent}" stroke-width="1.5"/>
           <rect x="-30" y="-70" width="40" height="90" fill="#0f172a" stroke="${p.accent}" stroke-width="1.5"/>
           <rect x="15" y="-40" width="35" height="60" fill="#1e293b" stroke="${p.accent}" stroke-width="1.5"/>
           <!-- Yellow Taxi silhouette -->
           <rect x="-45" y="25" width="90" height="25" rx="5" fill="#eab308" stroke="#000" stroke-width="1.5"/>
           <circle cx="-25" cy="48" r="8" fill="#000"/>
           <circle cx="25" cy="48" r="8" fill="#000"/>
           <text y="75" font-family="Georgia, serif" font-size="11" font-weight="700" letter-spacing="3" fill="${p.accent}" text-anchor="middle">MUMBAI IN MONSOON</text>`
        : p.symbolType === 'neon-city'
        ? `<!-- Jannat Streetlight Romance -->
           <line x1="0" y1="-70" x2="0" y2="45" stroke="${p.accent}" stroke-width="3"/>
           <path d="M -25,-60 Q 0,-85 25,-60 Z" fill="${p.accent}"/>
           <circle cx="0" cy="-55" r="10" fill="#ffffff" filter="url(#cinematicShine)"/>
           <!-- Road rain puddles -->
           <ellipse cx="0" cy="48" rx="60" ry="12" fill="none" stroke="${p.accent}" stroke-width="1.5" opacity="0.8"/>
           <text y="75" font-family="Georgia, serif" font-size="11" font-weight="700" letter-spacing="3" fill="${p.accent}" text-anchor="middle">MIDNIGHT STREETLIGHTS</text>`
        : p.symbolType === 'terrace-monsoon'
        ? `<!-- Wake Up Sid Fairy Lights & Sea -->
           <path d="M -70,-50 Q 0,-15 70,-50" fill="none" stroke="${p.accent}" stroke-width="1.5"/>
           <circle cx="-50" cy="-42" r="5" fill="${p.accent}"/>
           <circle cx="-20" cy="-30" r="5" fill="${p.subAccent}"/>
           <circle cx="15" cy="-28" r="5" fill="${p.accent}"/>
           <circle cx="50" cy="-40" r="5" fill="${p.subAccent}"/>
           <!-- Paper Plane -->
           <polygon points="0,5 25,25 -25,25" fill="#ffffff" stroke="${p.accent}" stroke-width="1"/>
           <text y="75" font-family="Georgia, serif" font-size="11" font-weight="700" letter-spacing="3" fill="${p.accent}" text-anchor="middle">TERRACE MONSOONS</text>`
        : p.symbolType === 'pigeon-haveli'
        ? `<!-- Delhi-6 Pigeon & Haveli -->
           <!-- Flying Dove / Masakali -->
           <path d="M 0,-30 Q 30,-60 60,-45 Q 35,-30 20,-10 Q 0,-20 0,-30 Z" fill="#ffffff" filter="url(#cinematicShine)"/>
           <path d="M 0,-30 Q -30,-60 -60,-45 Q -35,-30 -20,-10 Q 0,-20 0,-30 Z" fill="#ffffff" filter="url(#cinematicShine)"/>
           <circle cx="0" cy="-32" r="6" fill="#ffffff"/>
           <!-- Haveli arch -->
           <path d="M -50,45 L -50,10 Q 0,-20 50,10 L 50,45" fill="none" stroke="${p.accent}" stroke-width="2.5"/>
           <text y="75" font-family="Georgia, serif" font-size="11" font-weight="700" letter-spacing="3" fill="${p.accent}" text-anchor="middle">OLD DELHI · HAVELI CHORDS</text>`
        : p.symbolType === 'electric-guitar'
        ? `<!-- Rock On Stage Lights & Guitar -->
           <polygon points="-70,-70 70,-70 40,50 -40,50" fill="${p.accent}" fill-opacity="0.15"/>
           <!-- Electric Guitar Body -->
           <ellipse cx="0" cy="15" rx="28" ry="36" fill="#000" stroke="${p.accent}" stroke-width="2"/>
           <line x1="0" y1="-60" x2="0" y2="15" stroke="${p.accent}" stroke-width="4"/>
           <circle cx="0" cy="10" r="8" fill="${p.accent}"/>
           <text y="75" font-family="Georgia, serif" font-size="11" font-weight="700" letter-spacing="3" fill="#ffffff" text-anchor="middle">LIVE AT CONCERT · MAGIK</text>`
        : p.symbolType === 'college-friends'
        ? `<!-- Jaane Tu College Car & Joy -->
           <!-- Cute retro car -->
           <rect x="-45" y="5" width="90" height="28" rx="6" fill="${p.accent}" stroke="#000" stroke-width="2"/>
           <circle cx="-25" cy="33" r="8" fill="#1e293b"/>
           <circle cx="25" cy="33" r="8" fill="#1e293b"/>
           <path d="M -30,5 Q 0,-20 30,5 Z" fill="#ffffff" opacity="0.6"/>
           <text y="75" font-family="Georgia, serif" font-size="11" font-weight="700" letter-spacing="3" fill="${p.accent}" text-anchor="middle">CANTEEN DAYS & FRIENDSHIP</text>`
        : p.symbolType === 'noir-umbrella'
        ? `<!-- Gangster Noir Umbrella in Rain -->
           <path d="M -50,0 Q 0,-45 50,0 Z" fill="#000" stroke="${p.accent}" stroke-width="2.5"/>
           <line x1="0" y1="0" x2="0" y2="40" stroke="${p.accent}" stroke-width="3"/>
           <path d="M 0,40 Q -10,50 -10,40" fill="none" stroke="${p.accent}" stroke-width="3"/>
           <text y="75" font-family="Georgia, serif" font-size="11" font-weight="700" letter-spacing="3" fill="${p.accent}" text-anchor="middle">SEOUL RAIN & NOIR GUITAR</text>`
        : `<!-- Ghajini Polaroid Camera & Memories -->
           <rect x="-45" y="-25" width="90" height="65" rx="6" fill="#0f172a" stroke="${p.accent}" stroke-width="2.5"/>
           <circle cx="0" cy="8" r="18" fill="#000" stroke="${p.accent}" stroke-width="2"/>
           <rect x="20" y="-18" width="12" height="6" fill="${p.subAccent}"/>
           <text y="75" font-family="Georgia, serif" font-size="11" font-weight="700" letter-spacing="3" fill="${p.accent}" text-anchor="middle">POLAROID MEMORIES · 2008</text>`
    }
  </g>

  <!-- Iconic Film Title Typography -->
  <g transform="translate(300, 520)" text-anchor="middle">
    <rect x="-240" y="-38" width="480" height="56" rx="10" fill="#000000" fill-opacity="0.75" stroke="${p.accent}" stroke-width="1.5"/>
    <text y="2" font-family="'Impact', 'Arial Black', sans-serif" font-size="34" letter-spacing="4" fill="#ffffff" filter="url(#cinematicShine)">${p.film}</text>
  </g>

  <!-- Tagline Banner -->
  <text x="300" y="562" font-family="sans-serif" font-size="11" font-weight="700" letter-spacing="2" fill="${p.accent}" text-anchor="middle" opacity="0.95">${p.tagline}</text>

  <!-- Featured Song Badge -->
  <g transform="translate(300, 608)" text-anchor="middle">
    <rect x="-200" y="-16" width="400" height="42" rx="8" fill="${p.accent}" fill-opacity="0.15" stroke="${p.accent}" stroke-width="1"/>
    <text y="4" font-family="Georgia, serif" font-size="16" font-weight="700" fill="#ffffff">♪ ${p.songTitle}</text>
    <text y="20" font-family="sans-serif" font-size="10" font-weight="600" letter-spacing="1" fill="#cbd5e1">${p.singer}</text>
  </g>

  <!-- Composer & Lyricist credits -->
  <text x="300" y="668" font-family="sans-serif" font-size="11" font-weight="700" letter-spacing="2" fill="#e2e8f0" text-anchor="middle">${p.music}</text>

  <!-- Authentic Bollywood Theatrical Billing Block at Footer -->
  <g transform="translate(300, 715)">
    <!-- U/A Certificate Box -->
    <rect x="-250" y="-8" width="45" height="30" fill="none" stroke="#ffffff" stroke-width="1.5"/>
    <text x="-227" y="12" font-family="sans-serif" font-size="11" font-weight="800" fill="#ffffff" text-anchor="middle">U/A</text>

    <!-- Billing text block -->
    <text x="0" y="0" font-family="sans-serif" font-size="8" letter-spacing="2" fill="#94a3b8" text-anchor="middle">ORIGINAL MOTION PICTURE SOUNDTRACK · RECORDED IN DOLBY DIGITAL 5.1 STEREO</text>
    <text x="0" y="14" font-family="sans-serif" font-size="8" letter-spacing="2" fill="#94a3b8" text-anchor="middle">DISTRIBUTED ACROSS THEATRES NATIONWIDE · NOSTALGIA ENTERTAINMENT ARCHIVES</text>

    <!-- Audio Cassette / CD Box -->
    <rect x="205" y="-8" width="45" height="30" fill="none" stroke="${p.accent}" stroke-width="1.5"/>
    <text x="227" y="4" font-family="sans-serif" font-size="7" font-weight="800" fill="${p.accent}" text-anchor="middle">AUDIO</text>
    <text x="227" y="16" font-family="sans-serif" font-size="8" font-weight="800" fill="#ffffff" text-anchor="middle">CD</text>
  </g>
</svg>`;
}

function generatePosterBackground(p) {
  // 1920 x 1080 High-Res Cinematic Atmospheric Backdrop (Crisp, zero blur baked-in)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <linearGradient id="sky_${p.id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${p.theme1}" />
      <stop offset="60%" stop-color="${p.theme2}" />
      <stop offset="100%" stop-color="#050508" />
    </linearGradient>
    <radialGradient id="spotlight_${p.id}" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="${p.accent}" stop-opacity="0.35" />
      <stop offset="60%" stop-color="${p.theme1}" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.95" />
    </radialGradient>
  </defs>

  <!-- Sky Base -->
  <rect width="1920" height="1080" fill="url(#sky_${p.id})" />
  <rect width="1920" height="1080" fill="url(#spotlight_${p.id})" />

  <!-- Atmospheric Bollywood Light Beams -->
  <g opacity="0.18">
    <polygon points="960,0 200,1080 400,1080" fill="${p.accent}" />
    <polygon points="960,0 1520,1080 1720,1080" fill="${p.accent}" />
    <polygon points="960,0 700,1080 1220,1080" fill="#ffffff" />
  </g>

  <!-- Silhouetted Skyline & Theatrical Curtains -->
  <g fill="#050508" opacity="0.75">
    <rect x="0" y="850" width="1920" height="230" />
    <!-- Distant city / studio pillars -->
    <rect x="180" y="740" width="80" height="110" />
    <rect x="290" y="710" width="120" height="140" />
    <rect x="440" y="760" width="70" height="90" />
    <rect x="1400" y="720" width="110" height="130" />
    <rect x="1540" y="690" width="140" height="160" />
    <rect x="1710" y="750" width="80" height="100" />
  </g>

  <!-- Subtle Theatrical Arch frame -->
  <path d="M 0,0 Q 960,240 1920,0 L 1920,1080 L 0,1080 Z" fill="none" stroke="${p.accent}" stroke-width="1.5" opacity="0.25"/>

  <!-- Dark Cinematic Edge Vignette -->
  <radialGradient id="edgeVignette" cx="50%" cy="50%" r="70%">
    <stop offset="50%" stop-color="#000000" stop-opacity="0" />
    <stop offset="100%" stop-color="#000000" stop-opacity="0.8" />
  </radialGradient>
  <rect width="1920" height="1080" fill="url(#edgeVignette)" />
</svg>`;
}

console.log('Generating 10 authentic Bollywood movie posters and backdrops...');
const artworkDir = path.join(__dirname, '..', 'public', 'artwork');
const bgDir = path.join(__dirname, '..', 'public', 'backgrounds');

for (const p of posters) {
  const posterSvg = generatePosterArt(p);
  fs.writeFileSync(path.join(artworkDir, `song-${p.id}.svg`), posterSvg);

  const bgSvg = generatePosterBackground(p);
  fs.writeFileSync(path.join(bgDir, `bg-${p.id}.svg`), bgSvg);
  console.log(`✓ Created Bollywood Poster & Background: ${p.film} (${p.songTitle})`);
}

console.log('✓ All 10 Bollywood posters generated successfully!');
