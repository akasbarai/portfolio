import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import PortfolioView from "./components/PortfolioView";
import CmsConsole from "./components/CmsConsole";
import NeumorphicDock from "./components/NeumorphicDock";
import OwnerPortalLogin from "./components/OwnerPortalLogin";
import { PortfolioData } from "./types";
import { Sparkles } from "lucide-react";

export default function App() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [currentView, setView] = useState<"public" | "cms">("public");
  const [geminiActive, setGeminiActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(sessionStorage.getItem("owner_token"));
  });

  // --- Data Fetching ---
  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/portfolio");
      if (!res.ok) throw new Error("Failed to load portfolio database.");
      const json = await res.json();
      setPortfolioData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error reloading portfolio.");
    } finally {
      setLoading(false);
    }
  };

  const checkGeminiStatus = async () => {
    try {
      const res = await fetch("/api/gemini/status");
      if (res.ok) {
        const json = await res.json();
        setGeminiActive(json.configured);
      }
    } catch (err) {
      console.warn("Could not retrieve AI Status helper endpoint:", err);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
    checkGeminiStatus();
  }, []);

  useEffect(() => {
    const verifyOwnerSession = async () => {
      const token = sessionStorage.getItem("owner_token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/session", {
          headers: { "x-owner-token": token }
        });
        if (!res.ok) {
          sessionStorage.removeItem("owner_token");
          setIsAuthenticated(false);
        }
      } catch {
        sessionStorage.removeItem("owner_token");
        setIsAuthenticated(false);
      }
    };

    verifyOwnerSession();
  }, []);

  // --- Dynamic SEO Meta Tags Sync in <head> ---
  useEffect(() => {
    if (portfolioData && portfolioData.profile) {
      const seo = portfolioData.profile.seo;
      
      // Update Title tag
      if (seo && seo.metaTitle) {
        document.title = seo.metaTitle;
      } else if (portfolioData.profile.name) {
        document.title = `${portfolioData.profile.name} | Portfolios & CMS Dashboard`;
      }

      // Update Description meta tag
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }
      if (seo && seo.metaDescription) {
        metaDescription.setAttribute("content", seo.metaDescription);
      } else if (portfolioData.profile.bio) {
        metaDescription.setAttribute("content", portfolioData.profile.bio);
      }

      // Update Keywords meta tag
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      if (seo && seo.metaKeywords) {
        metaKeywords.setAttribute("content", seo.metaKeywords);
      } else if (portfolioData.profile.skills) {
        metaKeywords.setAttribute("content", portfolioData.profile.skills.join(", "));
      }
    }
  }, [portfolioData]);

  // --- CMS Submit handlers ---
  const handleSaveData = async (updatedData: PortfolioData) => {
    const token = sessionStorage.getItem("owner_token") || "";
    const res = await fetch("/api/portfolio", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-owner-token": token
      },
      body: JSON.stringify(updatedData)
    });
    if (!res.ok) {
      if (res.status === 401) handleSignOut();
      throw new Error("Could not propagate database updates to server. (Access Denied)");
    }
    setPortfolioData(updatedData);
  };

  const handleResetData = async () => {
    const token = sessionStorage.getItem("owner_token") || "";
    const res = await fetch("/api/portfolio/reset", { 
      method: "POST",
      headers: {
        "x-owner-token": token
      }
    });
    if (!res.ok) {
      if (res.status === 401) handleSignOut();
      throw new Error("Could not send DB reset command. (Access Denied)");
    }
    const json = await res.json();
    setPortfolioData(json.data);
  };

  const handleSignOut = () => {
    sessionStorage.removeItem("owner_token");
    setIsAuthenticated(false);
    setView("public");
  };

  return (
    <div className="bg-[#EBF2FA] min-h-screen flex flex-col justify-between">
      
      {/* Prime Header Navigation */}
      <Navbar currentView={currentView} setView={setView} geminiActive={geminiActive} />

      {/* Loading & Main Panel Sections */}
      <div className="flex-1">
        {loading ? (
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-stone-500">
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-[#EBF2FA] shadow-neu-out border border-white mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-t-teal-500 border-teal-100 animate-spin"></div>
              <Sparkles className="h-8 w-8 text-teal-600 animate-bounce" />
            </div>
            <p className="text-sm font-bold font-mono tracking-wider animate-pulse text-stone-600">Initializing Beautiful Neumorphic Workspace...</p>
            <p className="text-[10px] text-stone-400 mt-1.5 font-semibold">Deploying server side assets and drafting outlines</p>
          </div>
        ) : error ? (
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-[#EBF2FA]">
            <div className="p-4 rounded-3xl bg-red-50 shadow-neu-out border border-red-200 text-red-700 max-w-md">
              <h3 className="font-extrabold text-sm mb-2">Workspace Setup Interrupted</h3>
              <p className="text-xs">{error}</p>
              <button 
                onClick={fetchPortfolioData}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow"
              >
                Retry Loading Portfolio
              </button>
            </div>
          </div>
        ) : portfolioData ? (
          <div className="animate-in fade-in duration-355 slide-in-from-bottom-5">
            {currentView === "public" ? (
              <PortfolioView data={portfolioData} />
            ) : isAuthenticated ? (
              <CmsConsole 
                data={portfolioData} 
                onSave={handleSaveData} 
                onReset={handleResetData}
                onPreview={(previewData) => {
                  setPortfolioData(previewData);
                  setView("public");
                }}
                onSignOut={handleSignOut}
              />
            ) : (
              <OwnerPortalLogin 
                onLoginSuccess={() => setIsAuthenticated(true)} 
                onCancel={() => setView("public")} 
              />
            )}
            <NeumorphicDock currentView={currentView} setView={setView} />
          </div>
        ) : null}
      </div>

      {/* Brand Footer layout */}
      <footer className="border-t border-stone-200/50 bg-[#EBF2FA] py-6 text-center text-[10px] text-stone-400 font-mono font-semibold tracking-wider">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            &copy; {new Date().getFullYear()} {(portfolioData?.profile.name || "Portfolio").toUpperCase()} STUDIO. POWERED BY PREMIUM NEUMORPHIC CMS CONSOLE.
          </div>
          <div className="flex gap-4">
            <span className="text-teal-600">Server-side Gemini secured</span>
            <span className="text-emerald-600">Verified credentials ready</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
