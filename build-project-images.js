import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Generate DOMA Cover SVG (1920x1080)
const domaCoverSvg = `<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0c10"/>
      <stop offset="50%" stop-color="#121620"/>
      <stop offset="100%" stop-color="#080a0e"/>
    </linearGradient>

    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E5C158"/>
      <stop offset="50%" stop-color="#F3E096"/>
      <stop offset="100%" stop-color="#C89D30"/>
    </linearGradient>

    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a202c" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#0f131a" stop-opacity="0.95"/>
    </linearGradient>

    <linearGradient id="heroImageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1a2634"/>
      <stop offset="50%" stop-color="#2d3f52"/>
      <stop offset="100%" stop-color="#0f1722"/>
    </linearGradient>

    <linearGradient id="poolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0.9"/>
    </linearGradient>

    <linearGradient id="sunsetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fdba74" stop-opacity="0.3"/>
      <stop offset="50%" stop-color="#f43f5e" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.1"/>
    </linearGradient>

    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="20" stdDeviation="25" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="1920" height="1080" fill="url(#bgGrad)"/>

  <!-- Subtle Architectural Grid Pattern -->
  <g stroke="#ffffff" stroke-opacity="0.03" stroke-width="1">
    <path d="M 0,180 L 1920,180 M 0,360 L 1920,360 M 0,540 L 1920,540 M 0,720 L 1920,720 M 0,900 L 1920,900" />
    <path d="M 320,0 L 320,1080 M 640,0 L 640,1080 M 960,0 L 960,1080 M 1280,0 L 1280,1080 M 1600,0 L 1600,1080" />
  </g>

  <!-- Top Accent Frame Border -->
  <rect x="40" y="40" width="1840" height="1000" rx="20" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" stroke-opacity="0.4"/>

  <!-- Top Navigation Bar Mockup -->
  <g transform="translate(100, 80)">
    <!-- Logo -->
    <text x="0" y="36" font-family="'Syne', 'Playfair Display', Georgia, serif" font-size="32" font-weight="900" fill="#ffffff" letter-spacing="6">DOMA</text>
    <text x="145" y="32" font-family="monospace" font-size="11" font-weight="700" fill="#E5C158" letter-spacing="3">PORTUGAL</text>

    <!-- Navigation links -->
    <g transform="translate(680, 24)" font-family="sans-serif" font-size="13" font-weight="600" fill="#a1a1aa">
      <text x="0" y="0" fill="#ffffff">VILLAS</text>
      <text x="100" y="0">PENTHOUSES</text>
      <text x="240" y="0">ESTATES</text>
      <text x="350" y="0">CONCIERGE</text>
      <text x="470" y="0">JOURNAL</text>
    </g>

    <!-- Top CTA Button -->
    <g transform="translate(1420, 2)">
      <rect x="0" y="0" width="200" height="42" rx="8" fill="url(#goldGrad)" />
      <text x="100" y="26" font-family="sans-serif" font-size="12" font-weight="800" fill="#0a0c10" text-anchor="middle" letter-spacing="1">BOOK PRIVATE TOUR</text>
    </g>
  </g>

  <!-- Main Hero Title Section (Left Side) -->
  <g transform="translate(100, 220)">
    <!-- Category Badge -->
    <rect x="0" y="0" width="280" height="36" rx="18" fill="#1e2634" stroke="#334155" stroke-width="1"/>
    <circle cx="20" cy="18" r="5" fill="#E5C158"/>
    <text x="36" y="22" font-family="monospace" font-size="11" font-weight="800" fill="#E5C158" letter-spacing="2">CASE STUDY · LUXURY REAL ESTATE</text>

    <!-- Main Headline -->
    <text x="0" y="100" font-family="'Syne', sans-serif" font-size="64" font-weight="900" fill="#ffffff" letter-spacing="-1">LUXURY LIVING.</text>
    <text x="0" y="165" font-family="'Syne', sans-serif" font-size="64" font-weight="900" fill="url(#goldGrad)" letter-spacing="-1">SIMPLIFIED.</text>

    <!-- Subtitle Description -->
    <text x="0" y="215" font-family="sans-serif" font-size="18" fill="#94a3b8" width="600">
      Search-first architecture &amp; bespoke digital concierge for high-net-worth buyers in Portugal.
    </text>

    <!-- Key Stats Cards Row -->
    <g transform="translate(0, 260)">
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="170" height="80" rx="12" fill="#131924" stroke="#1e293b" stroke-width="1.5"/>
        <text x="20" y="32" font-family="sans-serif" font-size="11" font-weight="700" fill="#64748b" letter-spacing="1">CONCEPT SPRINT</text>
        <text x="20" y="60" font-family="monospace" font-size="22" font-weight="900" fill="#ffffff">2-Week</text>
      </g>

      <g transform="translate(190, 0)">
        <rect x="0" y="0" width="170" height="80" rx="12" fill="#131924" stroke="#1e293b" stroke-width="1.5"/>
        <text x="20" y="32" font-family="sans-serif" font-size="11" font-weight="700" fill="#64748b" letter-spacing="1">ARCHITECTURE</text>
        <text x="20" y="60" font-family="monospace" font-size="20" font-weight="900" fill="#E5C158">Search-First</text>
      </g>

      <g transform="translate(380, 0)">
        <rect x="0" y="0" width="190" height="80" rx="12" fill="#131924" stroke="#1e293b" stroke-width="1.5"/>
        <text x="20" y="32" font-family="sans-serif" font-size="11" font-weight="700" fill="#64748b" letter-spacing="1">DESIGN SYSTEM</text>
        <text x="20" y="60" font-family="monospace" font-size="20" font-weight="900" fill="#ffffff">Figma Tokens</text>
      </g>
    </g>
  </g>

  <!-- Right Side Showcase: Luxury Villa Architectural Render & Platform Card UI -->
  <g transform="translate(740, 180)" filter="url(#cardShadow)">
    <!-- Main Villa Canvas Container -->
    <rect x="0" y="0" width="1080" height="680" rx="24" fill="url(#heroImageGrad)" stroke="#334155" stroke-width="2"/>

    <!-- Sunset Horizon Background Glow -->
    <rect x="0" y="0" width="1080" height="350" rx="24" fill="url(#sunsetGrad)"/>

    <!-- Architectural Modern Villa Structure (Vector Graphic) -->
    <!-- Sky & Horizon -->
    <path d="M 0,320 Q 540,280 1080,320 L 1080,680 L 0,680 Z" fill="#0f172a" opacity="0.6"/>

    <!-- Main Villa Structure Glass & Concrete Panels -->
    <!-- Upper Floor Master Pavilion -->
    <rect x="220" y="140" width="640" height="200" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
    <!-- Glass Wall Windows -->
    <rect x="250" y="160" width="160" height="150" fill="#38bdf8" fill-opacity="0.15" stroke="#38bdf8" stroke-opacity="0.4" stroke-width="1"/>
    <rect x="430" y="160" width="220" height="150" fill="#38bdf8" fill-opacity="0.2" stroke="#38bdf8" stroke-opacity="0.4" stroke-width="1"/>
    <rect x="670" y="160" width="160" height="150" fill="#38bdf8" fill-opacity="0.15" stroke="#38bdf8" stroke-opacity="0.4" stroke-width="1"/>
    
    <!-- Warm Interior Lighting Effects -->
    <circle cx="330" cy="220" r="30" fill="#fef08a" opacity="0.15" filter="url(#glow)"/>
    <circle cx="540" cy="220" r="45" fill="#fef08a" opacity="0.2" filter="url(#glow)"/>

    <!-- Cantilevered Lower Level Deck -->
    <rect x="140" y="320" width="800" height="180" rx="10" fill="#0f172a" stroke="#334155" stroke-width="2"/>
    <rect x="180" y="340" width="300" height="140" fill="#38bdf8" fill-opacity="0.12" stroke="#38bdf8" stroke-opacity="0.3" stroke-width="1"/>
    <rect x="500" y="340" width="400" height="140" fill="#38bdf8" fill-opacity="0.18" stroke="#38bdf8" stroke-opacity="0.3" stroke-width="1"/>

    <!-- Infinity Pool with Reflective Turquoise Water -->
    <path d="M 80,490 L 1000,490 L 1040,650 L 40,650 Z" fill="url(#poolGrad)" />
    <!-- Pool Water Caustics / Ripple Lines -->
    <path d="M 120,530 Q 300,510 500,530 T 900,530" fill="none" stroke="#ffffff" stroke-opacity="0.3" stroke-width="2"/>
    <path d="M 160,570 Q 400,550 700,570 T 960,570" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="1.5"/>

    <!-- Floating Property Overlay Glass Card -->
    <g transform="translate(60, 380)" filter="url(#cardShadow)">
      <rect x="0" y="0" width="480" height="240" rx="18" fill="url(#cardGrad)" stroke="url(#goldGrad)" stroke-width="1.5"/>
      
      <!-- Property Title & Location -->
      <text x="30" y="42" font-family="'Syne', sans-serif" font-size="22" font-weight="900" fill="#ffffff">VILLA INFINITE BLUE</text>
      <text x="30" y="68" font-family="monospace" font-size="12" font-weight="700" fill="#E5C158" letter-spacing="1.5">QUINTA DO LAGO · ALGARVE</text>

      <!-- Price Tag -->
      <text x="30" y="120" font-family="'Syne', sans-serif" font-size="32" font-weight="900" fill="#ffffff">€4,850,000</text>

      <!-- Property Specs Badges -->
      <g transform="translate(30, 155)" font-family="monospace" font-size="11" font-weight="700" fill="#94a3b8">
        <rect x="0" y="0" width="90" height="30" rx="6" fill="#1e293b"/>
        <text x="45" y="19" text-anchor="middle">5 BEDS</text>

        <rect x="100" y="0" width="90" height="30" rx="6" fill="#1e293b"/>
        <text x="145" y="19" text-anchor="middle">6 BATHS</text>

        <rect x="200" y="0" width="100" height="30" rx="6" fill="#1e293b"/>
        <text x="250" y="19" text-anchor="middle">820 M²</text>
      </g>

      <!-- Action Link -->
      <g transform="translate(350, 155)">
        <rect x="0" y="0" width="100" height="30" rx="6" fill="url(#goldGrad)"/>
        <text x="50" y="19" font-family="sans-serif" font-size="10" font-weight="800" fill="#000000" text-anchor="middle">EXPLORE</text>
      </g>
    </g>

    <!-- Floating Search Architecture Pill Mockup -->
    <g transform="translate(520, 40)" filter="url(#cardShadow)">
      <rect x="0" y="0" width="500" height="70" rx="35" fill="#0a0c10" fill-opacity="0.9" stroke="#334155" stroke-width="1.5"/>
      <text x="30" y="28" font-family="monospace" font-size="10" font-weight="700" fill="#64748b">LOCATION</text>
      <text x="30" y="48" font-family="sans-serif" font-size="13" font-weight="700" fill="#ffffff">Algarve, PT</text>

      <line x1="160" y1="18" x2="160" y2="52" stroke="#334155" stroke-width="1"/>

      <text x="180" y="28" font-family="monospace" font-size="10" font-weight="700" fill="#64748b">PRICE RANGE</text>
      <text x="180" y="48" font-family="sans-serif" font-size="13" font-weight="700" fill="#E5C158">€2M - €10M</text>

      <g transform="translate(360, 12)">
        <rect x="0" y="0" width="125" height="46" rx="23" fill="url(#goldGrad)"/>
        <text x="62" y="28" font-family="sans-serif" font-size="12" font-weight="800" fill="#000000" text-anchor="middle">SEARCH</text>
      </g>
    </g>
  </g>

  <!-- Bottom Showcase Footer Bar -->
  <g transform="translate(100, 960)">
    <text x="0" y="24" font-family="monospace" font-size="12" font-weight="800" fill="#E5C158" letter-spacing="3">DOMA UX/UI CASE STUDY</text>
    <text x="320" y="24" font-family="sans-serif" font-size="13" fill="#64748b">Single-Screen Concierge · Lifestyle Collections · Transparent Scheduling</text>
    <text x="1620" y="24" font-family="monospace" font-size="12" font-weight="800" fill="#ffffff" text-anchor="end">DESIGNED BY RUI GRANJA</text>
  </g>
</svg>`;

