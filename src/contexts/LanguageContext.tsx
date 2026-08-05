import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  profileData,
  skillsData,
  experienceData,
  educationData,
  ongoingCoursesData,
  projectsData,
  languagesAndInterestsData,
  faqData,
} from '../data/portfolioData';
import {
  profileDataPt,
  skillsDataPt,
  experienceDataPt,
  educationDataPt,
  ongoingCoursesDataPt,
  projectsDataPt,
  languagesAndInterestsDataPt,
  faqDataPt,
} from '../data/portfolioData.pt';
import { uiStrings, UIStrings } from '../data/uiStrings';
import { Profile, WorkExperience, Education, OngoingCourse, Project, SkillCategory, LanguagesAndInterests, FAQItem } from '../types';

export type Language = 'en' | 'pt';

interface PortfolioDataBundle {
  profile: Profile;
  skills: SkillCategory[];
  experiences: WorkExperience[];
  education: Education[];
  ongoingCourses: OngoingCourse[];
  projects: Project[];
  languagesAndInterests: LanguagesAndInterests;
  faqs: FAQItem[];
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: UIStrings;
  data: PortfolioDataBundle;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_language') as Language;
      if (saved === 'en' || saved === 'pt') {
        return saved;
      }
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_language', lang);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pt' : 'en');
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useMemo(() => uiStrings[language], [language]);

  const data = useMemo<PortfolioDataBundle>(() => {
    if (language === 'pt') {
      return {
        profile: profileDataPt,
        skills: skillsDataPt,
        experiences: experienceDataPt,
        education: educationDataPt,
        ongoingCourses: ongoingCoursesDataPt,
        projects: projectsDataPt,
        languagesAndInterests: languagesAndInterestsDataPt,
        faqs: faqDataPt,
      };
    }
    return {
      profile: profileData,
      skills: skillsData,
      experiences: experienceData,
      education: educationData,
      ongoingCourses: ongoingCoursesData,
      projects: projectsData,
      languagesAndInterests: languagesAndInterestsData,
      faqs: faqData,
    };
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        data,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
