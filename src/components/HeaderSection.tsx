import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, useMotionTemplate, animate } from 'motion/react';
import { Profile } from '../types';
import { MapPin, Mail, Linkedin, Instagram, Copy, Check } from 'lucide-react';
import avatarImage from '../assets/images/avatar.jpg';
import { MagneticTiltWrapper } from './MagneticTiltWrapper';
import { MagneticWrapper } from './MagneticWrapper';
import { SectionHeading } from './SectionHeading';
import { useLanguage } from '../contexts/LanguageContext';
import { getMailtoHref } from '../utils/emailObfuscator';
import { useReducedMotion } from '../hooks/useReducedMotion';

const HeroParticlesBackground = React.lazy(() => import('./HeroParticlesBackground').then(m => ({ default: m.HeroParticlesBackground })));

const BehanceIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg
    className={`fill-current ${className}`}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M22 7h-7V5h7v2zm1.726 10c0 2.174-1.288 3.82-3.726 3.82-2.31 0-3.652-1.57-3.652-3.52 0-2.32 1.632-3.83 3.896-3.83 2.19 0 3.482 1.34 3.482 3.53zm-3.623-1.8c-.89 0-1.543.52-1.748 1.48h3.315c-.09-1.01-.652-1.48-1.567-1.48zM8.22 13.06c1.196-.28 2.062-1.22 2.062-2.58 0-1.89-1.424-2.98-3.702-2.98H0v13h6.915c2.58 0 4.14-1.34 4.14-3.41 0-1.84-1.12-3.23-2.835-4.03zM3.108 9.25h3.04c1.072 0 1.688.42 1.688 1.25 0 .89-.66 1.33-1.688 1.33H3.108V9.25zm3.504 9.5H3.108v-2.88h3.504c1.23 0 1.88.49 1.88 1.44 0 .96-.65 1.44-1.88 1.44z" />
  </svg>
);

interface HeaderSectionProps {
  profile: Profile;
  isIntroFinished?: boolean;
}

interface HypnoticEasterEggTextProps {
  lines: string[];
}

