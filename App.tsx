
import React, { useState, useEffect, useRef } from 'react';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import AIAssistant from './components/AIAssistant';
import About from './pages/About';
import Resume from './pages/Resume';
import Works from './pages/Works';
import Blog from './pages/Blog';
import Contact from './pages/Contact';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('about');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = ['about', 'resume', 'works', 'blog', 'contact'];
    const observerOptions = {
      root: scrollContainerRef.current,
      rootMargin: '-20% 0px -70% 0px', // Trigger when section is near the top
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
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element && scrollContainerRef.current) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex items-center justify-center lg:p-8 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-50 opacity-30 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-indigo-200 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-purple-200 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-[1440px] w-full h-full flex flex-col lg:flex-row gap-6 px-4 py-6 lg:p-0 relative">
        
        {/* Left: Fixed Profile Sidebar */}
        <div className="lg:w-80 h-fit lg:h-full shrink-0">
          <SidebarLeft />
        </div>

        {/* Center: Scrollable Content Area */}
        <main 
          ref={scrollContainerRef}
          className="flex-1 bg-white rounded-3xl shadow-xl overflow-y-auto no-scrollbar relative min-h-0 scroll-smooth"
        >
          <div className="p-6 lg:p-14 space-y-24">
            <section id="about" className="scroll-mt-14">
              <About />
            </section>
            <section id="resume" className="scroll-mt-14">
              <Resume />
            </section>
            <section id="works" className="scroll-mt-14">
              <Works />
            </section>
            <section id="blog" className="scroll-mt-14">
              <Blog />
            </section>
            <section id="contact" className="scroll-mt-14 pb-20">
              <Contact />
            </section>
          </div>
        </main>

        {/* Right: Fixed Navigation Sidebar */}
        <div className="shrink-0">
          <SidebarRight activeSection={activeSection} onNavClick={scrollToSection} />
        </div>

        {/* Floating AI Assistant Integration */}
        <AIAssistant />

      </div>
    </div>
  );
};

export default App;
