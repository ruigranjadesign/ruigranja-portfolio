import { Profile, WorkExperience, Education, OngoingCourse, Project, SkillCategory, LanguagesAndInterests, FAQItem } from '../types';
import { getObfuscatedEmail } from '../utils/emailObfuscator';
import shipwrightImg from '../assets/images/institutions/shipwright.webp';
import mavenImg from '../assets/images/institutions/maven-logo.webp';
import rawpowerCover from '../assets/images/projects/rawpower/01-cover.webp';
import rawpowerCoverMobile from '../assets/images/projects/rawpower/01-cover-mobile.webp';
import rawpowerStoryOverview from '../assets/images/projects/rawpower/02-story-overview.webp';
import rawpowerStoryOverviewMobile from '../assets/images/projects/rawpower/02-story-overview-mobile.webp';
import rawpowerProblemSolution from '../assets/images/projects/rawpower/03-problem-solution.webp';
import rawpowerUiScreens from '../assets/images/projects/rawpower/04-ui-screens.webp';
import domaCover from '../assets/images/projects/doma/01-cover.webp';
import domaCoverPng from '../assets/images/projects/doma/01-cover.webp';
import brasapuraCover from '../assets/images/projects/brasapura/01-cover.webp';

export const profileData: Profile = {
  name: "Rui Granja",
  title: "UX/UI Designer | AI-Driven UX & Product Strategy",
  location: "Braga, Portugal",
  locationUrl: "https://www.google.com/maps/place/Braga",
  availability: "Open to new opportunities",
  avatarUrl: "/avatar.webp",
  about: "UI/UX Designer specialized in creating user focused digital products, robust design systems, and integrating interfaces for Artificial Intelligence. Backed by solid practical training in interaction design, advanced prototyping in Figma, and usability patterns for LLMs, combining analytical rigor with the development of scalable, transparent, and intuitive experiences.",
  email: getObfuscatedEmail(),
  behance: "https://www.behance.net/ruigranja1",
  linkedin: "https://www.linkedin.com/in/ruigranja8",
  instagram: "https://www.instagram.com/rui.granja/",
};

export const skillsData: SkillCategory[] = [
  {
    category: "Core Expertise",
    skills: [
      "UI/UX Design",
      "Product Strategy",
      "Conversion Rate Optimization (CRO)",
      "Design Systems",
      "User Research & Usability Testing",
      "Responsive Web & Mobile Design",
      "AI Interface Patterns",
      "Copywriting"
    ]
  },
  {
    category: "Behavioral Mindset",
    skills: [
      "Analytical Thinking",
      "Creative Curiosity",
      "Proactivity",
      "Attention to Detail",
      "Collaboration",
      "Communication"
    ]
  },
  {
    category: "Toolstack",
    skills: [
      "Figma",
      "Midjourney",
      "Flow",
      "CapCut",
      "Higgsfield",
      "Balsamiq",
      "Mailchimp",
      "NotebookLM",
      "Gemini",
      "Claude",
      "Suno",
      "Basic Vibe Coding",
      "Notion",
      "Slack",
      "Shopify",
      "Google Ads & Analytics",
      "Google Search Console",
      "Adobe Lightroom",
      "Prompt Engineering"
    ]
  }
];

export const experienceData: WorkExperience[] = [
  {
    id: "exp-0",
    company: "Freelance",
    location: "Remote & Worldwide",
    employmentType: "Freelance",
    period: "2025 - Present",
    role: "UX/UI Designer | AI-Driven UX & Product Strategy",
    description: "Designing high-performing digital products, high-converting platforms, and scalable design systems.",
    highlights: [
      "Creation of high-impact digital platforms, including DOMA, Brasa Pura, and RAWPOWER.AI.",
      "Conversion Rate Optimization (CRO) strategies driving user engagement and sales performance.",
      "Building scalable, reusable Design Systems and UI component libraries in Figma."
    ]
  },
  {
    id: "exp-1",
    company: "Mundotêxtil",
    location: "Vizela, Portugal",
    employmentType: "Full-time",
    period: "2016 - 2024",
    role: "Label designing | printing & Warehouse",
    description: "Applied strict operational discipline and process standardization to industrial production line workflows.",
    highlights: [
      "Implementation of quality control standards and zero-tolerance defect policies across the production line.",
      "Systemic rigor and extreme attention to detail applied to creating Design Tokens, accessibility compliance, and UI components."
    ]
  },
  {
    id: "exp-2",
    company: "Sonae Sierra",
    location: "Guimarães, Portugal",
    employmentType: "Full-time",
    period: "2013 - 2015",
    role: "Operational Auditing",
    description: "Evaluated complex operational workflows and compliance across commercial retail locations.",
    highlights: [
      "Auditing and analyzing complex process workflows, systematically eliminating operational inconsistencies.",
      "Mapping workflow journeys and operational touchpoints, applied directly to Information Architecture and UX Research."
    ]
  }
];

