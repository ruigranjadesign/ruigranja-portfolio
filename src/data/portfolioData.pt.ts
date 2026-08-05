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

export const profileDataPt: Profile = {
  name: "Rui Granja",
  title: "UX/UI Designer | AI-Driven UX & Product Strategy",
  location: "Braga, Portugal",
  locationUrl: "https://www.google.com/maps/place/Braga",
  availability: "Disponível para novas oportunidades",
  avatarUrl: "/avatar.webp",
  about: "Designer UX/UI especializado na criação de produtos digitais focados no utilizador, sistemas de design robustos e integração de interfaces para Inteligência Artificial. Apoiado por uma sólida formação prática em design de interação, prototipagem avançada em Figma e padrões de usabilidade para LLMs, combinando rigor analítico com o desenvolvimento de experiências escaláveis, transparentes e intuitivas.",
  email: getObfuscatedEmail(),
  behance: "https://www.behance.net/ruigranja1",
  linkedin: "https://www.linkedin.com/in/ruigranja8",
  instagram: "https://www.instagram.com/rui.granja/",
};

export const skillsDataPt: SkillCategory[] = [
  {
    category: "Competências Principais",
    skills: [
      "Design UX/UI",
      "Estratégia de Produto",
      "Otimização da Taxa de Conversão (CRO)",
      "Sistemas de Design (Design Systems)",
      "Pesquisa de Utilizador & Testes de Usabilidade",
      "Design Web & Mobile Responsivo",
      "Padrões de Interface para IA",
      "Copywriting"
    ]
  },
  {
    category: "Perfil Comportamental",
    skills: [
      "Pensamento Analítico",
      "Curiosidade Criativa",
      "Proatividade",
      "Atenção ao Detalhe",
      "Colaboração",
      "Comunicação"
    ]
  },
  {
    category: "Ferramentas",
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
      "Engenharia de Prompts"
    ]
  }
];

export const experienceDataPt: WorkExperience[] = [
  {
    id: "exp-0",
    company: "Freelance",
    location: "Remoto & Global",
    employmentType: "Freelance",
    period: "2025 - Presente",
    role: "UX/UI Designer | AI-Driven UX & Product Strategy",
    description: "Design de produtos digitais de elevado desempenho, plataformas de alta conversão e sistemas de design escaláveis.",
    highlights: [
      "Criação de plataformas digitais de alto impacto, incluindo DOMA, Brasa Pura e RAWPOWER.AI.",
      "Otimização de taxas de conversão (CRO) focada no aumento do envolvimento do utilizador e vendas.",
      "Criação de Design Systems e bibliotecas de componentes UI reutilizáveis no Figma."
    ]
  },
  {
    id: "exp-1",
    company: "Mundotêxtil",
    location: "Vizela, Portugal",
    employmentType: "Tempo inteiro",
    period: "2016 - 2024",
    role: "Design de Etiquetas | Impressão & Armazém",
    description: "Aplicação de disciplina operacional rigorosa e padronização de processos em fluxos de trabalho industriais.",
    highlights: [
      "Implementação de padrões de controlo de qualidade e tolerância zero a falhas na linha de produção.",
      "Rigor sistémico e atenção extrema ao detalhe aplicados à criação de Design Tokens, acessibilidade e componentes UI."
    ]
  },
  {
    id: "exp-2",
    company: "Sonae Sierra",
    location: "Guimarães, Portugal",
    employmentType: "Tempo inteiro",
    period: "2013 - 2015",
    role: "Auditoria Operacional",
    description: "Avaliação de fluxos de trabalho operacionais e conformidade em locais de retalho.",
    highlights: [
      "Auditoria e análise de fluxos de processos complexos, reduzindo inconsistências operacionais.",
      "Mapeamento de jornadas de trabalho aplicadas diretamente à Arquitetura de Informação e UX Research."
    ]
  }
];

