import React, { useState, useEffect, useRef } from 'react';
import { Education, OngoingCourse } from '../types';
import { Award, ExternalLink, CheckCircle2, ChevronDown } from 'lucide-react';
import { useInView, motion, AnimatePresence } from 'motion/react';
import { InstitutionLogo, mavenImgMobile } from './InstitutionLogos';
import { AnimatedCounter } from './AnimatedCounter';
import { SectionHeader } from './SectionHeader';
import { ongoingCoursesData } from '../data/portfolioData';
import { useLanguage } from '../contexts/LanguageContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

const renderParsedCount = (str: string) => {
  const match = str.match(/^(\d+)\s*(.*)$/);
  if (!match) return str;
  const num = parseInt(match[1], 10);
  const label = match[2];
  return (
    <>
      <AnimatedCounter value={num} suffix=" " />
      {label}
    </>
  );
};

const renderParsedGrade = (gradeStr: string) => {
  const match = gradeStr.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (!match) return gradeStr;
  const numerator = parseInt(match[1], 10);
  const denominator = match[2];
  return <AnimatedCounter value={numerator} suffix={`/${denominator}`} />;
};

interface EducationSectionProps {
  educationList: Education[];
  ongoingCourses?: OngoingCourse[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  educationList,
  ongoingCourses = ongoingCoursesData,
}) => {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.1 });

  const rotatingPhrases = t.education.rotatingPhrases;
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isCertificatesExpanded, setIsCertificatesExpanded] = useState(false);
  const [isOngoingOpen, setIsOngoingOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Hover state for certificates "Focus & Shrink" physics
  const [hoveredCertId, setHoveredCertId] = useState<string | null>(null);
  const [isDesktopHover, setIsDesktopHover] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsDesktopHover(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDesktopHover(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  const handleCourseImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, courseId: string) => {
    const img = e.currentTarget;
    const stage = img.dataset.fallbackStage || '0';

    if (stage === '0') {
      img.dataset.fallbackStage = '1';
      if (img.src.includes('.png')) {
        img.src = img.src.replace('.png', '.jpg');
        return;
      }
      if (img.src.includes('.jpg')) {
        img.src = img.src.replace('.jpg', '.png');
        return;
      }
    }

    setImageErrors((prev) => ({ ...prev, [courseId]: true }));
  };

  // Smoothly rotate phrases every 3 seconds when in view
  useEffect(() => {
    if (!isInView || rotatingPhrases.length <= 1) return;

    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % rotatingPhrases.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isInView, rotatingPhrases.length]);

  const currentPhrase = rotatingPhrases[phraseIndex % rotatingPhrases.length] || 'EDUCATION & DEGREES';

  const primaryCertificates = educationList.slice(0, 2);
  const additionalCertificates = educationList.slice(2);

  const renderEducationCard = (edu: Education) => {
    const isHovered = hoveredCertId === edu.id;
    const isAnyHovered = hoveredCertId !== null;
    const activeHover = isDesktopHover && !shouldReduceMotion;

    const targetScale = activeHover && isAnyHovered ? (isHovered ? 1.03 : 0.97) : 1;
    const targetOpacity = activeHover && isAnyHovered ? (isHovered ? 1 : 0.7) : 1;
    const targetZIndex = isHovered ? 20 : 1;

    return (
      <motion.div
        key={edu.id}
        onMouseEnter={() => {
          if (activeHover) setHoveredCertId(edu.id);
        }}
        onMouseLeave={() => {
          if (activeHover) setHoveredCertId(null);
        }}
        onFocus={() => {
          if (activeHover) setHoveredCertId(edu.id);
        }}
        onBlur={() => {
          if (activeHover) setHoveredCertId(null);
        }}
        animate={{
          scale: targetScale,
          opacity: targetOpacity,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
          mass: 0.8,
        }}
        style={{
          zIndex: targetZIndex,
          position: 'relative',
          transformOrigin: 'center center',
        }}
        className={`space-y-4 print-break-inside-avoid border rounded-xl p-5 sm:p-6 md:p-8 bg-white dark:bg-zinc-900/30 transition-colors duration-300 max-w-full overflow-visible ${
          isHovered && activeHover
            ? 'border-lime-500 dark:border-[#CCFF00] shadow-xl dark:shadow-2xl dark:shadow-[#CCFF00]/10 ring-1 ring-lime-500/20 dark:ring-[#CCFF00]/20'
            : 'border-zinc-200 dark:border-zinc-800 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 max-w-full">
          <div className="space-y-2 min-w-0 max-w-full">
            {/* Main Title: Course / Degree Name */}
            <h3 className="font-syne font-bold text-[15px] sm:text-[17px] md:text-[18px] text-zinc-900 dark:text-zinc-50 uppercase tracking-tight leading-snug break-words max-w-full">
              {edu.degree}
            </h3>

            {/* Subtitle / Provider: Institution Logo + Name + Location & Badges */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap max-w-full">
              <div className="inline-flex items-center gap-2 shrink-0 max-w-full flex-wrap">
                <span className="p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 inline-flex items-center justify-center text-zinc-900 dark:text-zinc-100 shrink-0">
                  <InstitutionLogo
                    institution={edu.institution}
                    className="w-4 h-4 md:w-[18px] md:h-[18px]"
                  />
                </span>
                <span className="text-[11px] sm:text-[12px] font-mono font-extrabold text-lime-600 dark:text-[#CCFF00] uppercase tracking-wider break-words max-w-full">
                  {edu.institution}{edu.location ? `, ${edu.location}` : ''}
                </span>
              </div>

              {edu.issuerBadge && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] xs:text-[10px] font-mono font-extrabold uppercase bg-zinc-100 text-zinc-900 border border-zinc-300 dark:bg-zinc-800/90 dark:text-zinc-100 dark:border-zinc-700/80 tracking-wider transition-colors max-w-full flex-wrap break-words">
                  <CheckCircle2 className="w-3 h-3 text-lime-600 dark:text-[#CCFF00] shrink-0" />
                  <span className="break-words max-w-full">{edu.issuerBadge}</span>
                </span>
              )}

              {edu.grade && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] xs:text-[10px] font-mono font-extrabold uppercase bg-lime-500 text-black dark:bg-[#CCFF00] dark:text-black tracking-wider max-w-full flex-wrap break-words">
                  <Award className="w-3 h-3 text-black shrink-0" />
                  <span>{t.education.grade} {renderParsedGrade(edu.grade)}</span>
                </span>
              )}
            </div>
          </div>

          <div className="font-mono text-[11px] font-bold text-zinc-600 dark:text-zinc-300 shrink-0 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 self-start sm:self-auto max-w-full break-words">
            {edu.year}
          </div>
        </div>

        <p className="text-[14px] text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans max-w-[65ch] pt-1 break-words">
          {edu.description}
        </p>

        {edu.skills && edu.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800/80 no-print">
            {edu.skills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {edu.verificationLinks && edu.verificationLinks.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 no-print border-t border-zinc-100 dark:border-zinc-800/80 mt-3">
            {edu.verificationLinks.map((linkItem, idx) => (
              <a
                key={idx}
                href={linkItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono font-extrabold text-lime-600 dark:text-[#CCFF00] hover:underline uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>{linkItem.label}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <section id="education" ref={sectionRef} className="scroll-mt-24 max-w-full">
      <SectionHeader
        badge={t.education.badge}
        highlightWord={currentPhrase}
        className="mb-8 md:mb-12"
      />

      {/* Summary Stats Banner */}
      <div className="mb-8 md:mb-12 inline-flex flex-wrap items-center gap-x-3 gap-y-2 px-3.5 py-2.5 rounded-xl md:rounded-full bg-zinc-100/80 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 text-[10px] xs:text-[11px] sm:text-[12px] font-mono font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 shadow-xs max-w-full break-words">
        <span>{renderParsedCount(t.education.certificationsCount)}</span>
        <span className="text-zinc-300 dark:text-zinc-700 font-normal">·</span>
        <span>{renderParsedCount(t.education.specializationsCount)}</span>
        <span className="text-zinc-300 dark:text-zinc-700 font-normal">·</span>
        <span className="text-lime-600 dark:text-[#CCFF00]">{t.education.continuousLearning}</span>
      </div>

      <div className="space-y-8 md:space-y-12" onMouseLeave={() => setHoveredCertId(null)}>
        {/* Top 2 Primary Certificates */}
        <div className="space-y-8 md:space-y-12 p-4 -m-4 sm:p-6 sm:-m-6">
          {primaryCertificates.map(renderEducationCard)}
        </div>

        {/* Additional Certificates with Collapsible Toggle */}
        {additionalCertificates.length > 0 && (
          <div className="space-y-8 md:space-y-12">
            <AnimatePresence initial={false}>
              {isCertificatesExpanded && (
                <motion.div
                  id="additional-certificates-list"
                  role="region"
                  aria-labelledby="see-more-certificates-btn"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'visible' }}
                  className="space-y-8 md:space-y-12 p-4 -m-4 sm:p-6 sm:-m-6"
                >
                  {additionalCertificates.map(renderEducationCard)}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-center pt-2 pb-2 relative z-30">
              <button
                type="button"
                id="see-more-certificates-btn"
                aria-expanded={isCertificatesExpanded}
                aria-controls="additional-certificates-list"
                onClick={() => setIsCertificatesExpanded((prev) => !prev)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsCertificatesExpanded((prev) => !prev);
                  }
                }}
                tabIndex={0}
                className="relative z-30 inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-mono text-[12px] font-extrabold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 hover:border-lime-500 dark:hover:border-[#CCFF00] hover:text-lime-600 dark:hover:text-[#CCFF00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 dark:focus-visible:ring-[#CCFF00] transition-all duration-200 cursor-pointer shadow-md group"
              >
                <span>{isCertificatesExpanded ? t.education.seeLess : t.education.seeMore}</span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:text-lime-600 dark:group-hover:text-[#CCFF00] transition-transform duration-300 ease-out shrink-0 ${
                    isCertificatesExpanded ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* ON GOING Accordion Block */}
        {ongoingCourses && ongoingCourses.length > 0 && (
          <div className={`print-break-inside-avoid border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/30 hover:border-lime-500 dark:hover:border-[#CCFF00] transition-all relative z-20 ${
            isOngoingOpen ? 'overflow-visible' : 'overflow-hidden'
          }`}>
            <button
              type="button"
              onClick={() => setIsOngoingOpen((prev) => !prev)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsOngoingOpen((prev) => !prev);
                }
              }}
              aria-expanded={isOngoingOpen}
              aria-controls="ongoing-courses-accordion"
              id="ongoing-courses-header"
              tabIndex={0}
              className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 dark:focus-visible:ring-[#CCFF00] rounded-xl transition-colors relative z-30"
            >
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase bg-lime-500/10 text-lime-700 dark:bg-[#CCFF00]/10 dark:text-[#CCFF00] border border-lime-500/30 dark:border-[#CCFF00]/30 tracking-wider">
                  {t.education.onGoingBadge}
                </span>
                <h3 className="font-syne font-bold text-[16px] text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">
                  {t.education.onGoingTitle}
                </h3>
              </div>
              <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60 shrink-0 relative z-30">
                <ChevronDown
                  className={`w-4 h-4 text-zinc-900 dark:text-zinc-100 transition-transform duration-300 ease-out ${
                    isOngoingOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOngoingOpen && (
                <motion.div
                  id="ongoing-courses-accordion"
                  role="region"
                  aria-labelledby="ongoing-courses-header"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: isOngoingOpen ? 'visible' : 'hidden' }}
                  className="w-full"
                >
                  <div className="px-6 pb-6 md:px-8 md:pb-8 pt-0 space-y-4 border-t border-zinc-100 dark:border-zinc-800/80">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                      {ongoingCourses.map((course) => (
                        <div
                          key={course.id}
                          className="p-6 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col justify-between gap-4 hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            {/* Logo Image / Badge Container */}
                            <div className="w-12 h-12 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/70 flex items-center justify-center overflow-hidden shrink-0 shadow-xs p-1">
                              {course.logoUrl && !imageErrors[course.id] ? (
                                <img
                                  src={course.logoUrl}
                                  srcSet={course.logoUrl.includes('maven') ? `${mavenImgMobile} 768w, ${course.logoUrl} 1200w` : undefined}
                                  sizes={course.logoUrl.includes('maven') ? "(max-width: 768px) 768px, 100vw" : undefined}
                                  alt={`${course.provider} logo`}
                                  referrerPolicy="no-referrer"
                                  onError={(e) => handleCourseImageError(e, course.id)}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <InstitutionLogo
                                  institution={course.provider}
                                  className="w-5 h-5 text-zinc-700 dark:text-zinc-200"
                                />
                              )}
                            </div>

                            <div className="space-y-1 min-w-0 flex-1">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block break-words">
                                {course.provider}
                              </span>
                              <h4 className="font-syne font-bold text-[15px] text-zinc-900 dark:text-zinc-50 uppercase tracking-tight leading-snug">
                                {course.title}
                              </h4>
                            </div>
                          </div>

                          {course.tags && course.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {course.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-semibold bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between">
                            <a
                              href={course.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-mono font-extrabold text-lime-600 dark:text-[#CCFF00] hover:underline uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>{t.education.viewCourse}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

