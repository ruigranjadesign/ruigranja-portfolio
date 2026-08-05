import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileCode, Menu, X, ArrowUpRight, Sparkles, FileDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ThemeToggle } from './ThemeToggle';
import { downloadCv } from '../utils/cvDownloader';

interface NavbarProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  language?: 'en' | 'pt';
  onToggleLanguage?: () => void;
  email?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleTheme,
  language: propLanguage,
  onToggleLanguage,
}) => {
  const { language: ctxLanguage, toggleLanguage: ctxToggleLanguage, t } = useLanguage();
  const currentLanguage = propLanguage || ctxLanguage;
  const handleToggleLanguage = onToggleLanguage || ctxToggleLanguage;
  const isEn = currentLanguage === 'en';

  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('header');
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Links list
  const navLinks = [
    { id: 'about', label: isEn ? 'About' : 'Sobre' },
    { id: 'experience', label: isEn ? 'Experience' : 'Experiência' },
    { id: 'education', label: isEn ? 'Education' : 'Educação' },
    { id: 'projects', label: isEn ? 'Projects' : 'Projetos' },
    { id: 'faqs', label: 'FAQ' },
    { id: 'pre-footer', label: isEn ? 'Contact' : 'Contacto' },
  ];

  // Active section detection on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 80);

      const sections = ['header', 'about', 'experience', 'education', 'projects', 'languages-interests', 'faqs', 'pre-footer'];
      const scrollPosition = scrollY + 180;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i]);
        if (sectionEl && sectionEl.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll on mobile when floating corner hub is open
  useEffect(() => {
    const checkAndToggleScrollLock = () => {
      const isMobile = window.matchMedia('(max-width: 639px)').matches;
      if (isOpen && isMobile) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    checkAndToggleScrollLock();

    window.addEventListener('resize', checkAndToggleScrollLock);
    return () => {
      window.removeEventListener('resize', checkAndToggleScrollLock);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on click/tap outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Magnetic hover handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = (e.clientX - centerX) * 0.15;
      const distY = (e.clientY - centerY) * 0.15;
      setMagneticOffset({ x: distX, y: distY });
    }
  };

  const handleMouseEnter = () => {
    // Only open on hover on desktop devices with hover capability
    if (window.matchMedia('(hover: hover)').matches) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setMagneticOffset({ x: 0, y: 0 });
    // Only auto-collapse on hover leave on desktop devices
    if (window.matchMedia('(hover: hover)').matches) {
      setIsOpen(false);
    }
  };

  const onLanguageClick = () => {
    handleToggleLanguage();
    const nextLang = currentLanguage === 'en' ? 'pt' : 'en';
    const msg = nextLang === 'pt' ? 'Idioma alterado para Português' : 'Language changed to English';
    window.dispatchEvent(new CustomEvent('announce', { detail: msg }));
  };

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    if (id === 'header') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 1. ORIGINAL TOP NAVBAR (Scrolls naturally with the page) */}
      <nav className="relative z-40 px-4 sm:px-6 md:px-12 h-16 md:h-20 flex items-center no-print transition-colors duration-200 max-w-full overflow-hidden">
        <div className="w-full max-w-4xl mx-auto flex items-center justify-between gap-3 md:gap-4">
          {/* Brand / Logo */}
          <a
            href="#header"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('header');
            }}
            className="flex items-center min-w-[44px] min-h-[44px] group cursor-pointer"
            aria-label="Rui Granja - Home"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 606 604"
              className="h-[30px] sm:h-[34px] w-auto transition-transform duration-200 group-hover:scale-105 shrink-0"
            >
              <g transform="translate(0.000000,604.000000) scale(0.100000,-0.100000)">
                <path
                  d="M17 6023 c-4 -3 -7 -855 -7 -1892 l0 -1886 348 -336 c351 -339 554 -529 566 -529 3 0 6 844 6 1875 l0 1875 1078 0 c1193 0 1128 3 1270 -66 232 -113 358 -365 307 -615 -39 -192 -156 -344 -330 -425 -140 -65 -129 -64 -816 -65 -343 -1 -773 -5 -956 -8 l-332 -6 60 -99 c33 -55 144 -226 246 -380 102 -155 311 -474 463 -711 329 -512 470 -729 653 -1008 l136 -207 571 0 c313 0 570 2 570 5 0 3 -61 99 -137 213 -393 597 -803 1222 -826 1263 l-27 46 212 6 c236 6 335 20 480 68 500 168 872 597 990 1143 29 134 31 414 5 551 -70 359 -244 675 -483 873 -215 180 -468 286 -742 312 -119 11 -3294 14 -3305 3z"
                  className="fill-zinc-900 dark:fill-zinc-50 transition-colors duration-200"
                />
                <path
                  d="M1397 2984 c-69 -138 -130 -333 -158 -509 -22 -132 -17 -416 10 -569 101 -579 438 -1117 916 -1462 415 -301 982 -462 1548 -440 209 8 351 27 535 72 183 45 287 81 447 158 247 119 448 260 636 446 362 359 574 785 670 1343 16 95 59 436 59 469 0 5 -572 8 -1270 8 l-1271 0 293 -439 293 -440 428 0 429 -1 -27 -47 c-52 -91 -167 -234 -254 -314 -219 -204 -496 -338 -806 -389 -167 -28 -423 -24 -576 9 -296 64 -568 209 -764 407 -124 126 -257 321 -301 443 -62 171 -86 215 -230 431 -83 124 -242 365 -353 535 -112 171 -209 316 -216 324 -11 11 -17 6 -38 -35z"
                  className="fill-zinc-900 dark:fill-zinc-50 transition-colors duration-200"
                />
              </g>
            </svg>
          </a>

          {/* Right Actions: Download CV + Theme Toggle + Language Toggle + "for agents" Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/Rui_Granja_CV.pdf"
              download="Rui_Granja_CV.pdf"
              onClick={(e) => {
                e.preventDefault();
                downloadCv();
              }}
              aria-label={isEn ? "Download Rui Granja's Curriculum Vitae in PDF" : "Descarregar Currículo Vitae de Rui Granja em PDF"}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 hover:border-[#5E7800] dark:hover:border-[#CCFF00] hover:text-[#5E7800] dark:hover:text-[#CCFF00] hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all active:scale-95 duration-100 cursor-pointer shrink-0 shadow-2xs"
              title={isEn ? "Download CV (PDF)" : "Descarregar CV (PDF)"}
            >
              <FileDown className="w-3.5 h-3.5 text-[#5E7800] dark:text-[#CCFF00] shrink-0" />
              <span>CV</span>
            </a>

            <ThemeToggle
              darkMode={darkMode}
              onToggleTheme={onToggleTheme}
              title={t.nav.toggleTheme}
            />

            <button
              onClick={onLanguageClick}
              id="language-toggle"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-[#CCFF00] hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all active:scale-90 duration-100 cursor-pointer font-mono text-xs font-extrabold tracking-wider select-none shrink-0"
              title={isEn ? 'Switch to Portuguese' : 'Mudar para inglês'}
              aria-label={isEn ? 'Switch to Portuguese' : 'Mudar para inglês'}
            >
              {isEn ? 'EN' : 'PT'}
            </button>

            <a
              href="/llms.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-[#CCFF00] dark:hover:text-[#CCFF00] hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all active:scale-95 duration-100 cursor-pointer shrink-0"
              title={t.nav.forAgentsTitle}
            >
              <FileCode className="w-3.5 h-3.5 text-zinc-500 dark:text-[#CCFF00] shrink-0" />
              <span>{t.nav.forAgents}</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile Backdrop Overlay + Blur when Floating Badge is Expanded */}
      <AnimatePresence>
        {isScrolled && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 dark:bg-black/70 backdrop-blur-md sm:hidden cursor-pointer"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* 2. FLOATING CORNER HUB / BADGE MAGNÉTICO (Subtle & Ultra-Compact, Appears ONLY on Scroll) */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            className="fixed top-3 right-3 sm:top-4 sm:right-7 md:right-8 z-50 no-print max-w-[calc(100vw-24px)]"
          >
            <motion.div
              animate={{
                x: magneticOffset.x,
                y: magneticOffset.y,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative max-w-full"
            >
              {/* Glassmorphic Hub Pill */}
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="relative flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 rounded-full border backdrop-blur-xl bg-zinc-950/90 text-zinc-100 border-white/15 shadow-xl shadow-black/40 max-w-full overflow-hidden"
              >
                {/* Brand / Status Badge Button */}
                <button
                  onClick={() => setIsOpen((prev) => !prev)}
                  className="flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer select-none group min-h-[28px] sm:min-h-[30px] shrink-0"
                  aria-label="Toggle Corner Hub"
                  aria-expanded={isOpen}
                >
                  <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500" />
                  </span>

                  <span className="font-syne font-black text-[10px] sm:text-[11px] uppercase tracking-wider text-white">
                    <span className={isOpen ? 'hidden sm:inline' : 'inline'}>RUI GRANJA</span>
                    <span className={isOpen ? 'inline sm:hidden' : 'hidden'}>RUI</span>
                  </span>

                  {/* Subtle chevron toggle */}
                  <span className="text-zinc-400 group-hover:text-white transition-transform duration-200">
                    {isOpen ? <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <Menu className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                  </span>
                </button>

                {/* Compact Expansion Controls (CV, Theme, Language, Agents) */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto no-scrollbar pr-0.5 shrink-0 max-w-full"
                    >
                      <div className="h-3 w-px bg-white/20 mx-0.5 shrink-0" />

                      <a
                        href="/Rui_Granja_CV.pdf"
                        download="Rui_Granja_CV.pdf"
                        onClick={(e) => {
                          e.preventDefault();
                          downloadCv();
                        }}
                        aria-label={isEn ? "Download Rui Granja's Curriculum Vitae in PDF" : "Descarregar Currículo Vitae de Rui Granja em PDF"}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold text-[#CCFF00] hover:bg-white/10 transition-all shrink-0 cursor-pointer"
                        title={isEn ? 'Download CV (PDF)' : 'Descarregar CV (PDF)'}
                      >
                        <FileDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#CCFF00] shrink-0" />
                        <span className="whitespace-nowrap">CV</span>
                      </a>

                      <div className="scale-90 origin-center shrink-0">
                        <ThemeToggle
                          darkMode={darkMode}
                          onToggleTheme={onToggleTheme}
                          title={t.nav.toggleTheme}
                        />
                      </div>

                      <button
                        onClick={onLanguageClick}
                        className="px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-extrabold text-zinc-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
                        title={isEn ? 'Switch to Portuguese' : 'Mudar para inglês'}
                      >
                        {isEn ? 'EN' : 'PT'}
                      </button>

                      <a
                        href="/llms.txt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold text-emerald-400 hover:bg-white/10 transition-all shrink-0"
                        title={t.nav.forAgentsTitle}
                      >
                        <FileCode className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                        <span className="whitespace-nowrap">{t.nav.forAgents}</span>
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

