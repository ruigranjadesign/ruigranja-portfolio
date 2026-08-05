import React, { useState, useRef, Suspense } from 'react';
import { motion, useMotionValue, useMotionTemplate, useScroll, useTransform, MotionValue } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Project } from '../types';
import { AnimatedCounter } from './AnimatedCounter';
import { ProjectCard } from './ProjectCard';
import { SectionHeader } from './SectionHeader';
import { useLanguage } from '../contexts/LanguageContext';

const ProjectModal = React.lazy(() => import('./ProjectModal').then(m => ({ default: m.ProjectModal })));

interface ProjectsSectionProps {
  projects: Project[];
}

interface StackedCardProps {
  index: number;
  totalCards: number;
  progress: MotionValue<number>;
  children: React.ReactNode;
}

const StackedCard: React.FC<StackedCardProps> = ({ index, totalCards, progress, children }) => {
  const shouldReduceMotion = useReducedMotion();

  // 2. Calcula a escala final pretendida para cada cartão
  const targetScale = 1 - (totalCards - 1 - index) * 0.03; // ex: Cartão 1 encolhe até 0.94

  // 3. Mapeia o progresso do scroll diretamente para a propriedade scale do elemento
  const rangeStart = index * (1 / totalCards);
  const scale = useTransform(progress, [rangeStart, 1], [1, targetScale]);

  const isLast = index === totalCards - 1;

  return (
    <div
      className="sticky flex items-start justify-center w-full max-w-full mb-[40vh] sm:mb-[50vh] md:mb-[60vh]"
      style={{
        top: `calc(3.25rem + ${index * 16}px)`,
        zIndex: index + 10,
      }}
    >
      <motion.div
        style={{
          scale: shouldReduceMotion ? 1 : scale,
          transformOrigin: 'top center',
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
};

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const { t } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [failedCoverImages, setFailedCoverImages] = useState<Record<string, boolean>>({});
  const shouldReduceMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);

  // Total cards in stack = project cards only
  const totalCards = projects.length;

  // 1. Obtém o progresso total do scroll na secção (0 a 1)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Motion values for WIP spotlight card
  const wipMouseX = useMotionValue(0);
  const wipMouseY = useMotionValue(0);

  const handleWipMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    wipMouseX.set(clientX - left);
    wipMouseY.set(clientY - top);
  };

  const wipSpotlightBg = useMotionTemplate`radial-gradient(400px circle at ${wipMouseX}px ${wipMouseY}px, rgba(16, 185, 129, 0.12), rgba(204, 255, 0, 0.08), transparent 80%)`;

  return (
    <section id="projects" className="print-break-inside-avoid scroll-mt-32 pt-2 max-w-full pb-16 md:pb-24">
      <div className="mb-8 md:mb-12 flex items-end justify-between gap-3 flex-wrap sm:flex-nowrap max-w-full">
        <SectionHeader
          badge={t.projects.badge}
          title={t.projects.title}
          className="flex-1 min-w-0"
        />
        <span className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 no-print uppercase tracking-widest shrink-0 mb-1">
          <AnimatedCounter value={projects.length} /> {t.projects.items}
        </span>
      </div>

      {/* Stacked Cards Deck */}
      <div ref={containerRef} className="relative flex flex-col max-w-full">
        {projects.map((project, idx) => (
          <StackedCard key={project.id} index={idx} totalCards={totalCards} progress={scrollYProgress}>
            <ProjectCard
              project={project}
              index={idx}
              isFeatured={idx === 0}
              onSelectProject={setSelectedProject}
              failedCoverImage={failedCoverImages[project.id]}
              onCoverImageError={(id) => setFailedCoverImages((prev) => ({ ...prev, [id]: true }))}
            />
          </StackedCard>
        ))}
      </div>

      {/* Standalone GRANJA DESIGN SYSTEM Card (Normal flow below the project cards stack) */}
      <div className="-mt-48 sm:-mt-80 md:-mt-[28rem] relative z-20 w-full max-w-full">
        <motion.div
          onMouseMove={handleWipMouseMove}
          whileHover={shouldReduceMotion ? undefined : { y: -4 }}
          transition={{
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative group border-2 border-dashed border-zinc-300 dark:border-neutral-700/80 rounded-[40px] sm:rounded-[50px] md:rounded-[60px] p-6 md:p-8 bg-white dark:bg-[#09090B] hover:border-lime-500 dark:hover:border-[#CCFF00] transition-colors duration-300 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 shadow-2xl print-shadow-none print-break-inside-avoid no-print overflow-hidden w-full"
        >
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-[40px] sm:rounded-[50px] md:rounded-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden hidden sm:block [@media(hover:hover)]:block"
            style={{ background: wipSpotlightBg }}
            aria-hidden="true"
          />

          {/* Left Side: Badge, Title & Description */}
          <div className="relative z-10 flex-1 space-y-3 max-w-full">
            <div className="flex items-center gap-2.5 max-w-full flex-wrap">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 dark:bg-lime-500/10 border border-lime-500/20 text-[10px] font-mono font-extrabold uppercase tracking-wider text-lime-700 dark:text-[#CCFF00] max-w-full flex-wrap break-words">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500 dark:bg-[#CCFF00]" />
                </span>
                <span className="break-words">{t.projects.wipBadge}</span>
              </span>
            </div>

            <h3 className="text-[18px] xs:text-[20px] sm:text-[22px] md:text-[24px] font-bold font-syne uppercase tracking-tight text-neutral-900 dark:text-neutral-50 pt-0.5 break-words max-w-full">
              {t.projects.wipTitle}
            </h3>

            <p className="text-[13px] sm:text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans max-w-2xl break-words">
              {t.projects.wipDescription}
            </p>
          </div>

          {/* Right Side: Version */}
          <div className="relative z-10 shrink-0 flex items-center justify-end gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-zinc-200 dark:border-zinc-800/80">
            <span className="px-2.5 py-1 rounded-md bg-lime-500/10 border border-lime-500/20 font-mono text-[11px] font-extrabold text-lime-700 dark:text-[#CCFF00]">
              {t.projects.wipVersion}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Project Case Study Modal */}
      <Suspense fallback={null}>
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </Suspense>
    </section>
  );
};


