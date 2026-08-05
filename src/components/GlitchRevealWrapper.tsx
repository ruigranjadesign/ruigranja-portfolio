import React from 'react';
import { motion, Variants } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface GlitchRevealWrapperProps {
  children: React.ReactNode;
  className?: string;
  glitchDuration?: number; // Duration of glitch in ms (default: 350ms)
  once?: boolean; // Trigger only once when entering viewport (default: true)
  amount?: number | 'some' | 'all'; // Viewport threshold (default: 0.15)
  disabled?: boolean; // Disabled while intro loader is active
}

export const GlitchRevealWrapper: React.FC<GlitchRevealWrapperProps> = ({
  children,
  className = '',
  glitchDuration = 350,
  once = true,
  amount = 'some',
  disabled = false,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const isAnimationDisabled = disabled || prefersReducedMotion;
  const durationSec = glitchDuration / 1000;

  // Normalized keyframes (5 elements matching times: [0, 0.25, 0.5, 0.75, 1])
  const glitchVariants: Variants = {
    initial: {
      x: 0,
      y: 0,
      skewX: 0,
      filter: 'none',
    },
    animate: {
      x: [0, -3, 3, -1.5, 0],
      y: [0, 1, -1, 0.5, 0],
      skewX: [0, -1, 1, -0.5, 0],
      filter: [
        'none',
        'drop-shadow(-2.5px 0 0 rgba(255, 0, 85, 0.8)) drop-shadow(2.5px 0 0 rgba(0, 255, 255, 0.8)) drop-shadow(0 1px 0 rgba(204, 255, 0, 0.9))',
        'drop-shadow(3px 0 0 rgba(255, 0, 85, 0.85)) drop-shadow(-3px 0 0 rgba(0, 255, 255, 0.85))',
        'drop-shadow(-1px 0 0 rgba(204, 255, 0, 0.8))',
        'none',
      ],
      transition: {
        duration: durationSec,
        ease: 'easeInOut',
        times: [0, 0.25, 0.5, 0.75, 1],
      },
    },
  };

  // Overlay container variants (scanlines opacity)
  const overlayVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: [0, 0.9, 0.6, 0.2, 0],
      transition: {
        duration: durationSec,
        ease: 'easeOut',
        times: [0, 0.25, 0.5, 0.75, 1],
      },
    },
  };

  // Sweeping light beam variants
  const lightBeamVariants: Variants = {
    initial: { top: '-15%' },
    animate: {
      top: ['-15%', '25%', '60%', '90%', '115%'],
      transition: {
        duration: durationSec,
        ease: 'linear',
        times: [0, 0.25, 0.5, 0.75, 1],
      },
    },
  };

  // RGB split slice band variants
  const rgbSplitVariants: Variants = {
    initial: { top: '15%', height: '6px', opacity: 0 },
    animate: {
      top: ['15%', '45%', '35%', '25%', '25%'],
      height: ['6px', '10px', '8px', '4px', '4px'],
      opacity: [0, 0.7, 0.4, 0.2, 0],
      transition: {
        duration: durationSec,
        ease: 'easeInOut',
        times: [0, 0.25, 0.5, 0.75, 1],
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileInView={isAnimationDisabled ? undefined : 'animate'}
      viewport={{ once, amount }}
      className={`relative ${className}`}
    >
      {/* Primary Glitch Motion Container */}
      <motion.div variants={glitchVariants} className="w-full h-full">
        {children}
      </motion.div>

      {/* Sync Glitch Scanlines & Light Beam Sweep Overlay */}
      {!isAnimationDisabled && (
        <motion.div
          variants={overlayVariants}
          className="absolute inset-0 z-30 pointer-events-none overflow-hidden select-none"
        >
          {/* CRT Scanline Overlay */}
          <div
            className="absolute inset-0 opacity-15 dark:opacity-25 mix-blend-overlay"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 0, 0, 0.35) 1px, rgba(0, 0, 0, 0.35) 3px)',
            }}
          />

          {/* Sweeping Light Beam */}
          <motion.div
            variants={lightBeamVariants}
            className="absolute left-0 right-0 h-12 bg-gradient-to-b from-transparent via-lime-400/25 dark:via-[#CCFF00]/30 to-transparent blur-[1px]"
          />

          {/* RGB Split Slice Band */}
          <motion.div
            variants={rgbSplitVariants}
            className="absolute left-0 right-0 bg-cyan-400/20 dark:bg-[#CCFF00]/20 mix-blend-difference"
          />
        </motion.div>
      )}
    </motion.div>
  );
};

