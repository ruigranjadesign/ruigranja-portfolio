import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, Sparkles, Smile, Pen, Lightbulb, MessageSquare } from 'lucide-react';
import { FAQItem } from '../types';
import { SectionHeader } from './SectionHeader';
import { useLanguage } from '../contexts/LanguageContext';

interface FAQSectionProps {
  faqs: FAQItem[];
}

const ANSWER_ICONS = [Smile, Pen, Sparkles, Lightbulb, MessageSquare];

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  const { t } = useLanguage();
  // Expand first FAQ by default
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faqs" className="print-break-inside-avoid scroll-mt-24 max-w-full">
      {/* Section Header */}
      <SectionHeader
        badge={t.faqs.badge}
        title={t.faq.title}
        description={t.faq.subtitle}
        icon={
          <span className="p-1.5 sm:p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-[#5E7800] dark:text-[#CCFF00] shrink-0 inline-flex items-center justify-center">
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </span>
        }
        className="mb-8 md:mb-12"
      />

      {/* Accordion Container */}
      <div className="space-y-4 max-w-full">
        {faqs.map((item, index) => {
          const isOpen = openId === item.id;
          const triggerId = `faq-trigger-${item.id}`;
          const contentId = `faq-panel-${item.id}`;

          return (
            <div
              key={item.id}
              className={`border transition-all duration-300 rounded-xl bg-white dark:bg-zinc-900/40 backdrop-blur-xs max-w-full ${
                isOpen
                  ? 'border-[#5E7800]/60 dark:border-[#CCFF00]/60 shadow-[0_4px_20px_rgba(204,255,0,0.08)] dark:shadow-[0_4px_20px_rgba(204,255,0,0.12)] bg-zinc-50/50 dark:bg-zinc-900/70 overflow-visible'
                  : 'border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 overflow-hidden'
              }`}
            >
              {/* Accordion Trigger */}
              <button
                id={triggerId}
                type="button"
                onClick={() => toggleFAQ(item.id)}
                aria-expanded={isOpen}
                aria-controls={contentId}
                tabIndex={0}
                className="w-full text-left px-4 py-3.5 sm:px-6 sm:py-5 flex items-center justify-between gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7800] dark:focus-visible:ring-[#CCFF00] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 rounded-xl transition-colors group min-h-[52px] max-w-full"
              >
                <div className="flex items-center gap-2.5 sm:gap-4 pr-1 min-w-0 max-w-full">
                  <span className="font-mono text-xs font-bold text-[#5E7800] dark:text-[#CCFF00] px-2 py-0.5 rounded-lg bg-lime-500/10 dark:bg-[#CCFF00]/10 border border-[#5E7800]/20 dark:border-[#CCFF00]/20 shrink-0">
                    0{index + 1}
                  </span>
                  <span className="text-xs sm:text-base font-syne font-bold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-[#5E7800] dark:group-hover:text-[#CCFF00] transition-colors break-words min-w-0 max-w-full">
                    {item.question}
                  </span>
                </div>

                {/* Microinteraction Indicator Icon */}
                <div
                  className={`p-2 rounded-xl border transition-all duration-300 shrink-0 ${
                    isOpen
                      ? 'bg-[#5E7800] dark:bg-[#CCFF00] text-white dark:text-zinc-950 border-[#5E7800] dark:border-[#CCFF00] rotate-180 shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 group-hover:text-zinc-900 dark:group-hover:text-zinc-200'
                  }`}
                >
                  <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                </div>
              </button>

              {/* Accordion Panel */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={contentId}
                    role="region"
                    aria-labelledby={triggerId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: isOpen ? 'visible' : 'hidden' }}
                    className="max-w-full"
                  >
                    <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 font-sans border-t border-zinc-100 dark:border-zinc-800/60 mt-2 max-w-full">
                      <div className="flex gap-2.5 sm:gap-3 pt-3 max-w-full">
                        {React.createElement(ANSWER_ICONS[index % ANSWER_ICONS.length], {
                          className: "w-4 h-4 text-[#5E7800] dark:text-[#CCFF00] shrink-0 mt-0.5"
                        })}
                        <p className="flex-1 break-words max-w-full">{item.answer}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};
