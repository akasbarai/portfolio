
import React from 'react';
import SectionHeader from '../components/SectionHeader';
import { EDUCATION, EXPERIENCE, SKILLS } from '../constants';

const Resume: React.FC = () => {
  return (
    <div className="pb-10">
      <section className="mb-20">
        <SectionHeader title="Academic Journey" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-100 -translate-x-1/2"></div>
          
          <div className="space-y-12">
            {EDUCATION.map(item => <TimelineCard key={item.id} item={item} />)}
          </div>

          <div className="space-y-12">
            <h4 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3 md:hidden">
               Professional Path
            </h4>
            {EXPERIENCE.map(item => <TimelineCard key={item.id} item={item} />)}
          </div>
        </div>
      </section>

      <section className="mb-20">
        <SectionHeader title="Technical Stack" />
        <p className="text-slate-500 mb-10 max-w-2xl leading-relaxed">
          I've spent years honing my skills across the full stack, from pixel-perfect frontend implementations to robust server-side logic and cloud infrastructure.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {SKILLS.map((skill, idx) => (
            <div 
              key={idx} 
              className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-indigo-50 text-indigo-600 text-4xl mb-4 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl transition-all duration-500">
                <i className={`fab ${skill.icon}`}></i>
              </div>
              <p className="font-bold text-slate-700 text-sm tracking-tight">{skill.name}</p>
              <div className="mt-4 w-full h-1 bg-slate-50 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 w-[85%] group-hover:w-full transition-all duration-1000"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Certifications" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <CertificationCard 
            title="Full Stack Web Development" 
            issuer="Coursera / Meta"
            date="2023"
          />
          <CertificationCard 
            title="Google Cloud Digital Leader" 
            issuer="Google"
            date="2024"
          />
        </div>
      </section>
    </div>
  );
};

const TimelineCard: React.FC<{ item: any }> = ({ item }) => (
  <div className="relative pl-10 group">
    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-white bg-indigo-600 group-hover:scale-125 transition-transform z-10 shadow-md shadow-indigo-200"></div>
    <div className="mb-2 inline-block px-3 py-1 bg-indigo-50 text-indigo-600 font-bold text-[10px] uppercase tracking-widest rounded-full">{item.date}</div>
    <h5 className="text-xl font-bold text-slate-800 mb-1 leading-tight">{item.title}</h5>
    <p className="text-indigo-400 font-semibold text-xs mb-4 uppercase tracking-wide flex items-center gap-2">
      <i className="fas fa-university opacity-50"></i> {item.organization}
    </p>
    <p className="text-slate-500 text-sm leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 group-hover:bg-white group-hover:border-indigo-100 transition-colors">
      {item.description}
    </p>
  </div>
);

const CertificationCard: React.FC<{ title: string; issuer: string; date: string }> = ({ title, issuer, date }) => (
  <div className="flex items-center gap-4 p-6 bg-white border border-slate-100 rounded-3xl hover:shadow-lg transition-all">
    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
      <i className="fas fa-award text-2xl"></i>
    </div>
    <div>
      <h6 className="font-bold text-slate-800 text-sm">{title}</h6>
      <p className="text-xs text-slate-400">{issuer} • {date}</p>
    </div>
  </div>
);

export default Resume;
