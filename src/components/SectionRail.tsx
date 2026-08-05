import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useScroll, useSpring } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useLanguage } from '../contexts/LanguageContext';

export const SectionRail: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeId, setActiveId] = useState<string>('about');
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Smooth scroll progress spring
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const sections = [
    { id: 'about', number: '01', label: t.rail.sections.about },
    { id: 'experience', number: '02', label: t.rail.sections.experience },
    { id: 'education', number: '03', label: t.rail.sections.education },
    { id: 'projects', number: '04', label: t.rail.sections.projects },
    { id: 'languages-interests', number: '05', label: t.rail.sections.languagesInterests },
    { id: 'faqs', number: '06', label: t.rail.sections.faqs },
    { id: 'contact', number: '07', label: t.rail.sections.contact },
  ];

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sectionElements = sections
            .map(({ id }) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);

          if (sectionElements.length === 0) {
            ticking = false;
            return;
          }

          // Handle near-bottom of the page explicitly
          const scrollPosition = window.scrollY + window.innerHeight;
          const totalHeight = document.documentElement.scrollHeight;
          if (scrollPosition >= totalHeight - 100) {
            setActiveId(sections[sections.length - 1].id);
            ticking = false;
            return;
          }

          // Find section whose top is closest/before 35% of the viewport height
          const triggerPoint = window.innerHeight * 0.35;
          let currentActiveId = sections[0].id;

          for (const el of sectionElements) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= triggerPoint) {
              currentActiveId = el.id;
            } else {
              break;
            }
          }

          setActiveId(currentActiveId);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [language]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
      setActiveId(id);
      const targetSec = sections.find((s) => s.id === id);
      if (targetSec) {
        const msg = language === 'pt' ? `Navegou para a secção: ${targetSec.label}` : `Navigated to section: ${targetSec.label}`;
        window.dispatchEvent(new CustomEvent('announce', { detail: msg }));
      }
    }
  };

  const activeSection = sections.find((s) => s.id === activeId) || sections[0];

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Mobile Active Section Breadcrumb Pill */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 no-print pointer-events-auto max-w-[calc(100vw-32px)]">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-200/90 dark:border-zinc-800/90 shadow-xl text-xs font-mono font-bold max-w-full"
        >
          <span className="text-[#5E7800] dark:text-[#CCFF00] shrink-0">
            {activeSection.number}/{sections.length.toString().padStart(2, '0')}
          </span>
          <span className="text-zinc-400 dark:text-zinc-600 shrink-0">•</span>
          <span className="text-zinc-800 dark:text-zinc-200 font-semibold truncate max-w-[120px] xs:max-w-[160px]">
            {activeSection.label}
          </span>
        </motion.div>
      </div>

      {/* Desktop Section Navigation Rail */}
      <aside
        aria-label="Section navigation"
        className="hidden lg:flex fixed right-4 xl:right-8 top-1/2 -translate-y-1/2 z-50 no-print flex-col items-end pointer-events-auto"
      >
        <div className="flex items-center gap-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xl transition-all">
          {/* Continuous Smooth Spring Vertical Scroll Progress Rail Line */}
          <div className="relative w-[3px] h-[220px] bg-zinc-200/80 dark:bg-zinc-800/80 rounded-full overflow-hidden self-center">
            <motion.div
              className="w-full h-full bg-[#5E7800] dark:bg-[#CCFF00] rounded-full origin-top shadow-[0_0_8px_rgba(204,255,0,0.6)]"
              style={{ scaleY }}
            />
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {/* Active Section Step Counter */}
            <div className="w-full pb-2 mb-1 border-b border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-end text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-[#5E7800] dark:text-[#CCFF00] font-bold">
                <span>{activeSection.number} / {sections.length.toString().padStart(2, '0')}</span>
              </span>
            </div>

            {/* Section Item Links */}
            <div className="flex flex-col items-end gap-1">
              {sections.map(({ id, number, label }) => {
                const isActive = activeId === id;
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={(e) => handleClick(e, id)}
                    className="group relative flex items-center gap-2.5 py-1 px-2 cursor-pointer rounded-lg transition-colors"
                    aria-label={`${t.rail.scrollTo} ${label}`}
                    aria-current={isActive ? 'location' : undefined}
                  >
                    {/* Tooltip Label on Hover */}
                    <span className="absolute right-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none text-[11px] font-mono font-semibold text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 rounded-lg shadow-md whitespace-nowrap z-10">
                      <span className="text-[#5E7800] dark:text-[#CCFF00] font-bold mr-1.5">{number}</span>
                      {label}
                    </span>

                    {/* Number */}
                    <span
                      className={`text-[11px] font-mono font-extrabold transition-colors duration-200 relative z-10 ${
                        isActive
                          ? 'text-[#5E7800] dark:text-[#CCFF00]'
                          : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-200'
                      }`}
                    >
                      {number}
                    </span>

                    {/* Active Fluid Sliding Pill/Dot */}
                    <div className="relative w-5 h-2 flex items-center justify-center">
                      {isActive ? (
                        <motion.div
                          layoutId="activeSectionIndicator"
                          className="w-5 h-1.5 rounded-full bg-[#5E7800] dark:bg-[#CCFF00] shadow-[0_0_8px_rgba(94,120,0,0.4)] dark:shadow-[0_0_8px_rgba(204,255,0,0.6)]"
                          transition={{
                            type: 'spring',
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 group-hover:bg-zinc-400 dark:group-hover:bg-zinc-500 transition-colors" />
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </>,
    document.body
  );
};