export const educationData: Education[] = [
  {
    id: "edu-1",
    institution: "Lisbon School of Design",
    location: "Porto",
    degree: "UX/UI Design",
    year: "2025",
    grade: "18/20",
    issuerBadge: "LSD CERTIFIED",
    description: "Hands-on focus on visual & interaction design, high-fidelity UI, and prototyping.",
    skills: ["Figma", "Design Systems", "High-Fidelity Prototyping", "Visual Hierarchy", "User Flows"],
    verificationLinks: [
      { label: "View Testimonial ↗", url: "https://lsd.pt/testemunhos/rui-granja" }
    ]
  },
  {
    id: "edu-6",
    institution: "Smashing Media AG (by Vitaly Friedman)",
    degree: "Design Patterns for AI Interfaces",
    year: "2026",
    issuerBadge: "VERIFIED BY SMASHING MEDIA",
    description: "UX strategy and interface design patterns for Artificial Intelligence (LLMs). Focused on scaffolding, Human-AI interaction, context management, and guardrails to build user trust and transparency.",
    skills: ["AI UI Patterns", "LLM Interaction Design", "Scaffolding & Trust", "Context Management"],
    verificationLinks: [
      { label: "View Course ↗", url: "https://ai-design-patterns.com/" }
    ]
  },
  {
    id: "edu-4",
    institution: "Saïd Business School, University of Oxford",
    degree: "Generative and Agentic AI",
    year: "2026",
    issuerBadge: "OXFORD CERTIFIED",
    description: "Advanced exploration into generative intelligence, agentic frameworks, and strategic business applications of LLMs.",
    skills: ["Generative AI", "Agentic Workflows", "LLM Applications", "AI Strategy"],
    verificationLinks: [
      { label: "Verify Certificate ↗", url: "https://www.coursera.org/account/accomplishments/verify/T8ZXDZAAPY5U" }
    ]
  },
  {
    id: "edu-2",
    institution: "Google",
    degree: "Google UX Design Specialization",
    year: "2025",
    issuerBadge: "GOOGLE CERTIFIED",
    description: "End-to-end UX process, including key research artifacts and usability studies.",
    skills: ["User Research", "Wireframing", "Usability Testing", "Personas", "Interactive Prototypes"],
    verificationLinks: [
      { label: "Verify Certificate ↗", url: "https://www.coursera.org/account/accomplishments/professional-cert/SJDATZ0KN0ZN" }
    ]
  },
  {
    id: "edu-3",
    institution: "Google",
    degree: "Google AI & Prompting Specializations",
    year: "2025",
    issuerBadge: "GOOGLE CERTIFIED",
    description: "Applying advanced prompt engineering, such as prompt chaining, and responsible AI fundamentals to optimize research, data analysis, and content workflows.",
    skills: ["Prompt Engineering", "Prompt Chaining", "AI Research Workflows", "Responsible AI"],
    verificationLinks: [
      { label: "Specialization 1 ↗", url: "https://www.coursera.org/account/accomplishments/professional-cert/OAS300J9SIZQ" },
      { label: "Specialization 2 ↗", url: "https://www.coursera.org/account/accomplishments/specialization/6GKFIHSZKNGS" },
      { label: "Specialization 3 ↗", url: "https://www.coursera.org/account/accomplishments/specialization/5F0KGJUWAF5T" }
    ]
  },
  {
    id: "edu-5",
    institution: "Google",
    degree: "Google Digital Marketing & E-commerce Specialization",
    year: "2026",
    issuerBadge: "GOOGLE CERTIFIED",
    description: "Conversion rate optimization (CRO), multi-channel digital marketing, online store governance, advanced SEO/SEM strategies, email automation, and analytics.",
    skills: ["SEO & SEM", "Digital Marketing", "Conversion Rate Optimization (CRO)", "E-commerce Strategy", "Email Automation"],
    verificationLinks: [
      { label: "Verify Certificate ↗", url: "https://www.coursera.org/account/accomplishments/specialization/XWFCK3BR7EA7" }
    ]
  }
];