const HypnoticEasterEggText: React.FC<HypnoticEasterEggTextProps> = ({ lines }) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const [breathPhase, setBreathPhase] = useState(0);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [charCenters, setCharCenters] = useState<{ x: number; y: number }[]>([]);

  // 1. Kinetic Breathing Loop (7s organic hypnotic cycle)
  useEffect(() => {
    let animationFrameId: number;
    const startTime = performance.now();

    const updateBreath = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const cycle = (Math.sin((elapsed / 7) * Math.PI * 2) + 1) / 2; // 0..1
      setBreathPhase(cycle);
      animationFrameId = requestAnimationFrame(updateBreath);
    };

    animationFrameId = requestAnimationFrame(updateBreath);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const updateCenters = useCallback(() => {
    const centers = charRefs.current.map((el) => {
      if (!el) return { x: -1000, y: -1000 };
      const rect = el.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    });
    setCharCenters(centers);
  }, []);

  useEffect(() => {
    updateCenters();
    window.addEventListener('resize', updateCenters, { passive: true });
    window.addEventListener('scroll', updateCenters, { passive: true });
    return () => {
      window.removeEventListener('resize', updateCenters);
      window.removeEventListener('scroll', updateCenters);
    };
  }, [updateCenters, lines]);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    const handlePointerLeave = () => {
      setMousePos({ x: -1000, y: -1000 });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  let globalCharIndex = 0;

  return (
    <div className="font-mono text-[11px] sm:text-[12px] font-medium text-[#5E7800] dark:text-[#CCFF00] tracking-tight max-w-full text-left md:text-right leading-tight py-1 select-none overflow-visible space-y-0.5">
      {lines.map((line, lineIndex) => {
        const words = line.split(' ');
        return (
          <div key={lineIndex} className="block leading-tight">
            {words.map((word, wordIndex) => {
              const wordChars = Array.from(word);
              return (
                <React.Fragment key={wordIndex}>
                  <span className="inline-block whitespace-nowrap">
                    {wordChars.map((char) => {
                      const charIndex = globalCharIndex++;
                      const center = charCenters[charIndex];
                      let proximity = 0;
                      if (center && mousePos.x > -500) {
                        const dist = Math.hypot(mousePos.x - center.x, mousePos.y - center.y);
                        const maxDist = 120;
                        if (dist < maxDist) {
                          proximity = Math.pow(1 - dist / maxDist, 2);
                        }
                      }

                      const weight = Math.round(500 + breathPhase * 150 + proximity * 250);
                      const tracking = breathPhase * 0.02 + proximity * 0.06; // em
                      const translateY = -proximity * 2;
                      const scale = 1 + proximity * 0.1;

                      return (
                        <span
                          key={charIndex}
                          ref={(el) => {
                            charRefs.current[charIndex] = el;
                          }}
                          style={{
                            display: 'inline-block',
                            fontWeight: weight,
                            letterSpacing: `${tracking}em`,
                            transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
                            transition:
                              'transform 0.1s ease-out, font-weight 0.12s ease-out, text-shadow 0.15s ease-out, color 0.15s ease-out',
                            color: proximity > 0.25 ? '#CCFF00' : undefined,
                            textShadow: proximity > 0.3 ? '0 0 12px rgba(204, 255, 0, 0.8)' : '0 0 4px rgba(204, 255, 0, 0.15)',
                          }}
                        >
                          {char}
                        </span>
                      );
                    })}
                  </span>
                  {wordIndex < words.length - 1 && (
                    <span className="inline-block">&nbsp;</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export const HeaderSection: React.FC<HeaderSectionProps> = ({ profile, isIntroFinished = true }) => {
  const { t, language } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const isEn = language === 'en';
  const [avatarSrc, setAvatarSrc] = useState(avatarImage || profile.avatarUrl || '/avatar.webp');
  const [imageError, setImageError] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const easterEggTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissEasterEgg = useCallback(() => {
    setShowEasterEgg(false);
    if (easterEggTimerRef.current) {
      clearTimeout(easterEggTimerRef.current);
      easterEggTimerRef.current = null;
    }
  }, []);

  const playHypnoticSound = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const duration = 0.55; // 550ms smooth organic duration

      // Master Gain Envelope: quick warm attack (80ms), exponential decay to 0
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.18, now + 0.08);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      // Low-pass filter simulating warm tape / analog hum warmth
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);
      filter.frequency.exponentialRampToValueAtTime(220, now + duration);

      masterGain.connect(filter);
      filter.connect(ctx.destination);

      // Trance-inducing warm harmonic chord progression (A3=220Hz, C#4=277.18Hz, E4=329.63Hz, A4=440Hz)
      const frequencies = [220, 277.18, 329.63, 440];
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        // Subtle analog tape pitch drift
        osc.frequency.exponentialRampToValueAtTime(freq * 0.985, now + duration);

        const oscGain = ctx.createGain();
        oscGain.gain.value = 0.22;

        osc.connect(oscGain);
        oscGain.connect(masterGain);

        // Staggered arpeggiated onset for organic feel (15ms delay per note)
        osc.start(now + idx * 0.015);
        osc.stop(now + duration);
      });

      // Cleanup Audio Context after playback finishes
      setTimeout(() => {
        ctx.close().catch(() => {});
      }, (duration + 0.1) * 1000);
    } catch (err) {
      console.debug('Web Audio playback error:', err);
    }
  };

  const handleAvatarClick = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    // 1. Synthesized hypnotic audio cue via native Web Audio API
    playHypnoticSound();

    // 2. Rapid potent VHS static noise & RGB channel-shift glitch micro-burst (280ms)
    setIsGlitching(true);
    setTimeout(() => {
      setIsGlitching(false);
    }, 280);

    // 3. In-line subtle microcopy reveal
    setShowEasterEgg(true);

    // 4. Auto-dismiss after 6 seconds
    if (easterEggTimerRef.current) {
      clearTimeout(easterEggTimerRef.current);
    }
    easterEggTimerRef.current = setTimeout(() => {
      setShowEasterEgg(false);
    }, 6000);
  };

  useEffect(() => {
    if (!showEasterEgg) return;

    const handleScroll = () => {
      dismissEasterEgg();
    };

    const handleGlobalClick = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        dismissEasterEgg();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleGlobalClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [showEasterEgg, dismissEasterEgg]);

  useEffect(() => {
    setIsClient(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
      setHasScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Motion value for single radius in vmax (0 to 110vmax)
  const radius = useMotionValue(0);

  const maskImage = useMotionTemplate`radial-gradient(circle at 50% 50%, transparent ${radius}vmax, black calc(${radius}vmax + 1px))`;

  const ringSize = useTransform(radius, (r) => `${r * 2}vmax`);

  useEffect(() => {
    if (!isIntroFinished) {
      radius.set(0);
      return;
    }

    const animation = animate(radius, 160, {
      duration: 2.2,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => {
        setShowOverlay(false);
      },
    });

    return () => animation.stop();
  }, [isIntroFinished, radius]);

  return (
    <>
      {/* Automated Spotlight Reveal Overlay - Rendered via React Portal to document.body */}
      {isClient && createPortal(
        <AnimatePresence>
          {showOverlay && (
            <motion.div
              key="spotlight-reveal-overlay"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                maskImage,
                WebkitMaskImage: maskImage,
              }}
              className="fixed inset-0 z-50 pointer-events-none bg-white dark:bg-[#09090b] overflow-hidden"
            >
              {/* Subtle Lime Glowing Tint Edge */}
              <motion.div
                style={{
                  left: "50%",
                  top: "50%",
                  width: ringSize,
                  height: ringSize,
                  x: "-50%",
                  y: "-50%",
                }}
                className="absolute rounded-full border-2 border-[#CCFF00] shadow-[0_0_25px_#CCFF00,inset_0_0_15px_#CCFF00] opacity-75 pointer-events-none"
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <header id="hero" className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start print-margin-0 pt-2 relative z-10">
        <Suspense fallback={null}>
          <HeroParticlesBackground
            isIntroFinished={isIntroFinished}
            avatarRef={avatarRef}
            isAvatarHovered={isAvatarHovered}
          />
        </Suspense>
        <div className="order-2 md:order-1 md:col-span-8 space-y-6 w-full max-w-full min-w-0 overflow-visible">
          <MagneticTiltWrapper className="space-y-4 w-full max-w-full overflow-visible" maxTilt={8}>
            <div className="w-full max-w-full min-w-0 space-y-3 overflow-visible">
              <SectionHeading
                variant="hero"
                as="h1"
                className="w-full max-w-full overflow-visible pr-2 sm:pr-4"
                style={{ fontSize: 'clamp(1.8rem, 6.5vw, 4.6rem)', overflowWrap: 'normal', wordBreak: 'normal' }}
              >
                <span className="sr-only">
                  Rui Granja — UX/UI Designer &amp; CRO Specialist
                </span>
                <span aria-hidden="true" className="block max-w-full pb-1 sm:pb-2">{t.header.greeting}</span>
                <span aria-hidden="true" className="block max-w-full pb-1 sm:pb-2">rui</span>
                <span aria-hidden="true" className="block max-w-full pb-2 sm:pb-4 pr-2 sm:pr-4 overflow-visible">granja</span>
              </SectionHeading>
              <span className="block text-[13px] sm:text-[15px] font-mono font-bold text-[#5E7800] dark:text-[#CCFF00] max-w-2xl leading-relaxed uppercase tracking-wider font-normal break-words max-w-full">
                {profile.title}
              </span>
            </div>

            {/* Location & Availability Status */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-mono text-zinc-500 dark:text-zinc-400 pt-2">
              <a
                href={profile.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-[#CCFF00] transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 shrink-0 text-zinc-400 dark:text-zinc-500" />
                <span>{profile.location}</span>
              </a>
              <div className="inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 dark:bg-[#CCFF00] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500 dark:bg-[#CCFF00]"></span>
                </span>
                <span className="text-[#5E7800] dark:text-[#CCFF00] text-[10px] font-extrabold uppercase tracking-widest">
                  {profile.availability}
                </span>
              </div>
            </div>
          </MagneticTiltWrapper>

          {/* Social / Contact Links Buttons */}
          <div
            className={`flex flex-wrap items-center gap-2 pt-2 no-print transition-all duration-300 ease-out ${
              isScrolled
                ? 'max-sm:opacity-0 max-sm:pointer-events-none max-sm:-translate-y-2 max-sm:max-h-0 max-sm:overflow-hidden max-sm:py-0 max-sm:my-0'
                : 'max-sm:opacity-100 max-sm:translate-y-0 max-sm:max-h-40'
            }`}
          >
            {/* Email (Primary CTA) */}
            <div className="inline-flex items-center gap-1">
              <a
                href={getMailtoHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 sm:py-2 rounded-lg bg-zinc-900 dark:bg-[#CCFF00] text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-[#b5e600] transition-all font-mono text-[11px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 duration-100 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
                title={t.header.sendEmail}
              >
                <Mail className="w-3.5 h-3.5 text-white dark:text-zinc-950 shrink-0" />
                <span>Email</span>
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-3 py-2.5 sm:px-2.5 sm:py-2 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all font-mono text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 duration-100 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
                title={t.header.copyEmail}
                aria-label={t.header.copyEmail}
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#5E7800] dark:text-[#CCFF00]" />
                    <span className="text-[#5E7800] dark:text-[#CCFF00] font-mono font-extrabold text-[10px] uppercase tracking-wider">{t.header.copied}</span>
                  </>
                ) : (
                  <Copy className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                )}
              </button>
              <span className="sr-only" aria-live="polite">
                {copiedEmail ? t.header.emailCopied : ""}
              </span>
            </div>

            {/* Behance (Secondary Icon CTA) */}
            <a
              href={profile.behance}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 sm:p-2 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all flex items-center justify-center cursor-pointer active:scale-95 duration-100 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
              title={t.header.viewBehance}
              aria-label={t.header.viewBehance}
            >
              <BehanceIcon className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            </a>

            {/* LinkedIn (Secondary Icon CTA) */}
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 sm:p-2 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all flex items-center justify-center cursor-pointer active:scale-95 duration-100 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
              title={t.header.viewLinkedin}
              aria-label={t.header.viewLinkedin}
            >
              <Linkedin className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            </a>

            {/* Instagram (Secondary Icon CTA) */}
            {profile.instagram && (
              <a
                href={profile.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-2 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all flex items-center justify-center cursor-pointer active:scale-95 duration-100 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
                title={t.header.viewInstagram}
                aria-label={t.header.viewInstagram}
              >
                <Instagram className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              </a>
            )}
          </div>

          {/* Print-Only Contact Info */}
          <div className="hidden print:block text-[11px] font-mono text-zinc-600 space-y-1 pt-2">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 border-t border-zinc-200 pt-2">
              <div>Email: {profile.email}</div>
              <div>Behance: behance.net/ruigranja1</div>
              <div>LinkedIn: linkedin.com/in/ruigranja8</div>
              <div>Location: {profile.location}</div>
            </div>
          </div>
        </div>

        {/* Profile Avatar / Initials Fallback */}
        <div className="order-1 md:order-2 md:col-span-4 flex flex-col items-start md:items-end justify-start gap-2">
          <MagneticWrapper className="relative shrink-0">
            <motion.div
              ref={avatarRef}
              onMouseEnter={() => setIsAvatarHovered(true)}
              onMouseLeave={() => setIsAvatarHovered(false)}
              onClick={handleAvatarClick}
              animate={
                isGlitching
                  ? {
                      x: [0, -10, 10, -6, 6, -2, 0],
                      y: [0, 4, -4, 2, -2, 0],
                      skewX: [0, -8, 10, -5, 3, 0],
                      scale: [1, 1.05, 0.96, 1.03, 0.98, 1],
                      filter: [
                        'none',
                        'drop-shadow(-6px 0 0 rgba(255, 0, 85, 0.85)) drop-shadow(6px 0 0 rgba(0, 255, 255, 0.85))',
                        'drop-shadow(6px -3px 0 rgba(204, 255, 0, 0.9)) drop-shadow(-6px 3px 0 rgba(255, 0, 200, 0.9))',
                        'drop-shadow(-4px 0 0 rgba(0, 255, 255, 0.8)) drop-shadow(4px 0 0 rgba(255, 0, 85, 0.8))',
                        'none',
                      ],
                    }
                  : { x: 0, y: 0, skewX: 0, scale: 1, filter: 'none' }
              }
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden border-2 border-zinc-200 dark:border-zinc-800 hover:border-lime-500 dark:hover:border-[#CCFF00] transition-colors shadow-md relative bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center group cursor-pointer select-none"
            >
              {!imageError ? (
                <img
                  src={avatarSrc}
                  alt={language === 'pt' ? 'Retrato profissional de Rui Granja, UX/UI Designer e Especialista em CRO' : 'Professional portrait of Rui Granja, UX/UI Designer & CRO Specialist'}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                  onError={() => {
                    if (avatarSrc !== '/avatar.webp') {
                      setAvatarSrc('/avatar.webp');
                    } else {
                      setImageError(true);
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center font-syne font-black text-3xl text-zinc-900 dark:text-zinc-50 tracking-wider">
                  RG
                </div>
              )}

              {/* CRT / Scanline Glitch Flash Overlay */}
              <AnimatePresence>
                {isGlitching && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.9, 0.4, 0.8, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.28 }}
                    className="absolute inset-0 pointer-events-none z-30 overflow-hidden rounded-xl mix-blend-screen select-none"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500/30 via-[#CCFF00]/30 to-cyan-500/30 mix-blend-overlay" />
                    <div
                      className="absolute inset-0 opacity-60"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(204, 255, 0, 0.4) 2px, rgba(204, 255, 0, 0.4) 4px)',
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </MagneticWrapper>

          {/* In-Line Subtle Microcopy Reveal */}
          <AnimatePresence>
            {showEasterEgg && (
              <motion.div
                initial={{ opacity: 0, y: -4, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -4, height: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden no-print w-full flex justify-start md:justify-end"
              >
                <HypnoticEasterEggText
                  lines={
                    language === 'pt'
                      ? ["Sabias que...", "A curiosidade é a maior", "métrica de conversão."]
                      : ["Did you know...", "Curiosity is the strongest", "conversion metric."]
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scroll Down Hint Indicator */}
        <AnimatePresence>
          {isIntroFinished && !hasScrolled && (
            <motion.button
              type="button"
              onClick={() => {
                const marquee = document.querySelector('#marquee') || document.querySelectorAll('section')[0];
                marquee?.scrollIntoView({ behavior: 'smooth' });
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12, transition: { duration: 0.25 } }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col items-center gap-2 absolute -bottom-24 sm:-bottom-32 md:-bottom-48 left-1/2 -translate-x-1/2 text-zinc-400 dark:text-zinc-600 hover:text-[#5E7800] dark:hover:text-[#CCFF00] transition-colors cursor-pointer group no-print z-20"
              aria-label={isEn ? 'Scroll down' : 'Deslizar para baixo'}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
                {isEn ? 'Scroll' : 'Scroll'}
              </span>
              <motion.span
                animate={prefersReducedMotion ? { y: 0 } : { y: [0, 6, 0] }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="block w-px h-8 bg-current opacity-60 group-hover:opacity-100"
              />
            </motion.button>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
