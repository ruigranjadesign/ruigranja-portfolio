import React, { useState, useEffect, useRef } from 'react';
import { WorkExperience } from '../types';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { SectionHeader } from './SectionHeader';
import { useLanguage } from '../contexts/LanguageContext';
import { staggerContainerVariants, staggerItemVariants } from '../utils/animationVariants';

interface ExperienceSectionProps {
  experiences: WorkExperience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  const { t, language } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.1 });

  const rotatingWords = t.experience.rotatingWords;
  const [wordIndex, setWordIndex] = useState(0);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Smoothly rotate words every 3 seconds when in view
  useEffect(() => {
    if (!isInView || rotatingWords.length <= 1) return;

    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isInView, rotatingWords.length]);

  const currentWord = rotatingWords[wordIndex % rotatingWords.length] || (language === 'pt' ? 'PROFISSIONAL' : 'EXPERIENCE');

  return (
    <section id="experience" ref={sectionRef} className="scroll-mt-24">
      <SectionHeader
        badge={t.experience.badge}
        title={t.experience.titlePrefix || (language === 'pt' ? 'EXPERIÊNCIA' : 'WORK')}
        highlightWord={currentWord}
        highlightOnNewLine={true}
        description={
          t.experience.tagline ? (
            <p className="font-syne text-[14px] sm:text-[15px] font-medium text-zinc-700 dark:text-zinc-300 max-w-[72ch] border-l-2 border-lime-500 dark:border-[#CCFF00] pl-4 py-2 bg-lime-500/5 dark:bg-[#CCFF00]/5 rounded-r-lg break-words">
              "{t.experience.tagline}"
            </p>
          ) : undefined
        }
        className="mb-8 md:mb-12"
      />

      <motion.div
        className="space-y-8 md:space-y-10 max-w-full"
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {experiences.map((exp) => {
          const isExpanded = !!expandedIds[exp.id];
          const hasHighlights = exp.highlights && exp.highlights.length > 0;
          const isCurrent = exp.period.toLowerCase().includes('present') || exp.period.toLowerCase().includes('presente');

          return (
            <motion.div
              key={exp.id}
              variants={staggerItemVariants}
              className={`group relative space-y-3 print-break-inside-avoid border-l-2 pl-4 sm:pl-6 md:pl-8 transition-colors py-2 max-w-full ${
                isCurrent
                  ? 'border-lime-500/80 dark:border-[#CCFF00] hover:border-lime-500 dark:hover:border-[#CCFF00]'
                  : 'border-zinc-200 dark:border-zinc-800/90 hover:border-lime-500 dark:hover:border-[#CCFF00]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-full">
                <h3 className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-syne font-bold text-[14px] sm:text-[16px] text-zinc-900 dark:text-zinc-50 uppercase tracking-tight break-words max-w-full min-w-0">
                  <span className="break-words">{exp.company}</span>
                  <span className="text-xs font-mono font-normal text-zinc-400 dark:text-zinc-500 break-words">
                    / {exp.location} ({exp.employmentType})
                  </span>
                </h3>
                <div className="flex items-center gap-2 shrink-0 max-w-full flex-wrap">
                  <div
                    className={`font-mono text-[10px] sm:text-[11px] font-bold px-2.5 py-1 sm:px-3 rounded-full border flex items-center gap-1.5 max-w-full flex-wrap break-words ${
                      isCurrent
                        ? 'text-zinc-900 dark:text-[#CCFF00] bg-lime-500/10 dark:bg-[#CCFF00]/10 border-lime-500/40 dark:border-[#CCFF00]/40'
                        : 'text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    <span>{exp.period}</span>
                  </div>
                  {hasHighlights && (
                    <button
                      onClick={() => toggleExpand(exp.id)}
                      className="no-print inline-flex items-center justify-center gap-1.5 px-3 py-1.5 min-h-[44px] min-w-[44px] rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-[#CCFF00] hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? t.experience.collapseDetails : t.experience.expandDetails}
                    >
                      <span className="hidden sm:inline">{isExpanded ? t.experience.less : t.experience.more}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-300 text-lime-600 dark:text-[#CCFF00] ${
                          isExpanded ? 'rotate-180' : 'rotate-0'
                        }`}
                      />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="text-[12px] font-mono text-lime-600 dark:text-[#CCFF00] font-extrabold uppercase tracking-wider">
                  {exp.role}
                </div>
              </div>

              <p className="text-[14px] text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-[65ch] pt-1.5 whitespace-pre-line font-sans">
                {exp.description}
              </p>

              {hasHighlights && (
                <>
                  {/* Interactive accordion view for screen */}
                  <div className="no-print">
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key="highlights-accordion"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                          style={{ overflow: isExpanded ? 'visible' : 'hidden' }}
                          className="w-full"
                        >
                          <ul className="pt-3 space-y-2 text-[13px] text-zinc-600 dark:text-zinc-300 font-sans pl-1 border-t border-zinc-100 dark:border-zinc-900/60 mt-3">
                            {exp.highlights.map((item, idx) => (
                              <li key={idx} className="leading-relaxed flex items-start gap-2">
                                <span className="text-lime-500 dark:text-[#CCFF00] font-mono font-bold text-xs select-none mt-0.5">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Print fallback to ensure highlights are rendered when printing */}
                  <div className="hidden print:block">
                    <ul className="pt-3 space-y-2 text-[13px] text-zinc-600 dark:text-zinc-300 font-sans pl-1 border-t border-zinc-100 dark:border-zinc-900/60 mt-3">
                      {exp.highlights.map((item, idx) => (
                        <li key={idx} className="leading-relaxed flex items-start gap-2">
                          <span className="text-lime-500 dark:text-[#CCFF00] font-mono font-bold text-xs select-none">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

