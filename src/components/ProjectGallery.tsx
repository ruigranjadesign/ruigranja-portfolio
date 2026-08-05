import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2, X, Image as ImageIcon } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useLanguage } from '../contexts/LanguageContext';

interface GalleryItem {
  src: string;
  webpSrc?: string;
  mobileWebpSrc?: string;
  alt: string;
}

interface ProjectGalleryProps {
  gallery: GalleryItem[];
  projectTitle?: string;
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ gallery, projectTitle = 'Project Gallery' }) => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const shouldReduceMotion = useReducedMotion();

  // Reset failed images when gallery or project changes
  useEffect(() => {
    setFailedImages({});
    setCurrentIndex(0);
  }, [gallery, projectTitle]);

  // Swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalImages = gallery.length;

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  }, [totalImages]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  }, [totalImages]);

  // Touch swipe logic
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation and body scroll lock for lightbox
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // If lightbox is open, prioritize lightbox controls and prevent event bubbling
      if (isLightboxOpen) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          e.stopPropagation();
          handleNext();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          e.stopPropagation();
          handlePrev();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          setIsLightboxOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [isLightboxOpen, handleNext, handlePrev]);

  if (!gallery || gallery.length === 0) return null;

  const currentItem = gallery[currentIndex];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, index: number, src: string) => {
    const imgEl = e.currentTarget;
    const stage = parseInt(imgEl.dataset.fallbackStage || '0', 10);

    const rawpowerPublic = [
      '/images/projects/rawpower/01-cover.webp',
      '/images/projects/rawpower/02-story-overview.webp',
      '/images/projects/rawpower/03-problem-solution.webp',
      '/images/projects/rawpower/04-ui-screens.webp'
    ];

    if (stage === 0) {
      imgEl.dataset.fallbackStage = '1';
      if (src.includes('doma') || imgEl.src.includes('doma') || projectTitle.toLowerCase().includes('doma')) {
        imgEl.src = '/images/projects/doma/01-cover.webp';
        return;
      }
      if (src.includes('brasa') || imgEl.src.includes('brasa') || projectTitle.toLowerCase().includes('brasa')) {
        imgEl.src = '/images/projects/brasapura/01-cover.webp';
        return;
      }
      if (rawpowerPublic[index]) {
        imgEl.src = rawpowerPublic[index];
        return;
      }
    }

    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  // Helper component to render image or styled fallback
  const renderImageContent = (item: GalleryItem, index: number, isLightbox = false) => {
    const hasError = failedImages[index];

    if (hasError) {
      return (
        <div className={`w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-zinc-100 border border-zinc-800 ${isLightbox ? 'min-h-[60vh]' : 'min-h-[280px] sm:min-h-[360px]'}`}>
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3 text-[#CCFF00]">
            <ImageIcon className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-[#CCFF00] uppercase font-bold mb-1">
            SLIDE {String(index + 1).padStart(2, '0')} / {String(totalImages).padStart(2, '0')}
          </span>
          <h5 className="text-base font-syne font-bold uppercase tracking-tight text-zinc-200 max-w-md mb-2">
            {item.alt}
          </h5>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFailedImages((prev) => ({ ...prev, [index]: false }));
            }}
            className="mt-2 text-xs font-mono text-zinc-400 hover:text-[#CCFF00] underline cursor-pointer"
          >
            Reload Image
          </button>
        </div>
      );
    }

    return (
      <picture className="w-full flex items-center justify-center">
        {item.mobileWebpSrc && (
          <source
            type="image/webp"
            media="(max-width: 640px)"
            srcSet={item.mobileWebpSrc}
          />
        )}
        {item.webpSrc && (
          <source
            type="image/webp"
            srcSet={item.webpSrc}
          />
        )}
        <img
          src={item.src}
          srcSet={item.mobileWebpSrc ? `${item.mobileWebpSrc} 768w, ${item.src} 1200w` : undefined}
          sizes={item.mobileWebpSrc ? "(max-width: 768px) 768px, 100vw" : undefined}
          alt={item.alt}
          loading="lazy"
          decoding="async"
          onError={(e) => handleImageError(e, index, item.src)}
          style={
            isLightbox
              ? { maxWidth: '100%', maxHeight: '78vh', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block' }
              : { width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }
          }
          className={`${
            isLightbox
              ? 'max-w-full max-h-[78vh] w-auto h-auto object-contain drop-shadow-2xl mx-auto my-auto'
              : 'w-full h-auto block object-contain drop-shadow-md'
          } transition-transform duration-300 rounded-lg`}
        />
      </picture>
    );
  };

  return (
    <div className="space-y-3 w-full font-sans">
      {/* Gallery Header & Counter */}
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] font-extrabold text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
          {t.projectGallery.caseStudyGallery}
        </h4>
        <div className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <span className="text-[#5E7800] dark:text-[#CCFF00]">{String(currentIndex + 1).padStart(2, '0')}</span>
          <span className="text-zinc-400 mx-1">/</span>
          <span>{String(totalImages).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Main Image View Container */}
      <div
        className={`relative group w-full bg-zinc-950 rounded-xl border-2 border-zinc-900 dark:border-zinc-800 overflow-hidden select-none cursor-pointer flex items-center justify-center ${
          failedImages[currentIndex] ? 'aspect-video min-h-[280px] sm:min-h-[360px]' : ''
        }`}
        onClick={() => setIsLightboxOpen(true)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
        role="button"
        aria-label={`${t.projectGallery.openFullscreen} ${currentIndex + 1}: ${currentItem.alt}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
            transition={{ duration: shouldReduceMotion ? 0.05 : 0.25, ease: 'easeInOut' }}
            className="w-full h-full flex items-center justify-center p-2"
          >
            {renderImageContent(currentItem, currentIndex, false)}
          </motion.div>
        </AnimatePresence>

        {/* Hover / Expand Overlay Hint */}
        <div className="absolute top-3 right-3 bg-zinc-900/90 text-zinc-100 p-2 rounded-lg border border-zinc-700 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 text-xs font-mono font-semibold shadow-lg">
          <Maximize2 className="w-3.5 h-3.5 text-[#CCFF00]" />
          <span className="hidden sm:inline">{t.projectGallery.expand}</span>
        </div>

        {/* Caption Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/60 to-transparent p-3 pt-6 pointer-events-none">
          <p className="text-xs font-sans text-zinc-200 line-clamp-2 drop-shadow-sm font-medium">
            {currentItem.alt}
          </p>
        </div>

        {/* Left / Right Navigation Buttons */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-zinc-900/80 hover:bg-zinc-900 text-zinc-200 hover:text-[#CCFF00] border border-zinc-700/80 hover:border-[#CCFF00] transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer shadow-md"
          aria-label={t.projectGallery.prevImage}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-zinc-900/80 hover:bg-zinc-900 text-zinc-200 hover:text-[#CCFF00] border border-zinc-700/80 hover:border-[#CCFF00] transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer shadow-md"
          aria-label={t.projectGallery.nextImage}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnail Strip */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1 overflow-x-auto pb-1 scrollbar-thin">
        {gallery.map((item, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative rounded-lg overflow-hidden border-2 transition-all cursor-pointer aspect-video bg-zinc-900 flex items-center justify-center ${
                isActive
                  ? 'border-[#5E7800] dark:border-[#CCFF00] ring-2 ring-lime-500/30 dark:ring-[#CCFF00]/30 scale-105 z-10'
                  : 'border-zinc-200 dark:border-zinc-800 opacity-60 hover:opacity-100 hover:border-zinc-400 dark:hover:border-zinc-600'
              }`}
              aria-label={`View image ${idx + 1}: ${item.alt}`}
            >
              {failedImages[idx] ? (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-[10px] font-mono font-bold text-zinc-400">
                  {String(idx + 1).padStart(2, '0')}
                </div>
              ) : (
                <img
                  src={item.src}
                  srcSet={item.mobileWebpSrc ? `${item.mobileWebpSrc} 768w, ${item.src} 1200w` : undefined}
                  sizes={item.mobileWebpSrc ? "(max-width: 768px) 768px, 100vw" : undefined}
                  alt={`Thumbnail ${idx + 1}`}
                  loading="lazy"
                  onError={(e) => handleImageError(e, idx, item.src)}
                  className="w-full h-full object-cover"
                />
              )}
              {isActive && (
                <div className="absolute inset-0 bg-lime-500/10 dark:bg-[#CCFF00]/10 pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal Portal */}
      {isLightboxOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] bg-zinc-950/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 text-zinc-100 animate-in fade-in duration-200 select-none"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(false);
            }}
          >
            {/* Top Bar */}
            <div
              className="flex items-center justify-between w-full max-w-6xl mx-auto pb-4 border-b border-zinc-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-extrabold text-[#CCFF00] uppercase tracking-wider bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                  {projectTitle}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  {String(currentIndex + 1).padStart(2, '0')} / {String(totalImages).padStart(2, '0')}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(false);
                }}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-[#CCFF00] border border-zinc-700 transition-colors cursor-pointer"
                aria-label={t.projectGallery.closeLightbox}
                title={t.projectGallery.closeLightbox}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Lightbox Content Area */}
            <div
              className="relative flex-1 flex items-center justify-center max-w-6xl w-full mx-auto my-2 overflow-visible"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
                  transition={{ duration: shouldReduceMotion ? 0.05 : 0.2 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  {renderImageContent(currentItem, currentIndex, true)}
                </motion.div>
              </AnimatePresence>

              {/* Prev/Next Buttons on Lightbox */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 hover:text-[#CCFF00] border border-zinc-700 transition-all cursor-pointer shadow-xl"
                aria-label={t.projectGallery.prevImage}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 hover:text-[#CCFF00] border border-zinc-700 transition-all cursor-pointer shadow-xl"
                aria-label={t.projectGallery.nextImage}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption & Thumbnail Strip */}
            <div
              className="w-full max-w-6xl mx-auto pt-4 border-t border-zinc-800 space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-sm font-sans text-zinc-300 text-center font-medium max-w-2xl mx-auto">
                {currentItem.alt}
              </p>

              <div className="flex justify-center gap-2 overflow-x-auto py-1 scrollbar-thin">
                {gallery.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-16 sm:w-20 aspect-video rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 bg-zinc-900 ${
                      idx === currentIndex
                        ? 'border-[#CCFF00] ring-2 ring-[#CCFF00]/40 scale-105'
                        : 'border-zinc-800 opacity-50 hover:opacity-100'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  >
                    {failedImages[idx] ? (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-zinc-400">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                    ) : (
                      <img
                        src={item.src}
                        srcSet={item.mobileWebpSrc ? `${item.mobileWebpSrc} 768w, ${item.src} 1200w` : undefined}
                        sizes={item.mobileWebpSrc ? "(max-width: 768px) 768px, 100vw" : undefined}
                        alt={`Thumb ${idx + 1}`}
                        loading="lazy"
                        onError={(e) => handleImageError(e, idx, item.src)}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
