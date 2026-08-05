import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export interface SectionHeaderProps {
  badge?: string;
  title?: string;
  highlightWord?: string;
  highlightOnNewLine?: boolean;
  titleSuffix?: string;
  description?: string | React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  as?: 'h1' | 'h2' | 'h3' | 'div';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title = '',
  highlightWord,
  highlightOnNewLine = false,
  titleSuffix,
  description,
  icon,
  className = '',
  titleClassName = '',
  as = 'h2',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const Tag = as;

  // Split title and titleSuffix into individual words
  const titleWords = title ? title.trim().split(/\s+/).filter(Boolean) : [];
  const suffixWords = titleSuffix ? titleSuffix.trim().split(/\s+/).filter(Boolean) : [];

  const baseTitleStyles =
    'font-black uppercase tracking-tight leading-[1.18] font-syne py-1 max-w-full min-w-0 text-[clamp(1.15rem,4.5vw,3.25rem)] overflow-visible';

  const wordGradientClasses =
    'inline-block overflow-visible whitespace-nowrap bg-gradient-to-b from-[#3B5000] to-[#243300] dark:from-[#CCFF00] dark:to-[#5E7800] bg-clip-text text-transparent pr-[0.2em] mr-1 sm:mr-1.5 mb-1';

  return (
    <div className={`max-w-full ${className}`.trim()}>
      {/* Badge */}
      {badge && (
        <span className="text-[10px] uppercase tracking-[0.3em] font-extrabold font-mono text-zinc-400 dark:text-zinc-500 block mb-2 break-words [overflow-wrap:anywhere] max-w-full">
          {badge}
        </span>
      )}

      {/* Main Title Heading with Word Animations & Wrapping */}
      <Tag className={`${baseTitleStyles} ${titleClassName}`.trim()}>
        <div className="flex flex-wrap items-baseline max-w-full min-w-0 overflow-visible">
          {/* Optional Icon */}
          {icon && <span className="mr-3 mb-1 shrink-0 inline-flex items-center">{icon}</span>}

          {/* Title Words */}
          {titleWords.map((word, index) => (
            <motion.span
              key={`title-${word}-${index}`}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.35,
                delay: index * 0.04,
                ease: 'easeOut',
              }}
              className={wordGradientClasses}
            >
              {word}
            </motion.span>
          ))}

          {/* Highlight Word (Animates smoothly with fade & vertical slide when value changes) */}
          {highlightWord && (
            <AnimatePresence mode="wait">
              <motion.span
                key={highlightWord}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`inline-flex flex-wrap items-baseline max-w-full overflow-visible ${highlightOnNewLine ? 'w-full block' : ''}`.trim()}
              >
                {highlightWord
                  .trim()
                  .split(/\s+/)
                  .filter(Boolean)
                  .map((hWord, hIdx) => (
                    <span
                      key={`hw-${hWord}-${hIdx}`}
                      className={wordGradientClasses}
                    >
                      {hWord}
                    </span>
                  ))}
              </motion.span>
            </AnimatePresence>
          )}

          {/* Suffix Words */}
          {suffixWords.map((word, index) => (
            <motion.span
              key={`suffix-${word}-${index}`}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.35,
                delay: (titleWords.length + index) * 0.04,
                ease: 'easeOut',
              }}
              className={wordGradientClasses}
            >
              {word}
            </motion.span>
          ))}
        </div>
      </Tag>

      {/* Description */}
      {description && (
        typeof description === 'string' ? (
          <p className="mt-3 text-xs sm:text-sm md:text-base font-sans text-zinc-600 dark:text-zinc-400 max-w-2xl break-words [overflow-wrap:anywhere] leading-relaxed">
            {description}
          </p>
        ) : (
          <div className="mt-3 break-words [overflow-wrap:anywhere]">{description}</div>
        )
      )}
    </div>
  );
};
