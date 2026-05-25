import React, { useState, useEffect } from "react";
import { 
  Briefcase, 
  BookOpen, 
  Mail, 
  MapPin, 
  Phone, 
  Download, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Twitter, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Code, 
  Palette, 
  Cpu, 
  PenTool, 
  Music, 
  User, 
  ArrowRight,
  X,
  FileText
} from "lucide-react";
import { PortfolioData, Project, BlogPost, Experience, Education } from "../types";
import AstrologyPortal from "./AstrologyPortal";

interface PortfolioViewProps {
  data: PortfolioData;
}

export default function PortfolioView({ data }: PortfolioViewProps) {
  const { profile, projects, blogs, experiences, education } = data;

  // Key Interactive States
  const [expandedExperience, setExpandedExperience] = useState<string | null>(experiences[0]?.id || null);
  const [expandedEducation, setExpandedEducation] = useState<string | null>(education[0]?.id || null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [projectCategory, setProjectCategory] = useState<string>("All");
  const [showAstrology, setShowAstrology] = useState<boolean>(false);
  
  // Custom Toast notification for CV Download or Contact Success
  const [toast, setToast] = useState<string | null>(null);

  // Typewriter / cycling text under profile
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const titleCycle = [
    profile.title,
    "Full-Stack Developer",
    "UI/UX Visual Architect",
    "Creative Technical Lead",
    "AI Integration Specialist"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitleIndex((prev) => (prev + 1) % titleCycle.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [profile.title]);

  // Extract unique project categories
  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = projectCategory === "All"
    ? projects
    : projects.filter((p) => p.category === projectCategory);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const downloadCV = () => {
    // Generate a beautiful virtual JSON resume or standard file representation
    const profileJson = JSON.stringify(data, null, 2);
    const blob = new Blob([profileJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profile.name.replace(/\s+/g, "_")}_portfolio_archive.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Interactive Portfolio JSON compiled and downloaded successfully.");
  };

  // Pre-configured elegant icons matching what might be in "What I Do" (Services)
  const getServiceIcon = (index: number) => {
    const icons = [
      <Palette className="h-6 w-6 text-teal-600" />,
      <Code className="h-6 w-6 text-emerald-600" />,
      <Cpu className="h-6 w-6 text-cyan-600" />,
      <PenTool className="h-6 w-6 text-sky-600" />,
      <Layers className="h-6 w-6 text-indigo-600" />,
      <Sparkles className="h-6 w-6 text-purple-600" />
    ];
    return icons[index % icons.length];
  };

  return (
    <div className="bg-[#EBF2FA] min-h-screen pt-4 pb-20 px-4 sm:px-6 lg:px-8 text-stone-700 font-sans tracking-tight relative overflow-x-hidden">
      
      {/* Toast Notification */}
      {toast && (
        <div id="toast-notify" className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs px-4 py-3 rounded-xl shadow-neu-out border border-stone-800 flex items-center gap-2 animate-bounce">
          <Sparkles className="h-4 w-4 text-teal-400 animate-spin" />
          <span>{toast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= LEFT SIDEBAR: PROFILE PANEL ================= */}
        <aside className="lg:col-span-4 bg-[#EBF2FA] rounded-3xl p-6 shadow-neu-out border border-white/50 sticky top-24" id="portfolio-profile-card">
          <div className="flex flex-col items-center text-center">
            
            {/* User Avatar with premium Double Ring Soft Shadow */}
            <div className="relative w-44 h-44 rounded-full p-2 bg-[#EBF2FA] shadow-neu-in border border-white flex items-center justify-center mb-5 group">
              <div className="w-full h-full rounded-full overflow-hidden shadow-neu-out border-2 border-white relative">
                <img 
                  src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"} 
                  alt={profile.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white p-2 rounded-full shadow-neu-out border border-white">
                <Sparkles className="h-4 w-4 animate-pulse" />
              </div>
            </div>

            {/* User Names and Badge Typewriter */}
            <h1 className="text-2xl font-bold tracking-tight text-stone-800" id="profile-name">
              {profile.name}
            </h1>
            
            {/* Soft background green pill for Active Status Cycling tags */}
            <div className="mt-3.5 mb-6 h-8 overflow-hidden inline-flex items-center px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-xs font-semibold text-teal-700 shadow-neu-in-sm">
              <span className="animate-pulse mr-1.5 text-teal-500">Active:</span>
              <span className="transition-all duration-300 transform" key={currentTitleIndex}>
                {titleCycle[currentTitleIndex]}
              </span>
            </div>

            {/* Social Icons with Round Border Shadows */}
            <div className="flex justify-center items-center gap-3 mb-6">
              {profile.socialLinks.github && (
                <a 
                  href={profile.socialLinks.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-[#EBF2FA] text-stone-600 rounded-full shadow-neu-out border border-white hover:text-teal-600 transition-all shadow-neu-button"
                  title="GitHub Profile"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
              {profile.socialLinks.linkedin && (
                <a 
                  href={profile.socialLinks.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-[#EBF2FA] text-stone-600 rounded-full shadow-neu-out border border-white hover:text-teal-600 transition-all shadow-neu-button"
                  title="LinkedIn Connect"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {profile.socialLinks.twitter && (
                <a 
                  href={profile.socialLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-[#EBF2FA] text-stone-600 rounded-full shadow-neu-out border border-white hover:text-teal-600 transition-all shadow-neu-button"
                  title="Twitter Feed"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {profile.socialLinks.email && (
                <a 
                  href={`mailto:${profile.socialLinks.email}`}
                  className="p-3 bg-[#EBF2FA] text-stone-600 rounded-full shadow-neu-out border border-white hover:text-teal-600 transition-all shadow-neu-button"
                  title="Drop an Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
              )}
            </div>

            {/* Description intro details */}
            <p className="text-stone-600 text-xs leading-relaxed max-w-sm px-2 text-justify mb-6 bg-stone-55 rounded-2xl p-4 shadow-neu-in border border-white/40">
              {profile.bio}
            </p>

            {/* Detailed Contact List Frame */}
            <div className="w-full text-left space-y-3.5 mb-7 px-4 py-4 rounded-2xl bg-[#EBF2FA] shadow-neu-in border border-white/50">
              <div className="flex items-center gap-3.5 text-xs text-stone-600">
                <div className="p-2.5 bg-[#EBF2FA] rounded-xl shadow-neu-out border border-white">
                  <Mail className="h-3.5 w-3.5 text-teal-600" />
                </div>
                <div className="overflow-hidden truncate">
                  <p className="text-[10px] uppercase font-mono tracking-wider text-stone-400">Email Address</p>
                  <p className="font-semibold text-stone-700 truncate">{profile.socialLinks.email || "akasbarai560@gmail.com"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 text-xs text-stone-600">
                <div className="p-2.5 bg-[#EBF2FA] rounded-xl shadow-neu-out border border-white">
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono tracking-wider text-stone-400">Contact Phone</p>
                  <p className="font-semibold text-stone-700">+977 9825638531</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 text-xs text-stone-600">
                <div className="p-2.5 bg-[#EBF2FA] rounded-xl shadow-neu-out border border-white">
                  <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono tracking-wider text-stone-400">Current Base</p>
                  <p className="font-semibold text-stone-700">Lumbini, Nepal</p>
                </div>
              </div>
            </div>

            {/* CV Download CTA */}
            <button
              id="cta-download-cv"
              onClick={downloadCV}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-teal-600 text-white font-semibold text-xs tracking-wide shadow-neu-out border border-teal-500 hover:bg-teal-700 transition-all active:scale-[0.98]"
            >
              <Download className="h-4 w-4" />
              <span>Download CV Archive</span>
            </button>

          </div>
        </aside>

        {/* ================= RIGHT MAIN AREA: BENTO CARDS ================= */}
        <main className="lg:col-span-8 space-y-8" id="portfolio-main-grid">

          {/* SECTION: WHO AM I */}
          <section className="bg-[#EBF2FA] rounded-3xl p-6 sm:p-8 shadow-neu-out border border-white/50" id="section-who-am-i">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#0D9488] block mb-2 font-bold">ABOUT ME</span>
            <h2 className="text-2xl font-black text-stone-850 mb-4 tracking-tight">Who Am I?</h2>
            <p className="text-[#4B5563] text-sm leading-relaxed mb-6 whitespace-pre-line text-justify">
              {profile.aboutText || profile.bio}
            </p>

            {/* Badges / Tech Expertise Cloud */}
            <div className="border-t border-stone-200/50 pt-5">
              <p className="text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-3 font-semibold">Primary Core Tech Skills</p>
              <div className="flex flex-wrap gap-2.5">
                {profile.skills.map((skill, i) => (
                  <span 
                    key={i} 
                    className="px-3.5 py-1.5 bg-[#EBF2FA] text-xs font-semibold text-stone-700 rounded-xl shadow-neu-out-sm border border-white hover:text-teal-600 transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION: WHAT I DO (SERVICES) */}
          <section className="bg-[#EBF2FA] rounded-3xl p-6 sm:p-8 shadow-neu-out border border-white/50" id="section-services">
            <span className="text-[10px] uppercase font-mono tracking-widest text-teal-600 block mb-2 font-bold">SERVICES</span>
            <h2 className="text-2xl font-black text-stone-850 mb-6 tracking-tight">What I Do?</h2>
            
            {/* Custom Interactive Bento Grid Services */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "UI/UX Design", desc: "Crafting wireframes, responsive visual mockups, and immersive modern user journeys." },
                { title: "Frontend Developer", desc: "Building modular, highly custom single page apps with clean layouts and rich interactions." },
                { title: "Web Design", desc: "Devising striking, balanced aesthetic layouts with elegant typography and fluid grids." },
                { title: "Web & UI/UX Instructor", desc: "Mentoring junior talents and leading technical development seminars globally." },
                { title: "Graphics Designing", desc: "Conceptualizing high-contrast, scalable vector assets, brand guides and assets." },
                { title: "Astrologer & Finder", desc: "Exploring system patterns, astronomical rhythms, and predictive computations.", isAstrology: true }
              ].map((serv, index) => (
                <div 
                  key={index}
                  onClick={() => {
                    if (serv.isAstrology) {
                      setShowAstrology(!showAstrology);
                      if (!showAstrology) {
                        setTimeout(() => {
                          const astroEl = document.getElementById("section-astrology");
                          if (astroEl) {
                            astroEl.scrollIntoView({ behavior: "smooth", block: "start" });
                          }
                        }, 120);
                      }
                    } else {
                      triggerToast(`Selected specialized portfolio capability: ${serv.title}`);
                    }
                  }}
                  className={`bg-[#EBF2FA] rounded-2xl p-5 border border-white/40 shadow-neu-out-sm transition-all duration-300 hover:shadow-neu-in flex flex-col items-center text-center group cursor-pointer ${
                    serv.isAstrology && showAstrology ? "shadow-neu-in border-purple-300/60 ring-2 ring-purple-400/20 bg-purple-50/10" : ""
                  }`}
                >
                  <div className="p-3 bg-[#EBF2FA] rounded-full shadow-neu-out border border-white mb-4 group-hover:shadow-neu-in-sm transition-all duration-300">
                    {getServiceIcon(index)}
                  </div>
                  <h3 className={`font-bold text-sm text-stone-800 mb-2 truncate group-hover:text-teal-600 transition-colors ${
                    serv.isAstrology && showAstrology ? "text-purple-650" : ""
                  }`}>
                    {serv.title}
                  </h3>
                  <p className="text-stone-500 text-xs leading-relaxed text-justify">
                    {serv.desc}
                  </p>
                  {serv.isAstrology && (
                    <span className="mt-3.5 text-[9px] uppercase font-mono tracking-wider text-purple-650 font-bold bg-purple-50/60 border border-purple-100 rounded-full px-2.5 py-1">
                      {showAstrology ? "Active Console" : "Access Portal"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* SECTION: ASTROLOGY PORTAL CONTAINER */}
          {showAstrology && (
            <section className="scroll-mt-24 transition-all duration-300" id="section-astrology">
              <AstrologyPortal onClose={() => {
                setShowAstrology(false);
                const servicesEl = document.getElementById("section-services");
                if (servicesEl) servicesEl.scrollIntoView({ behavior: "smooth", block: "center" });
              }} />
            </section>
          )}

          {/* SECTION: EXPERIENCE TIMELINE */}
          <section className="bg-[#EBF2FA] rounded-3xl p-6 sm:p-8 shadow-neu-out border border-white/50" id="section-experience">
            <span className="text-[10px] uppercase font-mono tracking-widest text-teal-600 block mb-2 font-bold">EXPERIENCE</span>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-stone-850 tracking-tight">What I've Done?</h2>
              <button 
                onClick={() => triggerToast("Verification records request forwarded to the mailbox.")}
                className="px-3.5 py-1.5 rounded-full bg-[#EBF2FA] shadow-neu-out border border-white text-[10px] uppercase tracking-wider font-mono font-bold text-stone-500 hover:text-teal-600 shadow-neu-button"
              >
                Request Records
              </button>
            </div>

            {/* Neumorphic Timelines and Expanding Cards Accordion */}
            <div className="space-y-4">
              {experiences.map((exp) => {
                const isExpanded = expandedExperience === exp.id;
                return (
                  <div 
                    key={exp.id}
                    className={`bg-[#EBF2FA] rounded-2xl border border-white/50 transition-all ${
                      isExpanded 
                        ? "shadow-neu-in p-5 sm:p-6" 
                        : "shadow-neu-out p-4 hover:shadow-neu-in-sm cursor-pointer"
                    }`}
                    onClick={() => !isExpanded && setExpandedExperience(exp.id)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 bg-white rounded-xl shadow-neu-out border border-stone-100 ${
                          isExpanded ? "text-teal-600" : "text-stone-400"
                        }`}>
                          <Briefcase className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 id={`exp-title-${exp.id}`} className="font-bold text-stone-800 text-sm">
                            {exp.role}
                          </h3>
                          <p className="text-xs text-stone-500 font-semibold">{exp.company}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="hidden sm:inline bg-teal-50 text-teal-800 border-teal-100 border text-[10px] font-mono px-2.5 py-1 rounded-full font-bold">
                          {exp.period}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedExperience(isExpanded ? null : exp.id);
                          }}
                          className="p-1 rounded-full bg-[#EBF2FA] shadow-neu-out border border-white hover:text-teal-600"
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-stone-200/50 text-stone-600 text-xs leading-relaxed space-y-3.5">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <p className="font-mono text-[10px] text-stone-400">Headquarters Base: Kathmandu / Remote</p>
                          <a 
                            href="https://google.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1 bg-[#EBF2FA] shadow-neu-out border border-white rounded-lg text-[10px] uppercase font-bold text-stone-500 hover:text-teal-600 transition"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Visit Website</span>
                          </a>
                        </div>
                        <p className="whitespace-pre-line text-stone-600 bg-stone-50 rounded-xl p-3 border border-white shadow-neu-in">
                          {exp.description}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION: EDUCATION TIMELINE */}
          <section className="bg-[#EBF2FA] rounded-3xl p-6 sm:p-8 shadow-neu-out border border-white/50" id="section-education">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#0D9488] block mb-2 font-bold">EDUCATION</span>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-stone-850 tracking-tight">Where I Studied?</h2>
              <span className="text-[10px] font-mono text-stone-400 bg-stone-100/50 px-2.5 py-1 rounded-full border border-stone-200/30">Verified Credentials</span>
            </div>

            <div className="space-y-4">
              {education.map((edu) => {
                const isExpanded = expandedEducation === edu.id;
                return (
                  <div 
                    key={edu.id}
                    className={`bg-[#EBF2FA] rounded-2xl border border-white/50 transition-all ${
                      isExpanded 
                        ? "shadow-neu-in p-5 sm:p-6" 
                        : "shadow-neu-out p-4 hover:shadow-neu-in-sm cursor-pointer"
                    }`}
                    onClick={() => !isExpanded && setExpandedEducation(edu.id)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 bg-white rounded-xl shadow-neu-out border border-stone-100 ${
                          isExpanded ? "text-cyan-600" : "text-stone-400"
                        }`}>
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-stone-850 text-sm">
                            {edu.degree}
                          </h3>
                          <p className="text-xs text-stone-500 font-semibold">{edu.institution}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="hidden sm:inline bg-cyan-50 text-cyan-800 border-cyan-100 border text-[10px] font-mono px-2.5 py-1 rounded-full font-bold">
                          {edu.period}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedEducation(isExpanded ? null : edu.id);
                          }}
                          className="p-1 rounded-full bg-[#EBF2FA] shadow-neu-out border border-white hover:text-teal-600"
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-stone-200/50 text-stone-600 text-xs leading-relaxed space-y-2">
                        <p className="font-mono text-[10px] text-stone-400">Honors: Magna Cum Laude / Division First</p>
                        <p className="p-3 bg-stone-50 rounded-xl border border-white shadow-neu-in">
                          Completed rigorous study programs featuring core principles of modern system architectures, predictive mathematical models, data structural systems, and client interface designs.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION: PROJECTS PORTFOLIO */}
          <section className="bg-[#EBF2FA] rounded-3xl p-6 sm:p-8 shadow-neu-out border border-white/50" id="section-projects">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#0D9488] block mb-2 font-bold font-black">CREATIONS</span>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-black text-stone-850 tracking-tight">Featured Projects</h2>
              
              {/* Category Filter Pills (Neumorphic Tabs) */}
              <div className="flex flex-wrap gap-1.5 rounded-xl bg-stone-100/50 p-1 border border-stone-200/30">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProjectCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      projectCategory === cat
                        ? "bg-stone-900 text-white shadow-neu-out-sm"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredProjects.map((p) => (
                <div 
                  key={p.id}
                  className="bg-[#EBF2FA] rounded-2xl overflow-hidden border border-white/50 shadow-neu-out hover:shadow-neu-in transition-all duration-300 flex flex-col cursor-pointer group"
                  onClick={() => setSelectedProject(p)}
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-stone-100 border-b border-stone-250/20">
                    <img 
                      src={p.imageUrl} 
                      alt={p.title} 
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-stone-900/80 text-white text-[9px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {p.category}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-stone-850 group-hover:text-teal-600 transition-colors text-sm mb-1.5 truncate">
                        {p.title}
                      </h3>
                      <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed text-left mb-3.5 mb-4">
                        {p.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-t border-stone-200/50 pt-3.5">
                      <div className="flex gap-1.5 overflow-hidden text-[9px] tracking-wide font-semibold text-stone-500">
                        {p.techStack.slice(0, 3).map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 bg-stone-200/50 rounded-md">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-teal-600 group-hover:underline flex items-center gap-1 shrink-0">
                        Explore
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION: JOURNAL / BLOG WRITING */}
          <section className="bg-[#EBF2FA] rounded-3xl p-6 sm:p-8 shadow-neu-out border border-white/50" id="section-blogs">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#0D9488] block mb-2 font-bold">JOURNAL</span>
            <h2 className="text-2xl font-black text-stone-850 mb-6 tracking-tight">Editorial Journal</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.filter((b) => b.published).map((b) => (
                <article 
                  key={b.id}
                  className="bg-[#EBF2FA] rounded-2xl p-5 border border-white/50 shadow-neu-out hover:shadow-neu-in transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                  onClick={() => setSelectedBlog(b)}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 text-[10px] font-mono font-semibold text-stone-400">
                      <span>{b.publishedAt}</span>
                      <span className="p-1 px-2.5 rounded-full bg-stone-100 border border-stone-200/30 text-stone-500 font-bold">{b.readTime}</span>
                    </div>

                    <h3 className="text-base font-bold text-stone-850 group-hover:text-teal-600 transition-colors mb-2 line-clamp-2 leading-snug">
                      {b.title}
                    </h3>
                    
                    <p className="text-stone-500 text-xs leading-relaxed line-clamp-3 text-left mb-4">
                      {b.excerpt}
                    </p>
                  </div>

                  <div className="border-t border-stone-200/50 pt-3 flex flex-wrap gap-1.5">
                    {b.tags.map((tag, i) => (
                      <span key={i} className="text-[9px] font-mono tracking-wider font-bold text-teal-600 uppercase">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

        </main>
      </div>

      {/* ================= MODAL: PROJECT DETAIL EXPLORER ================= */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#EBF2FA] w-full max-w-2xl rounded-3xl overflow-hidden border border-white shadow-neu-out animate-in fade-in zoom-in-95 duration-250">
            
            <div className="relative aspect-video w-full bg-stone-100 border-b border-white">
              <img src={selectedProject.imageUrl} alt={selectedProject.title} className="object-cover w-full h-full" />
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 bg-stone-900/80 text-white rounded-full hover:bg-stone-950 shadow-lg transition-transform hover:scale-105"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-4 bg-teal-600 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-lg">
                {selectedProject.category}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <h3 className="text-xl font-black text-stone-850 mb-3">{selectedProject.title}</h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedProject.techStack.map((tech, i) => (
                  <span key={i} className="px-2.5 py-1 bg-stone-200/50 text-[10px] font-mono font-bold text-stone-600 rounded-lg">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/50 text-xs text-stone-600 leading-relaxed text-justify mb-6 shadow-neu-in">
                <p className="font-semibold text-stone-700 uppercase font-mono text-[9px] tracking-wider mb-2 text-teal-600">Architectural Summary</p>
                {selectedProject.longDescription || selectedProject.description}
              </div>

              <div className="flex gap-4">
                {selectedProject.liveUrl && (
                  <a 
                    href={selectedProject.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold font-semibold transition"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View Launch site</span>
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a 
                    href={selectedProject.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#EBF2FA] shadow-neu-out border border-white hover:bg-white text-stone-700 rounded-xl text-xs font-bold font-semibold transition"
                  >
                    <Github className="h-4 w-4" />
                    <span>Explore GitHub</span>
                  </a>
                )}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-3 border border-stone-200/60 rounded-xl text-xs font-semibold hover:bg-stone-50 text-stone-500"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL: JOURNAL ARTICLE READER ================= */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#EBF2FA] w-full max-w-3xl rounded-3xl overflow-hidden border border-white shadow-neu-out animate-in fade-in zoom-in-95 duration-250">
            
            <div className="relative aspect-[21/9] w-full bg-stone-100 border-b border-white">
              <img src={selectedBlog.imageUrl} alt={selectedBlog.title} className="object-cover w-full h-full opacity-90" />
              <button 
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 p-2 bg-stone-900/80 text-white rounded-full hover:bg-stone-950 shadow-lg transition-transform hover:scale-105"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-4 flex gap-2">
                {selectedBlog.tags.map((tag, i) => (
                  <span key={i} className="bg-stone-900/80 backdrop-blur-sm text-teal-400 text-[9px] font-mono tracking-widest uppercase px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 mb-2">
                <span>Published On {selectedBlog.publishedAt}</span>
                <span>{selectedBlog.readTime}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-stone-850 mb-6 leading-tight border-b border-stone-250/20 pb-4">
                {selectedBlog.title}
              </h3>

              {/* Styled markdown content */}
              <div id="blog-body" className="prose prose-stone max-w-none text-stone-600 text-xs sm:text-sm leading-relaxed space-y-4 text-justify">
                {selectedBlog.content.split("\n\n").map((para, i) => {
                  if (para.startsWith("##")) {
                    return <h4 key={i} className="text-stone-800 font-extrabold text-sm sm:text-base pt-3">{para.replace("##", "").trim()}</h4>;
                  }
                  if (para.startsWith("###")) {
                    return <h5 key={i} className="text-stone-700 font-bold text-xs sm:text-sm pt-2">{para.replace("###", "").trim()}</h5>;
                  }
                  if (para.startsWith("1.") || para.startsWith("-")) {
                    return (
                      <ul key={i} className="list-disc pl-5 space-y-1 bg-stone-50/40 rounded-xl p-3 border border-stone-200/20">
                        {para.split("\n").map((li, j) => (
                          <li key={j} className="text-stone-600">{li.substring(2).trim()}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (para.startsWith("```")) {
                    return (
                      <pre key={i} className="bg-stone-900 text-teal-300 font-mono text-[11px] p-4 rounded-xl border border-stone-850 overflow-x-auto my-3 leading-snug">
                        {para.replace(/```[a-z]*/g, "").trim()}
                      </pre>
                    );
                  }
                  return <p key={i}>{para}</p>;
                })}
              </div>
            </div>

            <div className="p-6 bg-stone-100/50 border-t border-stone-200/40 flex justify-end gap-3 rounded-b-3xl">
              <button 
                onClick={() => triggerToast("Bookmark added dynamically to local archive.")}
                className="px-4 py-2 bg-[#EBF2FA] shadow-neu-out border border-white text-xs font-semibold text-stone-600 hover:text-teal-600 rounded-xl transition shadow-neu-button"
              >
                Bookmark Article
              </button>
              <button
                onClick={() => setSelectedBlog(null)}
                className="px-4 py-2 bg-[#EBF2FA] shadow-neu-out border border-white text-xs font-semibold text-stone-500 hover:text-stone-700 rounded-xl transition shadow-neu-button"
              >
                Done Reading
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
