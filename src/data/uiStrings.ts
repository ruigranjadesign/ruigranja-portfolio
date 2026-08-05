export interface UIStrings {
  // 1. Botões de Ação Principais (CTAs)
  actions: {
    viewProject: string;
    viewCaseStudy: string;
    downloadCv: string;
    copyEmail: string;
    scheduleMeeting: string;
    startConversation: string;
    viewGallery: string;
    viewCourse: string;
    backToTop: string;
  };
  // 2. Mensagens de Feedback / Modais (Fórmula: O que aconteceu + Como resolver)
  feedback: {
    emailCopiedSuccess: string;
    messageSentSuccess: string;
    formError: string;
    linkCopiedSuccess: string;
    genericError: string;
  };
  // 3. Filtros de Projetos e Categorias
  filters: {
    all: string;
    uxUi: string;
    croMarketing: string;
    designSystems: string;
  };
  // 4. Estados Vazios (Empty States)
  emptyStates: {
    noResultsTitle: string;
    noResultsDescription: string;
    clearFiltersAction: string;
    tryDifferentSearch: string;
  };

  // UI Component Strings (Refined for conciseness & action verbs)
  nav: {
    switchLanguage: string;
    toggleTheme: string;
    forAgents: string;
    forAgentsTitle: string;
  };
  intro: {
    words: string[];
    skip: string;
  };
  introLoader: {
    words: string[];
    clickToSkip: string;
  };
  rail: {
    sections: {
      about: string;
      experience: string;
      education: string;
      projects: string;
      languagesInterests: string;
      faqs: string;
      contact: string;
    };
    scrollTo: string;
  };
  header: {
    greeting: string;
    copied: string;
    emailCopied: string;
    sendEmail: string;
    copyEmail: string;
    viewBehance: string;
    viewLinkedin: string;
    viewInstagram: string;
  };
  about: {
    badge: string;
    titlePrefix: string;
    rotatingWords: string[];
    skillsBadge: string;
    clickToDiscover: string;
  };
  experience: {
    badge: string;
    titlePrefix: string;
    rotatingWords: string[];
    tagline: string;
    more: string;
    less: string;
    expandDetails: string;
    collapseDetails: string;
  };
  education: {
    badge: string;
    rotatingPhrases: string[];
    certificationsStat: string;
    certificationsCount: string;
    specializationsStat: string;
    specializationsCount: string;
    continuousLearningStat: string;
    continuousLearning: string;
    seeMoreCertificates: string;
    seeMore: string;
    seeLess: string;
    onGoingBadge: string;
    onGoingTitle: string;
    viewCourse: string;
    gradeLabel: string;
    grade: string;
  };
  projects: {
    badge: string;
    title: string;
    items: string;
    gallery: string;
    galleryBadge: string;
    photo: string;
    photos: string;
    clickToExplore: string;
    viewFullStudy: string;
    viewGallery: string;
    quickOverview: string;
    wipBadge: string;
    wipTitle: string;
    wipDescription: string;
    wipStatus: string;
    wipVersion: string;
  };
  projectModal: {
    closeModal: string;
    featuredCover: string;
    caseStudyOverview: string;
    projectSummary: string;
    summary: string;
    keyDeliverables: string;
    copyLink: string;
    copied: string;
    viewFullStudy: string;
  };
  projectGallery: {
    caseStudyGallery: string;
    expand: string;
    openFullscreen: string;
    prevImage: string;
    nextImage: string;
    closeLightbox: string;
  };
  languagesInterests: {
    badge: string;
    titlePrefix: string;
    rotatingWords: string[];
    languagesFluency: string;
    languagesTitle: string;
    personalInterests: string;
    interestsTitle: string;
  };
  faqs: {
    badge: string;
    title: string;
    subtitle: string;
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
  };
  preFooter: {
    badge: string;
    availabilityBadge: string;
    titleStart: string;
    titleHighlight: string;
    titleEnd: string;
    headlineStart: string;
    headlineHighlight: string;
    headlineEnd: string;
    startConversation: string;
    copyEmail: string;
    emailCopied: string;
    localTime: string;
  };
  footer: {
    role: string;
    roleTagline: string;
    contact: string;
    copied: string;
    copyEmailAddress: string;
    copyEmailTitle: string;
    emailCopiedScreenReader: string;
    backToTop: string;
    backToTopTitle: string;
    top: string;
  };
  marquee: {
    certification: string;
    inProgress: string;
  };
}

