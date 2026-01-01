
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  organization: string;
  description: string;
}

export interface Skill {
  name: string;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  icon: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
}
