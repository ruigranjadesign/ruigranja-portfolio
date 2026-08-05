import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface LightingConfig {
  primaryColor: string;
  secondaryColor: string;
  orb1Pos: { top: string; left: string };
  orb2Pos: { top: string; left: string };
}

const SECTION_LIGHTING: Record<string, LightingConfig> = {
  hero: {
    primaryColor: 'rgba(16, 185, 129, 0.08)', // Verde Esmeralda Suave (Growth & UX)
    secondaryColor: 'rgba(204, 255, 0, 0.05)', // Toque de Lima
    orb1Pos: { top: '20%', left: '20%' },
    orb2Pos: { top: '35%', left: '80%' },
  },
  projects: {
    primaryColor: 'rgba(217, 119, 6, 0.08)', // Dourado / Âmbar Suave (DOMA & Trabalhos)
    secondaryColor: 'rgba(245, 158, 11, 0.05)', // Âmbar Complementar
    orb1Pos: { top: '65%', left: '75%' },
    orb2Pos: { top: '40%', left: '15%' },
  },
  about: {
    primaryColor: 'rgba(14, 165, 233, 0.08)', // Azul Elétrico / Ciano (RAWPOWER.AI & Perfil Analítico)
    secondaryColor: 'rgba(99, 102, 241, 0.06)', // Índigo Suave
    orb1Pos: { top: '30%', left: '80%' },
    orb2Pos: { top: '60%', left: '20%' },
  },
  skills: {
    primaryColor: 'rgba(99, 102, 241, 0.08)', // Violeta / Índigo Suave (Design Tools & AI)
    secondaryColor: 'rgba(14, 165, 233, 0.06)', // Ciano Complementar
    orb1Pos: { top: '45%', left: '25%' },
    orb2Pos: { top: '25%', left: '70%' },
  },
  contact: {
    primaryColor: 'rgba(16, 185, 129, 0.08)', // Verde Esmeralda (Conversão & CTA)
    secondaryColor: 'rgba(204, 255, 0, 0.06)', // Lima Conversão
    orb1Pos: { top: '75%', left: '50%' },
    orb2Pos: { top: '85%', left: '80%' },
  },
  'contact-availability': {
    primaryColor: 'rgba(16, 185, 129, 0.08)',
    secondaryColor: 'rgba(204, 255, 0, 0.06)',
    orb1Pos: { top: '75%', left: '50%' },
    orb2Pos: { top: '85%', left: '80%' },
  },
  experience: {
    primaryColor: 'rgba(99, 102, 241, 0.07)',
    secondaryColor: 'rgba(14, 165, 233, 0.05)',
    orb1Pos: { top: '40%', left: '30%' },
    orb2Pos: { top: '55%', left: '85%' },
  },
  education: {
    primaryColor: 'rgba(168, 85, 247, 0.07)',
    secondaryColor: 'rgba(236, 72, 153, 0.05)',
    orb1Pos: { top: '50%', left: '75%' },
    orb2Pos: { top: '30%', left: '15%' },
  },
  'languages-interests': {
    primaryColor: 'rgba(236, 72, 153, 0.07)',
    secondaryColor: 'rgba(99, 102, 241, 0.05)',
    orb1Pos: { top: '65%', left: '30%' },
    orb2Pos: { top: '70%', left: '80%' },
  },
  faqs: {
    primaryColor: 'rgba(204, 255, 0, 0.06)',
    secondaryColor: 'rgba(16, 185, 129, 0.05)',
    orb1Pos: { top: '70%', left: '60%' },
    orb2Pos: { top: '80%', left: '20%' },
  },
};

export const AmbientLightBackground: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const sectionIds = [
      'hero',
      'about',
      'skills',
      'experience',
      'education',
      'projects',
      'languages-interests',
      'faqs',
      'contact',
      'contact-availability',
    ];

    const handleScroll = () => {
      const triggerPoint = window.innerHeight * 0.4;
      let current = 'hero';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerPoint) {
            current = id;
          }
        }
      }

      // Check near bottom of page
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 120) {
        current = 'contact';
      }

      setActiveSection(current);
    };

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-20% 0px -35% 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (SECTION_LIGHTING[id]) {
            setActiveSection(id);
          }
        }
      });
    }, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const config = SECTION_LIGHTING[activeSection] || SECTION_LIGHTING.hero;
  const transitionDuration = prefersReducedMotion ? 0.1 : 1.0;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden no-print"
      aria-hidden="true"
    >
      {/* Primary Ambient Light Orb */}
      <motion.div
        className="absolute rounded-full w-[600px] h-[600px] blur-[120px] pointer-events-none opacity-100 transition-all duration-1000 ease-in-out -translate-x-1/2 -translate-y-1/2"
        animate={{
          top: config.orb1Pos.top,
          left: config.orb1Pos.left,
          backgroundColor: config.primaryColor,
        }}
        transition={{
          duration: transitionDuration,
          ease: [0.4, 0, 0.2, 1],
        }}
      />

      {/* Secondary Complementary Light Orb */}
      <motion.div
        className="absolute rounded-full w-[500px] sm:w-[600px] h-[500px] sm:h-[600px] blur-[120px] pointer-events-none opacity-100 transition-all duration-1000 ease-in-out -translate-x-1/2 -translate-y-1/2"
        animate={{
          top: config.orb2Pos.top,
          left: config.orb2Pos.left,
          backgroundColor: config.secondaryColor,
        }}
        transition={{
          duration: transitionDuration,
          ease: [0.4, 0, 0.2, 1],
        }}
      />
    </div>
  );
};