export const educationDataPt: Education[] = [
  {
    id: "edu-1",
    institution: "Lisbon School of Design",
    location: "Porto",
    degree: "UX/UI Design",
    year: "2025",
    grade: "18/20",
    issuerBadge: "CERTIFICADO LSD",
    description: "Foco prático em design visual e de interação, UI de alta fidelidade e prototipagem.",
    skills: ["Figma", "Sistemas de Design", "Prototipagem de Alta Fidelidade", "Hierarquia Visual", "Fluxos de Utilizador"],
    verificationLinks: [
      { label: "Ver Testemunho ↗", url: "https://lsd.pt/testemunhos/rui-granja" }
    ]
  },
  {
    id: "edu-6",
    institution: "Smashing Media AG (por Vitaly Friedman)",
    degree: "Design Patterns for AI Interfaces",
    year: "2026",
    issuerBadge: "VERIFICADO POR SMASHING MEDIA",
    description: "Estratégia de UX e padrões de interface para Inteligência Artificial (LLMs). Foco em scaffolding, interação Humano-IA, gestão de contexto e mecanismos de controlo para promover a confiança e transparência do utilizador.",
    skills: ["Padrões de UI para IA", "Design de Interação para LLMs", "Scaffolding & Confiança", "Gestão de Contexto"],
    verificationLinks: [
      { label: "Ver Curso ↗", url: "https://ai-design-patterns.com/" }
    ]
  },
  {
    id: "edu-4",
    institution: "Saïd Business School, University of Oxford",
    degree: "Generative and Agentic AI",
    year: "2026",
    issuerBadge: "CERTIFICADO OXFORD",
    description: "Exploração avançada em inteligência generativa, estruturas de agentes e aplicações estratégicas de negócio de LLMs.",
    skills: ["IA Generativa", "Fluxos de Trabalho com Agentes", "Aplicações de LLM", "Estratégia de IA"],
    verificationLinks: [
      { label: "Verificar Certificado ↗", url: "https://www.coursera.org/account/accomplishments/verify/T8ZXDZAAPY5U" }
    ]
  },
  {
    id: "edu-2",
    institution: "Google",
    degree: "Google UX Design Specialization",
    year: "2025",
    issuerBadge: "CERTIFICADO GOOGLE",
    description: "Processo de UX do início ao fim, incluindo a criação de artefactos de pesquisa essenciais e estudos de usabilidade.",
    skills: ["Pesquisa de Utilizador", "Wireframing", "Testes de Usabilidade", "Personas", "Protótipos Interativos"],
    verificationLinks: [
      { label: "Verificar Certificado ↗", url: "https://www.coursera.org/account/accomplishments/professional-cert/SJDATZ0KN0ZN" }
    ]
  },
  {
    id: "edu-3",
    institution: "Google",
    degree: "Google AI & Prompting Specializations",
    year: "2025",
    issuerBadge: "CERTIFICADO GOOGLE",
    description: "Aplicação de engenharia de prompts avançada, como encadeamento de prompts (prompt chaining), e princípios fundamentais de IA responsável para otimizar fluxos de pesquisa, análise de dados e criação de conteúdos.",
    skills: ["Engenharia de Prompts", "Encadeamento de Prompts", "Fluxos de Pesquisa com IA", "IA Responsável"],
    verificationLinks: [
      { label: "Especialização 1 ↗", url: "https://www.coursera.org/account/accomplishments/professional-cert/OAS300J9SIZQ" },
      { label: "Especialização 2 ↗", url: "https://www.coursera.org/account/accomplishments/specialization/6GKFIHSZKNGS" },
      { label: "Especialização 3 ↗", url: "https://www.coursera.org/account/accomplishments/specialization/5F0KGJUWAF5T" }
    ]
  },
  {
    id: "edu-5",
    institution: "Google",
    degree: "Google Digital Marketing & E-commerce Specialization",
    year: "2026",
    issuerBadge: "CERTIFICADO GOOGLE",
    description: "Otimização da taxa de conversão (CRO), marketing digital multicanal, gestão de lojas online, estratégias avançadas de SEO/SEM, automação de email e analítica.",
    skills: ["SEO & SEM", "Marketing Digital", "Otimização da Taxa de Conversão (CRO)", "Estratégia de E-commerce", "Automação de Email"],
    verificationLinks: [
      { label: "Verificar Certificado ↗", url: "https://www.coursera.org/account/accomplishments/specialization/XWFCK3BR7EA7" }
    ]
  }
];

export const ongoingCoursesDataPt: OngoingCourse[] = [
  {
    id: "course-1",
    title: "Curso de Sistemas de Design no Figma",
    provider: "Shipwright (por Headway)",
    url: "https://www.shipwright.design/",
    tags: ["Sistemas de Design", "Tokens no Figma", "Arquitetura"],
    logoUrl: shipwrightImg
  },
  {
    id: "course-2",
    title: "Estratégia de Produto para Designers",
    provider: "Femke van Schoonhoven (Maven)",
    url: "https://maven.com/femke/product-strategy-for-designers",
    tags: ["Estratégia de Produto", "Impacto no Negócio", "Roadmaps"],
    logoUrl: mavenImg
  }
];