export const ongoingCoursesData: OngoingCourse[] = [
  {
    id: "course-1",
    title: "Design System Course for Figma",
    provider: "Shipwright (by Headway)",
    url: "https://www.shipwright.design/",
    tags: ["Design Systems", "Figma Tokens", "Architecture"],
    logoUrl: shipwrightImg
  },
  {
    id: "course-2",
    title: "Product Strategy for Designers",
    provider: "Femke van Schoonhoven (Maven)",
    url: "https://maven.com/femke/product-strategy-for-designers",
    tags: ["Product Strategy", "Business Impact", "Roadmaps"],
    logoUrl: mavenImg
  }
];

export const projectsData: Project[] = [
  {
    id: "proj-1",
    title: "Fitness and Nutrition App",
    category: "Mobile App Design",
    description: "UX/UI design case study for a fitness and nutrition application.",
    fullDescription: "A comprehensive end-to-end UX/UI design case study for a mobile fitness and nutrition tracker. Features intuitive meal logging, goal-oriented workout flows, personalized streak analytics, and seamless dark/light UI components.",
    link: "https://www.behance.net/gallery/231961657/Fitness-and-nutrition-app-UXUI-design-case-study-EN",
    tags: ["UX/UI Design", "Figma", "Case Study", "Health & Fitness", "Mobile UI"],
    featured: true,
    linkLabel: "VIEW FULL STUDY",
    imagePlaceholderGradient: "from-blue-600/20 via-indigo-600/20 to-purple-600/20",
    keyOutcomes: [
      "Streamlined multi-step meal logging into a 2-tap interaction flow",
      "Designed visual progress dashboards with high contrast accessibility",
      "Created reusable design component tokens in Figma"
    ],
    metrics: [
      { label: "Interaction Cost", value: "2-Tap Flow" },
      { label: "Accessibility", value: "AAA Contrast" },
      { label: "Design Tokens", value: "100% Figma" }
    ],
    gallery: [
      {
        src: rawpowerCover,
        mobileWebpSrc: rawpowerCoverMobile,
        alt: "RAWPOWER.AI: Overview of the AI-powered mobile fitness and nutrition application"
      },
      {
        src: rawpowerStoryOverview,
        mobileWebpSrc: rawpowerStoryOverviewMobile,
        alt: "Project context and user-centered design process for the RAWPOWER.AI platform"
      },
      {
        src: rawpowerProblemSolution,
        alt: "Comparative overview between traditional app pain points and the RAWPOWER.AI adaptive solution"
      },
      {
        src: rawpowerUiScreens,
        alt: "Final user interface showing key screen designs of the main app flow"
      }
    ]
  },
  {
    id: "proj-2",
    title: "DOMA",
    category: "Web Platform Design",
    subtitle: "Luxury Real Estate Platform | Luxury Living. Simplified.",
    role: "UX/UI Designer (End-to-End, 2-week Concept Sprint)",
    description: "End-to-end UX/UI case study for a luxury real estate platform in Portugal.",
    fullDescription: "A comprehensive end-to-end UX/UI design case study for a luxury real estate platform in Portugal. Features search-first architecture, digital concierge user flows, lifestyle-curated collections, and an elegant experience focused on building trust with international buyers.",
    link: "https://www.behance.net/gallery/234984137/DOMA-Luxury-Real-Estate-Platform-(UXUI-Case-Study)",
    tags: ["UX/UI Design", "Figma", "Case Study", "Luxury Real Estate", "Web Platform"],
    featured: true,
    linkLabel: "VIEW FULL STUDY",
    imagePlaceholderGradient: "from-amber-600/20 via-orange-600/20 to-zinc-600/20",
    keyOutcomes: [
      "Designed search-first architecture and lifestyle-based collections (Ocean Villas, Vineyards, Penthouses)",
      "Implemented high-converting microcopy (\"Book Private Tour\", \"Unlock VIP Access\") and transparent scheduling flows",
      "Created a minimalist design system using strategic negative space, bold typography, and subtle gold accents"
    ],
    metrics: [
      { label: "Concept Sprint", value: "2-Week Delivery" },
      { label: "Architecture", value: "Search-First UX" },
      { label: "Design System", value: "Luxury Minimalist" }
    ],
    gallery: [
      {
        src: domaCoverPng,
        alt: "DOMA: Case study cover, luxury real estate digital platform in Portugal"
      }
    ]
  },
  {
    id: "proj-3",
    title: "Brasa Pura",
    category: "Web Design / Landing Page",
    subtitle: "Authentic Steakhouse Landing Page | Taste the Tradition",
    role: "UX/UI Designer (End-to-End)",
    description: "A high-converting landing page designed for an authentic Portuguese steakhouse.",
    fullDescription: "A high-converting landing page designed for an authentic Portuguese steakhouse using a single-screen above-the-fold architecture to eliminate scroll friction and drive instant reservations.",
    link: "https://www.behance.net/gallery/235073815/Brasa-Pura-Portuguese-Luxury-Steakhouse-Hero-Page",
    tags: ["UX/UI Design", "Figma", "Landing Page", "Restaurant", "Conversion UX"],
    featured: true,
    linkLabel: "VIEW FULL STUDY",
    imagePlaceholderGradient: "from-red-600/20 via-amber-700/20 to-zinc-900/20",
    keyOutcomes: [
      "Engineered an above-the-fold layout architecture reducing interaction cost and accelerating user decision-making",
      "Crafted high-converting microcopy and high-contrast CTAs to boost online table bookings and menu exploration",
      "Designed an immersive dark-mode visual system with warm charcoal and fire accents reflecting traditional steakhouse dining"
    ],
    metrics: [
      { label: "Layout Architecture", value: "Above-The-Fold" },
      { label: "Conversion Rate", value: "Zero Friction" },
      { label: "Visual Identity", value: "Fire Accents" }
    ],
    gallery: [
      {
        src: brasapuraCover,
        alt: "Brasa Pura: Landing page cover showing above-the-fold hero section for an authentic steakhouse"
      }
    ]
  }
];