export const uiStrings: Record<'en' | 'pt', UIStrings> = {
  en: {
    actions: {
      viewProject: 'View Project',
      viewCaseStudy: 'View Case Study',
      downloadCv: 'Download CV (PDF)',
      copyEmail: 'Copy Email Address',
      scheduleMeeting: 'Schedule Discovery Meeting',
      startConversation: 'Start Conversation',
      viewGallery: 'Explore Gallery',
      viewCourse: 'View Course Syllabus',
      backToTop: 'Back to Top',
    },
    feedback: {
      emailCopiedSuccess: 'Email address copied to clipboard. You can now paste it into your mail app.',
      messageSentSuccess: 'Message sent successfully. I will review your request and reply within 24 business hours.',
      formError: 'Form submission failed due to invalid fields. Please check the highlighted inputs and try again.',
      linkCopiedSuccess: 'Project link copied to clipboard. You can share it directly.',
      genericError: 'An unexpected error occurred. Please refresh the page or try again in a few moments.',
    },
    filters: {
      all: 'All Projects',
      uxUi: 'UX/UI Design',
      croMarketing: 'CRO & Marketing',
      designSystems: 'Design Systems',
    },
    emptyStates: {
      noResultsTitle: 'No projects match your search',
      noResultsDescription: 'We could not find any projects matching your active search or filters. Reset filters or try another term.',
      clearFiltersAction: 'Clear All Filters',
      tryDifferentSearch: 'Try another search term',
    },
    nav: {
      switchLanguage: 'Switch language to Portuguese',
      toggleTheme: 'Toggle color theme',
      forAgents: 'for agents',
      forAgentsTitle: 'AI Agent documentation & System prompt',
    },
    intro: {
      words: ['VISION', 'STRATEGY', 'APPROACH'],
      skip: 'Skip intro',
    },
    introLoader: {
      words: ['VISION', 'STRATEGY', 'APPROACH'],
      clickToSkip: 'Skip intro',
    },
    rail: {
      sections: {
        about: 'About',
        experience: 'Experience',
        education: 'Education',
        projects: 'Projects',
        languagesInterests: 'Languages & Interests',
        faqs: 'FAQs',
        contact: 'Contact',
      },
      scrollTo: 'Scroll to section',
    },
    header: {
      greeting: 'hi, i’m',
      copied: 'COPIED',
      emailCopied: 'Email copied to clipboard',
      sendEmail: 'Send Email',
      copyEmail: 'Copy Email Address',
      viewBehance: 'View Behance Portfolio',
      viewLinkedin: 'View LinkedIn Profile',
      viewInstagram: 'View Instagram Profile',
    },
    about: {
      badge: 'EXECUTIVE SUMMARY & PROFILE',
      titlePrefix: 'DESIGN',
      rotatingWords: ['APPROACH', 'STRATEGY', 'VISION'],
      skillsBadge: 'TECHNICAL & STRATEGIC TOOLKIT',
      clickToDiscover: 'Click to discover',
    },
    experience: {
      badge: 'CAREER HISTORY & EXPERIENCE',
      titlePrefix: 'WORK',
      rotatingWords: ['EXPERIENCE', 'JOURNEY', 'PROGRESSION'],
      tagline: 'How 10 years of operational quality & auditing shape my systematic approach to UX/UI.',
      more: 'MORE',
      less: 'LESS',
      expandDetails: 'Expand experience details',
      collapseDetails: 'Collapse experience details',
    },
    education: {
      badge: 'SPECIALIZATIONS & ACADEMICS',
      rotatingPhrases: ['EDUCATION & DEGREES', 'EVOLUTION & GROWTH', 'HORIZON & MASTERY'],
      certificationsStat: '6 CERTIFICATIONS',
      certificationsCount: '6 CERTIFICATIONS',
      specializationsStat: '3 SPECIALIZATIONS',
      specializationsCount: '3 SPECIALIZATIONS',
      continuousLearningStat: 'CONTINUOUS LEARNING',
      continuousLearning: 'CONTINUOUS LEARNING',
      seeMoreCertificates: 'SEE MORE CERTIFICATES',
      seeMore: 'SEE MORE CERTIFICATES',
      seeLess: 'SEE LESS',
      onGoingBadge: 'ONGOING',
      onGoingTitle: 'Active Learning & Ongoing Courses',
      viewCourse: 'View Course Syllabus',
      gradeLabel: 'GRADE:',
      grade: 'GRADE:',
    },
    projects: {
      badge: 'FEATURED CASE STUDIES & PROJECTS',
      title: 'PORTFOLIO ARCHIVE',
      items: 'ITEMS',
      gallery: 'GALLERY',
      galleryBadge: 'GALLERY',
      photo: 'PHOTO',
      photos: 'PHOTOS',
      clickToExplore: 'CLICK TO EXPLORE GALLERY & SUMMARY',
      viewFullStudy: 'VIEW CASE STUDY',
      viewGallery: 'EXPLORE GALLERY',
      quickOverview: 'QUICK OVERVIEW',
      wipBadge: 'WIP · System Architecture',
      wipTitle: 'New Design System',
      wipDescription: 'Accessible component library and design tokens in development for Figma.',
      wipStatus: 'Status: Figma',
      wipVersion: 'v0.1',
    },
    projectModal: {
      closeModal: 'Close modal dialog',
      featuredCover: 'FEATURED COVER',
      caseStudyOverview: 'CASE STUDY OVERVIEW',
      projectSummary: 'PROJECT SUMMARY',
      summary: 'PROJECT SUMMARY',
      keyDeliverables: 'KEY DELIVERABLES & IMPACT',
      copyLink: 'COPY CASE STUDY LINK',
      copied: 'COPIED',
      viewFullStudy: 'VIEW CASE STUDY',
    },
    projectGallery: {
      caseStudyGallery: 'CASE STUDY GALLERY',
      expand: 'EXPAND',
      openFullscreen: 'Open image in fullscreen',
      prevImage: 'Previous image',
      nextImage: 'Next image',
      closeLightbox: 'Close lightbox view',
    },
    languagesInterests: {
      badge: 'LANGUAGES & INTERESTS',
      titlePrefix: 'PERSONAL',
      rotatingWords: ['PROFILE', 'INTERESTS', 'LANGUAGES'],
      languagesFluency: 'LANGUAGES & FLUENCY',
      languagesTitle: 'LANGUAGES & FLUENCY',
      personalInterests: 'PERSONAL INTERESTS',
      interestsTitle: 'PERSONAL INTERESTS',
    },
    faqs: {
      badge: 'FREQUENTLY ASKED QUESTIONS',
      title: 'FREQUENTLY ASKED QUESTIONS',
      subtitle: 'Clear answers regarding project scope, design process, remote availability, and design system handoffs.',
    },
    faq: {
      badge: 'FREQUENTLY ASKED QUESTIONS',
      title: 'FREQUENTLY ASKED QUESTIONS',
      subtitle: 'Clear answers regarding project scope, design process, remote availability, and design system handoffs.',
    },
    preFooter: {
      badge: 'AVAILABLE FOR NEW ROLES & PROJECTS WORLDWIDE',
      availabilityBadge: 'AVAILABLE FOR NEW ROLES & PROJECTS WORLDWIDE',
      titleStart: 'LET’S BUILD SOMETHING ',
      titleHighlight: 'EXTRAORDINARY',
      titleEnd: ' TOGETHER.',
      headlineStart: 'LET’S BUILD SOMETHING ',
      headlineHighlight: 'EXTRAORDINARY',
      headlineEnd: ' TOGETHER.',
      startConversation: 'SCHEDULE DISCOVERY MEETING',
      copyEmail: 'COPY EMAIL ADDRESS',
      emailCopied: 'EMAIL COPIED!',
      localTime: 'LOCAL TIME:',
    },
    footer: {
      role: 'UX/UI Designer | AI-Driven UX & Product Strategy',
      roleTagline: 'UX/UI Designer | AI-Driven UX & Product Strategy',
      contact: 'CONTACT',
      copied: 'COPIED!',
      copyEmailAddress: 'Copy Email Address',
      copyEmailTitle: 'Copy Email Address',
      emailCopiedScreenReader: 'Email copied to clipboard',
      backToTop: 'Back to Top',
      backToTopTitle: 'Back to Top',
      top: 'TOP',
    },
    marquee: {
      certification: 'CERTIFICATION',
      inProgress: 'IN PROGRESS',
    },
  },
  pt: {
    actions: {
      viewProject: 'Ver Projeto',
      viewCaseStudy: 'Ver Estudo de Caso',
      downloadCv: 'Descarregar CV (PDF)',
      copyEmail: 'Copiar Endereço de Email',
      scheduleMeeting: 'Agendar Reunião de Alinhamento',
      startConversation: 'Iniciar Conversa',
      viewGallery: 'Explorar Galeria',
      viewCourse: 'Ver Programa do Curso',
      backToTop: 'Voltar ao Topo',
    },
    feedback: {
      emailCopiedSuccess: 'Endereço de email copiado com sucesso. Pode colá-lo no seu programa de email.',
      messageSentSuccess: 'Mensagem enviada com sucesso. Analisarei o pedido e responderei em menos de 24 horas úteis.',
      formError: 'Não foi possível enviar o formulário devido a campos inválidos. Verifique os campos assinalados e tente novamente.',
      linkCopiedSuccess: 'Link do projeto copiado com sucesso. Pode partilhá-lo diretamente.',
      genericError: 'Ocorreu um erro inesperado. Atualize a página ou tente novamente dentro de momentos.',
    },
    filters: {
      all: 'Todos os Projetos',
      uxUi: 'Design UX/UI',
      croMarketing: 'CRO & Marketing',
      designSystems: 'Design Systems',
    },
    emptyStates: {
      noResultsTitle: 'Nenhum projeto encontrado',
      noResultsDescription: 'Não encontramos projetos correspondentes à sua pesquisa ou filtros ativos. Limpe os filtros ou tente outro termo.',
      clearFiltersAction: 'Limpar Todos os Filtros',
      tryDifferentSearch: 'Tentar outro termo de pesquisa',
    },
    nav: {
      switchLanguage: 'Alternar idioma para Inglês',
      toggleTheme: 'Alternar tema de cor',
      forAgents: 'para agentes',
      forAgentsTitle: 'Documentação para Agentes de IA e Prompt de Sistema',
    },
    intro: {
      words: ['VISÃO', 'ESTRATÉGIA', 'ABORDAGEM'],
      skip: 'Saltar intro',
    },
    introLoader: {
      words: ['VISÃO', 'ESTRATÉGIA', 'ABORDAGEM'],
      clickToSkip: 'Saltar intro',
    },
    rail: {
      sections: {
        about: 'Sobre',
        experience: 'Experiência',
        education: 'Formação',
        projects: 'Projetos',
        languagesInterests: 'Idiomas & Interesses',
        faqs: 'Perguntas Frequentes',
        contact: 'Contacto',
      },
      scrollTo: 'Navegar para a secção',
    },
    header: {
      greeting: 'olá, sou o',
      copied: 'COPIADO',
      emailCopied: 'Email copiado para a área de transferência',
      sendEmail: 'Enviar Email',
      copyEmail: 'Copiar Endereço de Email',
      viewBehance: 'Ver Portfólio no Behance',
      viewLinkedin: 'Ver Perfil no LinkedIn',
      viewInstagram: 'Ver Perfil no Instagram',
    },
    about: {
      badge: 'RESUMO EXECUTIVO & PERFIL',
      titlePrefix: 'DESIGN DE',
      rotatingWords: ['ABORDAGEM', 'ESTRATÉGIA', 'VISÃO'],
      skillsBadge: 'RECURSOS TÉCNICOS & ESTRATÉGICOS',
      clickToDiscover: 'Clique para descobrir',
    },
    experience: {
      badge: 'PERCURSO PROFISSIONAL & EXPERIÊNCIA',
      titlePrefix: 'EXPERIÊNCIA',
      rotatingWords: ['PROFISSIONAL', 'JORNADA', 'PERCURSO', 'PROGRESSÃO'],
      tagline: 'Como 10 anos de qualidade operacional e auditoria moldam a minha abordagem sistémica ao UX/UI.',
      more: 'MAIS',
      less: 'MENOS',
      expandDetails: 'Expandir detalhes da experiência',
      collapseDetails: 'Recolher detalhes da experiência',
    },
    education: {
      badge: 'ESPECIALIZAÇÕES & FORMAÇÃO',
      rotatingPhrases: ['FORMAÇÃO & DIPLOMAS', 'EVOLUÇÃO & CRESCIMENTO', 'HORIZONTE & DOMÍNIO'],
      certificationsStat: '6 CERTIFICAÇÕES',
      certificationsCount: '6 CERTIFICAÇÕES',
      specializationsStat: '3 ESPECIALIZAÇÕES',
      specializationsCount: '3 ESPECIALIZAÇÕES',
      continuousLearningStat: 'APRENDIZAGEM CONTÍNUA',
      continuousLearning: 'APRENDIZAGEM CONTÍNUA',
      seeMoreCertificates: 'VER MAIS CERTIFICAÇÕES',
      seeMore: 'VER MAIS CERTIFICAÇÕES',
      seeLess: 'VER MENOS',
      onGoingBadge: 'EM CURSO',
      onGoingTitle: 'Formação Ativa & Cursos em Curso',
      viewCourse: 'Ver Programa do Curso',
      gradeLabel: 'NOTA:',
      grade: 'NOTA:',
    },
    projects: {
      badge: 'CASOS DE ESTUDO & PROJETOS EM DESTAQUE',
      title: 'ARQUIVO DE PORTFÓLIO',
      items: 'ITENS',
      gallery: 'GALERIA',
      galleryBadge: 'GALERIA',
      photo: 'FOTO',
      photos: 'FOTOS',
      clickToExplore: 'CLIQUE PARA EXPLORAR A GALERIA E RESUMO',
      viewFullStudy: 'VER ESTUDO DE CASO',
      viewGallery: 'EXPLORAR GALERIA',
      quickOverview: 'VISÃO GERAL',
      wipBadge: 'WIP · System Architecture',
      wipTitle: 'New Design System',
      wipDescription: 'Biblioteca de componentes acessíveis e design tokens em desenvolvimento para Figma.',
      wipStatus: 'Status: Figma',
      wipVersion: 'v0.1',
    },
    projectModal: {
      closeModal: 'Fechar janela modal',
      featuredCover: 'CAPA EM DESTAQUE',
      caseStudyOverview: 'RESUMO DO CASO DE ESTUDO',
      projectSummary: 'RESUMO DO PROJETO',
      summary: 'RESUMO DO PROJETO',
      keyDeliverables: 'ENTREGÁVEIS & IMPACTO',
      copyLink: 'COPIAR LINK DO ESTUDO',
      copied: 'COPIADO',
      viewFullStudy: 'VER ESTUDO DE CASO',
    },
    projectGallery: {
      caseStudyGallery: 'GALERIA DO CASO DE ESTUDO',
      expand: 'EXPANDIR',
      openFullscreen: 'Abrir imagem em ecrã inteiro',
      prevImage: 'Imagem anterior',
      nextImage: 'Próxima imagem',
      closeLightbox: 'Fechar visualização',
    },
    languagesInterests: {
      badge: 'IDIOMAS & INTERESSES',
      titlePrefix: '',
      rotatingWords: ['PERFIL', 'INTERESSES', 'IDIOMAS'],
      languagesFluency: 'IDIOMAS & FLUÊNCIA',
      languagesTitle: 'IDIOMAS & FLUÊNCIA',
      personalInterests: 'INTERESSES PESSOAIS',
      interestsTitle: 'INTERESSES PESSOAIS',
    },
    faqs: {
      badge: 'PERGUNTAS FREQUENTES',
      title: 'PERGUNTAS FREQUENTES',
      subtitle: 'Respostas claras sobre o âmbito de trabalho, processo de design, disponibilidade remota e metodologias de entrega.',
    },
    faq: {
      badge: 'PERGUNTAS FREQUENTES',
      title: 'PERGUNTAS FREQUENTES',
      subtitle: 'Respostas claras sobre o âmbito de trabalho, processo de design, disponibilidade remota e metodologias de entrega.',
    },
    preFooter: {
      badge: 'DISPONÍVEL PARA NOVAS OPORTUNIDADES & PROJETOS',
      availabilityBadge: 'DISPONÍVEL PARA NOVAS OPORTUNIDADES & PROJETOS',
      titleStart: 'VAMOS CONSTRUIR ALGO ',
      titleHighlight: 'EXTRAORDINÁRIO',
      titleEnd: ' JUNTOS.',
      headlineStart: 'VAMOS CONSTRUIR ALGO ',
      headlineHighlight: 'EXTRAORDINÁRIO',
      headlineEnd: ' JUNTOS.',
      startConversation: 'AGENDAR REUNIÃO DE ALINHAMENTO',
      copyEmail: 'COPIAR ENDEREÇO DE EMAIL',
      emailCopied: 'EMAIL COPIADO!',
      localTime: 'HORA LOCAL:',
    },
    footer: {
      role: 'UX/UI Designer | AI-Driven UX & Product Strategy',
      roleTagline: 'UX/UI Designer | AI-Driven UX & Product Strategy',
      contact: 'CONTACTAR',
      copied: 'COPIADO!',
      copyEmailAddress: 'Copiar Endereço de Email',
      copyEmailTitle: 'Copiar Endereço de Email',
      emailCopiedScreenReader: 'Endereço de email copiado com sucesso',
      backToTop: 'Voltar ao Topo',
      backToTopTitle: 'Voltar ao Topo',
      top: 'TOPO',
    },
    marquee: {
      certification: 'CERTIFICAÇÃO',
      inProgress: 'EM CURSO',
    },
  },
};

