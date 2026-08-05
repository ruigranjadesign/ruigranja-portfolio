import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, PanInfo, useDragControls } from 'motion/react';
import { X, FileDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { downloadCv } from '../utils/cvDownloader';

export interface CvDownloadButtonProps {
  className?: string;
  variant?: 'sublime' | 'minimal' | 'full';
  language?: 'en' | 'pt';
}

export const CvDownloadButton: React.FC<CvDownloadButtonProps> = ({
  className = '',
  variant = 'sublime',
  language: propLang,
}) => {
  const { language: ctxLang } = useLanguage();
  const currentLang = propLang || ctxLang || 'pt';
  const isEn = currentLang === 'en';

  const ariaLabel = "Descarregar Currículo Vitae de Rui Granja em PDF";
  const title = isEn ? "Download CV (PDF)" : "Descarregar CV (PDF)";
  const labelText = "CV";

  if (variant === 'minimal') {
    return (
      <a
        href="/Rui_Granja_CV.pdf"
        download="Rui_Granja_CV.pdf"
        onClick={(e) => {
          e.preventDefault();
          downloadCv();
        }}
        aria-label={ariaLabel}
        title={title}
        className={`group inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#5E7800] dark:text-[#CCFF00] hover:underline cursor-pointer transition-colors ${className}`}
      >
        <FileDown className="w-3.5 h-3.5 shrink-0 group-hover:translate-y-0.5 transition-transform duration-200" />
        <span>{labelText}</span>
      </a>
    );
  }

  return (
    <a
      href="/Rui_Granja_CV.pdf"
      download="Rui_Granja_CV.pdf"
      onClick={(e) => {
        e.preventDefault();
        downloadCv();
      }}
      aria-label={ariaLabel}
      title={title}
      className={`group relative inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg bg-zinc-900 dark:bg-zinc-900/90 text-white dark:text-[#CCFF00] border border-zinc-800 dark:border-[#CCFF00]/40 hover:border-zinc-700 dark:hover:border-[#CCFF00] hover:bg-zinc-800 dark:hover:bg-[#CCFF00] dark:hover:text-zinc-950 transition-all duration-200 font-mono text-[11px] font-extrabold uppercase tracking-wider cursor-pointer shadow-xs hover:shadow-[0_0_20px_rgba(204,255,0,0.25)] active:scale-95 duration-100 min-h-[44px] shrink-0 ${className}`}
    >
      <FileDown className="w-3.5 h-3.5 text-lime-500 dark:text-[#CCFF00] group-hover:text-white dark:group-hover:text-zinc-950 transition-transform duration-200 group-hover:translate-y-0.5 shrink-0" />
      <span>{labelText}</span>
    </a>
  );
};

export interface BottomSheetModalProps {
  /** Controls if the bottom sheet modal is open or closed */
  isOpen: boolean;
  /** Callback fired when the user requests to close the sheet (drag down > 120px, click backdrop, click close button, or press Escape) */
  onClose: () => void;
  /** Title or header content displayed at the top of the sheet */
  title?: React.ReactNode;
  /** Inner content rendered inside the bottom sheet */
  children: React.ReactNode;
  /** Optional custom class names for the sheet container */
  className?: string;
  /** Whether to show the top-right close icon button (default: true) */
  showCloseButton?: boolean;
  /** Whether to show the sublime CV Download button in the modal header/footer (default: false) */
  showCvDownload?: boolean;
  /** Optional custom footer actions node */
  footerActions?: React.ReactNode;
}

export const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  showCloseButton = true,
  showCvDownload = false,
  footerActions,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const dragControls = useDragControls();

  // Prevent background scrolling and handle trap focus & Escape key
  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = setTimeout(() => {
      if (sheetRef.current) {
        sheetRef.current.focus();
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const target = e.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.isContentEditable)
        ) {
          return;
        }
        e.preventDefault();
        onClose();
      }

      // Tab Focus Trap
      if (e.key === 'Tab' && sheetRef.current) {
        const focusables = (
          Array.from(
            sheetRef.current.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
          ) as HTMLElement[]
        ).filter(
          (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
        );

        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || document.activeElement === sheetRef.current) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    const handleCloseModals = () => {
      onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('close-modals', handleCloseModals);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('close-modals', handleCloseModals);
      if (
        previousActiveElement.current &&
        typeof previousActiveElement.current.focus === 'function'
      ) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  // Handle gesture drag end with Framer Motion info
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Requisito: fechar automaticamente se o utilizador arrastar mais de 120px para baixo
    // ou se flickar com velocidade para baixo (> 300px/s)
    if (info.offset.y > 120 || info.velocity.y > 300) {
      onClose();
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center no-print pointer-events-auto">
          {/* Backdrop / Overlay background with smooth opacity fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* Bottom Sheet Card Container */}
          <motion.div
            ref={sheetRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 28,
              stiffness: 300,
              mass: 0.8,
            }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.8 }}
            onDragEnd={handleDragEnd}
            className={`relative w-full max-w-2xl bg-white dark:bg-zinc-950 border-t sm:border-2 border-zinc-200 dark:border-zinc-800 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] max-h-[92dvh] sm:max-h-[85vh] focus:outline-hidden transform-gpu will-change-transform ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Visual Drag Handlebar at top */}
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="w-full flex items-center justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none select-none shrink-0 group bg-white dark:bg-zinc-950"
              aria-label="Arrastar para fechar"
            >
              <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700/80 group-hover:bg-zinc-400 dark:group-hover:bg-zinc-600 transition-colors" />
            </div>

            {/* Header (Title & Optional Close Button) */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between gap-4 px-6 pt-1 pb-3 border-b border-zinc-100 dark:border-zinc-800/80 shrink-0">
                <div className="flex-1 min-w-0">{title}</div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-[#CCFF00] hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors active:scale-95 duration-100 cursor-pointer shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-lime-500 dark:focus-visible:ring-[#CCFF00]"
                    aria-label="Fechar modal"
                    title="Fechar modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 pb-10 sm:pb-14 space-y-6 touch-pan-y">
              {children}
            </div>

            {/* Optional Footer Actions / CV Download Bar */}
            {(showCvDownload || footerActions) && (
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0">
                {footerActions}
                {showCvDownload && <CvDownloadButton />}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default BottomSheetModal;