// Generate RAWPOWER 04-ui-screens SVG (1920x1080)
const rawpowerScreensSvg = `<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#09090b"/>
      <stop offset="50%" stop-color="#141417"/>
      <stop offset="100%" stop-color="#050507"/>
    </linearGradient>

    <linearGradient id="limeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#CCFF00"/>
      <stop offset="100%" stop-color="#a3e635"/>
    </linearGradient>

    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="15" stdDeviation="20" flood-color="#000000" flood-opacity="0.8"/>
    </filter>
  </defs>

  <rect width="1920" height="1080" fill="url(#bgGrad)"/>

  <!-- Grid overlay -->
  <g stroke="#27272a" stroke-width="1" stroke-opacity="0.4">
    <path d="M 0,200 L 1920,200 M 0,540 L 1920,540 M 0,880 L 1920,880" />
    <path d="M 480,0 L 480,1080 M 960,0 L 960,1080 M 1440,0 L 1440,1080" />
  </g>

  <!-- Title Header -->
  <g transform="translate(100, 80)">
    <rect x="0" y="0" width="180" height="32" rx="16" fill="#18181b" stroke="#27272a"/>
    <text x="90" y="21" font-family="monospace" font-size="11" font-weight="800" fill="#CCFF00" text-anchor="middle" letter-spacing="2">04 UI SCREENS</text>
    <text x="0" y="85" font-family="'Syne', sans-serif" font-size="48" font-weight="900" fill="#ffffff">RAWPOWER.AI CORE MOBILE INTERFACES</text>
    <text x="0" y="125" font-family="sans-serif" font-size="16" fill="#a1a1aa">High-fidelity screens for workout tracking, meal logging, AI trainer assistant &amp; analytics</text>
  </g>

  <!-- 4 Mobile Device Mockup Frames -->
  <!-- Screen 1: Dashboard -->
  <g transform="translate(120, 240)" filter="url(#shadow)">
    <rect x="0" y="0" width="360" height="740" rx="36" fill="#09090b" stroke="#27272a" stroke-width="3"/>
    <rect x="120" y="12" width="120" height="24" rx="12" fill="#18181b"/>
    <!-- Screen Content -->
    <rect x="20" y="50" width="320" height="660" rx="20" fill="#18181b"/>
    <text x="40" y="90" font-family="sans-serif" font-size="12" font-weight="800" fill="#CCFF00" letter-spacing="2">TODAY'S SUMMARY</text>
    <text x="40" y="120" font-family="'Syne', sans-serif" font-size="24" font-weight="900" fill="#ffffff">2,450 kcal</text>

    <!-- Ring Chart Mock -->
    <circle cx="200" cy="220" r="65" fill="none" stroke="#27272a" stroke-width="14"/>
    <circle cx="200" cy="220" r="65" fill="none" stroke="#CCFF00" stroke-width="14" stroke-dasharray="320 100"/>
    <text x="200" y="225" font-family="monospace" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle">78%</text>

    <!-- Workout Cards -->
    <rect x="40" y="320" width="280" height="80" rx="12" fill="#27272a"/>
    <text x="60" y="350" font-family="sans-serif" font-size="14" font-weight="800" fill="#ffffff">Hypertrophy Chest &amp; Arms</text>
    <text x="60" y="375" font-family="monospace" font-size="11" fill="#CCFF00">45 MIN · 420 KCAL</text>

    <rect x="40" y="420" width="280" height="80" rx="12" fill="#27272a"/>
    <text x="60" y="450" font-family="sans-serif" font-size="14" font-weight="800" fill="#ffffff">Post-Workout Recovery Shake</text>
    <text x="60" y="475" font-family="monospace" font-size="11" fill="#a1a1aa">42G PROTEIN · 2-TAP LOG</text>
  </g>

  <!-- Screen 2: AI Trainer Chat -->
  <g transform="translate(540, 240)" filter="url(#shadow)">
    <rect x="0" y="0" width="360" height="740" rx="36" fill="#09090b" stroke="#27272a" stroke-width="3"/>
    <rect x="120" y="12" width="120" height="24" rx="12" fill="#18181b"/>
    <rect x="20" y="50" width="320" height="660" rx="20" fill="#18181b"/>
    <text x="40" y="90" font-family="sans-serif" font-size="12" font-weight="800" fill="#CCFF00" letter-spacing="2">AI TRAINER</text>

    <!-- Chat Messages -->
    <rect x="40" y="120" width="220" height="70" rx="12" fill="#27272a"/>
    <text x="55" y="145" font-family="sans-serif" font-size="12" fill="#ffffff">What should I eat before my</text>
    <text x="55" y="165" font-family="sans-serif" font-size="12" fill="#ffffff">heavy leg session today?</text>

    <rect x="80" y="210" width="240" height="110" rx="12" fill="#3f3f46"/>
    <text x="95" y="235" font-family="sans-serif" font-size="12" font-weight="800" fill="#CCFF00">RECOMMENDED MACROS:</text>
    <text x="95" y="260" font-family="sans-serif" font-size="12" fill="#ffffff">60g Complex Carbs (Oats)</text>
    <text x="95" y="280" font-family="sans-serif" font-size="12" fill="#ffffff">30g Whey + 1 Banana</text>
    <text x="95" y="300" font-family="monospace" font-size="10" fill="#d4d4d8">350 kcal · 60m pre-workout</text>
  </g>

  <!-- Screen 3: Meal Logger -->
  <g transform="translate(960, 240)" filter="url(#shadow)">
    <rect x="0" y="0" width="360" height="740" rx="36" fill="#09090b" stroke="#27272a" stroke-width="3"/>
    <rect x="120" y="12" width="120" height="24" rx="12" fill="#18181b"/>
    <rect x="20" y="50" width="320" height="660" rx="20" fill="#18181b"/>
    <text x="40" y="90" font-family="sans-serif" font-size="12" font-weight="800" fill="#CCFF00" letter-spacing="2">FAST MEAL LOGGING</text>

    <rect x="40" y="120" width="280" height="50" rx="25" fill="#27272a"/>
    <text x="70" y="150" font-family="sans-serif" font-size="13" fill="#a1a1aa">Snap photo or voice log meal...</text>

    <rect x="40" y="190" width="280" height="180" rx="16" fill="#27272a"/>
    <text x="60" y="225" font-family="sans-serif" font-size="16" font-weight="800" fill="#ffffff">Grilled Salmon &amp; Quinoa</text>
    <text x="60" y="255" font-family="monospace" font-size="20" font-weight="900" fill="#CCFF00">580 KCAL</text>
    <text x="60" y="285" font-family="sans-serif" font-size="12" fill="#d4d4d8">P: 45g | C: 48g | F: 18g</text>

    <rect x="60" y="310" width="240" height="40" rx="8" fill="#CCFF00"/>
    <text x="180" y="335" font-family="sans-serif" font-size="12" font-weight="900" fill="#000000" text-anchor="middle">CONFIRM &amp; LOG</text>
  </g>

  <!-- Screen 4: Streak & Analytics -->
  <g transform="translate(1380, 240)" filter="url(#shadow)">
    <rect x="0" y="0" width="360" height="740" rx="36" fill="#09090b" stroke="#27272a" stroke-width="3"/>
    <rect x="120" y="12" width="120" height="24" rx="12" fill="#18181b"/>
    <rect x="20" y="50" width="320" height="660" rx="20" fill="#18181b"/>
    <text x="40" y="90" font-family="sans-serif" font-size="12" font-weight="800" fill="#CCFF00" letter-spacing="2">STREAK &amp; ANALYTICS</text>

    <rect x="40" y="120" width="280" height="90" rx="16" fill="#27272a"/>
    <text x="60" y="155" font-family="sans-serif" font-size="12" font-weight="700" fill="#a1a1aa">CURRENT STREAK</text>
    <text x="60" y="190" font-family="monospace" font-size="28" font-weight="900" fill="#CCFF00">14 DAYS 🔥</text>

    <!-- Bar chart mock -->
    <rect x="40" y="230" width="280" height="160" rx="16" fill="#27272a"/>
    <path d="M 60,350 L 100,310 L 140,330 L 180,270 L 220,290 L 260,250 L 300,240" fill="none" stroke="#CCFF00" stroke-width="3"/>
  </g>
</svg>`;

async function build() {
  const domaBuffer = Buffer.from(domaCoverSvg);
  const rawpowerBuffer = Buffer.from(rawpowerScreensSvg);

  const targets = [
    {
      srcBuffer: domaBuffer,
      paths: [
        'src/assets/images/projects/doma/01-cover.png',
        'src/assets/images/projects/doma/01-cover.jpg',
        'public/images/projects/doma/01-cover.png',
        'public/images/projects/doma/01-cover.jpg',
      ]
    },
    {
      srcBuffer: rawpowerBuffer,
      paths: [
        'src/assets/images/projects/rawpower/04-ui-screens.png',
        'public/images/projects/rawpower/04-ui-screens.png',
      ]
    }
  ];

  for (const target of targets) {
    for (const p of target.paths) {
      const dir = path.dirname(p);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (p.endsWith('.jpg')) {
        await sharp(target.srcBuffer)
          .jpeg({ quality: 95 })
          .toFile(p);
      } else {
        await sharp(target.srcBuffer)
          .png({ compressionLevel: 8 })
          .toFile(p);
      }
      console.log('Successfully written image to:', p);
    }
  }
}

build().catch(err => {
  console.error('Error building project images:', err);
  process.exit(1);
});
