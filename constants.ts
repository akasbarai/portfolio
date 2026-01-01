
import { Service, TimelineItem, Skill, Project, BlogPost } from './types';

export const SERVICES: Service[] = [
  {
    id: 's1',
    title: 'UI/UX Design',
    description: 'Specializing in clean, user-centric designs. I create high-fidelity prototypes and wireframes that prioritize accessibility and modern aesthetics.',
    icon: 'fa-paint-brush'
  },
  {
    id: 's2',
    title: 'App Development',
    description: 'Expertise in building native-feel cross-platform apps using Flutter and React Native. I focus on performance and fluid animations.',
    icon: 'fa-mobile-alt'
  },
  {
    id: 's3',
    title: 'Photography',
    description: 'Passionate about landscape and street photography. I use professional post-processing techniques to tell visual stories.',
    icon: 'fa-camera'
  },
  {
    id: 's4',
    title: 'Web Development',
    description: 'Full-stack development using MERN stack. I build scalable, secure, and SEO-optimized web applications with cutting-edge tools.',
    icon: 'fa-code'
  },
  {
    id: 's5',
    title: 'Cloud Solutions',
    description: 'Implementing cloud-native features and serverless architectures using AWS and Firebase for scalable backend solutions.',
    icon: 'fa-cloud'
  }
];

export const EDUCATION: TimelineItem[] = [
  {
    id: 'e1',
    date: '2022 - Present',
    title: 'BSc. in Computer Science and Information Technology',
    organization: 'Bhairahawa Multiple Campus, TU, Nepal',
    description: 'Maintaining a 3.7 GPA. Focused on Data Structures, Algorithms, and Software Engineering. Active member of the IT Student Association.'
  },
  {
    id: 'e2',
    date: '2019 - 2021',
    title: 'Higher Secondary Education (Science)',
    organization: 'Model Multiple College, Butwal',
    description: 'Graduated with Distinction. Major in Mathematics and Physics. Awarded "Best Science Student" in the final year.'
  },
  {
    id: 'e3',
    date: '2017 - 2019',
    title: 'Secondary Education (SEE)',
    organization: 'Shree Rohini Secondary School',
    description: 'Secured GPA 3.8/4.0. Participated in regional science fairs and debate competitions.'
  }
];

export const EXPERIENCE: TimelineItem[] = [
  {
    id: 'ex1',
    date: 'Summer 2023',
    title: 'Junior IT Intern',
    organization: 'Local Tech Solutions, Rupandehi',
    description: 'Worked on internal dashboard optimization using React. Supported network security audits and hardware troubleshooting.'
  },
  {
    id: 'ex2',
    date: '2023 - Present',
    title: 'Freelance Full-Stack Developer',
    organization: 'Upwork / Remote',
    description: 'Completed 10+ projects for international clients ranging from landing pages to complex e-commerce integrations.'
  },
  {
    id: 'ex3',
    date: '2024 - Present',
    title: 'Open Source Contributor',
    organization: 'GitHub Community',
    description: 'Actively contributing to various JavaScript and Python libraries. Improving documentation and fixing bug reports.'
  }
];

export const SKILLS: Skill[] = [
  { name: 'HTML5/CSS3', icon: 'fa-html5' },
  { name: 'JavaScript', icon: 'fa-js' },
  { name: 'React.js', icon: 'fa-react' },
  { name: 'Python', icon: 'fa-python' },
  { name: 'SQL/NoSQL', icon: 'fa-database' },
  { name: 'Git/GitHub', icon: 'fa-git-alt' },
  { name: 'Tailwind CSS', icon: 'fa-wind' },
  { name: 'Flutter', icon: 'fa-mobile' },
  { name: 'Node.js', icon: 'fa-node-js' },
  { name: 'TypeScript', icon: 'fa-code' },
  { name: 'Figma', icon: 'fa-figma' },
  { name: 'AWS Cloud', icon: 'fa-aws' }
];

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Nexus E-Commerce',
    category: 'Full-Stack Web',
    description: 'A premium shopping platform with Stripe integration, real-time stock tracking, and an advanced admin dashboard.',
    icon: 'fa-shopping-cart'
  },
  {
    id: 'p2',
    title: 'Smart Inventory',
    category: 'Desktop SaaS',
    description: 'Enterprise-grade inventory management for local warehouses, featuring QR code scanning and automated reporting.',
    icon: 'fa-chart-line'
  },
  {
    id: 'p3',
    title: 'VibeChat Pro',
    category: 'Real-time Social',
    description: 'Scalable messaging app with end-to-end encryption, voice notes, and group management features.',
    icon: 'fa-comments'
  },
  {
    id: 'p4',
    title: 'TaskMaster AI',
    category: 'Mobile Productivity',
    description: 'Flutter app that uses local LLMs to prioritize tasks and suggest schedule optimizations.',
    icon: 'fa-check-circle'
  },
  {
    id: 'p5',
    title: 'Portfolio Engine',
    category: 'Open Source Tool',
    description: 'A customizable framework for developers to generate high-performance portfolios using React and MDX.',
    icon: 'fa-cogs'
  },
  {
    id: 'p6',
    title: 'HealthTrack',
    category: 'Health Tech',
    description: 'Personalized wellness tracker that syncs with wearable devices and provides data-driven health insights.',
    icon: 'fa-heartbeat'
  }
];

export const BLOGS: BlogPost[] = [
  {
    id: 'b1',
    title: 'Demystifying the Gemini API',
    excerpt: 'A deep dive into how large language models are revolutionizing modern web applications and developer productivity.',
    date: 'Jan 05, 2024'
  },
  {
    id: 'b2',
    title: 'Mastering Tailwind CSS 4.0',
    excerpt: 'Exploring the newest features in Tailwind and how to write more maintainable utility-first styles.',
    date: 'Dec 20, 2023'
  },
  {
    id: 'b3',
    title: 'Why I Chose BSc. CSIT',
    excerpt: 'My journey into computer science in Nepal and what future students can expect from this academic path.',
    date: 'Nov 12, 2023'
  }
];