export const projectsDataPt: Project[] = [
  {
    id: "proj-1",
    title: "Aplicação de Fitness e Nutrição",
    category: "Design de Aplicação Mobile",
    description: "Caso de estudo de design UX/UI para uma aplicação móvel de fitness e nutrição.",
    fullDescription: "Um caso de estudo abrangente de design UX/UI de ponta a ponta para um rastreador móvel de fitness e nutrição. Apresenta registo intuitivo de refeições, fluxos de treino orientados a objetivos, analítica personalizada de sequências e componentes de UI limpos em modo escuro/claro.",
    link: "https://www.behance.net/gallery/231961657/Fitness-and-nutrition-app-UXUI-design-case-study-EN",
    tags: ["Design UX/UI", "Figma", "Caso de Estudo", "Saúde & Fitness", "UI Mobile"],
    featured: true,
    linkLabel: "VER ESTUDO COMPLETO",
    imagePlaceholderGradient: "from-blue-600/20 via-indigo-600/20 to-purple-600/20",
    keyOutcomes: [
      "Otimizou o registo de refeições de vários passos num fluxo de interação de 2 toques",
      "Desenhou painéis de progresso visual com acessibilidade de alto contraste",
      "Criou tokens de componentes de design reutilizáveis no Figma"
    ],
    metrics: [
      { label: "Custo de Interação", value: "Fluxo em 2 Toques" },
      { label: "Acessibilidade", value: "Contraste AAA" },
      { label: "Tokens de Design", value: "100% em Figma" }
    ],
    gallery: [
      {
        src: rawpowerCover,
        mobileWebpSrc: rawpowerCoverMobile,
        alt: "RAWPOWER.AI: Visão geral da aplicação móvel de fitness e nutrição com IA"
      },
      {
        src: rawpowerStoryOverview,
        mobileWebpSrc: rawpowerStoryOverviewMobile,
        alt: "Contexto do projeto e processo de design centrado no utilizador para a plataforma RAWPOWER.AI"
      },
      {
        src: rawpowerProblemSolution,
        alt: "Visão geral comparativa entre pontos de dor das aplicações tradicionais e a solução adaptativa da RAWPOWER.AI"
      },
      {
        src: rawpowerUiScreens,
        alt: "Interface de utilizador final com os ecrãs principais do fluxo da aplicação"
      }
    ]
  },
  {
    id: "proj-2",
    title: "DOMA",
    category: "Design de Plataforma Web",
    subtitle: "Plataforma Imobiliária de Luxo | Viver no Luxo. Simplificado.",
    role: "Designer UX/UI (De Ponta a Ponta, Sprint de Conceito de 2 Semanas)",
    description: "Caso de estudo UX/UI de ponta a ponta para uma plataforma imobiliária de luxo em Portugal.",
    fullDescription: "Um caso de estudo completo de design UX/UI para uma plataforma imobiliária de luxo em Portugal. Destaca-se pela arquitetura focada na pesquisa, fluxos de utilizador com concierge digital, coleções organizadas por estilo de vida e uma experiência elegante pensada para construir confiança com compradores internacionais.",
    link: "https://www.behance.net/gallery/234984137/DOMA-Luxury-Real-Estate-Platform-(UXUI-Case-Study)",
    tags: ["Design UX/UI", "Figma", "Caso de Estudo", "Imobiliário de Luxo", "Plataforma Web"],
    featured: true,
    linkLabel: "VER ESTUDO COMPLETO",
    imagePlaceholderGradient: "from-amber-600/20 via-orange-600/20 to-zinc-600/20",
    keyOutcomes: [
      "Desenhou uma arquitetura focada na pesquisa e coleções baseadas no estilo de vida (Vilas à Beira-Mar, Vinhas, Penthouses)",
      "Implementou microcopy orientada à conversão (\"Agendar Visita Privada\", \"Desbloquear Acesso VIP\") e fluxos de agendamento transparentes",
      "Criou um sistema de design minimalista com uso estratégico do espaço negativo, tipografia marcante e detalhes dourados subtis"
    ],
    metrics: [
      { label: "Sprint de Conceito", value: "Entrega em 2 Semanas" },
      { label: "Arquitetura", value: "UX de Pesquisa" },
      { label: "Sistema de Design", value: "Minimalista de Luxo" }
    ],
    gallery: [
      {
        src: domaCoverPng,
        alt: "DOMA: Capa do caso de estudo, plataforma digital imobiliária de luxo em Portugal"
      }
    ]
  },
  {
    id: "proj-3",
    title: "Brasa Pura",
    category: "Web Design / Landing Page",
    subtitle: "Landing Page para Restaurante de Carnes Tradicional | Sinta a Tradição",
    role: "Designer UX/UI (De Ponta a Ponta)",
    description: "Uma landing page de alta conversão desenhada para um restaurante de carnes tradicional português.",
    fullDescription: "Uma landing page de alta conversão criada para um restaurante de carnes tradicional português, utilizando uma arquitetura acima da dobra num único ecrã para eliminar a fricção de scroll e incentivar reservas imediatas.",
    link: "https://www.behance.net/gallery/235073815/Brasa-Pura-Portuguese-Luxury-Steakhouse-Hero-Page",
    tags: ["Design UX/UI", "Figma", "Landing Page", "Restaurante", "UX de Conversão"],
    featured: true,
    linkLabel: "VER ESTUDO COMPLETO",
    imagePlaceholderGradient: "from-red-600/20 via-amber-700/20 to-zinc-900/20",
    keyOutcomes: [
      "Projetou uma arquitetura de layout acima da dobra, reduzindo o esforço de interação e acelerando a tomada de decisão",
      "Elaborou microcopy focada na conversão e CTAs de elevado contraste para aumentar reservas de mesas online e exploração do menu",
      "Desenhou um sistema visual envolvente em modo escuro, com tons quentes de carvão e acentos de fogo que refletem a experiência de um restaurante tradicional"
    ],
    metrics: [
      { label: "Arquitetura Layout", value: "Acima da Dobra" },
      { label: "Taxa de Conversão", value: "Zero Fricção" },
      { label: "Identidade Visual", value: "Tons Quentes" }
    ],
    gallery: [
      {
        src: brasapuraCover,
        alt: "Brasa Pura: Capa da landing page a mostrar a secção hero acima da dobra para o restaurante"
      }
    ]
  }
];

