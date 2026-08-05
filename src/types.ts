export interface Profile {
  name: string;
  title: string;
  location: string;
  locationUrl: string;
  availability: string;
  avatarUrl: string;
  about: string;
  email: string;
  behance: string;
  linkedin: string;
  instagram?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  location: string;
  employmentType: string;
  period: string;
  role: string;
  description: string;
  highlights?: string[];
}

export interface CredentialLink {
  label: string;
  url: string;
}

export interface Education {
  id: string;
  institution: string;
  location?: string;
  degree: string;
  year: string;
  grade?: string;
  issuerBadge?: string;
  description: string;
  skills?: string[];
  verificationLinks?: CredentialLink[];
}

export interface OngoingCourse {
  id: string;
  title: string;
  provider: string;
  url: string;
  tags?: string[];
  logoUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  subtitle?: string;
  role?: string;
  description: string;
  fullDescription?: string;
  link: string;
  tags: string[];
  featured?: boolean;
  imagePlaceholderGradient?: string;
  keyOutcomes?: string[];
  metrics?: { label: string; value: string }[];
  linkLabel?: string;
  gallery?: {
    src: string;
    webpSrc?: string;
    mobileWebpSrc?: string;
    alt: string;
  }[];
}

export interface LanguageItem {
  language: string;
  fluency: string;
}

export interface LanguagesAndInterests {
  languages: LanguageItem[];
  interests: string[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
