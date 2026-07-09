/* =========================================================
   ANAS ABUQUTA — PORTFOLIO CONTENT
   Edit this file directly, OR use dashboard.html for a
   point-and-click editor that exports an updated copy of it.
   ========================================================= */
window.SITE_DATA = {

  meta: {
    pageTitle: "Anas AbuQuta — Data Science & AI · Software Developer · Field Coordinator",
    pageDescription: "Portfolio of Anas AbuQuta — Data Science & AI student, software developer, and humanitarian field coordinator building software and managing information with real-world impact.",
    brandName: "Anas AbuQuta",
    brandInitials: "AA"
  },

  loader: {
    coordinate: "31.98°N, 35.30°E"
  },

  dispatchLog: [
    { tag: "[field]", text: "beneficiary registered — Kobo Toolbox sync ok" },
    { tag: "[code]",  text: 'git commit -m "fix: dashboard pagination"' },
    { tag: "[field]", text: "weekly coordination report exported (.xlsx)" },
    { tag: "[code]",  text: "php artisan migrate — 0 errors" },
    { tag: "[field]", text: "case follow-up logged in Zite Manager" },
    { tag: "[code]",  text: "npm run build — done in 4.2s" }
  ],

  hero: {
    eyebrow: "Field-tested engineering, from Nablus to production",
    titleLine1: "Building software",
    titleEm: "and",
    titleLine2: "coordinating people",
    titleLine3: "who need it most.",
    roles: [
      "Data Science & AI Student",
      "Software Developer",
      "Information Management Specialist",
      "Humanitarian Field Coordinator"
    ],
    summary: "Data Science & AI student combining software engineering with humanitarian field experience — data collection, information management, and digital transformation for organizations that operate where the need is real.",
    primaryCtaText: "View projects",
    secondaryCtaText: "Get in touch"
  },

  about: {
    eyebrow: "01 — About",
    title: "Two fields.<br>One way of paying attention.",
    paragraphs: [
      "I'm <strong>Anas Mohammed Hamdan AbuQuta</strong>, a Data Science and Artificial Intelligence student at the University College of Applied Sciences, graduating with a 91.28 GPA. Alongside my studies I build production software — ERP systems, APIs, dashboards — and coordinate humanitarian field operations for organizations working across Palestine.",
      "The two disciplines feed each other. Field work teaches me to design for people who don't have time for a confusing form. Software teaches me to turn a stack of paper registrations into a system a whole team can rely on. I enjoy the seam between them: building tools, cleaning data, and managing information so it actually gets used."
    ],
    facts: [
      { label: "Based in", value: "Palestine" },
      { label: "Studying", value: "Data Science & AI, UCAS" },
      { label: "Currently", value: "Field Coordinator, PHC" },
      { label: "Stack", value: "Laravel · Vue · Python" }
    ]
  },

  experience: {
    eyebrow: "02 — Experience",
    title: "Field log",
    lede: "A record of where I've worked, on the ground and in the codebase.",
    items: [
      {
        marker: "now",
        role: "Field Coordinator",
        dateRange: "Jan 2026 — Present",
        org: "Palestinian Housing Council (PHC)",
        bullets: [
          "Coordinate humanitarian field activities and beneficiary registration via Kobo Toolbox",
          "Follow up cases through Zite Manager and maintain community communication",
          "Organize field documentation, monitor activities, and prepare reports",
          "Build Excel and Google Sheets reporting for weekly coordination meetings"
        ],
        tags: ["Kobo Toolbox", "Zite Manager", "Field Ops", "Reporting"]
      },
      {
        marker: "02",
        role: "Data Programming & Field Volunteer",
        dateRange: "Jun 2024 — Jul 2025",
        org: "SOS Palestine",
        bullets: [
          "Ran data collection and entry through digital forms across field sites",
          "Supported community outreach and beneficiary documentation",
          "Organized information and supported reporting workflows"
        ],
        tags: ["Data Collection", "Digital Forms", "Community Support"]
      },
      {
        marker: "01",
        role: "Information Management & Data Entry Assistant",
        dateRange: "Mar 2024 — May 2024",
        org: "Ma'an Development Center — WFP Project",
        bullets: [
          "Managed information systems and beneficiary records for a WFP-funded project",
          "Handled Excel reporting, data cleaning, and quality assurance",
          "Maintained documentation standards across the reporting cycle"
        ],
        tags: ["WFP", "Data Cleaning", "QA"]
      }
    ]
  },

  education: {
    degree: "Bachelor of Data Science & Artificial Intelligence",
    institution: "University College of Applied Sciences (UCAS)",
    gpa: "91.28"
  },

  skills: {
    eyebrow: "03 — Skills",
    title: "What I build with",
    lede: "Split the way my work is split — application code on one side, information & data on the other.",
    groups: [
      {
        title: "Programming & Frontend",
        icon: "fa-solid fa-code",
        items: [
          { label: "PHP / Laravel", level: 90 },
          { label: "Vue.js", level: 85 },
          { label: "Python", level: 80 },
          { label: "JavaScript", level: 82 },
          { label: "HTML5 / CSS3 / Tailwind", level: 88 },
          { label: "MySQL / REST APIs", level: 78 }
        ]
      },
      {
        title: "Data & Information Management",
        icon: "fa-solid fa-table-cells",
        items: [
          { label: "Excel / Google Sheets", level: 92 },
          { label: "Kobo Toolbox", level: 85 },
          { label: "Data Cleaning & QA", level: 83 },
          { label: "Dashboards & Reporting", level: 80 },
          { label: "Git / GitHub / VS Code", level: 75 }
        ]
      }
    ],
    softSkills: ["Leadership", "Communication", "Problem Solving", "Teamwork", "Critical Thinking", "Adaptability", "Coordination"]
  },

  projectsSection: {
    eyebrow: "04 — Projects",
    title: "Selected work",
    lede: "Systems and tools built end to end — filter by area."
  },

  projects: [
    {
      id: "erp",
      category: "fullstack",
      icon: "fa-solid fa-boxes-stacked",
      title: "Al-Yaseen ERP System",
      short: "A large ERP platform for inventory, manufacturing, and accounting.",
      tags: ["Laravel API", "Vue.js", "MySQL"],
      description: "A large-scale ERP platform built with a Laravel API backend and a Vue.js frontend, covering the core operations a growing business needs in one system.",
      features: [
        "Inventory, customers, and manufacturing modules",
        "Chart of accounts with import & export tools",
        "Dashboards and reporting with pagination and search",
        "Multi-language interface, PDF & Excel export",
        "Role-based permissions and authentication",
        "Fully responsive UI"
      ]
    },
    {
      id: "accounting",
      category: "fullstack",
      icon: "fa-solid fa-file-invoice-dollar",
      title: "Accounting System",
      short: "Invoicing and customer management with role-based access.",
      tags: ["Laravel", "Vue", "MySQL"],
      description: "A bilingual accounting system for invoicing and customer management, built with Laravel, Vue, and MySQL, designed for teams that need clear role separation.",
      features: [
        "Invoice creation and customer records",
        "Authentication and permission-based roles",
        "Reporting dashboard",
        "Arabic & English language support",
        "Fully responsive design"
      ]
    },
    {
      id: "livematch",
      category: "fullstack",
      icon: "fa-solid fa-futbol",
      title: "Live Match API",
      short: "REST API and Vue frontend for live football match data.",
      tags: ["Laravel Sanctum", "REST API", "Vue"],
      description: "A REST API secured with Laravel Sanctum, paired with a Vue frontend, serving live match data across leagues and teams.",
      features: [
        "Live match scores and league listings",
        "Team profiles with logos",
        "Match links and authenticated access",
        "Token-based authentication via Sanctum"
      ]
    },
    {
      id: "textanalyzer",
      category: "data",
      icon: "fa-solid fa-magnifying-glass-chart",
      title: "Smart Text Analyzer",
      short: "A Python tool for word, sentence, and character-level text analysis.",
      tags: ["Python"],
      description: "A Python-based text analysis tool that breaks down documents into statistics useful for writers, researchers, or anyone auditing large bodies of text.",
      features: [
        "Word and sentence-level statistics",
        "Character frequency analysis",
        "Unique word detection",
        "General-purpose text processing pipeline"
      ]
    },
    {
      id: "socket",
      category: "data",
      icon: "fa-solid fa-network-wired",
      title: "Network Socket Programming",
      short: "A Python client-server system exploring core networking concepts.",
      tags: ["Python", "Sockets", "Threading"],
      description: "A hands-on exploration of networking fundamentals: building a client-server system in Python using raw TCP sockets and threading.",
      features: [
        "TCP/socket-based communication",
        "Client-server architecture",
        "Multi-threaded connection handling",
        "Core networking concepts applied practically"
      ]
    }
  ],

  services: {
    eyebrow: "05 — Services",
    title: "How I can help",
    items: [
      { icon: "fa-solid fa-laptop-code", title: "Software Development", text: "Laravel & REST API development, database design, and full responsive web applications." },
      { icon: "fa-solid fa-chart-line", title: "Dashboards & Reporting", text: "Data cleaning, Excel solutions, and dashboards that turn raw records into decisions." },
      { icon: "fa-solid fa-database", title: "Information Management", text: "Data entry systems, structured record-keeping, and information workflows that scale." },
      { icon: "fa-solid fa-people-group", title: "Humanitarian Field Coordination", text: "Digital forms, Kobo Toolbox deployments, and field data collection for NGO programs." }
    ]
  },

  achievements: {
    eyebrow: "06 — By the numbers",
    title: "Achievements",
    note: "* Figures are placeholders — edit real numbers in the dashboard.",
    counters: [
      { label: "Projects completed", target: 12 },
      { label: "Years of learning", target: 3 },
      { label: "Technologies used", target: 10 },
      { label: "Organizations worked with", target: 3 },
      { label: "GitHub repositories", target: 8 }
    ]
  },

  certifications: {
    eyebrow: "07 — Certifications",
    title: "Credentials",
    items: [
      { title: "Certificate title placeholder", issuer: "Issuing organization · Month Year", link: "#" },
      { title: "Certificate title placeholder", issuer: "Issuing organization · Month Year", link: "#" },
      { title: "Certificate title placeholder", issuer: "Issuing organization · Month Year", link: "#" }
    ]
  },

  testimonials: {
    eyebrow: "08 — Testimonials",
    title: "What people say",
    items: [
      { quote: "Placeholder testimonial text goes here — swap in a real quote from a supervisor or teammate.", name: "Name placeholder", role: "Role, Organization" },
      { quote: "Placeholder testimonial text goes here — swap in a real quote from a supervisor or teammate.", name: "Name placeholder", role: "Role, Organization" }
    ]
  },

  github: {
    eyebrow: "09 — GitHub",
    title: "Activity",
    username: "AnasAbuQuta"
  },

  contact: {
    eyebrow: "10 — Contact",
    title: "Let's work together",
    lede: "Open to software development roles, data & information management positions, and humanitarian field opportunities.",
    email: "your.email@example.com",
    phone: "+970 00 000 0000",
    linkedin: "https://linkedin.com/in/your-profile",
    github: "https://github.com/AnasAbuQuta",
    location: "Palestine",
    cvUrl: ""
  },

  footer: {
    tagline: "Data Science & AI · Software Development · Humanitarian Field Coordination",
    copy: "Built with care, from the field."
  }

};
