export interface Project {
  id: string;
  title: string;
  category: string; // e.g. "Web Development", "AI/ML", "Mobile App"
  description: string;
  longDescription?: string;
  techStack: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Markdown supported!
  imageUrl: string;
  tags: string[];
  publishedAt: string;
  readTime: string;
  published: boolean;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string; // e.g. "2024 - Present"
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}

export interface SeoMetadata {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  aboutText: string;
  skills: string[];
  socialLinks: SocialLinks;
  seo?: SeoMetadata;
}

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
  blogs: BlogPost[];
  experiences: Experience[];
  education: Education[];
  astrologyUsers?: AstrologyUser[];
}

export interface AstrologyConsultation {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
}

export interface AstrologyUser {
  id: string;
  name: string;
  email?: string;
  birthdate: string;
  birthdateAd?: string;
  birthdateBs?: string;
  birthplace: string;
  birthtime: string;
  rasi?: string;
  isVerified: boolean;
  createdAt: string;
  consultations: AstrologyConsultation[];
}
