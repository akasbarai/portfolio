export const defaultContent = {
  settings: {
    siteTitle: "Mariam Wallas | Frontend Developer",
    metaDescription:
      "Interactive portfolio for Mariam Wallas, a frontend developer and product-minded UI engineer.",
    accentColor: "#e23d6f",
    secondaryColor: "#48d5c4",
    availability: "Available for freelance and full-time product work",
    location: "Toronto, Canada",
    logoUrl: "",
    resumeUrl: "#",
    cmsNote: "Every public section is editable from the CMS."
  },
  navigation: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" }
  ],
  hero: {
    name: "Mariam Wallas",
    eyebrow: "Frontend Developer and UI Engineer",
    title: "I build elegant digital products with sharp interaction design.",
    summary:
      "I turn complex ideas into fast, accessible interfaces with React, design systems, animation, and practical product thinking.",
    ctaLabel: "Explore Work",
    ctaHref: "#work",
    portraitUrl: "https://i.postimg.cc/3NgvPcZD/home-img.png",
    backgroundUrl: "https://i.postimg.cc/DZxD1xGL/home-bg.jpg"
  },
  socials: [
    { label: "GitHub", url: "https://github.com", icon: "Github" },
    { label: "LinkedIn", url: "https://linkedin.com", icon: "Linkedin" },
    { label: "Instagram", url: "https://www.instagram.com", icon: "Instagram" },
    { label: "X", url: "https://www.x.com", icon: "Twitter" }
  ],
  stats: [
    { label: "Years Experience", value: "10+" },
    { label: "Projects Shipped", value: "60+" },
    { label: "Client Satisfaction", value: "98%" }
  ],
  about: {
    heading: "Design-aware engineering for modern teams.",
    body:
      "I specialize in front-end architecture, high-polish UI, and the collaboration rituals that help products move from concept to launch. My work blends clean component systems, thoughtful animation, performance, and accessibility.",
    imageUrl: "https://i.postimg.cc/W1YZxTpJ/about-img.jpg",
    highlights: [
      "React, JavaScript, HTML, CSS, Node, and design systems",
      "Comfortable translating rough product ideas into shippable UI",
      "Strong eye for accessibility, responsive behavior, and maintainability"
    ]
  },
  timeline: {
    education: [
      {
        title: "BFA in Graphic Design",
        organization: "XYZ University",
        location: "Sometown, NJ",
        period: "2011 - 2013"
      },
      {
        title: "Diploma in Web Design",
        organization: "ABC University",
        location: "Sometown, NJ",
        period: "2013 - 2015"
      },
      {
        title: "BS in Web Development",
        organization: "KLM University",
        location: "Sometown, NJ",
        period: "2015 - 2017"
      }
    ],
    experience: [
      {
        title: "Lead UX Designer",
        organization: "Copalopa Inc.",
        location: "Sometown, NJ",
        period: "2018 - Present"
      },
      {
        title: "Website and UX Designer",
        organization: "Gabogle Inc.",
        location: "Sometown, NJ",
        period: "2015 - 2018"
      },
      {
        title: "Junior UX Designer",
        organization: "Copalopa Inc.",
        location: "Sometown, NJ",
        period: "2013 - 2015"
      }
    ]
  },
  skillGroups: [
    {
      title: "Frontend Development",
      subtitle: "Interactive product interfaces",
      icon: "Code2",
      skills: [
        { name: "HTML", level: 90 },
        { name: "CSS", level: 86 },
        { name: "JavaScript", level: 78 },
        { name: "React", level: 88 }
      ]
    },
    {
      title: "Product Design",
      subtitle: "Usable systems and flows",
      icon: "Palette",
      skills: [
        { name: "Figma", level: 90 },
        { name: "Design Systems", level: 82 },
        { name: "Prototyping", level: 76 }
      ]
    },
    {
      title: "Backend Basics",
      subtitle: "APIs and content workflows",
      icon: "Server",
      skills: [
        { name: "Node", level: 72 },
        { name: "Express", level: 70 },
        { name: "MongoDB", level: 68 },
        { name: "Firebase", level: 75 }
      ]
    }
  ],
  projects: [
    {
      title: "Finance Command Center",
      category: "Web",
      summary: "A data-rich dashboard for portfolio monitoring and business KPIs.",
      description:
        "Built a responsive analytics surface with dense financial cards, filtered tables, and motion that keeps the interface feeling fast.",
      technologies: ["React", "CSS Grid", "Node"],
      role: "Frontend Lead",
      createdAt: "2025-04-22",
      url: "#",
      repo: "#",
      imageUrl: "https://i.postimg.cc/43Th5VXJ/work-1.png",
      featured: true,
      metrics: ["42% faster reporting", "8 reusable widgets"]
    },
    {
      title: "Restaurant Mobile Ordering",
      category: "App",
      summary: "A polished mobile ordering flow for a restaurant brand.",
      description:
        "Designed and prototyped a complete ordering journey, including menus, cart states, customization, and checkout.",
      technologies: ["Figma", "React", "Framer Motion"],
      role: "UI/UX Designer",
      createdAt: "2025-04-15",
      url: "#",
      repo: "#",
      imageUrl: "https://i.postimg.cc/sXLjnC5p/work-2.png",
      featured: true,
      metrics: ["31 screens", "Mobile-first system"]
    },
    {
      title: "Travel Booking Experience",
      category: "Design",
      summary: "A travel product concept with strong visual storytelling.",
      description:
        "Created booking flows, destination discovery, and reusable mobile components for a premium travel experience.",
      technologies: ["Figma", "Design System"],
      role: "Product Designer",
      createdAt: "2025-04-10",
      url: "#",
      repo: "#",
      imageUrl: "https://i.postimg.cc/QNB1jXYZ/work-3.png",
      featured: false,
      metrics: ["Reusable mobile kit", "Booking prototype"]
    },
    {
      title: "Fitness Launch Page",
      category: "Web",
      summary: "An energetic conversion page for a fitness product.",
      description:
        "Built a sharp marketing interface with responsive cards, CTA sections, and high-contrast visual rhythm.",
      technologies: ["HTML", "CSS", "JavaScript"],
      role: "Frontend Developer",
      createdAt: "2025-04-04",
      url: "#",
      repo: "#",
      imageUrl: "https://i.postimg.cc/s2DGqyG8/work-4.png",
      featured: false,
      metrics: ["Responsive UI", "Fast landing flow"]
    }
  ],
  services: [
    {
      title: "Web Experience Design",
      icon: "LayoutDashboard",
      summary: "Landing pages, dashboards, and content-rich marketing sites.",
      deliverables: [
        "Responsive interface systems",
        "Accessible component design",
        "Performance-minded builds",
        "CMS-ready content structure"
      ]
    },
    {
      title: "UI/UX Product Design",
      icon: "Sparkles",
      summary: "Research-backed flows, prototypes, and product UI polish.",
      deliverables: [
        "User flow mapping",
        "Interactive prototypes",
        "Design systems",
        "Usability refinements"
      ]
    },
    {
      title: "MERN Implementation",
      icon: "Server",
      summary: "Full-stack React, Express, MongoDB, and admin workflows.",
      deliverables: [
        "REST API architecture",
        "CMS dashboards",
        "Auth and message management",
        "Deployment-ready project structure"
      ]
    }
  ],
  testimonials: [
    {
      name: "Chen Xiuying",
      role: "Marketing Director",
      quote:
        "Mariam translated our business goals into a beautiful, highly functional website that our team could actually maintain.",
      date: "2025-03-30",
      avatarUrl: "https://i.postimg.cc/MTr9j4Yn/client1.jpg"
    },
    {
      name: "Joshua Middletown",
      role: "Sales Director",
      quote:
        "The design felt modern and precise. We saw stronger engagement quickly after launch.",
      date: "2025-01-18",
      avatarUrl: "https://i.postimg.cc/wvV7f8rB/client2.jpg"
    },
    {
      name: "Melanie Stone",
      role: "Business Owner",
      quote:
        "The final site was fast, user-friendly, and easy for customers to use on every device.",
      date: "2024-11-29",
      avatarUrl: "https://i.postimg.cc/pdP9DL0S/client3.jpg"
    }
  ],
  customSections: [
    {
      id: "featured-process",
      kicker: "Process",
      title: "A simple working style from idea to launch.",
      body:
        "Use this CMS section as a flexible content block. Add more sections, cards, links, and images without touching code.",
      imageUrl: "",
      items: [
        {
          title: "Discover",
          body: "Clarify goals, audience, content, and the strongest portfolio story.",
          imageUrl: "",
          url: "",
          label: ""
        },
        {
          title: "Build",
          body: "Shape the interface, wire the CMS content, and refine responsive behavior.",
          imageUrl: "",
          url: "",
          label: ""
        },
        {
          title: "Launch",
          body: "Polish details, test the production build, and keep the site easy to maintain.",
          imageUrl: "",
          url: "",
          label: ""
        }
      ]
    }
  ],
  contact: {
    email: "user@gmail.com",
    phone: "999-888-777",
    whatsapp: "999-888-777",
    messenger: "user.fb123",
    headline: "Have a product idea or portfolio request?",
    body:
      "Send a message and I will get back with a clear next step, timeline, and collaboration path."
  }
};
