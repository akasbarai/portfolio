
import React from 'react';
import SectionHeader from '../components/SectionHeader';
import { SERVICES } from '../constants';

const About: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <section className="mb-20">
        <SectionHeader title="About Me" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-6 text-slate-600 leading-relaxed">
            <p className="text-xl text-slate-800 font-medium italic border-l-4 border-indigo-600 pl-4 py-2 bg-indigo-50/30 rounded-r-2xl">
              "Building modern solutions with a passion for logic and a heart for design."
            </p>
            <p>
              I am <span className="text-indigo-600 font-bold">Akash Prasad Barai</span>, a tech-driven BSc. CSIT student at Bhairahawa Multiple Campus. My journey in the world of computer science is fueled by curiosity and a relentless drive to solve real-world problems.
            </p>
            <p>
              Beyond coding, I am a storyteller through my camera lens and a continuous learner who believes that technology should be accessible to everyone. I spend my free time exploring new frameworks, reading about AI ethics, and contributing to open-source communities.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <h5 className="text-2xl font-bold text-indigo-600">3.7+</h5>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">GPA Achievement</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <h5 className="text-2xl font-bold text-indigo-600">15+</h5>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Projects Done</p>
              </div>
            </div>
          </div>
          <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden group">
            <i className="fas fa-quote-right absolute -top-4 -right-4 text-white/10 text-8xl transition-transform group-hover:scale-125 duration-700"></i>
            <h4 className="text-lg font-bold mb-4 relative z-10">Core Philosophy</h4>
            <p className="text-sm text-indigo-100 leading-relaxed italic relative z-10">
              "Code is like humor. When you have to explain it, it’s bad. My mission is to write code that speaks for itself through performance and clarity."
            </p>
            <div className="mt-8 flex items-center gap-3">
               <div className="w-10 h-10 rounded-full border-2 border-white/30 p-0.5">
                  <div className="w-full h-full bg-indigo-400 rounded-full flex items-center justify-center">
                    <i className="fas fa-bolt text-xs"></i>
                  </div>
               </div>
               <p className="text-xs font-bold uppercase tracking-tighter">Fast & Efficient</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-20">
        <SectionHeader title="Expertise" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <div 
              key={service.id} 
              className="p-8 bg-white border border-slate-100 rounded-3xl hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all group relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"></div>
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm relative z-10">
                <i className={`fas ${service.icon} text-2xl`}></i>
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-3 relative z-10">{service.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed relative z-10">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="What People Say" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <TestimonialCard 
              name="Suresh Sharma" 
              role="Senior Developer, Local Tech"
              text="Akash is one of the most proactive interns I've worked with. His ability to grasp complex React concepts quickly is impressive."
           />
           <TestimonialCard 
              name="Maria Rodriguez" 
              role="Freelance Client"
              text="Delivered a beautiful landing page ahead of schedule. Highly recommended for his attention to detail and design sense."
           />
        </div>
      </section>
    </div>
  );
};

const TestimonialCard: React.FC<{ name: string; role: string; text: string }> = ({ name, role, text }) => (
  <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] relative">
    <div className="absolute top-8 right-8 text-indigo-200 text-4xl">
      <i className="fas fa-quote-right"></i>
    </div>
    <p className="text-slate-600 italic mb-6 text-sm leading-relaxed">"{text}"</p>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-indigo-600 font-bold">
        {name[0]}
      </div>
      <div>
        <h5 className="font-bold text-slate-800 text-sm">{name}</h5>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{role}</p>
      </div>
    </div>
  </div>
);

export default About;
