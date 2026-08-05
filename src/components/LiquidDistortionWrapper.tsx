import React, { useState, useEffect, useRef, useId } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface LiquidDistortionWrapperProps {
  children: React.ReactNode;
  className?: string; // Outer container classes
  contentClassName?: string; // Inner content container classes (e.g. space-y-4)
  maxScale?: number; // Maximum distortion intensity scale (default: 20)
  disabled?: boolean;
}

export const LiquidDistortionWrapper: React.FC<LiquidDistortionWrapperProps> = ({
  children,
  className = '',
  contentClassName = '',
  maxScale = 20,
  disabled = false,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);

  const uniqueId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const filterId = `liquid-distortion-filter-${uniqueId}`;

  // Hardware capability check: Enabled by default, ensures liquid distortion works in preview frames
  const [isSupportedDevice, setIsSupportedDevice] = useState(true);

  // Motion values for smooth fluid physics
  const rawScale = useMotionValue(0);
  const rawSkewX = useMotionValue(0);
  const rawSkewY = useMotionValue(0);
  const rawPullX = useMotionValue(0);
  const rawPullY = useMotionValue(0);

  // Organic spring physics for fluid inertia
  const springScale = useSpring(rawScale, { stiffness: 160, damping: 15 });
  const springSkewX = useSpring(rawSkewX, { stiffness: 140, damping: 16 });
  const springSkewY = useSpring(rawSkewY, { stiffness: 140, damping: 16 });
  const springPullX = useSpring(rawPullX, { stiffness: 120, damping: 14 });
  const springPullY = useSpring(rawPullY, { stiffness: 120, damping: 14 });

  // Dynamic filter string derived directly from springScale without React state re-renders
  const filterValue = useTransform(springScale, (v) => (v > 0.1 ? `url(#${filterId})` : 'none'));

  const prevMouseRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const decayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const latestMouseRef = useRef<{ clientX: number; clientY: number } | null>(null);

  useEffect(() => {
    setIsSupportedDevice(true);
  }, []);

  const isEffectActive = isSupportedDevice && !disabled && !prefersReducedMotion;

  // Direct DOM SVG attribute mutation on spring physics change (bypasses React re-renders for 60fps filter updates)
  useEffect(() => {
    if (!isEffectActive) return;

    const unsubscribe = springScale.on('change', (latest) => {
      const currentScale = Math.max(0, latest);

      // Directly update SVG filter attributes on the DOM node to guarantee 60fps repaints without React re-renders
      if (displacementRef.current) {
        displacementRef.current.setAttribute('scale', currentScale.toFixed(2));
      }
      if (turbulenceRef.current) {
        const freqX = 0.015 + (currentScale / Math.max(1, maxScale)) * 0.035;
        const freqY = 0.025 + (currentScale / Math.max(1, maxScale)) * 0.035;
        turbulenceRef.current.setAttribute('baseFrequency', `${freqX.toFixed(4)} ${freqY.toFixed(4)}`);
      }
    });

    return () => unsubscribe();
  }, [isEffectActive, springScale, maxScale]);

  // Clean up RAF and timeouts
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current);
    };
  }, []);

  const updateDistortion = () => {
    rafIdRef.current = null;
    if (!isEffectActive || !containerRef.current || !latestMouseRef.current) return;

    const { clientX, clientY } = latestMouseRef.current;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const now = performance.now();

    if (prevMouseRef.current) {
      const dt = Math.max(1, now - prevMouseRef.current.time);
      const dx = x - prevMouseRef.current.x;
      const dy = y - prevMouseRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = dist / dt; // pixels per ms

      // Scale intensity based on cursor speed
      const targetScale = Math.min(maxScale, Math.pow(speed * 12, 1.2) + 2.5);
      rawScale.set(targetScale);

      // Fluid elastic skews and pulls
      const targetSkewX = Math.max(-6, Math.min(6, (dx / dt) * 3));
      const targetSkewY = Math.max(-4, Math.min(4, (dy / dt) * 2));
      const targetPullX = Math.max(-8, Math.min(8, dx * 0.15));
      const targetPullY = Math.max(-8, Math.min(8, dy * 0.15));

      rawSkewX.set(targetSkewX);
      rawSkewY.set(targetSkewY);
      rawPullX.set(targetPullX);
      rawPullY.set(targetPullY);
    } else {
      rawScale.set(4);
    }

    prevMouseRef.current = { x, y, time: now };

    if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current);
    decayTimeoutRef.current = setTimeout(() => {
      rawScale.set(0);
      rawSkewX.set(0);
      rawSkewY.set(0);
      rawPullX.set(0);
      rawPullY.set(0);
      prevMouseRef.current = null;
    }, 100);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEffectActive) return;
    latestMouseRef.current = { clientX: e.clientX, clientY: e.clientY };

    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(updateDistortion);
    }
  };

  const handleMouseLeave = () => {
    if (!isEffectActive) return;
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current);

    rawScale.set(0);
    rawSkewX.set(0);
    rawSkewY.set(0);
    rawPullX.set(0);
    rawPullY.set(0);
    prevMouseRef.current = null;
  };

  // Combine space-y or layout classes if passed via className or contentClassName
  const innerClasses = [
    contentClassName,
    className.includes('space-y-') ? className.split(' ').filter(c => c.startsWith('space-y-')).join(' ') : '',
  ]
    .filter(Boolean)
    .join(' ');

  // Fallback for non-hover devices, reduced motion, or disabled state
  if (!isEffectActive) {
    return (
      <div className={`relative ${className}`}>
        <div className={innerClasses || undefined}>{children}</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
    >
      {/* SVG Displacement Filter Definition */}
      <svg
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <defs>
          <filter
            id={filterId}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            filterUnits="objectBoundingBox"
            primitiveUnits="userSpaceOnUse"
          >
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.0150 0.0250"
              numOctaves="1"
              seed="7"
              result="liquidNoise"
            />
            <feDisplacementMap
              ref={displacementRef}
              in="SourceGraphic"
              in2="liquidNoise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Fluid Motion Container */}
      <motion.div
        style={{
          x: springPullX,
          y: springPullY,
          skewX: springSkewX,
          skewY: springSkewY,
          filter: filterValue,
        }}
        className={`w-full h-full will-change-[filter,transform] ${innerClasses}`}
      >
        {children}
      </motion.div>
    </div>
  );
};
