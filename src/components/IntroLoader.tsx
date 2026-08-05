import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface IntroLoaderProps {
  onComplete: () => void;
}

type ParticlePhase = 'drift' | 'converge' | 'pulse' | 'explode' | 'pause' | 'done';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  targetX: number;
  targetY: number;
  spinRadius?: number;
  lat?: number;
  lon?: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  speed: number;
  angle: number;
  ampX: number;
  ampY: number;
}

export const IntroLoader: React.FC<IntroLoaderProps> = ({ onComplete }) => {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = useState<number | null>(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isFontsReady, setIsFontsReady] = useState(false);
  const completedRef = useRef(false);

  const lastWordRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef<ParticlePhase>('drift');
  const phaseStartTimeRef = useRef<number>(performance.now());
  const anchorPointRef = useRef<{ x: number; y: number } | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const introWords = t.introLoader.words;

  const handleFinish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsExiting(true);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setTimeout(() => {
      onComplete();
    }, 320);
  }, [onComplete]);

  // Reduced motion: skip particle sequence completely and call finish
  useEffect(() => {
    if (shouldReduceMotion) {
      handleFinish();
    }
  }, [shouldReduceMotion, handleFinish]);

  // Ensure custom fonts (especially Syne) are 100% loaded before starting the intro animation
  useEffect(() => {
    let isMounted = true;

    if (typeof document !== 'undefined' && 'fonts' in document) {
      Promise.all([
        document.fonts.ready,
        document.fonts.load('700 1em Syne').catch(() => []),
      ])
        .then(() => {
          if (isMounted) setIsFontsReady(true);
        })
        .catch(() => {
          if (isMounted) setIsFontsReady(true);
        });
    } else {
      setIsFontsReady(true);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to calculate anchor point from last word ref
  const getAnchorPoint = useCallback(() => {
    const clickToSkipY = window.innerHeight - 48;
    if (lastWordRef.current) {
      const rect = lastWordRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        // Center between bottom of letters and click-to-skip label
        const midY = rect.bottom + (clickToSkipY - rect.bottom) * 0.5;
        return {
          x: rect.left + rect.width / 2,
          y: Math.max(rect.bottom + 45, midY),
        };
      }
    }
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2 + 100,
    };
  }, []);

  // Handle explosion trigger (click or keypress skip)
  const triggerExplosion = useCallback(() => {
    if (completedRef.current) return;

    if (
      phaseRef.current === 'explode' ||
      phaseRef.current === 'pause' ||
      phaseRef.current === 'done'
    ) {
      handleFinish();
      return;
    }

    const anchor = getAnchorPoint();
    anchorPointRef.current = anchor;

    setStepIndex(null);
    setIsExiting(true);
    phaseRef.current = 'explode';
    phaseStartTimeRef.current = performance.now();

    particlesRef.current.forEach((p) => {
      p.x = anchor.x + (p.x - anchor.x) * 0.1;
      p.y = anchor.y + (p.y - anchor.y) * 0.1;
      const dx = p.baseX - anchor.x;
      const dy = p.baseY - anchor.y;
      const dist = Math.hypot(dx, dy) || 1;
      const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.3;
      const speed = Math.max(4, Math.min(12, dist / 30)) * (Math.random() * 0.4 + 0.8);
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.alpha = 1;
    });

    handleFinish();
  }, [getAnchorPoint, handleFinish]);

  // Keypress listener for skipping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'Escape') {
        if (e.code === 'Space') {
          e.preventDefault();
        }
        triggerExplosion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerExplosion]);

  // Word sequence timer (synchronized with particle animation sequence)
  useEffect(() => {
    if (shouldReduceMotion || !isFontsReady) return;

    const wordDuration = 2000;
    const wordCount = introWords.length;

    const timers: NodeJS.Timeout[] = [];

    // Step through each word
    for (let i = 1; i < wordCount; i++) {
      timers.push(
        setTimeout(() => {
          if (completedRef.current) return;
          setStepIndex(i);
        }, i * wordDuration)
      );
    }

    // Trigger particle convergence right when the last word (APPROACH/ABORDAGEM) appears
    const lastWordStartTime = (wordCount - 1) * wordDuration;
    timers.push(
      setTimeout(() => {
        if (completedRef.current) return;

        const anchor = getAnchorPoint();
        anchorPointRef.current = anchor;

        if (phaseRef.current === 'drift') {
          phaseRef.current = 'converge';
          phaseStartTimeRef.current = performance.now();

          const total = particlesRef.current.length;
          particlesRef.current.forEach((p, idx) => {
            p.lat = (Math.random() - 0.5) * Math.PI * 0.85;
            p.lon = (idx / total) * Math.PI * 2;
          });
        }
      }, lastWordStartTime + 50) // Triggers as soon as APPROACH appears on screen
    );

    // End word display and fade out loader
    timers.push(
      setTimeout(() => {
        if (completedRef.current) return;
        setStepIndex(null);
        handleFinish();
      }, wordCount * wordDuration)
    );

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [shouldReduceMotion, isFontsReady, introWords.length, getAnchorPoint, handleFinish]);

  // Particle Canvas animation loop
  useEffect(() => {
    if (shouldReduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const isMobile = width < 768;
    const count = isMobile ? 24 : 52;

    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const baseX = Math.random() * width;
      const baseY = Math.random() * height;
      particles.push({
        x: baseX,
        y: baseY,
        baseX,
        baseY,
        targetX: baseX,
        targetY: baseY,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        size: Math.random() * 2.0 + 1.2,
        alpha: Math.random() * 0.35 + 0.2,
        speed: Math.random() * 0.015 + 0.008,
        angle: Math.random() * Math.PI * 2,
        ampX: Math.random() * 40 + 15,
        ampY: Math.random() * 40 + 15,
      });
    }
    particlesRef.current = particles;

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = (time: number) => {
      if (completedRef.current) return;

      const currentPhase = phaseRef.current;
      const elapsed = time - phaseStartTimeRef.current;
      const isDark = document.documentElement.classList.contains('dark');

      ctx.clearRect(0, 0, width, height);

      const baseColor = isDark ? '0, 255, 102' : '24, 24, 27';
      const accentColor = isDark ? '204, 255, 0' : '0, 0, 0';

      if (currentPhase === 'drift') {
        // Ambient dust floating gracefully across full screen
        particlesRef.current.forEach((p) => {
          p.angle += p.speed;
          p.baseX = (p.baseX + p.vx + width) % width;
          p.baseY = (p.baseY + p.vy + height) % height;
          p.x = p.baseX + Math.sin(p.angle * 1.5) * p.ampX;
          p.y = p.baseY + Math.cos(p.angle * 1.2) * p.ampY;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${baseColor}, ${p.alpha})`;
          ctx.fill();
        });
      } else if (currentPhase === 'converge' || currentPhase === 'pulse') {
        const anchor = anchorPointRef.current || {
          x: width / 2,
          y: height / 2 + 100,
        };

        const globeR = isMobile ? 22 : 32;
        const tilt = 0.41; // 23.5 deg Earth axial tilt
        const rotY = time * 0.003; // Smooth 3D rotation around Y axis

        // Atmospheric glow
        const glowRadius = globeR * 1.8;
        const glow = ctx.createRadialGradient(
          anchor.x,
          anchor.y,
          0,
          anchor.x,
          anchor.y,
          glowRadius
        );
        glow.addColorStop(0, `rgba(${accentColor}, 0.35)`);
        glow.addColorStop(0.5, `rgba(${baseColor}, 0.15)`);
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.beginPath();
        ctx.arc(anchor.x, anchor.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // 3D Outer Sphere Horizon Outline
        ctx.beginPath();
        ctx.arc(anchor.x, anchor.y, globeR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${accentColor}, 0.55)`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // 3D Wireframe Latitude Parallels (Equator + Parallels)
        const latAngles = [-0.9, -0.45, 0, 0.45, 0.9];
        latAngles.forEach((lat) => {
          const latR = globeR * Math.cos(lat);
          const latY = globeR * Math.sin(lat);
          ctx.beginPath();
          for (let i = 0; i <= 36; i++) {
            const theta = (i / 36) * Math.PI * 2;
            const x3 = latR * Math.sin(theta + rotY);
            const y3 = latY;
            const z3 = latR * Math.cos(theta + rotY);
            const xT = x3 * Math.cos(tilt) - y3 * Math.sin(tilt);
            const yT = x3 * Math.sin(tilt) + y3 * Math.cos(tilt);
            const sx = anchor.x + xT;
            const sy = anchor.y + yT;
            if (i === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.strokeStyle =
            lat === 0
              ? `rgba(${accentColor}, 0.75)`
              : `rgba(${accentColor}, 0.35)`;
          ctx.lineWidth = lat === 0 ? 1.4 : 0.8;
          ctx.stroke();
        });

        // 3D Wireframe Longitude Meridians
        const meridianCount = 6;
        for (let m = 0; m < meridianCount; m++) {
          const lon = (m / meridianCount) * Math.PI + rotY;
          ctx.beginPath();
          for (let i = 0; i <= 32; i++) {
            const lat = -Math.PI / 2 + (i / 32) * Math.PI;
            const x3 = globeR * Math.cos(lat) * Math.sin(lon);
            const y3 = globeR * Math.sin(lat);
            const xT = x3 * Math.cos(tilt) - y3 * Math.sin(tilt);
            const yT = x3 * Math.sin(tilt) + y3 * Math.cos(tilt);
            const sx = anchor.x + xT;
            const sy = anchor.y + yT;
            if (i === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.strokeStyle = `rgba(${accentColor}, 0.35)`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // Tilted Earth Polar Axis Line
        const axisLen = globeR * 1.35;
        const npX = -axisLen * Math.sin(tilt);
        const npY = -axisLen * Math.cos(tilt);
        const spX = axisLen * Math.sin(tilt);
        const spY = axisLen * Math.cos(tilt);
        ctx.beginPath();
        ctx.moveTo(anchor.x + spX, anchor.y + spY);
        ctx.lineTo(anchor.x + npX, anchor.y + npY);
        ctx.strokeStyle = `rgba(${accentColor}, 0.45)`;
        ctx.lineWidth = 1.0;
        ctx.setLineDash([2, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Geometric Node Particles on Earth Surface
        let maxDist = 0;
        const total = particlesRef.current.length;
        particlesRef.current.forEach((p, idx) => {
          if (p.lat === undefined)
            p.lat = (Math.random() - 0.5) * Math.PI * 0.85;
          if (p.lon === undefined)
            p.lon = (idx / total) * Math.PI * 2;

          const x3 = globeR * Math.cos(p.lat) * Math.sin(p.lon + rotY);
          const y3 = globeR * Math.sin(p.lat);
          const z3 = globeR * Math.cos(p.lat) * Math.cos(p.lon + rotY);

          const xT = x3 * Math.cos(tilt) - y3 * Math.sin(tilt);
          const yT = x3 * Math.sin(tilt) + y3 * Math.cos(tilt);

          const targetX = anchor.x + xT;
          const targetY = anchor.y + yT;

          if (currentPhase === 'converge') {
            p.x += (targetX - p.x) * 0.16;
            p.y += (targetY - p.y) * 0.16;
            const dist = Math.hypot(targetX - p.x, targetY - p.y);
            if (dist > maxDist) maxDist = dist;
          } else {
            p.x = targetX;
            p.y = targetY;
          }

          const isFront = z3 >= 0;
          p.alpha = isFront ? 0.95 : 0.25;
          const nodeSize = isFront ? p.size * 1.3 : p.size * 0.7;

          ctx.beginPath();
          ctx.arc(p.x, p.y, nodeSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${accentColor}, ${p.alpha})`;
          ctx.fill();
        });

        if (currentPhase === 'converge' && (elapsed > 350 || maxDist < 4)) {
          phaseRef.current = 'pulse';
          phaseStartTimeRef.current = time;
        }

        if (currentPhase === 'pulse' && elapsed >= 1550) {
          phaseRef.current = 'explode';
          phaseStartTimeRef.current = time;
          setIsExiting(true);

          particlesRef.current.forEach((p) => {
            p.x = anchor.x;
            p.y = anchor.y;
            // Aim outward towards screen-wide spread matching base positions
            const dx = p.baseX - anchor.x;
            const dy = p.baseY - anchor.y;
            const dist = Math.hypot(dx, dy) || 1;
            const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.3;
            const speed = Math.max(4, Math.min(12, dist / 30)) * (Math.random() * 0.4 + 0.8);
            p.vx = Math.cos(angle) * speed;
            p.vy = Math.sin(angle) * speed;
            p.alpha = 1;
          });
        }
      } else if (currentPhase === 'explode') {
        let activeCount = 0;

        particlesRef.current.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.95;
          p.vy *= 0.95;
          p.alpha = Math.max(0, p.alpha - 0.035);

          if (p.alpha > 0) {
            activeCount++;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * (0.6 + p.alpha * 0.6), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${accentColor}, ${p.alpha})`;
            ctx.fill();
          }
        });

        if (elapsed > 450 || activeCount === 0) {
          phaseRef.current = 'pause';
          phaseStartTimeRef.current = time;
        }
      } else if (currentPhase === 'pause') {
        // Shortened pause (~60ms) before onComplete for a seamless transition
        if (elapsed >= 60) {
          phaseRef.current = 'done';
          handleFinish();
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [shouldReduceMotion, handleFinish]);

  const currentWord =
    isFontsReady && stepIndex !== null ? introWords[stepIndex] || introWords[0] : null;
  const isLastWord = stepIndex === introWords.length - 1;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      onClick={triggerExplosion}
      title={t.introLoader.clickToSkip}
      className="fixed inset-0 z-[100] bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none cursor-pointer w-screen h-screen"
    >
      <div className="relative w-auto max-w-full mx-auto flex items-center justify-center py-6 px-4 overflow-visible">
        <AnimatePresence mode="wait">
          {currentWord && (
            <motion.div
              key={currentWord}
              ref={isLastWord ? lastWordRef : undefined}
              initial="initial"
              animate="animate"
              exit={{
                opacity: 0,
                transition: { duration: 0.28, ease: 'easeOut' },
              }}
              variants={{
                initial: {},
                animate: {
                  transition: {
                    staggerChildren: 0.025,
                  },
                },
              }}
              className="flex items-center justify-center whitespace-nowrap text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black font-syne uppercase tracking-tight text-zinc-900 dark:text-zinc-50 leading-none"
            >
              {currentWord.split('').map((char, index) => (
                <motion.span
                  key={`${currentWord}-${index}`}
                  variants={{
                    initial: { opacity: 0, scale: 1.15, filter: 'blur(4px)' },
                    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
                  }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!shouldReduceMotion && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 w-full h-full pointer-events-none z-[105]"
        />
      )}

      {/* Click to skip label near the progress bar */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-[110] text-center pointer-events-none">
        <span className="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-mono text-zinc-400 dark:text-zinc-500">
          {t.introLoader.clickToSkip}
        </span>
      </div>

      {/* Animated progress line filling up until the end */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-zinc-200 dark:bg-zinc-800 pointer-events-none z-[110]">
        {isFontsReady && (
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              duration: (introWords.length * 2000) / 1000,
              ease: 'linear',
            }}
            className="h-full bg-zinc-900 dark:bg-zinc-100"
          />
        )}
      </div>
    </motion.div>
  );
};








