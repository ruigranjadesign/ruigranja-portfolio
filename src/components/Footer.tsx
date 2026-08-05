import React, { useState } from 'react';
import { ArrowUp, ArrowUpRight, Mail, Instagram, Copy, Check, Linkedin, FileDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getMailtoHref } from '../utils/emailObfuscator';
import { downloadCv } from '../utils/cvDownloader';

const BehanceIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg
    className={`fill-current ${className}`}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M22 7h-7V5h7v2zm1.726 10c0 2.174-1.288 3.82-3.726 3.82-2.31 0-3.652-1.57-3.652-3.52 0-2.32 1.632-3.83 3.896-3.83 2.19 0 3.482 1.34 3.482 3.53zm-3.623-1.8c-.89 0-1.543.52-1.748 1.48h3.315c-.09-1.01-.652-1.48-1.567-1.48zM8.22 13.06c1.196-.28 2.062-1.22 2.062-2.58 0-1.89-1.424-2.98-3.702-2.98H0v13h6.915c2.58 0 4.14-1.34 4.14-3.41 0-1.84-1.12-3.23-2.835-4.03zM3.108 9.25h3.04c1.072 0 1.688.42 1.688 1.25 0 .89-.66 1.33-1.688 1.33H3.108V9.25zm3.504 9.5H3.108v-2.88h3.504c1.23 0 1.88.49 1.88 1.44 0 .96-.65 1.44-1.88 1.44z" />
  </svg>
);

interface FooterProps {
  email: string;
  behance: string;
  linkedin?: string;
  instagram?: string;
}

export const Footer: React.FC<FooterProps> = ({ email, behance, linkedin, instagram }) => {
  const { t } = useLanguage();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 max-w-4xl mx-auto px-3.5 sm:px-6 md:px-8 mt-20 pb-20 sm:pb-16 border-t-2 border-zinc-200 dark:border-zinc-800 pt-10 no-print text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 max-w-full">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2 gap-y-1 text-center md:text-left max-w-full break-words">
          <span>© {new Date().getFullYear()} RUI GRANJA</span>
          <span className="text-lime-500 dark:text-[#CCFF00]">•</span>
          <span className="break-words">{t.footer.roleTagline}</span>
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 gap-y-2 w-full md:w-auto">
          {/* Download CV (Sublime Footer CTA) */}
          <a
            href="/Rui_Granja_CV.pdf"
            download="Rui_Granja_CV.pdf"
            onClick={(e) => {
              e.preventDefault();
              downloadCv();
            }}
            aria-label="Descarregar Currículo Vitae de Rui Granja em PDF"
            className="group hover:text-zinc-900 dark:hover:text-[#CCFF00] transition-colors inline-flex items-center gap-1.5 py-2.5 px-2 sm:py-1.5 sm:px-1 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 cursor-pointer"
            title={t.actions.downloadCv}
          >
            <FileDown className="w-3.5 h-3.5 shrink-0 text-[#5E7800] dark:text-[#CCFF00] group-hover:translate-y-0.5 transition-transform duration-200" />
            <span>CV</span>
          </a>

          <div className="inline-flex items-center gap-1">
            <a
              href={getMailtoHref()}
              className="group hover:text-zinc-900 dark:hover:text-[#CCFF00] transition-colors inline-flex items-center gap-1.5 py-2.5 px-2 sm:py-1.5 sm:px-1 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
            >
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span>{t.footer.contact}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-lime-600 dark:text-[#CCFF00] opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 shrink-0" />
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="hover:text-zinc-900 dark:hover:text-[#CCFF00] transition-colors inline-flex items-center gap-1 cursor-pointer p-2 sm:p-1.5 min-h-[44px] min-w-[44px] justify-center rounded-lg"
              title={t.footer.copyEmailTitle}
              aria-label={t.footer.copyEmailTitle}
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#5E7800] dark:text-[#CCFF00]" />
                  <span className="text-[#5E7800] dark:text-[#CCFF00] text-[10px] font-mono font-extrabold uppercase tracking-wider">{t.footer.copied}</span>
                </>
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
            <span className="sr-only" aria-live="polite">
              {copiedEmail ? t.footer.emailCopiedScreenReader : ""}
            </span>
          </div>
          <a
            href={behance}
            target="_blank"
            rel="noopener noreferrer"
            className="group hover:text-zinc-900 dark:hover:text-[#CCFF00] transition-colors inline-flex items-center gap-1.5 py-2.5 px-2 sm:py-1.5 sm:px-1 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
          >
            <BehanceIcon className="w-3.5 h-3.5 shrink-0" />
            <span>BEHANCE</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-lime-600 dark:text-[#CCFF00] opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 shrink-0" />
          </a>
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group hover:text-zinc-900 dark:hover:text-[#CCFF00] transition-colors inline-flex items-center gap-1.5 py-2.5 px-2 sm:py-1.5 sm:px-1 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
            >
              <Linkedin className="w-3.5 h-3.5 shrink-0" />
              <span>LINKEDIN</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-lime-600 dark:text-[#CCFF00] opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 shrink-0" />
            </a>
          )}
          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group hover:text-zinc-900 dark:hover:text-[#CCFF00] transition-colors inline-flex items-center gap-1.5 py-2.5 px-2 sm:py-1.5 sm:px-1 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
            >
              <Instagram className="w-3.5 h-3.5 shrink-0" />
              <span>INSTAGRAM</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-lime-600 dark:text-[#CCFF00] opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 shrink-0" />
            </a>
          )}
          <button
            onClick={scrollToTop}
            className="group hover:text-zinc-900 dark:hover:text-[#CCFF00] transition-colors inline-flex items-center gap-1 cursor-pointer text-lime-600 dark:text-[#CCFF00] py-2.5 px-3 sm:py-1.5 sm:px-2 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 rounded-lg"
            title={t.footer.backToTopTitle}
          >
            <span>{t.footer.top}</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
