
import React from 'react';
import SectionHeader from '../components/SectionHeader';
import { PROJECTS } from '../constants';

const Works: React.FC = () => {
  return (
    <div className="pb-10">
      <SectionHeader title="Portfolio Showcase" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {PROJECTS.map((project) => (
          <div 
            key={project.id} 
            className="group overflow-hidden bg-white border border-slate-100 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all relative"
          >
            {/* Project Preview Header */}
            <div className="h-64 bg-slate-50 relative flex items-center justify-center transition-all group-hover:bg-indigo-600 overflow-hidden">
               <i className={`fas ${project.icon} text-7xl text-slate-200 group-hover:text-white/20 group-hover:scale-150 transition-all duration-700`}></i>
               
               {/* Hover Overlay Buttons */}
               <div className="absolute inset-0 bg-indigo-900/60 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-12 h-12 bg-white text-indigo-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <i className="fas fa-link"></i>
                  </button>
                  <button className="w-12 h-12 bg-white text-indigo-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <i className="fab fa-github"></i>
                  </button>
               </div>
            </div>

            <div className="p-10">
              <div className="flex justify-between items-start mb-4">
                <span className="inline-block px-4 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {project.category}
                </span>
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                </div>
              </div>
              
              <h4 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors">
                {project.title}
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                {project.description}
              </p>
              
              {/* Tech stack pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {['React', 'Node.js', 'PostgreSQL'].map(tech => (
                  <span key={tech} className="text-[9px] font-bold uppercase text-slate-400 border border-slate-100 px-2 py-0.5 rounded">
                    {tech}
                  </span>
                ))}
              </div>

              <button className="flex items-center gap-3 text-slate-800 font-bold text-sm group/btn border-b-2 border-transparent hover:border-indigo-600 pb-1 transition-all">
                Explore Case Study 
                <i className="fas fa-arrow-right text-xs group-hover/btn:translate-x-2 transition-transform"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-20 p-12 bg-indigo-600 rounded-[3rem] text-white text-center relative overflow-hidden group">
         <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
         <h3 className="text-3xl font-bold mb-4 relative z-10">Have a custom project?</h3>
         <p className="text-indigo-100 mb-8 max-w-lg mx-auto relative z-10">
           I'm currently accepting new freelance projects and collaborations. Let's turn your vision into reality.
         </p>
         <button className="px-10 py-4 bg-white text-indigo-600 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all relative z-10">
           Start a Conversation
         </button>
      </div>
    </div>
  );
};

export default Works;
