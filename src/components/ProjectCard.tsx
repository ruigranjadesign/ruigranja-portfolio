import React from 'react';
import { motion, useMotionValue, useMotionTemplate, Variants, useReducedMotion } from 'motion/react';
import { ExternalLink, ArrowUpRight, Images } from 'lucide-react';
import { Project } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { MagneticWrapper } from './MagneticWrapper';

export interface ProjectCardProps {
  project: Project;
  index?: number;
  isFeatured?: boolean;
  onSelectProject: (project: Project) => void;
  failedCoverImage?: boolean;
  onCoverImageError?: (projectId: string) => void;
}

// 1. Image Zoom Variant (GPU Accelerated scale: 1.04)
const imageZoomVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.04,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Smooth overlay fade transition
const overlayVariants: Variants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: { duration: 0.35, ease: 'easeInOut' },
  },
};

// 2. Staggered Technology Badges/Tags Container
const tagsContainerVariants: Variants = {
  initial: {},
  hover: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

// Individual Technology Tag/Badge
const badgeItemVariants: Variants = {
  initial: { opacity: 0.8, y: 0 },
  hover: {
    opacity: 1,
    y: -2,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

// Arrow Action Button Shift Variant
const arrowIconVariants: Variants = {
  initial: { x: 0, y: 0, opacity: 0.7 },
  hover: {
    x: 3,
    y: -3,
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  isFeatured = false,
  onSelectProject,
  failedCoverImage = false,
  onCoverImageError,
}) => {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  // Motion values tracking mouse cursor position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  // Spotlight gradient
  const spotlightBg = useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(16, 185, 129, 0.12), rgba(204, 255, 0, 0.08), transparent 80%)`;

  const printLink = project.link.replace('https://www.', '').replace('https://', '');
  const hasGallery = Boolean(project.gallery && project.gallery.length > 0);
  const coverImage = hasGallery && project.gallery ? project.gallery[0] : null;

  const isFitnessProject =
    project.id === 'proj-1' ||
    project.title.toLowerCase().includes('fitness') ||
    project.title.toLowerCase().includes('rawpower');

  // Single tile renderer helper
  const renderTileImage = (
    imgItem: { src: string; webpSrc?: string; mobileWebpSrc?: string; alt: string },
    extraClasses: string = '',
    showBadges: boolean = false
  ) => (
    <div
      tabIndex={0}
      role="button"
      aria-label={`View ${project.title} project image`}
      onClick={() => onSelectProject(project)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectProject(project);
        }
      }}
      className={`relative w-full h-full overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 cursor-pointer group/media focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-[#CCFF00] transition-all ${
        project.id === 'proj-2' || project.title.toLowerCase() === 'doma'
          ? 'bg-[#89aabf]'
          : 'bg-zinc-950'
      } ${extraClasses}`}
    >
      <motion.div
        variants={shouldReduceMotion ? undefined : imageZoomVariants}
        className="w-full h-full"
      >
        <picture className="w-full h-full block overflow-hidden">
          {imgItem.mobileWebpSrc && (
            <source
              type="image/webp"
              media="(max-width: 640px)"
              srcSet={imgItem.mobileWebpSrc}
            />
          )}
          {imgItem.webpSrc && (
            <source
              type="image/webp"
              srcSet={imgItem.webpSrc}
            />
          )}
          <img
            src={imgItem.src}
            alt={imgItem.alt}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const imgEl = e.currentTarget;
              const stage = parseInt(imgEl.dataset.fallbackStage || '0', 10);
              imgEl.removeAttribute('srcset');
              const picture = imgEl.parentElement;
              if (picture && picture.tagName === 'PICTURE') {
                const sources = picture.querySelectorAll('source');
                sources.forEach((s) => s.remove());
              }
              if (stage === 0) {
                imgEl.dataset.fallbackStage = '1';
                if (
                  project.id === 'proj-1' ||
                  project.title.toLowerCase().includes('fitness') ||
                  project.title.toLowerCase().includes('raw')
                ) {
                  imgEl.src = '/images/projects/rawpower/01-cover.webp';
                  return;
                }
                if (
                  project.id === 'proj-2' ||
                  project.title.toLowerCase().includes('doma')
                ) {
                  imgEl.src = '/images/projects/doma/01-cover.webp';
                  return;
                }
                if (
                  project.id === 'proj-3' ||
                  project.title.toLowerCase().includes('brasa')
                ) {
                  imgEl.src = '/images/projects/brasapura/01-cover.webp';
                  return;
                }
              } else if (stage === 1) {
                imgEl.dataset.fallbackStage = '2';
                if (
                  project.id === 'proj-2' ||
                  project.title.toLowerCase().includes('doma')
                ) {
                  imgEl.src = '/images/projects/doma/01-cover.webp';
                  return;
                }
              }
              if (onCoverImageError) {
                onCoverImageError(project.id);
              }
            }}
            className="w-full h-full object-cover object-center block"
          />
        </picture>
      </motion.div>

      {/* Overlay */}
      <motion.div
        variants={shouldReduceMotion ? undefined : overlayVariants}
        className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/30 to-transparent pointer-events-none"
      />

      {showBadges && (
        <>
          <div className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-md text-white border border-white/20 text-[10px] font-mono font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md select-none pointer-events-none z-10">
            <Images className="w-3.5 h-3.5 text-lime-400 dark:text-[#CCFF00]" />
            <span>
              {t.projects.galleryBadge} · {project.gallery?.length}{' '}
              {project.gallery?.length === 1 ? t.projects.photo : t.projects.photos}
            </span>
          </div>

          {isFitnessProject && (
            <div className="absolute bottom-3 left-3 bg-zinc-950/85 backdrop-blur-md text-white border border-white/20 text-[10px] font-mono font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg group-hover/media:border-lime-400/60 transition-colors select-none pointer-events-none z-10">
              <span>{t.projects.clickToExplore}</span>
            </div>
          )}
        </>
      )}
    </div>
  );

  // Helper render for cover image media block
  const renderMedia = (aspectClasses: string) => (
    <div className="no-print w-full">
      {hasGallery && coverImage && !failedCoverImage ? (
        renderTileImage(coverImage, `rounded-xl ${aspectClasses}`, true)
      ) : (
        <div
          onClick={() => hasGallery && onSelectProject(project)}
          tabIndex={hasGallery ? 0 : undefined}
          role={hasGallery ? 'button' : undefined}
          aria-label={hasGallery ? `View ${project.title} project gallery` : undefined}
          onKeyDown={(e) => {
            if (hasGallery && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onSelectProject(project);
            }
          }}
          className={`w-full ${aspectClasses} rounded-xl bg-gradient-to-r ${
            project.imagePlaceholderGradient || 'from-zinc-800 to-zinc-900'
          } border border-zinc-200 dark:border-zinc-800 flex items-center justify-center ${
            hasGallery
              ? 'cursor-pointer hover:border-lime-500 dark:hover:border-[#CCFF00] transition-colors'
              : ''
          }`}
        >
          <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-700/50">
            {project.category}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      key={project.id}
      onMouseMove={handleMouseMove}
      initial={shouldReduceMotion ? false : 'initial'}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      whileHover={shouldReduceMotion ? undefined : 'hover'}
      transition={{
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`group relative border-2 border-zinc-900/15 dark:border-zinc-50/20 rounded-[32px] sm:rounded-[50px] md:rounded-[60px] p-4 sm:p-7 md:p-9 bg-white dark:bg-[#09090B] hover:border-lime-500 dark:hover:border-[#CCFF00] transition-colors duration-300 flex flex-col justify-between h-full shadow-2xl print-shadow-none print-break-inside-avoid overflow-hidden max-w-full ${
        isFeatured ? 'col-span-full' : ''
      }`}
    >
      {/* Spotlight Radial Glow Overlay */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[40px] sm:rounded-[50px] md:rounded-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden hidden sm:block [@media(hover:hover)]:block"
        style={{ background: spotlightBg }}
        aria-hidden="true"
      />

      {/* CARD CONTENT LAYOUT */}
      <div className="relative z-10 flex-1 flex flex-col justify-between space-y-4 max-w-full h-full">
        {/* Header & Info */}
        <div className="space-y-3 max-w-full">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-3">
              {typeof index === 'number' && (
                <span
                  className="font-black leading-none select-none shrink-0 text-zinc-200 dark:text-zinc-800"
                  style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 5vw, 60px)' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              )}
              <span className="text-[9px] xs:text-[10px] font-mono font-extrabold text-zinc-500 dark:text-zinc-400 shrink-0 no-print uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                {project.category}
              </span>
            </div>
            {isFeatured && (
              <span className="text-[10px] font-mono font-extrabold text-lime-600 dark:text-[#CCFF00] uppercase tracking-wider px-2.5 py-1 rounded-full bg-lime-500/10 border border-lime-500/20">
                Featured
              </span>
            )}
          </div>

          <h3 className="group/link min-w-0 max-w-full">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[16px] xs:text-[18px] sm:text-[20px] md:text-[22px] font-bold font-syne uppercase tracking-tight text-zinc-900 dark:text-zinc-50 group-hover/link:text-lime-600 dark:group-hover/link:text-[#CCFF00] inline-flex items-center gap-2 min-w-0 max-w-full transition-colors leading-snug py-0.5 break-words"
            >
              <span className="break-words py-0.5 max-w-full">{project.title}</span>
              <MagneticWrapper intensity={0.3} className="shrink-0">
                <motion.span
                  variants={shouldReduceMotion ? undefined : arrowIconVariants}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 group-hover/link:text-lime-600 dark:group-hover/link:text-[#CCFF00] group-hover/link:border-lime-500 dark:group-hover/link:border-[#CCFF00] transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4 text-lime-500 dark:text-[#CCFF00]" />
                </motion.span>
              </MagneticWrapper>
            </a>
          </h3>

          {/* Description with line-clamp-2 */}
          {project.description && (
            <p className="text-[13px] sm:text-[14px] text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed line-clamp-2 break-words">
              {project.description}
            </p>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <motion.div
              variants={shouldReduceMotion ? undefined : tagsContainerVariants}
              className="flex flex-wrap items-center gap-1.5 pt-1 no-print"
            >
              {project.tags.map((tag, idx) => (
                <motion.span
                  key={`${project.id}-tag-${idx}`}
                  variants={shouldReduceMotion ? undefined : badgeItemVariants}
                  className="text-[10px] font-mono font-semibold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 hover:border-lime-500/50 dark:hover:border-[#CCFF00]/50 hover:text-lime-600 dark:hover:text-[#CCFF00] px-2 py-0.5 rounded-md transition-colors shadow-2xs"
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          )}
        </div>

        {/* Media with responsive aspect ratio */}
        {renderMedia('aspect-[16/10] sm:aspect-[16/9] md:aspect-[2.2/1]')}

        {/* Footer Links & Actions */}
        <div className="relative z-10 pt-4 mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 no-print border-t border-zinc-200 dark:border-zinc-800/80">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono font-extrabold text-lime-600 dark:text-[#CCFF00] hover:underline uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer py-2.5 sm:py-1 px-1 sm:px-0 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 active:scale-95 duration-100"
          >
            <span>{project.linkLabel || t.projects.viewFullStudy}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <MagneticWrapper intensity={0.2}>
            <button
              onClick={() => onSelectProject(project)}
              className="text-[11px] font-mono font-bold text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-[#CCFF00] uppercase tracking-wider transition-all cursor-pointer py-2.5 px-3.5 sm:py-1 sm:px-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 inline-flex items-center justify-center gap-1.5 active:scale-95 duration-100"
            >
              <Images className="w-3.5 h-3.5" />
              <span>{hasGallery ? t.projects.viewGallery : t.projects.quickOverview}</span>
            </button>
          </MagneticWrapper>
        </div>
      </div>

      <div className="hidden print:block text-[9px] font-mono text-zinc-400 mt-2 truncate">
        Link: {printLink}
      </div>
    </motion.div>
  );
};

