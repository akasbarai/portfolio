
import React from 'react';

interface SidebarRightProps {
  activeSection: string;
  onNavClick: (id: string) => void;
}

const SidebarRight: React.FC<SidebarRightProps> = ({ activeSection, onNavClick }) => {
  const navItems = [
    { id: 'about', icon: 'fa-user', label: 'About' },
    { id: 'resume', icon: 'fa-file-alt', label: 'Resume' },
    { id: 'works', icon: 'fa-briefcase', label: 'Works' },
    { id: 'blog', icon: 'fa-blog', label: 'Blog' },
    { id: 'contact', icon: 'fa-envelope', label: 'Contact' }
  ];

  return (
    <aside className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:relative lg:bottom-auto lg:left-auto lg:translate-x-0 w-fit lg:w-20 lg:h-full z-50">
      <nav className="flex lg:flex-col gap-4 p-3 bg-white/90 backdrop-blur-xl border border-slate-100 lg:bg-white rounded-[2rem] lg:rounded-3xl shadow-2xl lg:shadow-xl lg:h-fit">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              className={`w-12 h-12 lg:w-14 lg:h-14 flex flex-col items-center justify-center rounded-2xl transition-all group relative border-none cursor-pointer outline-none ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' 
                  : 'bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              <i className={`fas ${item.icon} text-lg lg:text-xl`}></i>
              
              {/* Tooltip for desktop */}
              <span className="absolute right-full mr-4 px-3 py-1 bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all hidden lg:block whitespace-nowrap shadow-xl">
                {item.label}
                <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 -z-10"></span>
              </span>
              
              {/* Active Indicator Dot */}
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 bg-white rounded-full lg:hidden"></span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default SidebarRight;
