import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface VhsTrackingBandProps {
  children: React.ReactNode;
  className?: string;
  minIntervalMs?: number; // min random interval in ms (default: 8000)
  maxIntervalMs?: number; // max random interval in ms (default: 15000)
}

interface GlitchState {
  isActive: boolean;
  bandTop: number; // percentage 0 - 80%
  bandHeight: number; // percentage 12 - 28%
  sliceOffset1: number; // px shift left/right
  sliceOffset2: number; // px shift opposite
  skewDeg: number;
  trackingTime: number;
}

export const VhsTrackingBand: React.FC<VhsTrackingBandProps> = ({
  children,
  className = '',
  minIntervalMs = 8000,
  maxIntervalMs = 15000,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [glitch, setGlitch] = useState<GlitchState>({
    isActive: false,
    bandTop: 30,
    bandHeight: 18,
    sliceOffset1: -22,
    sliceOffset2: 18,
    skewDeg: -2,
    trackingTime: 42,
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const glitchDurationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerGlitch = useCallback(() => {
    if (prefersReducedMotion) return;

    // Randomize band params for realistic VHS tracking error
    const bandHeight = Math.floor(Math.random() * 16) + 12; // 12% to 28%
    const bandTop = Math.floor(Math.random() * (90 - bandHeight)); // Positioned within bounds
    const sliceOffset1 = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 18) + 14); // 14px to 32px
    const sliceOffset2 = -sliceOffset1 * 0.75;
    const skewDeg = (Math.random() - 0.5) * 6; // -3deg to +3deg
    const trackingTime = Math.floor(Math.random() * 80 + 10);

    setGlitch({
      isActive: true,
      bandTop,
      bandHeight,
      sliceOffset1,
      sliceOffset2,
      skewDeg,
      trackingTime,
    });

    if (glitchDurationTimeoutRef.current) {
      clearTimeout(glitchDurationTimeoutRef.current);
    }

    // VHS tracking glitch burst duration: 650ms
    glitchDurationTimeoutRef.current = setTimeout(() => {
      setGlitch(prev => ({ ...prev, isActive: false }));
    }, 650);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (glitchDurationTimeoutRef.current) clearTimeout(glitchDurationTimeoutRef.current);
      setGlitch(prev => ({ ...prev, isActive: false }));
      return;
    }

    const scheduleNextGlitch = () => {
      const delay = Math.floor(Math.random() * (maxIntervalMs - minIntervalMs)) + minIntervalMs;
      timerRef.current = setTimeout(() => {
        triggerGlitch();
        scheduleNextGlitch();
      }, delay);
    };

    scheduleNextGlitch();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (glitchDurationTimeoutRef.current) clearTimeout(glitchDurationTimeoutRef.current);
    };
  }, [minIntervalMs, maxIntervalMs, triggerGlitch, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <div className={`relative ${className}`}>{children}</div>;
  }

  // Calculate clip paths for sliced distortion layers
  const top1 = glitch.bandTop;
  const bottom1 = 100 - (glitch.bandTop + glitch.bandHeight);

  const top2 = Math.max(0, glitch.bandTop - 6);
  const bottom2 = Math.min(100, 100 - (glitch.bandTop + glitch.bandHeight * 0.5));

  return (
    <div className={`relative ${className}`}>
      {/* Base children content */}
      <motion.div
        animate={
          glitch.isActive
            ? {
                x: [0, -2, 3, -1, 0],
                y: [0, 1, -1, 0],
                filter: [
                  'none',
                  'drop-shadow(-1px 0 0 rgba(255, 0, 85, 0.5)) drop-shadow(1px 0 0 rgba(0, 255, 255, 0.5))',
                  'none',
                ],
              }
            : { x: 0, y: 0, filter: 'none' }
        }
        transition={{ duration: 0.65, ease: 'easeInOut' }}
        className="w-full"
      >
        {children}
      </motion.div>

      {/* VHS Tracking Glitch Overlay Layers */}
      <AnimatePresence>
        {glitch.isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute inset-0 pointer-events-none overflow-hidden z-20 select-none"
            aria-hidden="true"
          >
            {/* Slice Layer 1: Horizontal pixel displacement shift left/right */}
            <motion.div
              animate={{
                x: [0, glitch.sliceOffset1, glitch.sliceOffset1 * 0.4, glitch.sliceOffset1 * 1.2, 0],
                skewX: [0, glitch.skewDeg, -glitch.skewDeg, 0],
              }}
              transition={{ duration: 0.6, ease: 'steps(5)' as any }}
              style={{
                clipPath: `inset(${top1}% 0% ${bottom1}% 0%)`,
              }}
              className="absolute inset-0 w-full h-full mix-blend-normal filter drop-shadow(-3px 0 0 rgba(255, 0, 85, 0.9)) drop-shadow(3px 0 0 rgba(0, 255, 255, 0.9)) pointer-events-none"
              aria-hidden="true"
            >
              {children}
            </motion.div>

            {/* Slice Layer 2: Secondary offset slice for layered tracking tear */}
            <motion.div
              animate={{
                x: [0, glitch.sliceOffset2, glitch.sliceOffset2 * 1.3, 0],
              }}
              transition={{ duration: 0.55, ease: 'steps(4)' as any }}
              style={{
                clipPath: `inset(${top2}% 0% ${bottom2}% 0%)`,
              }}
              className="absolute inset-0 w-full h-full filter drop-shadow(2px 0 0 rgba(204, 255, 0, 0.85)) drop-shadow(-2px 0 0 rgba(0, 255, 255, 0.85)) pointer-events-none"
              aria-hidden="true"
            >
              {children}
            </motion.div>

            {/* Real VHS Tracking Band Sweep Bar with Static Noise */}
            <motion.div
              initial={{ top: `${glitch.bandTop}%`, opacity: 0.9 }}
              animate={{
                top: [`${glitch.bandTop - 5}%`, `${glitch.bandTop + glitch.bandHeight + 5}%`],
                opacity: [0.95, 0.7, 0.9, 0],
              }}
              transition={{ duration: 0.65, ease: 'linear' }}
              style={{
                height: `${glitch.bandHeight}%`,
              }}
              className="absolute left-0 right-0 z-30 pointer-events-none flex flex-col justify-between overflow-hidden"
            >
              {/* Top Distortion Edge Highlight Line */}
              <div className="h-[2px] w-full bg-gradient-to-r from-cyan-400 via-[#CCFF00] to-rose-500 opacity-90 shadow-[0_0_8px_#CCFF00]" />

              {/* VHS Static Noise Bar Canvas / SVG Pattern */}
              <div className="flex-1 w-full relative bg-zinc-900/30 dark:bg-zinc-100/10 backdrop-blur-[0.5px] mix-blend-overlay overflow-hidden">
                {/* Horizontal CRT Scanlines */}
                <div
                  className="absolute inset-0 opacity-40 dark:opacity-60"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255, 255, 255, 0.4) 1px, rgba(255, 255, 255, 0.4) 2px)',
                  }}
                />

                {/* SVG Static Pixel Snow Noise Pattern */}
                <svg className="absolute inset-0 w-full h-full opacity-35 mix-blend-screen">
                  <filter id="vhs-static-noise">
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency="0.85 0.15"
                      numOctaves="3"
                      stitchTiles="stitch"
                    />
                    <feColorMatrix type="saturate" values="0" />
                  </filter>
                  <rect width="100%" height="100%" filter="url(#vhs-static-noise)" />
                </svg>

                {/* VHS Tape Tracking HUD Text Indicator */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[9px] font-black tracking-widest text-[#CCFF00] dark:text-[#CCFF00] opacity-80 uppercase drop-shadow-[0_0_4px_rgba(0,0,0,0.8)]">
                  PLAY ► TRACKING 0:{glitch.trackingTime}
                </div>
              </div>

              {/* Bottom Distortion Edge Line */}
              <div className="h-[2px] w-full bg-gradient-to-r from-rose-500 via-cyan-400 to-[#CCFF00] opacity-80" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