export const languagesAndInterestsDataPt: LanguagesAndInterests = {
  languages: [
    { language: "Português", fluency: "Nativo" },
    { language: "Inglês", fluency: "Avançado" }
  ],
  interests: [
    "Produção Musical",
    "Fotografia & Edição",
    "Leitura",
    "Fitness"
  ]
};

export const faqDataPt: FAQItem[] = [
  {
    id: "faq-1",
    question: "Quais são os seus principais serviços de design e âmbito de trabalho?",
    answer: "Especializo-me em Design UX/UI para Web e Aplicações Mobile, complementado por copywriting persuasivo e criação de conteúdos de alto impacto para redes sociais. A minha abordagem une o apuro estético, a otimização da taxa de conversão (CRO) e uma estratégia centrada no utilizador, entregando produtos digitais completos desde a interface até à microcopy."
  },
  {
    id: "faq-2",
    question: "Em que formatos de trabalho ou funções está disponível atualmente?",
    answer: "Estou totalmente disponível para funções a tempo inteiro, oportunidades remotas em qualquer parte do mundo (incluindo Estados Unidos, Europa e equipas globais), projetos de design em regime de freelancer e elegível para programas de estágios profissionais (como o IEFP Iniciar em Portugal)."
  },
  {
    id: "faq-3",
    question: "Qual é o seu tempo de entrega habitual e como funciona o seu processo de design?",
    answer: "Depende da dimensão do projeto, mas trabalho com metodologias ágeis e sprints curtos. Consigo entregar plataformas web/mobile completas, landing pages ou kits de marketing visual em 1 a 2 semanas, cobrindo desde a pesquisa inicial e wireframes até à copy persuasiva e protótipos de alta fidelidade prontos para produção no Figma."
  },
  {
    id: "faq-4",
    question: "Como aborda a passagem (handoff) do design para as equipas de desenvolvimento?",
    answer: "Os meus ficheiros no Figma estão organizados com Design Tokens, Auto-Layout e documentação detalhada de componentes. O objetivo é permitir que os programadores implementem cada layout sem ter de adivinhar margens, estados de hover ou comportamentos responsivos."
  },
  {
    id: "faq-5",
    question: "Tem flexibilidade para trabalhar com marcas internacionais ou equipas remotas nos EUA e no Mundo?",
    answer: "Com certeza. Estou totalmente preparado para colaborar com empresas internacionais e dos EUA em regime remoto. Ofereço horários flexíveis para sobrepor fusos horários americanos e europeus, utilizo ferramentas modernas de trabalho remoto (Figma, Miro, Notion, Slack, Discord) e mantenho uma comunicação transparente e orientada a resultados."
  }
];
