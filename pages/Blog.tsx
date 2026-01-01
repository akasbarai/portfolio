
import React from 'react';
import SectionHeader from '../components/SectionHeader';
import { BLOGS } from '../constants';

const Blog: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionHeader title="Insights & Articles" />
      <div className="grid grid-cols-1 gap-10">
        {BLOGS.map((post) => (
          <article 
            key={post.id} 
            className="flex flex-col md:flex-row gap-8 items-start p-6 bg-white border border-slate-50 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="w-full md:w-64 h-48 bg-slate-100 rounded-3xl shrink-0 overflow-hidden flex items-center justify-center">
              <img 
                src={`https://picsum.photos/seed/${post.id}/800/600`} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
              />
            </div>
            <div className="flex-1 py-2">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">Tech</span>
                <span className="text-slate-400 text-xs font-medium">{post.date}</span>
              </div>
              <h4 className="text-2xl font-bold text-slate-800 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">
                {post.title}
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-tighter hover:text-indigo-600">
                Read Full Story <i className="fas fa-chevron-right text-[10px]"></i>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog;
