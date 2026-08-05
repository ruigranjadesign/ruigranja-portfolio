import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface HeroParticlesBackgroundProps {
  isIntroFinished?: boolean;
  avatarRef?: React.RefObject<HTMLDivElement | null>;
  isAvatarHovered?: boolean;
  isBottomInView?: boolean;
}

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  normX: number;
  normY: number;
  radius: number;
  seed: number;
  isAccent: boolean;
  phase: number;
  speed: number;
  ampX: number;
  ampY: number;
  evasionDirection: number; // -1 for left evasion, 1 for right evasion
}

// --- ARROW (↗) POINT FORMATION (Normalized [-1, 1]) ---
// 12 points forming an up-right arrow (shaft + head) for left-side particles
const LEFT_ARROW_HEAD_POINTS = [
  // Shaft
  { x: -0.55, y: 0.55 },
  { x: -0.38, y: 0.38 },
  { x: -0.21, y: 0.21 },
  { x: -0.04, y: 0.04 },
  { x: 0.13, y: -0.13 },
  { x: 0.30, y: -0.30 },
  { x: 0.47, y: -0.47 },
  { x: 0.55, y: -0.55 },

  // Top horizontal head bar
  { x: 0.35, y: -0.55 },
  { x: 0.15, y: -0.55 },

  // Right vertical head bar
  { x: 0.55, y: -0.35 },
  { x: 0.55, y: -0.15 },
];

// 14 points forming a surrounding circle around the arrow
const LEFT_CIRCLE_COUNT = 14;

