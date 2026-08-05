import React, { useEffect, useRef } from 'react';
import { useInView, useMotionValue, animate } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  prefix = '',
  suffix = '',
  duration = 1200,
  className = '',
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(spanRef, { once: true, amount: 'some' });
  const shouldReduceMotion = useReducedMotion();
  const count = useMotionValue(0);

  useEffect(() => {
    if (shouldReduceMotion) return;
    if (!isInView) return;

    count.set(0);
    const durationInSeconds = duration / 1000;
    const controls = animate(count, value, {
      duration: durationInSeconds,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        if (spanRef.current) {
          spanRef.current.textContent = `${prefix}${Math.round(latest)}${suffix}`;
        }
      },
    });

    return () => controls.stop();
  }, [isInView, value, prefix, suffix, duration, shouldReduceMotion, count]);

  if (shouldReduceMotion) {
    return <span className={`inline-block tabular-nums ${className}`}>{prefix}{Math.round(value)}{suffix}</span>;
  }

  return <span ref={spanRef} className={`inline-block tabular-nums ${className}`}>{prefix}0{suffix}</span>;
};
