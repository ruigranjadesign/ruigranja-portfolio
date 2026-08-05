import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';

interface ScrollRevealTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

interface WordProps {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
}

const Word: React.FC<WordProps> = ({ word, range, progress }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  const color = useTransform(
    progress,
    range,
    ['rgba(161, 161, 170, 0.4)', 'rgba(24, 24, 27, 1)'] // Light mode transition
  );

  return (
    <span className="relative inline-block mr-[0.28em] py-0.5">
      <motion.span
        style={{ opacity }}
        className="transition-colors duration-150 text-zinc-900 dark:text-zinc-100"
      >
        {word}
      </motion.span>
    </span>
  );
};

export const ScrollRevealText: React.FC<ScrollRevealTextProps> = ({ text, className = '', style }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'end 0.65'],
  });

  const words = text.split(' ');

  return (
    <p ref={containerRef} className={className} style={style}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = Math.min(1, start + 0.6 / words.length);
        return (
          <Word
            key={`${word}-${i}`}
            word={word}
            range={[start, end]}
            progress={scrollYProgress}
          />
        );
      })}
    </p>
  );
};
