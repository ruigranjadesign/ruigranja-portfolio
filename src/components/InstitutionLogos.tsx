import React from 'react';
import lsdImg from '../assets/images/institutions/lsd.webp';
import oxfordImg from '../assets/images/institutions/oxford.webp';
import smashingImg from '../assets/images/institutions/smashing.webp';
import shipwrightImg from '../assets/images/institutions/shipwright.webp';
import mavenImg from '../assets/images/institutions/maven-logo.webp';
import mavenImgMobile from '../assets/images/institutions/maven-logo-mobile.webp';

export { shipwrightImg, mavenImg, mavenImgMobile };

interface LogoProps {
  className?: string;
}

export const GoogleLogo: React.FC<LogoProps> = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-label="Google Logo"
  >
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const LsdLogo: React.FC<LogoProps> = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    aria-label="Lisbon School of Design Logo"
  >
    {/* Geometric LSD lettermark */}
    <path d="M2 4h3v13h5v3H2V4zm9 0h6.5v3H14v3.5h3c1.1 0 2 .9 2 2V17c0 1.7-1.3 3-3 3H11v-3h4.5v-3.5H11V4zm9.5 0H23v16h-2.5V4z" />
  </svg>
);

export const OxfordLogo: React.FC<LogoProps> = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    aria-label="University of Oxford Logo"
  >
    {/* University of Oxford Coat of Arms Shield */}
    <path d="M12 1.5L3.5 4.8v6.2c0 5.6 3.6 10.8 8.5 12.2 4.9-1.4 8.5-6.6 8.5-12.2V4.8L12 1.5zm0 2.1l6.5 2.5v5.6c0 4.5-2.8 8.7-6.5 9.8-3.7-1.1-6.5-5.3-6.5-9.8V6.1L12 3.6z" />
    <path d="M7 6.8l.8.8.8-.8.8.8.8-.8v1.2H7z" />
    <path d="M13.8 6.8l.8.8.8-.8.8.8.8-.8v1.2h-3.2z" />
    <path d="M7.5 10.2h4v5h-4zm5 0h4v5h-4z" fillOpacity="0.2" />
    <path d="M7.5 10.2h4v5h-4zm5 0h4v5h-4z" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <path d="M8.5 11.5h2M8.5 13h2M13.5 11.5h2M13.5 13h2" stroke="currentColor" strokeWidth="1" />
    <path d="M10.4 16.5l.8.8.8-.8.8.8.8-.8v1.2h-3.2z" />
  </svg>
);

export const SmashingLogo: React.FC<LogoProps> = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    aria-label="Smashing Media Logo"
  >
    {/* Official Smashing Magazine 'S' Logo */}
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.4 15.6c-1.2 2.1-3.6 3.3-6.3 3.3-3.6 0-6.6-2.1-7.5-5.4l2.7-.9c.6 2.1 2.4 3.3 4.8 3.3 1.8 0 3.3-.9 3.9-2.1.6-1.2.3-2.7-.9-3.6l-3.6-2.4c-2.4-1.5-3.3-3.9-2.4-6.3.9-2.4 3.3-3.9 6.3-3.9 3.3 0 5.7 1.8 6.6 4.8l-2.7.9c-.6-1.8-2.1-2.7-3.9-2.7-1.8 0-3 .9-3.6 2.1-.3.9 0 2.1.9 2.7l3.6 2.4c2.7 1.5 3.9 3.9 3 6.3z" />
  </svg>
);

export const InstitutionLogo: React.FC<{
  institution: string;
  className?: string;
}> = ({ institution, className = "w-4 h-4 md:w-5 md:h-5" }) => {
  const nameLower = institution.toLowerCase();

  let logoSrc = '';
  let altText = institution;

  if (nameLower.includes('google')) {
    logoSrc = '/images/institutions/google.svg';
    altText = 'Google Logo';
  } else if (nameLower.includes('lisbon school') || nameLower.includes('lsd')) {
    return (
      <img
        src={lsdImg}
        alt="Lisbon School of Design Logo"
        referrerPolicy="no-referrer"
        className={`${className} object-contain dark:brightness-110 rounded-lg transition-all`}
      />
    );
  } else if (nameLower.includes('oxford') || nameLower.includes('saïd') || nameLower.includes('said')) {
    return (
      <img
        src={oxfordImg}
        alt="Saïd Business School, University of Oxford Logo"
        referrerPolicy="no-referrer"
        className={`${className} object-contain dark:brightness-110 rounded-lg transition-all`}
      />
    );
  } else if (nameLower.includes('smashing')) {
    return (
      <img
        src={smashingImg}
        alt="Smashing Media AG Logo"
        referrerPolicy="no-referrer"
        className={`${className} object-contain dark:brightness-110 rounded-lg transition-all`}
      />
    );
  } else if (nameLower.includes('shipwright') || nameLower.includes('headway')) {
    return (
      <img
        src={shipwrightImg}
        alt="Shipwright Logo"
        referrerPolicy="no-referrer"
        className={`${className} object-contain dark:brightness-110 rounded-lg transition-all`}
      />
    );
  } else if (nameLower.includes('maven') || nameLower.includes('femke')) {
    return (
      <img
        src={mavenImg}
        srcSet={`${mavenImgMobile} 768w, ${mavenImg} 1200w`}
        sizes="(max-width: 768px) 768px, 100vw"
        alt="Maven Logo"
        referrerPolicy="no-referrer"
        className={`${className} object-contain dark:brightness-110 rounded-lg transition-all`}
      />
    );
  }

  if (logoSrc) {
    return (
      <img
        src={logoSrc}
        alt={altText}
        referrerPolicy="no-referrer"
        className={`${className} object-contain dark:invert-[0.1] dark:brightness-120 transition-all`}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
};
