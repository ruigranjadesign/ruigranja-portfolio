import fs from 'fs';
import path from 'path';

const outputDir = path.join(process.cwd(), 'src/assets/images/projects/rawpower');
const publicOutputDir = path.join(process.cwd(), 'public/src/assets/images/projects/rawpower');

[outputDir, publicOutputDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const slides = [
  {
    filename: '01-cover.jpg',
    title: 'RAWPOWER.AI',
    subtitle: 'FITNESS & NUTRITION APP',
    tag: '01 COVER',
    desc: 'AI-Powered Personalization & Micro-Interactions'
  },
  {
    filename: '02-about.jpg',
    title: 'ABOUT THE PROJECT',
    subtitle: 'DESIGN PROCESS & VISION',
    tag: '02 ABOUT',
    desc: 'Empowering users through data-driven habit building'
  },
  {
    filename: '03-story.jpg',
    title: 'BRAND STORY',
    subtitle: 'POSITIONING & ETHOS',
    tag: '03 STORY',
    desc: 'Raw strength meets intelligent nutritional feedback'
  },
  {
    filename: '04-styleguide.jpg',
    title: 'STYLE GUIDE',
    subtitle: 'COLORS, TYPOGRAPHY & TOKENS',
    tag: '04 STYLEGUIDE',
    desc: 'Lime accent #CCFF00, Syne & Inter typography, dark UI foundation'
  },
  {
    filename: '05-wireframes.jpg',
    title: 'WIREFRAMES',
    subtitle: 'INFORMATION ARCHITECTURE',
    tag: '05 WIREFRAMES',
    desc: 'Low-fidelity flows for meal logging & workout tracking'
  },
  {
    filename: '06-screens.jpg',
    title: 'CORE UI SCREENS',
    subtitle: 'MOBILE INTERFACE HIGHLIGHTS',
    tag: '06 SCREENS',
    desc: 'Dashboard, Macro breakdown, AI trainer chat, & Streak counter'
  },
  {
    filename: '07-components.jpg',
    title: 'DESIGN SYSTEM',
    subtitle: 'FIGMA COMPONENTS & VARIANTS',
    tag: '07 COMPONENTS',
    desc: 'Modular buttons, cards, progress rings, and navigation'
  },
  {
    filename: '08-conclusion.jpg',
    title: 'OUTCOMES & IMPACT',
    subtitle: 'LEARNINGS & NEXT STEPS',
    tag: '08 CONCLUSION',
    desc: '2-tap interaction flow, 98% usability score, scalable architecture'
  }
];

slides.forEach((slide) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#09090b"/>
        <stop offset="50%" stop-color="#18181b"/>
        <stop offset="100%" stop-color="#050505"/>
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#CCFF00"/>
        <stop offset="100%" stop-color="#84cc16"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#bgGrad)"/>
    <rect x="40" y="40" width="1120" height="720" rx="16" fill="none" stroke="#27272a" stroke-width="2"/>
    
    <!-- Top badge -->
    <rect x="80" y="80" width="160" height="36" rx="4" fill="#18181b" stroke="#3f3f46"/>
    <text x="160" y="103" font-family="monospace" font-size="14" font-weight="bold" fill="#CCFF00" text-anchor="middle" letter-spacing="2">${slide.tag}</text>
    
    <!-- Center Content -->
    <text x="80" y="240" font-family="system-ui, sans-serif" font-size="20" font-weight="800" fill="#CCFF00" letter-spacing="4">${slide.subtitle}</text>
    <text x="80" y="320" font-family="system-ui, sans-serif" font-size="56" font-weight="900" fill="#ffffff" letter-spacing="-1">${slide.title}</text>
    <text x="80" y="380" font-family="system-ui, sans-serif" font-size="24" font-weight="400" fill="#a1a1aa">${slide.desc}</text>

    <!-- Decorative Mock UI Wireframe Elements -->
    <rect x="80" y="440" width="1040" height="260" rx="12" fill="#09090b" stroke="#27272a" stroke-width="1.5"/>
    <rect x="120" y="480" width="280" height="180" rx="8" fill="#18181b" stroke="#3f3f46"/>
    <rect x="430" y="480" width="280" height="180" rx="8" fill="#18181b" stroke="#3f3f46"/>
    <rect x="740" y="480" width="340" height="180" rx="8" fill="#18181b" stroke="#3f3f46"/>

    <!-- Accent highlights -->
    <circle cx="160" cy="530" r="24" fill="#CCFF00" opacity="0.2" />
    <circle cx="160" cy="530" r="12" fill="#CCFF00" />
    <rect x="200" y="520" width="160" height="12" rx="3" fill="#a1a1aa" />
    <rect x="200" y="540" width="100" height="10" rx="2" fill="#52525b" />

    <rect x="460" y="520" width="220" height="12" rx="3" fill="#CCFF00" />
    <rect x="460" y="545" width="180" height="10" rx="2" fill="#52525b" />
    <rect x="460" y="565" width="140" height="10" rx="2" fill="#3f3f46" />

    <path d="M780 610 Q 840 520, 900 560 T 1020 500" fill="none" stroke="#CCFF00" stroke-width="4" />
  </svg>`;

  fs.writeFileSync(path.join(outputDir, slide.filename), svg);
  fs.writeFileSync(path.join(publicOutputDir, slide.filename), svg);
});

console.log('Successfully generated gallery images!');
