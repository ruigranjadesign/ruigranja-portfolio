import React, { useState, useEffect } from 'react';
import { Mail, Copy, Check, Clock, ArrowUpRight, FileDown } from 'lucide-react';
import { MagneticTiltWrapper } from './MagneticTiltWrapper';
import { useLanguage } from '../contexts/LanguageContext';
import { getMailtoHref } from '../utils/emailObfuscator';
import { SectionHeader } from './SectionHeader';
import { downloadCv } from '../utils/cvDownloader';

interface PreFooterSectionProps {
  email: string;
  location?: string;
  behanceUrl?: string;
  linkedinUrl?: string;
}

export const PreFooterSection: React.FC<PreFooterSectionProps> = ({
  email,
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [clockDisplay, setClockDisplay] = useState<string>('--:--:-- WEST · PORTUGAL');

  // Real-time Portugal Clock with explicit cleanup to prevent memory leaks
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // 24-hour time format in Portugal
      const timeFormatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Lisbon',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

      const timeStr = timeFormatter.format(now);

      // Timezone abbreviation determination (WEST / WET)
      const tzFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Lisbon',
        timeZoneName: 'short',
      });
      const parts = tzFormatter.formatToParts(now);
      const rawTz = parts.find((p) => p.type === 'timeZoneName')?.value || 'WEST';

      let tzLabel = 'WEST';
      if (rawTz.includes('WET') || rawTz === 'GMT') {
        tzLabel = 'WET';
      } else if (rawTz.includes('WEST') || rawTz.includes('GMT+1') || rawTz.includes('BST')) {
        tzLabel = 'WEST';
      }

      setClockDisplay(`${timeStr} ${tzLabel} · PORTUGAL`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="contact" className="print-break-inside-avoid scroll-mt-24">
      <div id="contact-availability" />
      <MagneticTiltWrapper maxTilt={5} glow={true} className="w-full">
        <div id="contact-cta" className="relative overflow-hidden rounded-xl border-0 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-900 p-5 sm:p-8 md:p-12 shadow-xl transition-all duration-300">
          
          {/* Decorative Corner Accent Lines */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-lime-500/10 dark:from-[#CCFF00]/15 to-transparent blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-radial from-lime-500/10 dark:from-[#CCFF00]/10 to-transparent blur-2xl pointer-events-none" />

          <div className="space-y-6 relative z-10 max-w-4xl">
            {/* Discreet Portugal Clock Caption */}
            <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-zinc-500 dark:text-zinc-400 select-none">
              <Clock className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
              <span>{clockDisplay}</span>
            </div>

            {/* Primary Headline */}
            <SectionHeader
              badge={t.preFooter.badge}
              title={t.preFooter.titleStart}
              highlightWord={t.preFooter.titleHighlight}
              titleSuffix={t.preFooter.titleEnd}
            />

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2 max-w-full">
              <a
                href={getMailtoHref('Project / Role Inquiry - Rui Granja')}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-3 rounded-lg bg-zinc-900 dark:bg-[#CCFF00] text-white dark:text-zinc-950 font-mono text-[11px] sm:text-xs font-extrabold uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-[#b8e600] transition-all shadow-md active:scale-98 min-h-[44px] max-w-full break-words"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span className="break-words">{t.preFooter.startConversation}</span>
                <ArrowUpRight className="w-4 h-4 ml-0.5 shrink-0" />
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-3 rounded-lg bg-white dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider hover:border-[#5E7800] dark:hover:border-[#CCFF00] transition-all active:scale-98 cursor-pointer min-h-[44px] max-w-full break-words"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#5E7800] dark:text-[#CCFF00] shrink-0" />
                    <span className="text-[#5E7800] dark:text-[#CCFF00] break-words">{t.preFooter.emailCopied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
                    <span className="break-words">{t.preFooter.copyEmail}</span>
                  </>
                )}
              </button>

              <a
                href="/Rui_Granja_CV.pdf"
                download="Rui_Granja_CV.pdf"
                onClick={(e) => {
                  e.preventDefault();
                  downloadCv();
                }}
                aria-label="Descarregar Currículo Vitae de Rui Granja em PDF"
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-3 rounded-lg bg-white dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider hover:border-[#5E7800] dark:hover:border-[#CCFF00] hover:text-[#5E7800] dark:hover:text-[#CCFF00] transition-all active:scale-98 cursor-pointer min-h-[44px] max-w-full break-words group"
                title={t.actions.downloadCv}
              >
                <FileDown className="w-4 h-4 text-[#5E7800] dark:text-[#CCFF00] group-hover:translate-y-0.5 transition-transform shrink-0" />
                <span>CV</span>
              </a>
            </div>
          </div>
        </div>
      </MagneticTiltWrapper>
    </section>
  );
};
