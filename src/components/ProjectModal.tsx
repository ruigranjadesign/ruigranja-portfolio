import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { ExternalLink, Copy, Check, Sparkles, FolderGit2 } from 'lucide-react';
import { ProjectGallery } from './ProjectGallery';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import { staggerContainerVariants, staggerItemVariants } from '../utils/animationVariants';
import { BottomSheetModal } from './BottomSheetModal';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [coverFailed, setCoverFailed] = useState(false);

  useEffect(() => {
    setCoverFailed(false);
  }, [project]);

  if (!project) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(project.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modalTitle = (
    <div>
      <div className="inline-flex flex-wrap items-center gap-2 text-xs font-mono font-extrabold text-[#5E7800] dark:text-[#CCFF00] uppercase tracking-wider mb-1">
        <span className="inline-flex items-center gap-1.5">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>{project.category}</span>
        </span>
        {project.role && (
          <>
            <span className="text-zinc-400 font-normal">|</span>
            <span className="text-zinc-500 dark:text-zinc-400 font-semibold">{project.role}</span>
          </>
        )}
      </div>
      <h3 id="project-modal-title" className="text-xl sm:text-2xl font-black font-syne uppercase tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight md:leading-[0.95]">
        {project.title}
      </h3>
      {project.subtitle && (
        <p className="text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400 mt-1">
          {project.subtitle}
        </p>
      )}
    </div>
  );

  return (
    <BottomSheetModal
      isOpen={!!project}
      onClose={onClose}
      title={modalTitle}
      showCloseButton={true}
    >
      {/* Visual Banner Decorative Accent / Cover Image */}
      {project.gallery && project.gallery.length > 0 && !coverFailed ? (
        <div
          tabIndex={0}
          role="button"
          aria-label={`${t.projectModal.featuredCover} - ${t.projectGallery.expand}`}
          onClick={() => {
            const galleryElem = document.getElementById('project-modal-gallery');
            if (galleryElem) {
              galleryElem.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              const galleryElem = document.getElementById('project-modal-gallery');
              if (galleryElem) {
                galleryElem.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }}
          className="group relative w-full h-44 sm:h-52 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden cursor-pointer shadow-md transition-all hover:border-lime-500 dark:hover:border-[#CCFF00] bg-zinc-950 flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-lime-500 dark:focus-visible:ring-[#CCFF00]"
        >
          {/* Horizontal Crop Cover Image */}
          <img
            src={project.gallery[0].src}
            srcSet={project.gallery[0].mobileWebpSrc ? `${project.gallery[0].mobileWebpSrc} 768w, ${project.gallery[0].src} 1200w` : undefined}
            sizes={project.gallery[0].mobileWebpSrc ? "(max-width: 768px) 768px, 100vw" : undefined}
            alt={project.gallery[0].alt}
            onError={(e) => {
              const imgEl = e.currentTarget;
              const stage = parseInt(imgEl.dataset.fallbackStage || '0', 10);
              if (stage === 0) {
                imgEl.dataset.fallbackStage = '1';
                if (project.id === 'proj-1' || project.title.toLowerCase().includes('fitness')) {
                  imgEl.src = '/images/projects/rawpower/01-cover.webp';
                  return;
                }
                if (project.id === 'proj-2' || project.title.toLowerCase().includes('doma')) {
                  imgEl.src = '/images/projects/doma/01-cover.webp';
                  return;
                }
                if (project.id === 'proj-3' || project.title.toLowerCase().includes('brasa')) {
                  imgEl.src = '/images/projects/brasapura/01-cover.webp';
                  return;
                }
              }
              setCoverFailed(true);
            }}
            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent flex items-end justify-between p-4 pointer-events-none">
            <span className="text-xs font-mono text-white font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-700/80 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-lime-400 dark:text-[#CCFF00]" />
              <span>{t.projectModal.featuredCover}</span>
            </span>
          </div>
        </div>
      ) : (
        <div className={`w-full h-24 rounded-xl bg-gradient-to-r ${project.imagePlaceholderGradient || 'from-zinc-900 to-black'} flex items-center justify-center border border-zinc-200 dark:border-zinc-800 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-lime-500/10 dark:bg-[#CCFF00]/5 pointer-events-none" />
          <span className="text-xs font-mono text-zinc-900 dark:text-zinc-100 font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-700">
            {t.projectModal.caseStudyOverview}
          </span>
        </div>
      )}

      {/* Overview */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] font-extrabold text-zinc-400 dark:text-zinc-500">
          {t.projectModal.summary}
        </h4>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-[65ch] font-sans">
          {project.fullDescription || project.description}
        </p>
      </div>

      {/* Gallery Section */}
      {project.gallery && project.gallery.length > 0 && (
        <div id="project-modal-gallery" className="pt-2 border-t border-zinc-200 dark:border-zinc-800 scroll-mt-6">
          <ProjectGallery gallery={project.gallery} projectTitle={project.title} />
        </div>
      )}

      {/* Key Metrics & KPIs */}
      {project.metrics && project.metrics.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
          <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] font-extrabold text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#5E7800] dark:text-[#CCFF00]" />
            <span>Metrics & KPIs</span>
          </h4>
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1"
          >
            {project.metrics.map((metric, idx) => (
              <motion.div
                key={idx}
                variants={staggerItemVariants}
                className="p-3 rounded-xl bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col justify-between"
              >
                <span className="text-[10px] font-mono font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  {metric.label}
                </span>
                <span className="text-sm font-mono font-black text-[#5E7800] dark:text-[#CCFF00] tracking-tight mt-1">
                  {metric.value}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Key Outcomes */}
      {project.keyOutcomes && project.keyOutcomes.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
          <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] font-extrabold text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#5E7800] dark:text-[#CCFF00]" />
            {t.projectModal.keyDeliverables}
          </h4>
          <motion.ul
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="space-y-1.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-sans max-w-[65ch]"
          >
            {project.keyOutcomes.map((outcome, idx) => (
              <motion.li
                key={idx}
                variants={staggerItemVariants}
                className="leading-relaxed flex items-start gap-2"
              >
                <span className="text-[#5E7800] dark:text-[#CCFF00] font-mono font-bold text-xs select-none">•</span>
                <span>{outcome}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 pt-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors active:scale-95 duration-100 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-lime-500 dark:focus-visible:ring-[#CCFF00]"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#5E7800] dark:text-[#CCFF00]" />
              <span className="text-[#5E7800] dark:text-[#CCFF00]">{t.projectModal.copied}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{t.projectModal.copyLink}</span>
            </>
          )}
        </button>

        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg bg-lime-500 text-black dark:bg-[#CCFF00] dark:text-black font-extrabold text-xs font-mono uppercase tracking-wider hover:bg-lime-400 transition-all active:scale-95 duration-100 cursor-pointer shadow-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-lime-500 dark:focus-visible:ring-[#CCFF00]"
        >
          <span>{project.linkLabel || t.projectModal.viewFullStudy}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </BottomSheetModal>
  );
};