export const languagesAndInterestsData: LanguagesAndInterests = {
  languages: [
    { language: "Portuguese", fluency: "Native" },
    { language: "English", fluency: "Advanced" }
  ],
  interests: [
    "Music Production",
    "Photography & Editing",
    "Reading",
    "Fitness"
  ]
};

export const faqData: FAQItem[] = [
  {
    id: "faq-1",
    question: "What are your primary design services and scope of work?",
    answer: "I specialize in Web and Mobile App UX/UI Design, supported by persuasive copywriting and high-impact social media assets. My approach bridges aesthetic refinement, conversion rate optimization (CRO), and user-centered strategy to deliver complete digital products and brand assets from interface to microcopy."
  },
  {
    id: "faq-2",
    question: "What work arrangements or roles are you currently open to?",
    answer: "I am fully available for full-time roles, remote opportunities worldwide (including United States, Europe, and global teams), freelance design projects, and eligible for professional training programs or internships (such as IEFP Iniciar in Portugal)."
  },
  {
    id: "faq-3",
    question: "How fast is your turnaround time, and what does your design process look like?",
    answer: "It depends on the scope, but I work with agile methodologies and short sprints. I can deliver complete web/mobile platforms, landing pages, or visual marketing kits in 1 to 2 weeks, covering initial research and wireframes through to persuasive copy and production-ready Figma prototypes."
  },
  {
    id: "faq-4",
    question: "How do you handle design handoffs with development teams?",
    answer: "My Figma files are structured with Design Tokens, Auto-Layout, and detailed component documentation. The goal is to let developers implement every layout without guessing margins, hover states, or responsive behavior."
  },
  {
    id: "faq-5",
    question: "Are you flexible to work with international brands or remote teams in the US and Worldwide?",
    answer: "Absolutely. I am fully equipped to collaborate with US and international companies worldwide. I offer flexible working hours to overlap with US and European time zones, utilize modern remote tools (Figma, Miro, Notion, Slack, Discord), and maintain clear, results-driven communication."
  }
];

