import React from "react";
import { User, Key, Database, Sparkles, BookOpen, Briefcase, Eye } from "lucide-react";

interface NavbarProps {
  currentView: "public" | "cms";
  setView: (view: "public" | "cms") => void;
  geminiActive: boolean;
}

export default function Navbar({ currentView, setView, geminiActive }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo / Brand Name */}
        <div 
          onClick={() => setView("public")}
          className="flex cursor-pointer items-center gap-2"
          id="logo-brand"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-white">
            <User className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-base font-bold tracking-tight text-stone-900">
              folio<span className="text-stone-500">.cms</span>
            </span>
            <span className="font-mono text-[10px] text-stone-400">owner workspace</span>
          </div>
        </div>

        {/* Action Toggle Toggles */}
        <div className="flex items-center gap-3" id="nav-actions">
          {/* Gemini API Status Badge */}
          <div 
            className={`hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium sm:flex ${
              geminiActive 
                ? "bg-purple-50 text-purple-700 border border-purple-200" 
                : "bg-stone-100 text-stone-500 border border-stone-200"
            }`}
            title={geminiActive ? "AI Assistants ready!" : "Define process.env.GEMINI_API_KEY in Secrets."}
            id="gemini-badge"
          >
            <Sparkles className={`h-3 w-3 ${geminiActive ? "animate-pulse" : ""}`} />
            {geminiActive ? "Gemini AI Live" : "AI Inactive"}
          </div>

          {/* View Toggles */}
          <div className="flex items-center gap-1 rounded-xl bg-stone-100 p-1 border border-stone-200" id="view-toggle-container">
            <button
              id="view-public-btn"
              onClick={() => setView("public")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                currentView === "public"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-950"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Public Site</span>
            </button>

            <button
              id="view-cms-btn"
              onClick={() => setView("cms")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                currentView === "cms"
                  ? "bg-stone-900 text-white shadow-sm"
                  : "text-stone-500 hover:text-stone-950"
              }`}
            >
              <Key className="h-3.5 w-3.5" />
              <span>Akash's Portal</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
