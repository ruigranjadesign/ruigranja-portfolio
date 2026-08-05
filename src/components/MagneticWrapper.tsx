import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

export interface MagneticWrapperProps {
  children: React.ReactNode;
  className?: string;
  /** Intensity multiplier controlling how far the element follows the cursor (default: 0.35) */
  intensity?: number;
  /** Spring physics options for GPU-accelerated motion */
  springConfig?: { stiffness?: number; damping?: number; mass?: number };
}

/**
 * MagneticWrapper
 * Micro-interaction component providing a spring-based magnetic pull effect towards mouse cursor.
 * Uses Framer Motion's `useMotionValue` + `useSpring` for GPU-accelerated 60fps rendering.
 * Includes complete fallback support for users preferring reduced motion (`a11y`).
 */
export const MagneticWrapper: React.FC<MagneticWrapperProps> = ({
  children,
  className = '',
  intensity = 0.35,
  springConfig = { stiffness: 220, damping: 18, mass: 0.4 },
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Motion values representing GPU raw displacement offsets (x, y)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Apply spring physics interpolation to motion values
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !ref.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    // Center coordinates of target element
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Calculate magnetic pull vector from cursor relative to center
    const pullX = (clientX - centerX) * intensity;
    const pullY = (clientY - centerY) * intensity;

    x.set(pullX);
    y.set(pullY);
  };

  const handleMouseLeave = () => {
    // Return smoothly to center position on mouse leave
    x.set(0);
    y.set(0);
  };

  if (shouldReduceMotion) {
    return <div className={`inline-block ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};
