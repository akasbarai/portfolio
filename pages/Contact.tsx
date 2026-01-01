
import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      <SectionHeader title="Get In Touch" />
      
      {submitted ? (
        <div className="p-12 text-center bg-indigo-50 rounded-[3rem] animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            <i className="fas fa-check"></i>
          </div>
          <h4 className="text-2xl font-bold text-slate-800 mb-2">Message Sent!</h4>
          <p className="text-slate-500">Thanks for reaching out, Akash will get back to you shortly.</p>
          <button 
            onClick={() => setSubmitted(false)}
            className="mt-8 text-indigo-600 font-bold text-sm uppercase underline decoration-2 underline-offset-4"
          >
            Send another message
          </button>
        </div>
      ) : (
        <>
          <p className="text-slate-500 mb-10 text-center">
            Have a project in mind or just want to say hi? Feel free to send a message.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-4">Full Name</label>
                <input 
                  required 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-4">Email Address</label>
                <input 
                  required 
                  type="email" 
                  placeholder="john@example.com" 
                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-4">Message</label>
              <textarea 
                required 
                rows={6} 
                placeholder="How can I help you?" 
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-sm resize-none"
              ></textarea>
            </div>
            <button 
              disabled={isSubmitting}
              className={`w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-[0.98] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner animate-spin"></i> Sending...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i> Send Message
                </>
              )}
            </button>
          </form>
        </>
      )}

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {[
          { icon: 'fa-phone', title: 'Call Me', value: '+977 9797688358' },
          { icon: 'fa-envelope', title: 'Email Me', value: 'Akash@csit.edu' },
          { icon: 'fa-map-marker-alt', title: 'Visit Me', value: 'Lumbini, Nepal' }
        ].map((info, idx) => (
          <div key={idx} className="text-center group">
            <div className="w-12 h-12 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <i className={`fas ${info.icon}`}></i>
            </div>
            <h5 className="font-bold text-slate-800 text-sm mb-1">{info.title}</h5>
            <p className="text-xs text-slate-400 font-medium truncate">{info.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contact;
