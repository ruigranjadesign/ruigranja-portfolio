import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface CrtThemeWrapperProps {
  isTransitioning: boolean;
  children: React.ReactNode;
}

export const CrtThemeWrapper: React.FC<CrtThemeWrapperProps> = ({
  isTransitioning,
  children,
}) => {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <motion.div
        animate={{
          opacity: isTransitioning ? [1, 0.2, 1] : 1,
        }}
        transition={{
          duration: 0.22,
          ease: 'easeInOut',
        }}
        className="w-full min-h-screen"
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      {/* Collapsing Page Content Container */}
      <motion.div
        animate={
          isTransitioning
            ? {
                scaleY: [1, 0.003, 0.003, 1],
                scaleX: [1, 0.88, 0.88, 1],
                filter: [
                  'brightness(1) contrast(1)',
                  'brightness(2.6) contrast(1.8) saturate(1.4)',
                  'brightness(2.6) contrast(1.8) saturate(1.4)',
                  'brightness(1) contrast(1)',
                ],
              }
            : {
                scaleY: 1,
                scaleX: 1,
                filter: 'brightness(1) contrast(1)',
              }
        }
        transition={{
          duration: 0.38,
          times: [0, 0.48, 0.52, 1],
          ease: [0.76, 0, 0.24, 1],
        }}
        className="origin-center w-full min-h-screen"
      >
        {children}
      </motion.div>

      {/* CRT Power Off/On Phosphor Scanline & Flash Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.08 }}
            className="fixed inset-0 pointer-events-none z-[999999] flex items-center justify-center overflow-hidden"
          >
            {/* Dark CRT Screen Edge Vignette Frame */}
            <motion.div
              className="absolute inset-0 bg-black/50"
              animate={{
                opacity: [0, 0.85, 0.85, 0],
              }}
              transition={{
                duration: 0.38,
                times: [0, 0.45, 0.55, 1],
              }}
              style={{
                backgroundImage:
                  'radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.85) 90%)',
              }}
            />

            {/* CRT Horizontal Phosphor Flash Scanline */}
            <motion.div
              className="absolute w-full h-[3px] bg-white shadow-[0_0_20px_#ffffff,0_0_40px_#CCFF00,0_0_80px_rgba(0,240,255,0.9),0_0_120px_rgba(255,255,255,1)]"
              animate={{
                scaleX: [0.1, 1, 1, 0.1],
                scaleY: [1, 2.5, 2.5, 1],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 0.38,
                times: [0, 0.4, 0.6, 1],
                ease: 'easeInOut',
              }}
            />

            {/* Center Phosphor Beam Flare Dot */}
            <motion.div
              className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_30px_12px_#ffffff,0_0_60px_24px_#CCFF00]"
              animate={{
                scale: [0, 3.5, 3.5, 0],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 0.38,
                times: [0, 0.48, 0.52, 1],
              }}
            />

            {/* Retro CRT Scanline Texture Lines */}
            <div
              className="absolute inset-0 opacity-25 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0px, rgba(0,0,0,0.5) 1px, transparent 1px, transparent 3px)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
