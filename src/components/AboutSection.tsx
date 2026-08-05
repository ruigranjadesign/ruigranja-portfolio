import React, { useState, useMemo } from 'react';
import { SkillCategory } from '../types';
import { Sparkles, MousePointerClick } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { ScrollRevealText } from './ScrollRevealText';
import { useLanguage } from '../contexts/LanguageContext';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { SectionHeader } from './SectionHeader';

interface SkillTab {
  id: string;
  label: string;
  categoryName?: string;
  skills?: string[];
}

interface AboutSectionProps {
  about: string;
  skillCategories: SkillCategory[];
}

export const AboutSection: React.FC<AboutSectionProps> = ({ about, skillCategories }) => {
  const { t, language } = useLanguage();
  const sectionRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.1 });
  const prefersReducedMotion = useReducedMotion();

  const [wordIndex, setWordIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<string>('cat-0');

  const rotatingWords = t.about.rotatingWords;
  const currentWord = rotatingWords[wordIndex % rotatingWords.length] || rotatingWords[0] || 'APPROACH';

  // Smoothly rotate specialties every 3 seconds when in view
  React.useEffect(() => {
    if (!isInView || rotatingWords.length <= 1) return;

    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isInView, rotatingWords.length]);

  const customEasing = [0.25, 0.1, 0.25, 1] as const;

  // Build tabs: categories in skillCategories + "ALL" at the end
  const tabs = useMemo<SkillTab[]>(() => {
    const allTabLabel = language === 'pt' ? 'TODAS' : 'ALL';
    return [
      ...skillCategories.map((cat, idx) => ({
        id: `cat-${idx}`,
        label: cat.category,
        categoryName: cat.category,
        skills: cat.skills,
      })),
      { id: 'ALL', label: allTabLabel },
    ];
  }, [skillCategories, language]);

  // Compute displayed skills according to selected activeTab
  const displayedSkills = useMemo(() => {
    if (activeTab === 'ALL') {
      return skillCategories.flatMap((cat) =>
        cat.skills.map((skill) => ({
          name: skill,
          category: cat.category,
        }))
      );
    }
    const matchedTab = tabs.find((tab) => tab.id === activeTab);
    if (matchedTab && matchedTab.skills) {
      return matchedTab.skills.map((skill) => ({
        name: skill,
        category: matchedTab.categoryName || '',
      }));
    }
    return skillCategories.flatMap((cat) =>
      cat.skills.map((skill) => ({
        name: skill,
        category: cat.category,
      }))
    );
  }, [activeTab, skillCategories, tabs]);

  // Stagger animation variants for skill badges
  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.035,
        delayChildren: 0.02,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.12 },
    },
  };

  const staggerItemVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 10,
      scale: prefersReducedMotion ? 1 : 0.95,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 350,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : -6,
      scale: 0.96,
      transition: { duration: 0.1 },
    },
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center py-10 sm:py-14 md:py-16 px-5 sm:px-8 md:px-10 print-break-inside-avoid scroll-mt-24"
    >
      {/* Decorative Corner Glow Blobs */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -30 }}
        whileInView={{ opacity: 0.2, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1, ease: customEasing }}
        className="pointer-events-none absolute top-4 left-4 w-96 h-96 rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-[#5E7800]/30 via-[#5E7800]/05 to-transparent dark:from-[#CCFF00]/20 dark:via-[#CCFF00]/03 dark:to-transparent blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 30 }}
        whileInView={{ opacity: 0.2, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.15, ease: customEasing }}
        className="pointer-events-none absolute top-4 right-4 w-96 h-96 rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-[#5E7800]/30 via-[#5E7800]/05 to-transparent dark:from-[#CCFF00]/20 dark:via-[#CCFF00]/03 dark:to-transparent blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -30 }}
        whileInView={{ opacity: 0.2, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: customEasing }}
        className="pointer-events-none absolute bottom-4 left-4 w-96 h-96 rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-[#5E7800]/30 via-[#5E7800]/05 to-transparent dark:from-[#CCFF00]/20 dark:via-[#CCFF00]/03 dark:to-transparent blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 30 }}
        whileInView={{ opacity: 0.2, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.25, ease: customEasing }}
        className="pointer-events-none absolute bottom-4 right-4 w-96 h-96 rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-[#5E7800]/30 via-[#5E7800]/05 to-transparent dark:from-[#CCFF00]/20 dark:via-[#CCFF00]/03 dark:to-transparent blur-3xl"
      />

      <div className="relative z-10 max-w-full">
        <div className="w-full max-w-full min-w-0">
          {/* Main Heading with SectionHeader */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: customEasing }}
          >
            <SectionHeader
              badge={t.about.badge}
              title={t.about.titlePrefix}
              highlightWord={currentWord}
              className="mb-10 sm:mb-14 md:mb-16"
            />
          </motion.div>

          {/* Paragraph with ScrollRevealText */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: customEasing }}
            className="mb-16 sm:mb-20 md:mb-24 py-1.5 max-w-[72ch]"
          >
            <ScrollRevealText
              text={about}
              className="leading-relaxed font-sans font-medium break-words"
              style={{ fontSize: 'clamp(1rem, 1.6vw, 1.2rem)' }}
            />
          </motion.div>
        </div>
      </div>

      {/* Skills & Competencies Module (div#skills) */}
      <div id="skills" className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-zinc-200 dark:border-zinc-800/80 no-print transition-colors duration-200">
        {/* Cabeçalho & Micro-cópia Interativa (div#skills > div:first-child) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <h3 className="font-mono text-[10px] font-extrabold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#5E7800] dark:text-[#CCFF00]" />
            {t.about.skillsBadge}
          </h3>

          <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100/60 dark:bg-zinc-800/40 px-2.5 py-1 rounded-full border border-zinc-200/60 dark:border-zinc-800/60 w-fit">
            <MousePointerClick className="w-3.5 h-3.5 text-[#5E7800] dark:text-[#CCFF00] animate-bounce" />
            <span>{t.about.clickToDiscover || (language === 'pt' ? 'Clique para descobrir' : 'Click to discover')}</span>
          </div>
        </div>

        {/* Barra de Abas Dinâmicas (Navegação por Categoria - Pill Control) */}
        <div className="p-1.5 rounded-xl bg-zinc-100/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xs flex flex-wrap gap-1.5 mb-6 sm:mb-8 max-w-full">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-colors duration-200 z-10 max-w-full break-words ${
                  isActive
                    ? 'text-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSkillTab"
                    className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-lg shadow-xs border border-zinc-200/80 dark:border-zinc-700/60 -z-10"
                    transition={
                      prefersReducedMotion
                        ? { duration: 0.1 }
                        : { type: 'spring', stiffness: 400, damping: 30 }
                    }
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Grelha de Badges de Skills (Animação Sequencial / Stagger) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={staggerContainerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex flex-wrap gap-2 sm:gap-2.5 max-w-full"
          >
            {displayedSkills.map((item, idx) => (
              <motion.div
                key={`${item.name}-${idx}`}
                variants={staggerItemVariants}
                className="group relative flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-200 shadow-2xs hover:shadow-xs cursor-default max-w-full break-words"
              >
                <span className="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                  {item.name}
                </span>
                {activeTab === 'ALL' && (
                  <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 uppercase tracking-tight opacity-75">
                    {item.category}
                  </span>
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

