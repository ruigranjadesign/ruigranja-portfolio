import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface MagneticTiltWrapperProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glow?: boolean;
}

export const MagneticTiltWrapper: React.FC<MagneticTiltWrapperProps> = ({
  children,
  className = '',
  maxTilt = 8,
  glow = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Support mouse/touch tilt (enabled by default, fallback for iframe previews)
  const [isSupportedDevice, setIsSupportedDevice] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isCoarseOnly = window.matchMedia('(pointer: coarse) and (hover: none)').matches;
    setIsSupportedDevice(!isCoarseOnly);
  }, []);

  // Motion values for tilt
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);

  // Motion values for glow cursor
  const rawGlowX = useMotionValue(0);
  const rawGlowY = useMotionValue(0);
  const rawGlowOpacity = useMotionValue(0);

  // Springs matching LiquidDistortionWrapper physics
  const springRotateX = useSpring(rawRotateX, { stiffness: 120, damping: 14 });
  const springRotateY = useSpring(rawRotateY, { stiffness: 120, damping: 14 });

  const springGlowX = useSpring(rawGlowX, { stiffness: 150, damping: 16 });
  const springGlowY = useSpring(rawGlowY, { stiffness: 150, damping: 16 });
  const springGlowOpacity = useSpring(rawGlowOpacity, { stiffness: 120, damping: 14 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Relative offset from center (-0.5 to +0.5)
    const pctX = mouseX / rect.width - 0.5;
    const pctY = mouseY / rect.height - 0.5;

    // Calculate 3D tilt angles (moving right tilts around Y, moving down tilts around X)
    const targetRotateY = pctX * 2 * maxTilt;
    const targetRotateX = -pctY * 2 * maxTilt;

    rawRotateX.set(targetRotateX);
    rawRotateY.set(targetRotateY);

    if (glow) {
      rawGlowX.set(mouseX);
      rawGlowY.set(mouseY);
      rawGlowOpacity.set(1);
    }
  };

  const handleMouseLeave = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
    rawGlowOpacity.set(0);
  };

  // If reduced motion is preferred or touch-only device, render plain container
  if (shouldReduceMotion || !isSupportedDevice) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative [perspective:1000px] ${className}`}
    >
      <motion.div
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: 'preserve-3d',
        }}
        className={`relative w-full h-full will-change-transform ${className}`}
      >
        {children}

        {/* Cursor Glow Overlay */}
        {glow && (
          <motion.div
            style={{
              x: springGlowX,
              y: springGlowY,
              opacity: springGlowOpacity,
            }}
            className="pointer-events-none absolute -top-32 -left-32 w-64 h-64 rounded-full blur-2xl bg-lime-500/20 dark:bg-[#CCFF00]/25 -z-0"
          />
        )}
      </motion.div>
    </div>
  );
};
