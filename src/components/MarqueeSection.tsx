import React, { useEffect, useRef } from 'react';
import { InstitutionLogo } from './InstitutionLogos';
import { useLanguage } from '../contexts/LanguageContext';

interface MarqueeItem {
  id: string;
  institution: string;
  title: string;
  subtitleEn: string;
  subtitlePt: string;
  type: 'completed' | 'ongoing';
}

const row1Base: MarqueeItem[] = [
  {
    id: 'm-lsd',
    institution: 'Lisbon School of Design',
    title: 'Lisbon School of Design',
    subtitleEn: 'UX/UI Design Specialization',
    subtitlePt: 'Especialização em UX/UI Design',
    type: 'completed',
  },
  {
    id: 'm-google',
    institution: 'Google',
    title: 'Google',
    subtitleEn: 'UX, AI & E-commerce Specializations',
    subtitlePt: 'Especializações em UX, IA e E-commerce',
    type: 'completed',
  },
  {
    id: 'm-smashing',
    institution: 'Smashing Media AG',
    title: 'Smashing Media AG',
    subtitleEn: 'Smart Interface Design Patterns & AI',
    subtitlePt: 'Padrões de Design para Interfaces com IA',
    type: 'completed',
  },
];

const row2Base: MarqueeItem[] = [
  {
    id: 'm-oxford',
    institution: 'Saïd Business School, University of Oxford',
    title: 'University of Oxford',
    subtitleEn: 'Generative & Agentic AI Programme',
    subtitlePt: 'Programa de IA Generativa e Agêntica',
    type: 'completed',
  },
  {
    id: 'm-maven',
    institution: 'Maven',
    title: 'Maven',
    subtitleEn: 'Product Strategy for Designers',
    subtitlePt: 'Estratégia de Produto para Designers',
    type: 'ongoing',
  },
  {
    id: 'm-shipwright',
    institution: 'Shipwright',
    title: 'Shipwright',
    subtitleEn: 'Design System Course for Figma',
    subtitlePt: 'Curso de Design System para Figma',
    type: 'ongoing',
  },
];

// Quadruplicar arrays para garantir loop contínuo e sem cortes no viewport
const row1Items = [...row1Base, ...row1Base, ...row1Base, ...row1Base];
const row2Items = [...row2Base, ...row2Base, ...row2Base, ...row2Base];

export const MarqueeSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    let animationFrameId: number;

    const updateScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const innerHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Calcular offset do scroll proporcional à posição do elemento na janela
      const scrollDelta = scrollY - (sectionTop - innerHeight);
      const baseOffset = Math.max(0, scrollDelta) * 0.25;

      if (row1Ref.current && row1Ref.current.scrollWidth > 0) {
        const setWidth1 = row1Ref.current.scrollWidth / 4;
        if (setWidth1 > 0) {
          const modOffset1 = baseOffset % setWidth1;
          row1Ref.current.style.transform = `translate3d(${-setWidth1 - modOffset1}px, 0, 0)`;
        }
      }

      if (row2Ref.current && row2Ref.current.scrollWidth > 0) {
        const setWidth2 = row2Ref.current.scrollWidth / 4;
        if (setWidth2 > 0) {
          const modOffset2 = baseOffset % setWidth2;
          row2Ref.current.style.transform = `translate3d(${-setWidth2 * 2 + modOffset2}px, 0, 0)`;
        }
      }
    };

    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(updateScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const renderCard = (item: MarqueeItem, key: string) => {
    const isCompleted = item.type === 'completed';
    const badgeText = isCompleted ? t.marquee.certification : t.marquee.inProgress;
    const subtitle = language === 'pt' ? item.subtitlePt : item.subtitleEn;

    return (
      <div
        key={key}
        className="group relative overflow-hidden w-[260px] xs:w-[290px] sm:w-[320px] md:w-[360px] h-[170px] xs:h-[185px] sm:h-[200px] md:h-[230px] rounded-[28px] sm:rounded-[36px] md:rounded-[40px] bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 md:p-6 flex flex-col justify-between shrink-0 shadow-xs transition-all duration-300 hover:border-lime-500 dark:hover:border-[#CCFF00]"
      >
        {/* Pontinhos decorativos espalhados no fundo (puramente estéticos) */}
        <div aria-hidden="true" className="absolute top-5 right-5 sm:top-6 sm:right-6 w-1.5 h-1.5 rounded-full bg-zinc-900/10 dark:bg-white/10 pointer-events-none" />
        <div aria-hidden="true" className="absolute top-10 right-10 sm:top-12 sm:right-12 w-1 h-1 rounded-full bg-zinc-900/10 dark:bg-white/10 pointer-events-none" />
        <div aria-hidden="true" className="absolute bottom-5 right-7 sm:bottom-6 sm:right-8 w-1.5 h-1.5 rounded-full bg-zinc-900/10 dark:bg-white/10 pointer-events-none" />

        {/* Canto superior esquerdo: Badge Pill */}
        <div className="flex items-center justify-between z-10">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 bg-zinc-100 dark:bg-zinc-800 text-[9px] sm:text-[10px] tracking-wider font-mono font-bold uppercase text-zinc-700 dark:text-zinc-300">
            {badgeText}
          </span>
        </div>

        {/* Centro: Logo com InstitutionLogo em círculo de destaque */}
        <div className="flex items-center gap-3 my-auto z-10">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-zinc-100/90 dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/60 flex items-center justify-center p-2 sm:p-2.5 shrink-0 shadow-xs">
            <InstitutionLogo
              institution={item.institution}
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain transition-all duration-300"
            />
          </div>
          <div className="flex flex-col min-w-0 pr-1">
            <span className="font-syne font-bold text-xs xs:text-sm sm:text-base md:text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors truncate">
              {item.title}
            </span>
          </div>
        </div>

        {/* Canto inferior: Subtítulo do curso/certificação */}
        <div className="z-10">
          <p className="font-mono text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-tight sm:leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    );
  };

  return (
    <section
      id="marquee"
      ref={sectionRef}
      className="pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden relative max-w-full select-none"
      aria-label="Social proof certification marquee"
      style={{
        maskImage: 'linear-gradient(to right, transparent 0, black 70px, black calc(100% - 70px), transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0, black 70px, black calc(100% - 70px), transparent 100%)',
      }}
    >
      <div className="flex flex-col gap-2.5 sm:gap-3 md:gap-4">
        {/* Row 1: Leftward scroll */}
        <div className="overflow-hidden w-full py-1">
          <div
            ref={row1Ref}
            className="flex items-center gap-2.5 sm:gap-3 md:gap-4 w-max will-change-transform"
          >
            {row1Items.map((item, idx) => renderCard(item, `row1-${item.id}-${idx}`))}
          </div>
        </div>

        {/* Row 2: Rightward scroll */}
        <div className="overflow-hidden w-full py-1">
          <div
            ref={row2Ref}
            className="flex items-center gap-2.5 sm:gap-3 md:gap-4 w-max will-change-transform"
          >
            {row2Items.map((item, idx) => renderCard(item, `row2-${item.id}-${idx}`))}
          </div>
        </div>
      </div>
    </section>
  );
};
