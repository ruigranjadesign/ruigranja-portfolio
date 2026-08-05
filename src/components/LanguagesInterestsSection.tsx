import React, { useState, useEffect, useRef } from 'react';
import { LanguagesAndInterests } from '../types';
import { Globe, Heart } from 'lucide-react';
import { useInView } from 'motion/react';
import { SectionHeader } from './SectionHeader';
import { useLanguage } from '../contexts/LanguageContext';

interface LanguagesInterestsSectionProps {
  data: LanguagesAndInterests;
}

export const LanguagesInterestsSection: React.FC<LanguagesInterestsSectionProps> = ({ data }) => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.1 });

  const rotatingWords = t.languagesInterests.rotatingWords;
  const [wordIndex, setWordIndex] = useState(0);

  // Smoothly rotate words every 3 seconds when in view
  useEffect(() => {
    if (!isInView || rotatingWords.length <= 1) return;

    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isInView, rotatingWords.length]);

  const currentWord = rotatingWords[wordIndex % rotatingWords.length] || 'PROFILE';

  return (
    <section id="languages-interests" ref={sectionRef} className="print-break-inside-avoid scroll-mt-24 max-w-full">
      <SectionHeader
        badge={t.languagesInterests.badge}
        title={t.languagesInterests.titlePrefix}
        highlightWord={currentWord}
        className="mb-8 md:mb-12"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-full">
        {/* Column 1: Languages */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 sm:p-6 md:p-8 bg-white dark:bg-zinc-900/30 hover:border-[#5E7800] dark:hover:border-[#CCFF00] transition-all duration-200 shadow-2xs flex flex-col justify-between max-w-full overflow-hidden">
          <div className="max-w-full">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800/80 max-w-full">
              <Globe className="w-4 h-4 text-[#5E7800] dark:text-[#CCFF00] shrink-0" />
              <h3 className="text-[12px] font-mono font-extrabold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 break-words max-w-full">
                {t.languagesInterests.languagesTitle}
              </h3>
            </div>

            <div className="space-y-3 pt-2 max-w-full">
              {data.languages.map((lang, idx) => (
                <div key={idx} className="flex flex-wrap items-center justify-between gap-2 max-w-full">
                  <span className="text-[14px] font-syne font-bold uppercase tracking-tight text-zinc-800 dark:text-zinc-200 break-words max-w-full">
                    {lang.language}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-extrabold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/80 break-words max-w-full shrink-0">
                    {lang.fluency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Personal Interests */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 sm:p-6 md:p-8 bg-white dark:bg-zinc-900/30 hover:border-[#5E7800] dark:hover:border-[#CCFF00] transition-all duration-200 shadow-2xs flex flex-col justify-between max-w-full overflow-hidden">
          <div className="max-w-full">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800/80 max-w-full">
              <Heart className="w-4 h-4 text-[#5E7800] dark:text-[#CCFF00] shrink-0" />
              <h3 className="text-[12px] font-mono font-extrabold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 break-words max-w-full">
                {t.languagesInterests.interestsTitle}
              </h3>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-2 max-w-full">
              {data.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-[11px] sm:text-[12px] font-mono font-semibold bg-zinc-100/90 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/80 hover:border-[#5E7800] dark:hover:border-[#CCFF00]/80 transition-all shadow-2xs break-words max-w-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
