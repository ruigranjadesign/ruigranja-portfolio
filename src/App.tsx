import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { Navbar } from './components/Navbar';
import { SectionRail } from './components/SectionRail';
import { HeaderSection } from './components/HeaderSection';
import { MarqueeSection } from './components/MarqueeSection';
import { AboutSection } from './components/AboutSection';
import { ExperienceSection } from './components/ExperienceSection';
import { EducationSection } from './components/EducationSection';
import { ProjectsSection } from './components/ProjectsSection';
import { LanguagesInterestsSection } from './components/LanguagesInterestsSection';
import { FAQSection } from './components/FAQSection';
import { PreFooterSection } from './components/PreFooterSection';
import { AmbientLightBackground } from './components/AmbientLightBackground';
import { Footer } from './components/Footer';
import { IntroLoader } from './components/IntroLoader';

function AppContent() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const { language, toggleLanguage, data } = useLanguage();
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('minimal_cv_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [announcement, setAnnouncement] = useState<string>('');

  useEffect(() => {
    const handleAnnounce = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setAnnouncement(customEvent.detail);
      }
    };
    window.addEventListener('announce', handleAnnounce);
    return () => window.removeEventListener('announce', handleAnnounce);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
      html.classList.remove('light');
      localStorage.setItem('minimal_cv_theme', 'dark');
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
      localStorage.setItem('minimal_cv_theme', 'light');
    }
  }, [darkMode]);

  // Global Keyboard Shortcuts (1-7 for sections, ESC for modals/overlays)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'Escape') {
        window.dispatchEvent(new CustomEvent('close-modals'));
        return;
      }

      const sectionMap: Record<string, { id: string; namePt: string; nameEn: string }> = {
        '1': { id: 'about', namePt: 'Sobre', nameEn: 'About' },
        '2': { id: 'experience', namePt: 'Experiência', nameEn: 'Experience' },
        '3': { id: 'education', namePt: 'Educação', nameEn: 'Education' },
        '4': { id: 'projects', namePt: 'Projetos', nameEn: 'Projects' },
        '5': { id: 'languages-interests', namePt: 'Idiomas e Interesses', nameEn: 'Languages and Interests' },
        '6': { id: 'faqs', namePt: 'Perguntas Frequentes', nameEn: 'FAQs' },
        '7': { id: 'contact-availability', namePt: 'Contacto', nameEn: 'Contact' },
      };

      const secInfo = sectionMap[e.key];
      if (secInfo) {
        const element = document.getElementById(secInfo.id);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: 'smooth' });
          const secName = language === 'pt' ? secInfo.namePt : secInfo.nameEn;
          const msg = language === 'pt' ? `Navegou para a secção: ${secName}` : `Navigated to section: ${secName}`;
          window.dispatchEvent(new CustomEvent('announce', { detail: msg }));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [language]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    const nextMode = !darkMode;
    const themeMsg = nextMode
      ? (language === 'pt' ? 'Tema escuro ativado' : 'Dark theme enabled')
      : (language === 'pt' ? 'Tema claro ativado' : 'Light theme enabled');
    window.dispatchEvent(new CustomEvent('announce', { detail: themeMsg }));
  };

  return (
    <>
      {/* Intro Loader / Splash Screen on page load */}
      <AnimatePresence>
        {showIntro && (
          <IntroLoader onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {/* Screen Reader Live Region for status announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-200 relative overflow-x-clip">
        {/* Fixed Ambient Dynamic Lighting Background */}
        <AmbientLightBackground />

        <Navbar
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
          language={language}
          onToggleLanguage={toggleLanguage}
          email={data.profile.email}
        />

        <SectionRail />

        <main className="max-w-4xl mx-auto pb-12 sm:pb-8 print-margin-0 relative z-10 overflow-x-clip">
          <article className="max-w-4xl mx-auto pt-6 pb-24 md:pt-16 md:pb-24 px-3.5 sm:px-6 md:px-8 text-zinc-900 dark:text-zinc-100 font-sans print-margin-0 space-y-16 sm:space-y-20 md:space-y-28 overflow-visible max-w-full">
            <HeaderSection profile={data.profile} isIntroFinished={!showIntro} />

            <MarqueeSection />

            <AboutSection
              about={data.profile.about}
              skillCategories={data.skills}
            />

            <ExperienceSection experiences={data.experiences} />

            <EducationSection educationList={data.education} ongoingCourses={data.ongoingCourses} />

            <ProjectsSection projects={data.projects} />

            <LanguagesInterestsSection data={data.languagesAndInterests} />

            <FAQSection faqs={data.faqs} />

            <PreFooterSection
              email={data.profile.email}
              location={data.profile.location}
              behanceUrl={data.profile.behance}
              linkedinUrl={data.profile.linkedin}
            />
          </article>
        </main>

        <Footer
          email={data.profile.email}
          behance={data.profile.behance}
          linkedin={data.profile.linkedin}
          instagram={data.profile.instagram}
        />
      </div>
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
