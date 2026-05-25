import React, { useState, useEffect } from "react";
import { 
  User, 
  Layers, 
  Briefcase, 
  BookOpen, 
  Code, 
  FileText, 
  Settings,
  Sparkles,
  Key
} from "lucide-react";

interface NeumorphicDockProps {
  currentView: "public" | "cms";
  setView: (view: "public" | "cms") => void;
}

export default function NeumorphicDock({ currentView, setView }: NeumorphicDockProps) {
  const [activeSection, setActiveSection] = useState<string>("section-who-am-i");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Scroll spy to highlight active section on public page
  useEffect(() => {
    if (currentView !== "public") {
      setActiveSection("");
      return;
    }

    const sections = [
      "section-who-am-i",
      "section-services",
      "section-experience",
      "section-education",
      "section-projects",
      "section-blogs"
    ];

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -55% 0px",
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [currentView]);

  const handleNavClick = (sectionId: string) => {
    if (currentView !== "public") {
      setView("public");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const navItems = [
    { id: "section-who-am-i", label: "About", icon: User },
    { id: "section-services", label: "Services", icon: Layers },
    { id: "section-experience", label: "Experience", icon: Briefcase },
    { id: "section-education", label: "Education", icon: BookOpen },
    { id: "section-projects", label: "Creations", icon: Code },
    { id: "section-blogs", label: "Journal", icon: FileText }
  ];

  return (
    <div 
      className="fixed right-4 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center bg-[#EBF2FA] w-18 py-6 px-3 rounded-[32px] shadow-neu-out border border-white/60 select-none transition-all duration-300"
      id="neumorphic-nav-dock"
    >
      {/* Neumorphic Sliding Switch at the TOP */}
      <div className="flex flex-col items-center mb-6" id="dock-switch-section">
        <div 
          onClick={() => setView(currentView === "public" ? "cms" : "public")}
          className="w-12 h-6 rounded-full bg-[#EBF2FA] shadow-neu-in border border-white/40 p-1 cursor-pointer flex items-center relative transition-all duration-300 hover:scale-105 active:scale-95"
          title={`Switch View to ${currentView === "public" ? "CMS Panel" : "Public Site"}`}
          id="dock-view-switch"
        >
          {/* Slide toggle circle dot overlay */}
          <div 
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              currentView === "cms" 
                ? "translate-x-6 bg-teal-500 shadow-[0_0_10px_#0d9488]" 
                : "translate-x-0 bg-slate-400 shadow-neu-out-sm"
            }`} 
          />
        </div>
      </div>

      {/* Separator */}
      <div className="w-8 h-[2px] bg-white/40 shadow-neu-in-sm rounded-full mb-5" />

      {/* Navigation circles set */}
      <div className="flex flex-col gap-4 items-center">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeSection === item.id && currentView === "public";

          return (
            <div 
              key={item.id}
              className="relative group flex items-center justify-center"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Tooltip on the left */}
              <div 
                className={`absolute right-12 bg-[#EBF2FA] text-stone-600 border border-white text-[11px] font-sans font-bold py-1.5 px-3 rounded-xl shadow-neu-out pointer-events-none transition-all duration-200 ${
                  hoveredItem === item.id 
                    ? "opacity-100 translate-x-0 visible" 
                    : "opacity-0 translate-x-2 invisible"
                }`}
                style={{ whiteSpace: "nowrap" }}
              >
                {item.label}
              </div>

              {/* Neumorphic Button Circle */}
              <button
                onClick={() => handleNavClick(item.id)}
                className={`w-11 h-11 rounded-full flex items-center justify-center border border-white transition-all duration-350 ${
                  isActive 
                    ? "shadow-neu-in text-teal-600 bg-[#EBF2FA]" 
                    : "shadow-neu-out text-stone-500 bg-[#EBF2FA] hover:text-stone-850 hover:shadow-neu-in-sm hover:scale-[1.03]"
                }`}
              >
                <IconComponent className={`h-4.5 w-4.5 transition-colors ${isActive ? "text-teal-600" : ""}`} />
              </button>
            </div>
          );
        })}

        {/* CMS Console Button (Quick Settings Launcher) */}
        <div 
          className="relative group flex items-center justify-center pt-2"
          onMouseEnter={() => setHoveredItem("cms-launcher")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          {/* Tooltip */}
          <div 
            className={`absolute right-12 bg-[#EBF2FA] text-stone-600 border border-white text-[11px] font-sans font-bold py-1.5 px-3 rounded-xl shadow-neu-out pointer-events-none transition-all duration-200 ${
              hoveredItem === "cms-launcher" 
                ? "opacity-100 translate-x-0 visible" 
                : "opacity-0 translate-x-2 invisible"
            }`}
            style={{ whiteSpace: "nowrap" }}
          >
            Akash's Portal
          </div>

          <button
            onClick={() => setView(currentView === "cms" ? "public" : "cms")}
            className={`w-11 h-11 rounded-full flex items-center justify-center border border-white transition-all duration-350 ${
              currentView === "cms" 
                ? "shadow-neu-in text-indigo-650 bg-[#EBF2FA] border-indigo-200" 
                : "shadow-neu-out text-stone-400 bg-[#EBF2FA] hover:text-indigo-650 hover:shadow-neu-in-sm hover:scale-[1.03]"
            }`}
            id="dock-cms-btn"
          >
            <Key className={`h-4.5 w-4.5 transition-colors ${currentView === "cms" ? "text-indigo-600 animate-pulse" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