export const HeroParticlesBackground: React.FC<HeroParticlesBackgroundProps> = ({
  isIntroFinished = true,
  avatarRef,
  isAvatarHovered = false,
  isBottomInView: isBottomInViewProp,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll progress tracking
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Bottom / Contact CTA section visibility tracking
  const isBottomInViewRef = useRef<boolean>(false);
  const glowProgressRef = useRef<number>(0);

  // IntersectionObserver to detect when user reaches the bottom contact CTA section
  useEffect(() => {
    if (typeof isBottomInViewProp === 'boolean') {
      isBottomInViewRef.current = isBottomInViewProp;
      return;
    }

    const checkAndObserve = () => {
      const contactEl = document.getElementById('contact-cta') || document.getElementById('contact');
      if (!contactEl) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isBottomInViewRef.current = entry.isIntersecting;
          });
        },
        {
          root: null,
          threshold: 0.1, // Triggers when user scrolls into the contact section
        }
      );

      observer.observe(contactEl);
      return observer;
    };

    let observer = checkAndObserve();
    const interval = setInterval(() => {
      if (!observer) {
        observer = checkAndObserve();
        if (observer) clearInterval(interval);
      }
    }, 300);

    return () => {
      clearInterval(interval);
      observer?.disconnect();
    };
  }, [isBottomInViewProp]);

  const activeElementRef = useRef<HTMLElement | null>(null);
  const activeRectRef = useRef<DOMRect | null>(null);

  // Mouse position tracking for cursor following
  const mousePosRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const arrowCenterPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const isAvatarHoveredRef = useRef<boolean>(isAvatarHovered);
  useEffect(() => {
    isAvatarHoveredRef.current = isAvatarHovered;
  }, [isAvatarHovered]);

  // Track global mouse coordinates for smooth cursor following & ambient particle evasion
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mousePosRef.current = { x: -1000, y: -1000 };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Smooth scroll tracking
  const scrollYTargetRef = useRef<number>(0);
  const scrollYLerpRef = useRef<number>(0);

  // Mobile idle fade tracking
  const idleFadeRef = useRef<number>(1);
  const lastActivityTimeRef = useRef<number>(Date.now());
  const lastFrameTimeRef = useRef<number>(0);

  // Fast rotation angle and opacity for arrow indicator
  const arrowAngleRef = useRef<number>(0);
  const arrowOpacityRef = useRef<number>(0);

  // Device check & client check for portaling
  const [isSupportedDevice, setIsSupportedDevice] = useState<boolean>(true);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window === 'undefined') return;
    const isCoarseOnly = window.matchMedia('(pointer: coarse) and (hover: none)').matches;
    setIsSupportedDevice(!isCoarseOnly);
  }, []);

  // Window Scroll Listener for Progress Bar & Lateral Evasion
  useEffect(() => {
    const handleActivity = () => {
      lastActivityTimeRef.current = Date.now();
    };

    const handleScroll = () => {
      handleActivity();
      const curScrollY = window.scrollY;
      scrollYTargetRef.current = curScrollY;

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (curScrollY / docHeight) * 100));
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }

      if (activeElementRef.current && document.body.contains(activeElementRef.current)) {
        activeRectRef.current = activeElementRef.current.getBoundingClientRect();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleActivity, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, []);

  // Helper to extract valid, genuinely interactive buttons/links (excluding non-clickable cards & experience section)
  const getInteractiveElement = (target: HTMLElement | null): HTMLElement | null => {
    if (!target) return null;

    // Strictly exclude the Experience & Work section as requested
    if (target.closest('#experience')) {
      return null;
    }

    const interactive = target.closest(
      'a[href], button, [role="button"], input[type="submit"], input[type="button"], [data-particle-orbit="true"]'
    ) as HTMLElement | null;

    if (!interactive) return null;

    // Check if disabled or non-interactive
    if (interactive.getAttribute('aria-disabled') === 'true' || interactive.hasAttribute('disabled')) {
      return null;
    }

    return interactive;
  };

  // Global mouseover / mouseout listener for interactive buttons / links
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const interactive = getInteractiveElement(target);

      if (interactive) {
        activeElementRef.current = interactive;
        activeRectRef.current = interactive.getBoundingClientRect();
      } else {
        activeElementRef.current = null;
        activeRectRef.current = null;
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      const currentInteractive = activeElementRef.current;

      if (!related || !currentInteractive) {
        activeElementRef.current = null;
        activeRectRef.current = null;
        return;
      }

      const stillInside = currentInteractive.contains(related);
      if (!stillInside) {
        const nextInteractive = getInteractiveElement(related);
        if (nextInteractive) {
          activeElementRef.current = nextInteractive;
          activeRectRef.current = nextInteractive.getBoundingClientRect();
        } else {
          activeElementRef.current = null;
          activeRectRef.current = null;
        }
      }
    };

    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mouseout', handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  // Particle Canvas Render Loop
  useEffect(() => {
    const isReducedMotion =
      shouldReduceMotion ||
      (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    if (isReducedMotion || !isIntroFinished) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;

    const PARTICLE_COUNT = 60; // High-density particles for rich 3D shape morphing at bottom

    const initParticles = (w: number, h: number) => {
      width = w;
      height = h;

      particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        let normX = Math.random();
        let normY = Math.random();

        // Reduce particle density in top-center (where main text content/avatar is)
        if (normX > 0.25 && normX < 0.75 && normY < 0.72) {
          if (Math.random() < 0.75) {
            const isLeft = Math.random() < 0.5;
            normX = isLeft ? Math.random() * 0.23 + 0.02 : Math.random() * 0.23 + 0.75;
          }
        }

        const baseX = normX * w;
        const baseY = normY * h;
        const isAccent = i % 3 === 0;
        const evasionDirection = i % 2 === 0 ? 1 : -1;

        // Start particles clustered near center/anchor point for an outward explosion transition
        const cx = w / 2;
        const cy = h / 2 + 30;
        const startRadius = Math.random() * 18;
        const startAngle = Math.random() * Math.PI * 2;
        const startX = cx + Math.cos(startAngle) * startRadius;
        const startY = cy + Math.sin(startAngle) * startRadius;

        return {
          x: startX,
          y: startY,
          baseX,
          baseY,
          normX,
          normY,
          radius: isAccent ? 2.8 : Math.random() * 0.9 + 1.4,
          seed: i * 1.371 + Math.random() * 0.5,
          isAccent,
          phase: Math.random() * Math.PI * 2,
          speed: 0.0006 + Math.random() * 0.0012,
          ampX: 10 + Math.random() * 18,
          ampY: 8 + Math.random() * 16,
          evasionDirection,
        };
      });
    };

    const handleResize = () => {
      if (!canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w <= 0 || h <= 0) return;

      // Retina / High-DPI Display scale (capped at 2 for performance)
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = w;
      height = h;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.scale(dpr, dpr);

      if (particles.length === 0) {
        initParticles(width, height);
      } else {
        particles.forEach((p) => {
          p.baseX = p.normX * width;
          p.baseY = p.normY * height;
        });
      }
    };

    handleResize();
    const timer1 = setTimeout(handleResize, 100);
    const timer2 = setTimeout(handleResize, 500);

    const resizeObserver = new ResizeObserver(() => handleResize());
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener('resize', handleResize, { passive: true });

    // Page Visibility API - pause animation calculations when tab is inactive to save GPU & Battery
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = 0;
        }
      } else {
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(render);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = (now: number) => {
      // Pause calculations when browser tab is hidden
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      if (!ctx || width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Lerp scroll position for smooth scroll-driven lateral evasion
      scrollYLerpRef.current += (scrollYTargetRef.current - scrollYLerpRef.current) * 0.12;
      const scrollY = scrollYLerpRef.current;

      const isDark = document.documentElement.classList.contains('dark');

      // STRICT COLOR PALETTE: Solid Pure Black (#000000) for light mode, Neon Lime (#CCFF00 / #00FF66) for dark mode
      const baseDotColor = isDark ? 'rgba(0, 255, 102, 0.85)' : '#000000';
      const accentDotColor = isDark ? '#CCFF00' : '#000000';
      const accentGlowColor = isDark ? 'rgba(0, 255, 102, 0.35)' : 'rgba(0, 0, 0, 0.12)';

      ctx.clearRect(0, 0, width, height);

      // Check if scroll is moving past the Hero header, BEFORE the About section (#about) enters the viewport
      let isPastHero = false;
      const aboutEl = document.getElementById('about');
      if (aboutEl) {
        const rect = aboutEl.getBoundingClientRect();
        // Trigger gather-to-left earlier: before #about section enters the screen (when top of #about is within 1.15x screen height or scrollY > 60)
        if (rect.top <= height * 1.15 || scrollY > 60) {
          isPastHero = true;
        }
      } else if (scrollY > 60) {
        isPastHero = true;
      }

      // Check if button/link or avatar is hovered
      let activeRect: DOMRect | null = null;
      if (isAvatarHoveredRef.current && avatarRef?.current) {
        const avR = avatarRef.current.getBoundingClientRect();
        if (avR.width > 0 && avR.height > 0) {
          activeRect = avR;
        }
      } else if (
        activeElementRef.current &&
        document.body.contains(activeElementRef.current) &&
        !activeElementRef.current.closest('#experience')
      ) {
        const rect = activeElementRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && rect.top < height && rect.bottom > 0) {
          activeRect = rect;
        }
      }

      if (activeRect) {
        arrowOpacityRef.current += (1 - arrowOpacityRef.current) * 0.22;
        arrowAngleRef.current += 0.02;

        // Target arrow position follows mouse cursor on active button
        const mx = mousePosRef.current.x > 0 ? mousePosRef.current.x : activeRect.left + activeRect.width / 2;
        const my = mousePosRef.current.y > 0 ? mousePosRef.current.y : activeRect.top + activeRect.height / 2;

        const fitRight = mx + 24 <= width;
        const targetArrowX = fitRight ? mx + 16 : mx - 16;
        const targetArrowY = my;

        if (arrowCenterPosRef.current.x === 0 && arrowCenterPosRef.current.y === 0) {
          arrowCenterPosRef.current = { x: targetArrowX, y: targetArrowY };
        } else {
          arrowCenterPosRef.current.x += (targetArrowX - arrowCenterPosRef.current.x) * 0.22;
          arrowCenterPosRef.current.y += (targetArrowY - arrowCenterPosRef.current.y) * 0.22;
        }
      } else {
        arrowOpacityRef.current += (0 - arrowOpacityRef.current) * 0.22;
      }

      const arrowOpacity = arrowOpacityRef.current;
      if (arrowOpacity > 0.005) {
        // Draw crisp, thin fine vector arrow and spinning dashed circle
        const scale = 16; // Clear, elegant arrow scale (~32px diameter)
        const cx = arrowCenterPosRef.current.x;
        const cy = arrowCenterPosRef.current.y;

        ctx.save();
        ctx.globalAlpha = arrowOpacity;

        // Thin crisp shaft & head stroke
        ctx.strokeStyle = isDark ? '#CCFF00' : '#000000';
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        // Shaft
        ctx.moveTo(cx - 0.55 * scale, cy + 0.55 * scale);
        ctx.lineTo(cx + 0.55 * scale, cy - 0.55 * scale);
        // Top bar
        ctx.lineTo(cx - 0.1 * scale, cy - 0.55 * scale);
        // Right bar
        ctx.moveTo(cx + 0.55 * scale, cy - 0.55 * scale);
        ctx.lineTo(cx + 0.55 * scale, cy + 0.1 * scale);
        ctx.stroke();

        // Thin spinning circle outline
        ctx.beginPath();
        ctx.arc(cx, cy, scale * 1.15, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? 'rgba(204, 255, 0, 0.42)' : 'rgba(0, 0, 0, 0.32)';
        ctx.lineWidth = 0.9;
        ctx.setLineDash([5, 3]);
        ctx.lineDashOffset = -arrowAngleRef.current * 18;
        ctx.stroke();
        ctx.restore();
      }

      // Smoothly update conversion glow progress (0 to 1 over ~1.5s)
      const isBottomActive = isBottomInViewRef.current;
      if (isBottomActive) {
        glowProgressRef.current += (1 - glowProgressRef.current) * 0.035;
      } else {
        glowProgressRef.current += (0 - glowProgressRef.current) * 0.05;
      }
      const glowProgress = glowProgressRef.current;

      // Fade out particles when scrolling down ON MOBILE ONLY (unless bottom CTA is active)
      const isMobile = width < 768;
      const scrollFadeAlpha = isMobile && !isBottomActive ? Math.max(0, 1 - scrollY / 380) : 1;

      // Mobile Idle Fade calculation (fade out after 4s idle on mobile when bottom CTA is inactive)
      const deltaTime = lastFrameTimeRef.current > 0 ? Math.min(100, now - lastFrameTimeRef.current) : 16.6;
      lastFrameTimeRef.current = now;

      if (isMobile && !isBottomActive) {
        const isIdle = Date.now() - lastActivityTimeRef.current >= 4000;
        const targetIdleFade = isIdle ? 0 : 1;
        const fadeStep = deltaTime / 900;
        if (idleFadeRef.current < targetIdleFade) {
          idleFadeRef.current = Math.min(targetIdleFade, idleFadeRef.current + fadeStep);
        } else if (idleFadeRef.current > targetIdleFade) {
          idleFadeRef.current = Math.max(targetIdleFade, idleFadeRef.current - fadeStep);
        }
      } else {
        idleFadeRef.current = 1;
      }

      const finalAlpha = Math.min(scrollFadeAlpha, idleFadeRef.current);

      ctx.save();
      ctx.globalAlpha = finalAlpha;

      if (finalAlpha > 0.01) {
        // Ambient connecting lines between nearby floating particles (and subtle architectural network at bottom)
        ctx.lineWidth = isBottomActive ? 0.5 : 0.5;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Connection distance when particles morph into geometric shapes at bottom
            const maxDist = isBottomActive ? 90 : (isPastHero ? 16 : 95);
            if (dist < maxDist) {
              let maxAlpha = isDark ? 0.22 : 0.12;
              if (isBottomActive) {
                maxAlpha = isDark ? 0.16 : 0.10; // Subtle, elegant background line texture
              } else if (isPastHero) {
                maxAlpha = 0.05; // Ultra-subtle on scroll gutter
              }
              const alpha = (1 - dist / maxDist) * maxAlpha;
              ctx.strokeStyle = isDark
                ? `rgba(0, 255, 102, ${alpha})`
                : `rgba(0, 0, 0, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // SCROLL-DRIVEN LATERAL EVASION (PARALLAX DRIFT)
      const scrollEvasionAmount = scrollY * 0.35;
      const contactEl = document.getElementById('contact-cta') || document.getElementById('contact');
      const footerEl = document.querySelector('footer');

      particles.forEach((p, i) => {
        let targetX: number;
        let targetY: number;

        if (isBottomActive && contactEl) {
          // --- HIGH-IMPACT DYNAMIC SHAPE MORPHING AT BOTTOM (BETWEEN CTA CARD & FOOTER) ---
          const ctaRect = contactEl.getBoundingClientRect();
          const footerRect = footerEl ? footerEl.getBoundingClientRect() : null;

          // Space strictly BELOW the contact card and above/inside the footer transition area
          const topBound = ctaRect.bottom + 12;
          const bottomBound = footerRect ? Math.max(topBound + 28, footerRect.top - 10) : topBound + 75;
          const gapHeight = Math.max(32, bottomBound - topBound);
          const gapCenterY = topBound + gapHeight / 2;
          const ctaCenterX = ctaRect.left + ctaRect.width / 2;
          const boundsWidth = Math.min(ctaRect.width * 0.88, 720);

          const normIdx = i / (PARTICLE_COUNT - 1); // 0.0 to 1.0 ratio across particles

          // =========================================================================
          // FORMA 1: GRÁFICO DE AÇÕES A SUBIR (Stock Market / Bullish Growth Line)
          // Linha financeira ascendente em pico positivo com pulsos rápidos de luz a subir.
          // =========================================================================
          const stockX = ctaCenterX - boundsWidth / 2 + normIdx * boundsWidth;
          const growthTrend = Math.pow(normIdx, 1.4) * (gapHeight * 0.76);
          const stockSpikes =
            Math.sin(normIdx * 22) * 11 +
            Math.cos(normIdx * 38) * 6 +
            Math.sin(normIdx * 62) * 3;
          const stockY = topBound + gapHeight - 8 - growthTrend + stockSpikes;

          // Pulse de luz veloz que percorre continuamente a curva de baixo para cima
          const pulseSpeed = now * 0.012;
          const pulsePhase = (normIdx * 10 - pulseSpeed) % (Math.PI * 2);
          const stockPulseIntensity = Math.pow(Math.max(0, Math.sin(pulsePhase)), 4);

          // =========================================================================
          // FORMA 2: VÓRTEX DE ESFERAS A RODAR RÁPIDO (Fast 3D Spinning Sphere / Orbital Ring)
          // Rotação tridimensional rápida em redor do centro para efeito orbital vibrante.
          // =========================================================================
          const fastSpin = now * 0.0055; // Alta velocidade de rotação 3D
          const theta = normIdx * Math.PI * 4 + fastSpin;
          const phi = (normIdx - 0.5) * Math.PI * 0.9;

          const Rx = boundsWidth * 0.28;
          const Ry = gapHeight * 0.44;
          const Rz = gapHeight * 0.44;

          const x3d_0 = Rx * Math.cos(theta) * Math.cos(phi);
          const y3d_0 = Ry * Math.sin(phi);
          const z3d_0 = Rz * Math.sin(theta) * Math.cos(phi);

          // Matriz de rotação 3D com inclinação (tilt) nos eixos X e Y
          const tiltX = 0.45;
          const y3d_1 = y3d_0 * Math.cos(tiltX) - z3d_0 * Math.sin(tiltX);
          const z3d_1 = y3d_0 * Math.sin(tiltX) + z3d_0 * Math.cos(tiltX);

          const spinY = fastSpin * 0.5;
          const x3d_2 = x3d_0 * Math.cos(spinY) - z3d_1 * Math.sin(spinY);
          const z3d_2 = x3d_0 * Math.sin(spinY) + z3d_1 * Math.cos(spinY);

          const perspective = 300 / (300 + z3d_2);
          const vortexX = ctaCenterX + x3d_2 * perspective;
          const vortexY = gapCenterY + y3d_1 * perspective;
          const vortexScale = Math.min(1.8, Math.max(0.6, perspective));

          // =========================================================================
          // FORMA 3: ONDA DE FREQUÊNCIA / EQUALIZADOR DE DADOS (Data Equalizer Wave)
          // Oscilação rápida em colunas de ondas de frequência de alta energia.
          // =========================================================================
          const numCols = 14;
          const colIndex = Math.floor(normIdx * numCols);
          const colProgress = (normIdx * numCols) % 1;
          const colSpacing = boundsWidth / numCols;
          const eqX = ctaCenterX - boundsWidth / 2 + (colIndex + 0.5) * colSpacing + (colProgress - 0.5) * (colSpacing * 0.35);

          const colFreq = 0.009 + (colIndex % 4) * 0.003;
          const colHeight = (gapHeight * 0.85) * (0.2 + 0.8 * Math.abs(Math.sin(now * colFreq + colIndex * 0.8) * Math.cos(now * 0.006 + colIndex)));
          const eqY = topBound + gapHeight - colProgress * colHeight + Math.sin(now * 0.016 + colIndex) * 3;

          // =========================================================================
          // CICLO CONTÍNUO DE 15s COM TRANSIÇÃO FLUIDA DE 1.5s ENTRE FORMAS
          // 3 Formas x 5.0s cada slot = 15.0s Ciclo Total
          // =========================================================================
          const cyclePeriod = 15000;
          const phaseTime = now % cyclePeriod;

          let shapeX: number;
          let shapeY: number;
          let shapePulse = 0;
          let shapeZScale = 1.0;

          if (phaseTime < 3500) {
            // Forma 1 Pura: Stock Market Line (3.5s)
            shapeX = stockX;
            shapeY = stockY;
            shapePulse = stockPulseIntensity;
          } else if (phaseTime < 5000) {
            // Transição 1.5s: Forma 1 -> Forma 2 (Vortex Sphere)
            const progress = (phaseTime - 3500) / 1500;
            const smoothT = progress * progress * (3 - 2 * progress); // Ease-in-out cubic
            shapeX = stockX + (vortexX - stockX) * smoothT;
            shapeY = stockY + (vortexY - stockY) * smoothT;
            shapePulse = stockPulseIntensity * (1 - smoothT);
            shapeZScale = 1.0 + (vortexScale - 1.0) * smoothT;
          } else if (phaseTime < 8500) {
            // Forma 2 Pura: 3D Spinning Vortex (3.5s)
            shapeX = vortexX;
            shapeY = vortexY;
            shapeZScale = vortexScale;
          } else if (phaseTime < 10000) {
            // Transição 1.5s: Forma 2 -> Forma 3 (Equalizer Wave)
            const progress = (phaseTime - 8500) / 1500;
            const smoothT = progress * progress * (3 - 2 * progress); // Ease-in-out cubic
            shapeX = vortexX + (eqX - vortexX) * smoothT;
            shapeY = vortexY + (eqY - vortexY) * smoothT;
            shapeZScale = vortexScale + (1.0 - vortexScale) * smoothT;
          } else if (phaseTime < 13500) {
            // Forma 3 Pura: Data Equalizer Wave (3.5s)
            shapeX = eqX;
            shapeY = eqY;
            shapePulse = Math.sin(now * 0.012 + colIndex) * 0.35;
          } else {
            // Transição 1.5s: Forma 3 -> Forma 1 (Stock Market Line)
            const progress = (phaseTime - 13500) / 1500;
            const smoothT = progress * progress * (3 - 2 * progress); // Ease-in-out cubic
            shapeX = eqX + (stockX - eqX) * smoothT;
            shapeY = eqY + (stockY - eqY) * smoothT;
            shapePulse = stockPulseIntensity * smoothT;
          }

          const microDriftX = Math.sin(now * 0.002 + p.phase) * 1.2;
          const microDriftY = Math.cos(now * 0.0018 + p.phase) * 1.2;

          targetX = shapeX + microDriftX;
          targetY = shapeY + microDriftY;

          // Guard frame metadata on particle for render pass
          (p as any)._zScale = shapeZScale;
          (p as any)._pulse = shapePulse;
        } else if (isPastHero) {
          // BEFORE ABOUT SECTION & DOWNWARDS:
          // ALL particles gather strictly in a narrow, ultra-subtle vertical margin on far left edge
          const microDriftX = Math.sin(now * 0.0012 + p.phase) * 1.5;
          const microDriftY = Math.cos(now * 0.001 + p.phase) * 2.5;

          const leftPadding = 12;
          const leftGutterWidth = 28; // Ultra-narrow band (12px to 28px) at viewport edge

          const horizontalSpread = ((i * 17) % 100) / 100;
          const verticalRatio = i / PARTICLE_COUNT;

          targetX = leftPadding + horizontalSpread * (leftGutterWidth - leftPadding) + microDriftX;
          targetY = verticalRatio * height + microDriftY;
        } else {
          // Ambient floating state with scroll-driven lateral evasion & smooth cursor escape (Hero & Top Sections)
          const driftX = Math.sin(now * p.speed + p.phase) * p.ampX;
          const driftY = Math.cos(now * p.speed * 0.8 + p.phase) * p.ampY;

          const lateralPush = p.evasionDirection * (scrollEvasionAmount * (0.5 + p.normY * 0.8));

          let rawTargetX = p.baseX + driftX + lateralPush;
          const margin = 120;
          const totalW = width + margin * 2;
          rawTargetX = ((((rawTargetX + margin) % totalW) + totalW) % totalW) - margin;
          const rawTargetY = p.baseY + driftY;

          // Subtle & smooth cursor evasion / repulsion
          let mousePushX = 0;
          let mousePushY = 0;
          const mx = mousePosRef.current.x;
          const my = mousePosRef.current.y;

          if (mx > 0 && my > 0) {
            const dx = rawTargetX - mx;
            const dy = rawTargetY - my;
            const distSq = dx * dx + dy * dy;
            const mouseEvasionRadius = 160;

            if (distSq < mouseEvasionRadius * mouseEvasionRadius && distSq > 0.01) {
              const dist = Math.sqrt(distSq);
              // Smooth quadratic decay factor
              const factor = Math.pow(1 - dist / mouseEvasionRadius, 2);
              const maxPush = 55; // Subtle maximum push distance in pixels
              mousePushX = (dx / dist) * maxPush * factor;
              mousePushY = (dy / dist) * maxPush * factor;
            }
          }

          targetX = rawTargetX + mousePushX;
          targetY = rawTargetY + mousePushY;
        }

        // High-velocity trajectory lerp factor (0.08) for fast energy movement sensation
        const lerpFactor = isBottomActive ? 0.08 : 0.10;
        p.x += (targetX - p.x) * lerpFactor;
        p.y += (targetY - p.y) * lerpFactor;

        // Render particle dot - Flat Circles (Círculos planos limpos e geométricos sem brilho ou gradientes)
        if (isBottomActive) {
          const zScale = (p as any)._zScale || 1.0;
          const pulse = (p as any)._pulse || 0.0;

          // Raio do círculo plano geométrico sem brilho ou sombra
          const baseRadius = 3.5 + (p.seed % 1.8);
          const radius = baseRadius * Math.min(1.5, Math.max(0.65, zScale));

          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);

          if (isDark) {
            const alpha = Math.min(1, 0.75 + pulse * 0.25);
            ctx.fillStyle = p.isAccent
              ? `rgba(204, 255, 0, ${alpha})`
              : `rgba(0, 255, 102, ${alpha})`;
          } else {
            const alpha = Math.min(1, 0.80 + pulse * 0.20);
            ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
          }
          ctx.fill();
        } else {
          const displayRadius = p.radius * (1 + glowProgress * 0.15);
          ctx.beginPath();
          ctx.arc(p.x, p.y, displayRadius, 0, Math.PI * 2);

          if (isDark) {
            ctx.fillStyle = p.isAccent
              ? `rgba(204, 255, 0, ${0.85 + glowProgress * 0.15})`
              : `rgba(0, 255, 102, ${0.85 + glowProgress * 0.15})`;
          } else {
            ctx.fillStyle = p.isAccent && glowProgress > 0.1 ? '#5E7800' : '#000000';
          }
          ctx.fill();

          // Subtle accent aura behind standard particles
          if (p.isAccent) {
            ctx.beginPath();
            const auraRadius = displayRadius * (1.6 + glowProgress * 1.4);
            ctx.arc(p.x, p.y, auraRadius, 0, Math.PI * 2);
            const glowAlpha = isDark ? 0.35 + glowProgress * 0.35 : 0.12 + glowProgress * 0.18;
            ctx.fillStyle = isDark
              ? `rgba(204, 255, 0, ${glowAlpha})`
              : `rgba(0, 0, 0, ${glowAlpha})`;
            ctx.fill();
          }
        }
      });

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    if (!document.hidden) {
      animationFrameId = requestAnimationFrame(render);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      clearTimeout(timer1);
      clearTimeout(timer2);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [shouldReduceMotion, isSupportedDevice, isIntroFinished, avatarRef]);

  if (shouldReduceMotion || !isIntroFinished || !isClient) {
    return null;
  }

  const particlesOverlay = (
    <>
      {/* 1. CANVAS LAYER (z-[45] portaled to document.body so interactive particle arrow appears above cards/sections) */}
      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-none z-[45] overflow-hidden opacity-90 dark:opacity-95"
        aria-hidden="true"
      >
        <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" />
      </div>

      {/* 2. LEFT-SIDE VERTICAL SCROLL PROGRESS BAR */}
      <div
        className="hidden sm:block fixed top-0 bottom-0 left-0 w-[3px] sm:w-[4px] z-[45] pointer-events-none bg-zinc-200/50 dark:bg-zinc-800/50"
        aria-hidden="true"
      >
        <div
          className="absolute top-0 left-0 w-full bg-zinc-900 dark:bg-[#CCFF00] transition-all duration-75 ease-out shadow-[0_0_10px_#CCFF00]/60 dark:shadow-[0_0_10px_#CCFF00]/80 rounded-b-full"
          style={{ height: `${scrollProgress}%` }}
        />
      </div>
    </>
  );

  return createPortal(particlesOverlay, document.body);
};
