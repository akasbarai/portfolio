
import React from 'react';

const SectionHeader: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="mb-10 relative">
      <h3 className="text-3xl font-bold text-slate-800 pb-4 inline-block relative z-10">
        {title}
        <span className="absolute bottom-0 left-0 w-12 h-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></span>
      </h3>
      <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100 -z-10"></div>
    </div>
  );
};

export default SectionHeader;
