import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

function generateCV() {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 36, // 0.5 inch margins
  });

  const outputPath = path.join(process.cwd(), 'public', 'Rui_Granja_CV.pdf');
  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  const primaryColor = '#0F4C5C'; // Dark Teal
  const accentColor = '#2A9D8F';  // Vibrant Teal / Green accent
  const bannerBg = '#EBF5F4';     // Light teal/gray background banner
  const textColor = '#1D2A44';    // Dark slate text
  const mutedText = '#4A5568';    // Muted gray text

  // 1. Header Name & Title
  doc.fillColor(primaryColor)
     .font('Helvetica-Bold')
     .fontSize(24)
     .text('Rui Granja', 36, 36);

  doc.fillColor(accentColor)
     .font('Helvetica-Bold')
     .fontSize(12)
     .text('UX/UI Designer | AI-Driven UX & Product Strategy', 36, 64);

  // Contact Info Line
  doc.font('Helvetica')
     .fontSize(8.5)
     .fillColor(mutedText)
     .text('Location: ', 36, 80, { continued: true })
     .font('Helvetica-Bold').fillColor(textColor).text('Braga, Portugal', { continued: true })
     .font('Helvetica').fillColor(mutedText).text('  |  Email: ', { continued: true })
     .font('Helvetica-Bold').fillColor(textColor).text('ruigranja.studio@gmail.com', { continued: true })
     .font('Helvetica').fillColor(mutedText).text('  |  LinkedIn: ', { continued: true })
     .font('Helvetica-Bold').fillColor(textColor).text('linkedin.com/in/ruigranja8', { continued: true })
     .font('Helvetica').fillColor(mutedText).text('  |  Behance: ', { continued: true })
     .font('Helvetica-Bold').fillColor(textColor).text('behance.net/ruigranja1');

  // Divider Line
  doc.moveTo(36, 96)
     .lineTo(559, 96)
     .lineWidth(1)
     .strokeColor('#CBD5E0')
     .stroke();

  let currentY = 106;

  // Helper for Section Banners
  function addSectionHeader(title: string) {
    // Draw background box
    doc.rect(36, currentY, 523, 18)
       .fill(bannerBg);

    doc.fillColor(primaryColor)
       .font('Helvetica-Bold')
       .fontSize(9.5)
       .text(title.toUpperCase(), 42, currentY + 4);

    currentY += 24;
  }

  // 2. PROFESSIONAL SUMMARY
  addSectionHeader('PROFESSIONAL SUMMARY');
  doc.font('Helvetica')
     .fontSize(8.5)
     .fillColor(textColor)
     .text(
       'UI/UX Designer specialized in creating user-focused digital products, robust design systems, and integrating interfaces for Artificial Intelligence. Backed by solid practical training in interaction design, advanced prototyping in Figma, and usability patterns for LLMs, combining analytical rigor with the development of scalable, transparent, and intuitive experiences.',
       36,
       currentY,
       { width: 523, align: 'left', lineGap: 3 }
     );
  currentY += 42;

  // 3. FEATURED UX/UI PROJECTS & CASE STUDIES
  addSectionHeader('FEATURED UX/UI PROJECTS & CASE STUDIES');

  const projects = [
    { title: 'DOMA (Luxury Real Estate):', desc: 'End-to-end luxury platform UX/UI, search-first architecture, digital concierge flows.' },
    { title: 'Brasa Pura (Luxury Steakhouse):', desc: 'Conversion-focused landing page applying CRO principles & above-the-fold visual hierarchy.' },
    { title: 'RAWPOWER.AI (Fitness & Nutrition):', desc: 'Mobile UX research, user journey mapping & 2-tap interaction flow optimization.' },
  ];

  projects.forEach((proj) => {
    doc.font('Helvetica-Bold')
       .fontSize(8.5)
       .fillColor(textColor)
       .text('•  ', 42, currentY, { continued: true })
       .text(proj.title + ' ', { continued: true })
       .font('Helvetica')
       .text(proj.desc);
    currentY += 15;
  });
  currentY += 8;

  // 4. SKILLS & TOOLSTACK
  addSectionHeader('SKILLS & TOOLSTACK');

  const skillGroups = [
    { label: 'Core Expertise:', val: 'UI/UX Design, Product Strategy, Conversion Rate Optimization (CRO), Design Systems, User Research, Usability Testing, AI Interface Patterns, Copywriting' },
    { label: 'Toolstack & AI:', val: 'Figma, Midjourney, Balsamiq, CapCut, Higgsfield, Gemini, Claude, Prompt Engineering, Shopify, Google Ads & Analytics, Search Console, Notion' },
  ];

  skillGroups.forEach((sg) => {
    doc.font('Helvetica-Bold')
       .fontSize(8.5)
       .fillColor(textColor)
       .text(sg.label + ' ', 42, currentY, { continued: true })
       .font('Helvetica')
       .text(sg.val, { width: 517 });
    currentY += 16;
  });
  currentY += 8;

  // 5. WORK EXPERIENCE
  addSectionHeader('WORK EXPERIENCE');

  const experiences = [
    {
      company: 'Freelance',
      role: 'UX/UI Designer | AI-Driven UX & Product Strategy',
      period: '2025 – Present',
      bullets: [
        'Designing high-performing digital products, high-converting platforms, and scalable design systems.',
        'Creation of high-impact platforms including DOMA, Brasa Pura, and RAWPOWER.AI.'
      ]
    },
    {
      company: 'Mundotêxtil',
      role: 'Label Designing | Printing & Warehouse Specialist',
      period: '2016 – 2024',
      bullets: [
        'Applied strict operational discipline, quality control, and zero-tolerance defect policies across production lines.',
        'Systemic rigor applied to creating Design Tokens, accessibility compliance, and component libraries.'
      ]
    },
    {
      company: 'Sonae Sierra',
      role: 'Operational Auditor',
      period: '2013 – 2015',
      bullets: [
        'Audited retail store operations across commercial locations to verify compliance with quality standards.',
        'Mapped complex workflow journeys and operational touchpoints, applied directly to UX Research and IA.'
      ]
    }
  ];

  experiences.forEach((exp) => {
    // Role line
    doc.font('Helvetica-Bold')
       .fontSize(9)
       .fillColor(textColor)
       .text(exp.company, 42, currentY, { continued: true })
       .font('Helvetica')
       .text('  —  ' + exp.role, { continued: true });

    doc.font('Helvetica-Oblique')
       .fontSize(8.5)
       .fillColor(mutedText)
       .text(exp.period, 36, currentY, { align: 'right', width: 523 });

    currentY += 14;

    exp.bullets.forEach((bullet) => {
      doc.font('Helvetica')
         .fontSize(8.5)
         .fillColor(textColor)
         .text('•  ' + bullet, 48, currentY, { width: 510, lineGap: 2 });
      currentY += 14;
    });
    currentY += 4;
  });
  currentY += 6;

  // 6. EDUCATION & CERTIFICATIONS
  addSectionHeader('EDUCATION & CERTIFICATIONS');

  const education = [
    { name: 'UX/UI Design Course (18/20)', org: 'Lisbon School of Design, Porto', year: '2025' },
    { name: 'Design Patterns for AI Interfaces', org: 'Smashing Media AG (Vitaly Friedman)', year: '2026' },
    { name: 'Generative and Agentic AI', org: 'Saïd Business School, University of Oxford', year: '2026' },
    { name: 'Google UX Design Specialization', org: 'Google', year: '2025' },
    { name: 'Google AI & Prompting Specializations', org: 'Google', year: '2025' },
    { name: 'Google Digital Marketing & E-Commerce Cert.', org: 'Google', year: '2026' },
  ];

  education.forEach((edu) => {
    doc.font('Helvetica-Bold')
       .fontSize(8.5)
       .fillColor(textColor)
       .text('•  ' + edu.name, 42, currentY, { continued: true })
       .font('Helvetica')
       .text('  —  ' + edu.org);

    doc.font('Helvetica-Oblique')
       .fontSize(8.5)
       .fillColor(mutedText)
       .text(edu.year, 36, currentY, { align: 'right', width: 523 });

    currentY += 14;
  });
  currentY += 8;

  // 7. LANGUAGES
  addSectionHeader('LANGUAGES');
  doc.font('Helvetica-Bold')
     .fontSize(8.5)
     .fillColor(textColor)
     .text('Portuguese: ', 42, currentY, { continued: true })
     .font('Helvetica').text('Native  |  ', { continued: true })
     .font('Helvetica-Bold').text('English: ', { continued: true })
     .font('Helvetica').text('Advanced / Professional');

  doc.end();

  writeStream.on('finish', () => {
    console.log('PDF generated successfully at:', outputPath);
  });
}

generateCV();

