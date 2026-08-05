import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * FilmGrainOverlay
 * 
 * Global animated "Noise" Film Grain Overlay component that sits fixed across 
 * the entire viewport to add a subtle, premium analog film texture.
 * 
 * Technical Features:
 * - Fixed full-screen overlay (pointer-events-none, z-50)
 * - 24FPS frame rate using CSS steps(24) transform jitter
 * - Desktop-only conditional rendering (hidden on mobile/touch viewports)
 * - Zero CLS impact & WCAG AA contrast preservation
 */
export const FilmGrainOverlay: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(min-width: 768px) and (pointer: fine)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(min-width: 768px) and (pointer: fine)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  // Do not render on mobile/touch screens to conserve performance and battery life
  if (!isDesktop) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none hidden md:block"
      style={{
        // Keep strictly pointer-events: none and no layout impact
        pointerEvents: 'none',
      }}
    >
      {/* 
        High-frequency film grain texture layer.
        Sized larger than viewport (300% x 300%) to allow 24fps jitter shifts 
        without revealing layer edges.
      */}
      <div
        className={`absolute -inset-[100%] w-[300%] h-[300%] opacity-[0.065] dark:opacity-[0.075] mix-blend-overlay ${
          prefersReducedMotion ? '' : 'animate-film-grain-24fps'
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          willChange: 'transform',
        }}
      />
    </div>
  );
};

export default FilmGrainOverlay;
