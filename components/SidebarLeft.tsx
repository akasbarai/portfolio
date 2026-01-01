
import React from 'react';

const SidebarLeft: React.FC = () => {
  return (
    <aside className="w-full lg:h-full bg-white rounded-3xl p-8 shadow-xl text-center overflow-y-auto no-scrollbar transition-all duration-300 hover:shadow-2xl flex flex-col">
      <div className="relative group shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" 
          alt="Profile" 
          className="w-32 h-32 lg:w-36 lg:h-36 rounded-2xl mx-auto object-cover mb-6 shadow-md transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute -bottom-2 right-1/2 translate-x-12 bg-green-500 text-white text-[10px] px-3 py-1 rounded-full animate-pulse shadow-lg font-bold border-2 border-white">
          HIRE ME
        </div>
      </div>
      
      <div className="shrink-0">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Akash P. Barai</h1>
        <p className="bg-indigo-50 text-indigo-600 px-4 py-1 rounded-lg text-sm font-medium inline-block mb-6">
          Full-Stack Enthusiast
        </p>
      </div>

      <div className="flex justify-center gap-3 mb-6 shrink-0">
        {[
          { icon: 'fa-facebook-f', link: 'https://facebook.com' },
          { icon: 'fa-github', link: 'https://github.com' },
          { icon: 'fa-linkedin-in', link: 'https://linkedin.com' },
          { icon: 'fa-twitter', link: 'https://twitter.com' }
        ].map((social, idx) => (
          <a 
            key={idx}
            href={social.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-indigo-600 hover:text-white transition-all duration-300"
          >
            <i className={`fab ${social.icon} text-sm`}></i>
          </a>
        ))}
      </div>

      <div className="space-y-4 text-left border-t border-slate-100 pt-6 flex-1">
        <ContactItem icon="fa-phone" label="Phone" value="+977 9797688358" />
        <ContactItem icon="fa-envelope" label="Email" value="akasbarai560@gmail.com" />
        <ContactItem icon="fa-map-marker-alt" label="Location" value="Rohini, Rupandehi, Nepal" />
        <ContactItem icon="fa-university" label="Institute" value="Bhairahawa Multiple Campus" />
      </div>

      <div className="pt-6 shrink-0 mt-auto">
        <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200 active:scale-95 transition-all text-sm">
          <i className="fas fa-download"></i>
          Get My Resume
        </button>
      </div>
    </aside>
  );
};

const ContactItem: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 group">
    <div className="w-9 h-9 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
      <i className={`fas ${icon} text-xs`}></i>
    </div>
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold leading-none mb-1">{label}</p>
      <p className="text-sm text-slate-700 font-medium truncate w-36" title={value}>{value}</p>
    </div>
  </div>
);

export default SidebarLeft;
