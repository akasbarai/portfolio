import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  Compass, 
  LogOut, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  Clock3, 
  AlertCircle,
  HelpCircle,
  Lock,
  Mail
} from "lucide-react";
import { AstrologyUser, AstrologyConsultation } from "../types";
import { convertAdToBs, convertBsToAd, NEPALI_MONTHS } from "../utils/dateConverter";

// Standard Rasi List
const RASI_LIST = [
  "Mesh (Aries)",
  "Vrishabh (Taurus)",
  "Mithun (Gemini)",
  "Kark (Cancer)",
  "Simha (Leo)",
  "Kanya (Virgo)",
  "Tula (Libra)",
  "Vrishchik (Scorpio)",
  "Dhanu (Sagittarius)",
  "Makar (Capricorn)",
  "Kumbh (Aquarius)",
  "Meen (Pisces)",
  "Don't Know / Calculate For Me"
];

const GREGORIAN_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const SUGGESTED_QUESTIONS = [
  "What do my planetary alignments suggest about my current career progression?",
  "What guidance do the nakshatras offer regarding my inner focus & creativity?",
  "Can you analyze my current transit period for health and personal wellness?",
  "Which astrological configurations should I cultivate to optimize my growth?"
];

const ASTRO_USER_SESSION_KEY = "astro_user_session";
const ASTRO_TOKEN_KEY = "astro_session_token";

interface AstrologyPortalProps {
  onClose?: () => void;
}

export default function AstrologyPortal({ onClose }: AstrologyPortalProps) {
  const [mode, setMode] = useState<"login" | "register" | "dashboard">("login");
  
  // Registration Form Fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  
  // Dynamic synchronized birthdates (AD + BS)
  const [regType, setRegType] = useState<"AD" | "BS">("AD");
  const [regDateAd, setRegDateAd] = useState("");
  const [regYearAd, setRegYearAd] = useState<number | "">("");
  const [regMonthAd, setRegMonthAd] = useState<number>(1);
  const [regDayAd, setRegDayAd] = useState<number>(1);
  const [regYearBs, setRegYearBs] = useState<number | "">("");
  const [regMonthBs, setRegMonthBs] = useState<number>(1);
  const [regDayBs, setRegDayBs] = useState<number>(1);
  
  const [regTime, setRegTime] = useState("");
  const [regPlace, setRegPlace] = useState("");
  const [regRasi, setRegRasi] = useState("Don't Know / Calculate For Me");

  // Login Form Fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginType, setLoginType] = useState<"AD" | "BS">("AD");
  const [loginDateAd, setLoginDateAd] = useState("");
  const [loginYearAd, setLoginYearAd] = useState<number | "">("");
  const [loginMonthAd, setLoginMonthAd] = useState<number>(1);
  const [loginDayAd, setLoginDayAd] = useState<number>(1);
  const [loginYearBs, setLoginYearBs] = useState<number | "">("");
  const [loginMonthBs, setLoginMonthBs] = useState<number>(1);
  const [loginDayBs, setLoginDayBs] = useState<number>(1);

  // Synced updates for registration form
  const handleRegAdFieldsChange = (y: number | "", m: number, d: number) => {
    setRegYearAd(y);
    setRegMonthAd(m);
    setRegDayAd(d);

    if (y && y >= 1943 && y <= 2034) {
      const adStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      setRegDateAd(adStr);
      const res = convertAdToBs(adStr);
      if (res) {
        setRegYearBs(res.yearBs);
        setRegMonthBs(res.monthBs);
        setRegDayBs(res.dayBs);
      }
    } else {
      setRegDateAd("");
      setRegYearBs("");
    }
  };

  const handleRegBsChange = (y: number | "", m: number, d: number) => {
    setRegYearBs(y);
    setRegMonthBs(m);
    setRegDayBs(d);
    
    if (y && y >= 2000 && y <= 2090) {
      const res = convertBsToAd(y, m, d);
      if (res) {
        setRegDateAd(res.adStr);
        setRegYearAd(res.yearAd);
        setRegMonthAd(res.monthAd);
        setRegDayAd(res.dayAd);
      }
    } else {
      setRegDateAd("");
      setRegYearAd("");
    }
  };

  // Synced updates for login form
  const handleLoginAdFieldsChange = (y: number | "", m: number, d: number) => {
    setLoginYearAd(y);
    setLoginMonthAd(m);
    setLoginDayAd(d);

    if (y && y >= 1943 && y <= 2034) {
      const adStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      setLoginDateAd(adStr);
      const res = convertAdToBs(adStr);
      if (res) {
        setLoginYearBs(res.yearBs);
        setLoginMonthBs(res.monthBs);
        setLoginDayBs(res.dayBs);
      }
    } else {
      setLoginDateAd("");
      setLoginYearBs("");
    }
  };

  const handleLoginBsChange = (y: number | "", m: number, d: number) => {
    setLoginYearBs(y);
    setLoginMonthBs(m);
    setLoginDayBs(d);
    
    if (y && y >= 2000 && y <= 2090) {
      const res = convertBsToAd(y, m, d);
      if (res) {
        setLoginDateAd(res.adStr);
        setLoginYearAd(res.yearAd);
        setLoginMonthAd(res.monthAd);
        setLoginDayAd(res.dayAd);
      }
    } else {
      setLoginDateAd("");
      setLoginYearAd("");
    }
  };

  // Common UI State
  const [currentUser, setCurrentUser] = useState<AstrologyUser | null>(null);
  const [loaddraft, setLoaddraft] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [successText, setSuccessText] = useState<string | null>(null);

  // Consulting Chat Workspace State
  const [question, setQuestion] = useState("");
  const [consulting, setConsulting] = useState(false);
  const [expandedConsultation, setExpandedConsultation] = useState<string | null>(null);

  // Check localStorage for session active on mount
  useEffect(() => {
    const saved = localStorage.getItem(ASTRO_USER_SESSION_KEY);
    const token = localStorage.getItem(ASTRO_TOKEN_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AstrologyUser;
        setCurrentUser(parsed);
        setMode("dashboard");
      } catch (e) {
        localStorage.removeItem(ASTRO_USER_SESSION_KEY);
        localStorage.removeItem(ASTRO_TOKEN_KEY);
      }
    }

    if (token) {
      fetch("/api/astrology/me", {
        headers: { "x-astrology-token": token }
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Session expired");
          const json = await res.json();
          setCurrentUser(json.user);
          setMode("dashboard");
          localStorage.setItem(ASTRO_USER_SESSION_KEY, JSON.stringify(json.user));
        })
        .catch(() => {
          localStorage.removeItem(ASTRO_USER_SESSION_KEY);
          localStorage.removeItem(ASTRO_TOKEN_KEY);
          setCurrentUser(null);
          setMode("login");
        });
    }
  }, []);

  // Soft refresh state from db for verified flag updates
  const handleReloadProfileStat = async (_userId: string) => {
    try {
      setLoaddraft(true);
      setErrorText(null);
      const token = localStorage.getItem(ASTRO_TOKEN_KEY);
      if (currentUser && token) {
        const res = await fetch("/api/astrology/me", {
          headers: { "x-astrology-token": token }
        });
        if (res.ok) {
          const json = await res.json();
          setCurrentUser(json.user);
          localStorage.setItem(ASTRO_USER_SESSION_KEY, JSON.stringify(json.user));
          setSuccessText("Cosmic alignments successfully re-calculated.");
          setTimeout(() => setSuccessText(null), 3000);
        } else {
          throw new Error("Could not fetch profile update.");
        }
      } else {
        throw new Error("Missing session token.");
      }
    } catch (err) {
      setErrorText("Could not connect to servers. Ask Akash to verify service.");
    } finally {
      setLoaddraft(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);
    setSuccessText(null);

    const finalBirthdateBs = regYearBs && regMonthBs && regDayBs 
      ? `${regYearBs}-${String(regMonthBs).padStart(2, "0")}-${String(regDayBs).padStart(2, "0")} BS` 
      : "";

    if (!regName || !regEmail || !regPassword || !regDateAd || !regTime || !regPlace) {
      setErrorText("Please complete all required parameters, including Name, Gmail, Password, and valid Date of Birth (AD or BS).");
      return;
    }

    try {
      setLoaddraft(true);
      const res = await fetch("/api/astrology/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          password: regPassword,
          birthdate: regDateAd,
          birthdateAd: regDateAd,
          birthdateBs: finalBirthdateBs,
          birthtime: regTime,
          birthplace: regPlace.trim(),
          rasi: regRasi
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not register details.");
      }

      setSuccessText("Account created successfully. Your profile is pending Akash's verification.");
      
      // Auto transition to Sign In form with registration parameters pre-filled
      setLoginEmail(regEmail);
      setLoginPassword(regPassword);
      setLoginDateAd(regDateAd);
      if (regYearAd) {
        setLoginYearAd(regYearAd);
        setLoginMonthAd(regMonthAd);
        setLoginDayAd(regDayAd);
      }
      if (regYearBs) {
        setLoginYearBs(regYearBs);
        setLoginMonthBs(regMonthBs);
        setLoginDayBs(regDayBs);
      }
      setLoginType(regType);
      setMode("login");
      
      // Reset registration values
      setRegName("");
      setRegEmail("");
      setRegPassword("");
      setRegType("AD");
      setRegDateAd("");
      setRegYearAd("");
      setRegMonthAd(1);
      setRegDayAd(1);
      setRegYearBs("");
      setRegMonthBs(1);
      setRegDayBs(1);
      setRegTime("");
      setRegPlace("");
      setRegRasi("Don't Know / Calculate For Me");
    } catch (err: any) {
      setErrorText(err.message || "Celestial registration failed.");
    } finally {
      setLoaddraft(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);
    setSuccessText(null);

    const finalLoginDate = loginType === "AD" 
      ? loginDateAd
      : (loginYearBs && loginMonthBs && loginDayBs ? `${loginYearBs}-${String(loginMonthBs).padStart(2, "0")}-${String(loginDayBs).padStart(2, "0")} BS` : "");

    if (!loginEmail || !finalLoginDate || !loginPassword) {
      setErrorText("Please provide your Gmail (Email), Birth Date, and Password.");
      return;
    }

    try {
      setLoaddraft(true);
      const res = await fetch("/api/astrology/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail.trim(),
          birthdate: finalLoginDate,
          password: loginPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Profile credentials do not match.");
      }

      setCurrentUser(data.user);
      localStorage.setItem(ASTRO_USER_SESSION_KEY, JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem(ASTRO_TOKEN_KEY, data.token);
      }
      setMode("dashboard");
      setLoginEmail("");
      setLoginPassword("");
      setLoginDateAd("");
      setLoginYearAd("");
      setLoginMonthAd(1);
      setLoginDayAd(1);
      setLoginYearBs("");
      setLoginMonthBs(1);
      setLoginDayBs(1);
    } catch (err: any) {
      setErrorText(err.message || "Signing in failed.");
    } finally {
      setLoaddraft(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem(ASTRO_USER_SESSION_KEY);
    localStorage.removeItem(ASTRO_TOKEN_KEY);
    setCurrentUser(null);
    setMode("login");
  };

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !question.trim()) return;

    setErrorText(null);
    setSuccessText(null);
    try {
      setConsulting(true);
      const res = await fetch("/api/astrology/consult", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-astrology-token": localStorage.getItem(ASTRO_TOKEN_KEY) || ""
        },
        body: JSON.stringify({ question: question.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit astrological query.");
      }

      setCurrentUser(data.user);
      localStorage.setItem(ASTRO_USER_SESSION_KEY, JSON.stringify(data.user));
      setQuestion("");
      
      // Expand the latest consultation item automatically
      if (data.consultation) {
        setExpandedConsultation(data.consultation.id);
      }
      setSuccessText("A new cosmic consultation has been recorded.");
      setTimeout(() => setSuccessText(null), 3500);
    } catch (err: any) {
      setErrorText(err.message || "Error channelling stellar channels.");
    } finally {
      setConsulting(false);
    }
  };

  return (
    <div className="bg-[#EBF2FA] rounded-2xl p-5 sm:p-7 shadow-neu-out border border-white/60 text-stone-700" id="astrology-portal-wrapper">
      
      {/* Title block */}
      <div className="flex items-center justify-between border-b border-stone-250/30 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-purple-500 to-indigo-600 rounded-2xl text-white shadow-md animate-pulse">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#111827] uppercase tracking-wider">Astrologer & Celestial Finder Portal</h3>
            <p className="text-[10px] text-stone-400 mt-0.5">Vedic pattern computations, predictive cosmic readings, and owner-verified spiritual mentoring.</p>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="px-3 py-1 text-[10px] font-bold font-mono tracking-wider bg-stone-100 hover:bg-stone-200 border border-stone-200/50 rounded-xl text-stone-500"
          >
            Back to Services
          </button>
        )}
      </div>

      {/* Global Notice Status Banners */}
      {errorText && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3 shadow-neu-out-sm font-medium animate-shake">
          <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
          <span>{errorText}</span>
        </div>
      )}

      {successText && (
        <div className="mb-4 p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-3 shadow-neu-out-sm font-medium animate-pulse">
          <CheckCircle className="h-4 w-4 text-teal-500 shrink-0" />
          <span>{successText}</span>
        </div>
      )}

      {/* RENDER ACTIVE MODE */}
      {mode === "login" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="text-center max-w-md mx-auto">
            <p className="text-[11px] uppercase tracking-wide font-mono text-stone-400 font-bold mb-1">Access Cosmic Space</p>
            <h4 className="text-lg font-black text-stone-850">Sign In to Your Celestial Account</h4>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              If you have already submitted your cosmic birth configurations, sign in below with your Gmail, Birth Date, and Password.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="max-w-md mx-auto space-y-4 bg-white/40 p-6 rounded-2xl border border-white/50 shadow-neu-out col-span-1">
            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-1 font-bold">Your Registered Gmail (Email)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Mail className="h-3.5 w-3.5" />
                </span>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. seeker@gmail.com"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-[#EBF2FA] border border-stone-200 focus:outline-none focus:border-purple-400 shadow-neu-in text-stone-750 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-1 font-bold">Your Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Lock className="h-3.5 w-3.5" />
                </span>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-[#EBF2FA] border border-stone-200 focus:outline-none focus:border-purple-400 shadow-neu-in text-stone-750 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 font-bold">Date of Birth</label>
                <div className="flex bg-[#EBF2FA]/80 p-0.5 rounded-lg border border-stone-200 shadow-neu-in-sm">
                  <button
                    type="button"
                    onClick={() => setLoginType("AD")}
                    className={`px-2 py-0.5 text-[9px] uppercase font-mono tracking-wider font-bold rounded-md transition ${
                      loginType === "AD" 
                        ? "bg-white text-indigo-600 shadow-sm border border-stone-100" 
                        : "text-stone-400 hover:text-stone-700"
                    }`}
                  >
                    AD
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginType("BS")}
                    className={`px-2 py-0.5 text-[9px] uppercase font-mono tracking-wider font-bold rounded-md transition ${
                      loginType === "BS" 
                        ? "bg-white text-purple-600 shadow-sm border border-stone-100" 
                        : "text-stone-400 hover:text-stone-700"
                    }`}
                  >
                    BS
                  </button>
                </div>
              </div>

              {loginType === "AD" ? (
                <div className="grid grid-cols-3 gap-2 animate-in fade-in duration-155">
                  <div>
                    <select
                      value={loginDayAd}
                      onChange={(e) => {
                        handleLoginAdFieldsChange(loginYearAd, loginMonthAd, parseInt(e.target.value, 10));
                      }}
                      className="w-full text-center text-xs px-1 py-2.5 rounded-xl bg-[#EBF2FA] border border-stone-200 focus:outline-none focus:border-purple-400 shadow-neu-in text-stone-750 font-medium"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      value={loginMonthAd}
                      onChange={(e) => {
                        handleLoginAdFieldsChange(loginYearAd, parseInt(e.target.value, 10), loginDayAd);
                      }}
                      className="w-full text-center text-xs px-1 py-2.5 rounded-xl bg-[#EBF2FA] border border-stone-200 focus:outline-none focus:border-purple-400 shadow-neu-in text-stone-750 font-medium"
                    >
                      {GREGORIAN_MONTHS.map((name, idx) => (
                        <option key={idx} value={idx + 1}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Year"
                      value={loginYearAd}
                      min={1943}
                      max={2034}
                      required
                      onChange={(e) => {
                        const yr = e.target.value === "" ? "" : parseInt(e.target.value, 10);
                        handleLoginAdFieldsChange(yr, loginMonthAd, loginDayAd);
                      }}
                      className="w-full text-center text-xs px-1 py-2.5 rounded-xl bg-[#EBF2FA] border border-stone-200 focus:outline-none focus:border-purple-400 shadow-neu-in text-stone-750 font-medium"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 animate-in fade-in duration-155">
                  <div>
                    <input
                      type="number"
                      placeholder="Year"
                      value={loginYearBs}
                      min={2000}
                      max={2090}
                      required
                      onChange={(e) => {
                        const yr = e.target.value === "" ? "" : parseInt(e.target.value, 10);
                        handleLoginBsChange(yr, loginMonthBs, loginDayBs);
                      }}
                      className="w-full text-center text-xs px-1 py-2.5 rounded-xl bg-[#EBF2FA] border border-stone-200 focus:outline-none focus:border-purple-400 shadow-neu-in text-stone-750 font-medium"
                    />
                  </div>
                  <div>
                    <select
                      value={loginMonthBs}
                      onChange={(e) => {
                        handleLoginBsChange(loginYearBs, parseInt(e.target.value, 10), loginDayBs);
                      }}
                      className="w-full text-center text-xs px-1 py-2.5 rounded-xl bg-[#EBF2FA] border border-stone-200 focus:outline-none focus:border-purple-400 shadow-neu-in text-stone-750 font-medium"
                    >
                      {NEPALI_MONTHS.map((name, idx) => (
                        <option key={idx} value={idx + 1}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      value={loginDayBs}
                      onChange={(e) => {
                        handleLoginBsChange(loginYearBs, loginMonthBs, parseInt(e.target.value, 10));
                      }}
                      className="w-full text-center text-xs px-1 py-2.5 rounded-xl bg-[#EBF2FA] border border-stone-200 focus:outline-none focus:border-purple-400 shadow-neu-in text-stone-750 font-medium"
                    >
                      {Array.from({ length: 32 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              
              {/* Sync check display */}
              <p className="text-[9px] text-stone-400 font-mono mt-1 w-full text-right italic select-none">
                {loginDateAd && loginYearBs ? `Synced: ${loginDateAd} AD ⇄ ${loginYearBs}-${String(loginMonthBs).padStart(2, "0")}-${String(loginDayBs).padStart(2, "0")} BS` : "Specify birth date above..."}
              </p>
            </div>

            <button
              type="submit"
              disabled={loaddraft}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold leading-wide tracking-wide shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{loaddraft ? "Opening Astro Pathways..." : "Access Cosmic Profile"}</span>
            </button>
          </form>

          <div className="text-center">
            <p className="text-xs text-stone-500">
              New seeker?{" "}
              <button 
                onClick={() => setMode("register")}
                className="text-purple-600 font-bold hover:underline"
              >
                Submit your birth configurations here to register & verify
              </button>
            </p>
          </div>
        </div>
      )}

      {mode === "register" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="text-center max-w-md mx-auto">
            <p className="text-[11px] uppercase tracking-wide font-mono text-stone-400 font-bold mb-1">Celestial Setup</p>
            <h4 className="text-lg font-black text-stone-850">Register Your Birth Configurations</h4>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              We translate date coordinates, exact time, and latitudes into Vedic houses system charts. Registrations are vetted and authenticated by Akash Prasad Barai.
            </p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="max-w-xl mx-auto bg-white/40 p-6 rounded-2xl border border-white/50 shadow-neu-out grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-1 font-bold">Your Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <User className="h-3.5 w-3.5" />
                </span>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-[#EBF2FA] border border-stone-200 focus:outline-none focus:border-purple-400 shadow-neu-in text-stone-750 font-medium"
                />
              </div>
            </div>

            <div className="md:col-span-1">
              <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-1 font-bold">Gmail (Email Address)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Mail className="h-3.5 w-3.5" />
                </span>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. seeker@gmail.com"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-[#EBF2FA] border border-stone-200 focus:outline-none focus:border-purple-400 shadow-neu-in text-stone-750 font-medium"
                />
              </div>
            </div>

            <div className="md:col-span-1">
              <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-1 font-bold">Choose Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Lock className="h-3.5 w-3.5" />
                </span>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-[#EBF2FA] border border-stone-200 focus:outline-none focus:border-purple-400 shadow-neu-in text-stone-750 font-medium"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 font-bold">Date of Birth</label>
                <div className="flex bg-[#EBF2FA]/80 p-0.5 rounded-lg border border-stone-200 shadow-neu-in-sm">
                  <button
                    type="button"
                    onClick={() => setRegType("AD")}
                    className={`px-2 py-0.5 text-[9px] uppercase font-mono tracking-wider font-bold rounded-md transition ${
                      regType === "AD" 
                        ? "bg-white text-indigo-600 shadow-sm border border-stone-100" 
                        : "text-stone-400 hover:text-stone-700"
                    }`}
                  >
                    AD
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegType("BS")}
                    className={`px-2 py-0.5 text-[9px] uppercase font-mono tracking-wider font-bold rounded-md transition ${
                      regType === "BS" 
                        ? "bg-white text-purple-600 shadow-sm border border-stone-100" 
                        : "text-stone-400 hover:text-stone-700"
                    }`}
                  >
                    BS
                  </button>
                </div>
              </div>

              {regType === "AD" ? (
                <div className="grid grid-cols-3 gap-2 animate-in fade-in duration-155">
                  <div>
                    <select
                      value={regDayAd}
                      onChange={(e) => {
                        handleRegAdFieldsChange(regYearAd, regMonthAd, parseInt(e.target.value, 10));
                      }}
                      className="w-full text-center text-xs px-1 py-2.5 rounded-xl bg-[#EBF2FA] border border-stone-200 focus:outline-none focus:border-purple-400 shadow-neu-in text-stone-750 font-medium"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      value={regMonthAd}
                      onChange={(e) => {
                        handleRegAdFieldsChange(regYearAd, parseInt(e.target.value, 10), regDayAd);
                      }}
                      className="w-full text-center text-xs px-1 py-2.5 rounded-xl bg-[#EBF2FA] border border-stone-200 focus:outline-none focus:border-purple-400 shadow-neu-in text-stone-750 font-medium"
                    >
                      {GREGORIAN_MONTHS.map((name, idx) => (
                        <option key={idx} value={idx + 1}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Year"
                      value={regYearAd}
                      min={1943}
                      max={2034}
                      required
                      onChange={(e) => {
                        const yr = e.target.value === "" ? "" : parseInt(e.target.value, 10);
                        handleRegAdFieldsChange(yr, regMonthAd, regDayAd);
                      }}
                      className="w-full text-center text-xs px-1 py-2.5 rounded-xl bg-[#EBF2FA] border border-stone-200 focus:outline-none focus:border-purple-400 shadow-neu-in text-stone-750 font-medium"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 animate-in fade-in duration-155">
                  <div>
                    <input
                      type="number"
                      placeholder="Year"
                      value={regYearBs}
                      min={2000}
                      max={2090}
                      required
                      onChange={(e) => {
                        const yr = e.target.value === "" ? "" : parseInt(e.target.value, 10);
                        handleRegBsChange(yr, regMonthBs, regDayBs);
                      }}
                      className="w-full text-center text-xs px-1 py-2.5 rounded-xl bg-[#EBF2FA] border border-stone-200 focus:outline-none focus:border-purple-400 shadow-neu-in text-stone-750 font-medium"
                    />
                  </div>
                  <div>
                    <select
                      value={regMonthBs}
                      onChange={(e) => {
                        handleRegBsChange(regYearBs, parseInt(e.target.value, 10), regDayBs);
                      }}
                      className="w-full text-center text-xs px-1 py-2.5 rounded-xl bg-[#EBF2FA] border border-stone-200 focus:outline-none focus:border-purple-400 shadow-neu-in text-stone-750 font-medium"
                    >
                      {NEPALI_MONTHS.map((name, idx) => (
                        <option key={idx} value={idx + 1}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      value={regDayBs}
                      onChange={(e) => {
                        handleRegBsChange(regYearBs, regMonthBs, parseInt(e.target.value, 10));
                      }}
                      className="w-full text-center text-xs px-1 py-2.5 rounded-xl bg-[#EBF2FA] border border-stone-200 focus:outline-none focus:border-purple-400 shadow-neu-in text-stone-750 font-medium"
                    >
                      {Array.from({ length: 32 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Sync check display */}
              <p className="text-[9px] text-stone-400 font-mono mt-1 w-full text-right italic select-none">
                {regDateAd && regYearBs ? `Synced Live: ${regDateAd} AD ⇄ ${regYearBs}-${String(regMonthBs).padStart(2, "0")}-${String(regDayBs).padStart(2, "0")} BS` : "Input Date of Birth in AD or BS above..."}
              </p>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-1 font-bold">Time of Birth</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Clock className="h-3.5 w-3.5" />
                </span>
                <input
                  type="time"
                  required
                  value={regTime}
                  onChange={(e) => setRegTime(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-[#EBF2FA] border border-stone-200 focus:outline-none focus:border-purple-400 shadow-neu-in text-stone-750 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-1 font-bold">Place of Birth (City, Country)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <MapPin className="h-3.5 w-3.5" />
                </span>
                <input
                  type="text"
                  required
                  value={regPlace}
                  onChange={(e) => setRegPlace(e.target.value)}
                  placeholder="e.g. Kathmandu, Nepal"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-[#EBF2FA] border border-stone-200 focus:outline-none focus:border-purple-400 shadow-neu-in text-stone-750 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-1 font-bold">Your Vedic Rasi / Moon Sign (Optional)</label>
              <select
                value={regRasi}
                onChange={(e) => setRegRasi(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-[#EBF2FA] border border-stone-200 focus:outline-none focus:border-purple-400 shadow-neu-in text-stone-750 font-medium"
              >
                {RASI_LIST.map((rasi) => (
                  <option key={rasi} value={rasi}>{rasi}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                disabled={loaddraft}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold leading-wide tracking-wide shadow-md transition disabled:opacity-50"
              >
                {loaddraft ? "Registering Birth Coordinates..." : "Register Birth Chart Configuration"}
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-xs text-stone-500">
              Already registered?{" "}
              <button 
                onClick={() => setMode("login")}
                className="text-indigo-600 font-bold hover:underline"
              >
                Click here parameters key sign-in
              </button>
            </p>
          </div>
        </div>
      )}

      {mode === "dashboard" && currentUser && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-250">
          
          {/* LEFT PART: Astro Identity Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-gradient-to-br from-indigo-900 via-stone-900 to-purple-950 rounded-2xl p-5 border border-purple-900 text-white shadow-lg space-y-4 relative overflow-hidden">
              {/* Subtle background cosmic mesh */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#818cf8,transparent_55%)] opacity-35" />
              
              <div className="relative flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold tracking-wider text-purple-300 uppercase">Seeker Alignment Data</span>
                {currentUser.isVerified ? (
                  <span className="px-2 py-0.5 text-[8px] font-bold font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500 rounded">
                    Verified Seeker
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[8px] font-bold font-mono text-amber-300 bg-amber-950/80 border border-amber-500 rounded animate-pulse">
                    Verification Pending
                  </span>
                )}
              </div>

              <div className="relative space-y-1">
                <p className="text-xs font-mono text-stone-300">Jyotish Chart Seeker</p>
                <h4 className="text-lg font-black tracking-tight">{currentUser.name}</h4>
                {currentUser.email && (
                  <p className="text-[10px] font-mono text-purple-200">{currentUser.email}</p>
                )}
              </div>

              {/* Grid elements */}
              <div className="relative grid grid-cols-2 gap-3 pt-3 border-t border-purple-800/40 text-[10px] font-mono leading-relaxed text-stone-300">
                <div>
                  <p className="text-[8px] text-purple-350 uppercase tracking-widest font-bold">Birth Date (AD)</p>
                  <p className="font-semibold text-white">{currentUser.birthdateAd || currentUser.birthdate}</p>
                </div>
                <div>
                  <p className="text-[8px] text-purple-350 uppercase tracking-widest font-bold">Birth Date (BS)</p>
                  <p className="font-semibold text-[#818cf8]">{currentUser.birthdateBs || "Synced Auto"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[8px] text-purple-350 uppercase tracking-widest font-bold">Birth Time</p>
                  <p className="font-semibold text-white">{currentUser.birthtime}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[8px] text-purple-350 uppercase tracking-widest font-bold">Birth Place</p>
                  <p className="font-semibold text-white break-all">{currentUser.birthplace}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[8px] text-purple-350 uppercase tracking-widest font-bold">Sidereal Rasi</p>
                  <p className="font-semibold text-[#C084FC]">{currentUser.rasi}</p>
                </div>
              </div>

              <div className="relative pt-2">
                <button
                  type="button"
                  onClick={() => handleReloadProfileStat(currentUser.id)}
                  disabled={loaddraft}
                  className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-wider text-purple-200 transition"
                >
                  {loaddraft ? "Synchronizing Grid..." : "Refresh Astro Details"}
                </button>
              </div>
            </div>

            {/* Verification Helper Block */}
            {!currentUser.isVerified && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs shadow-neu-out-sm leading-relaxed space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <Clock3 className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Awaiting Activation Keys</span>
                </div>
                <p className="text-stone-600 text-[11px]">
                  Hello {currentUser.name}! Akash manages physical ledger records and credentials. Ask Akash to verify your account in the Owner's Control center. Once vetted, full consulting options with the AI Guru will unlock!
                </p>
                <div className="bg-amber-100 p-2.5 rounded-xl border border-amber-200 text-[10px] text-amber-900 font-semibold font-mono">
                  Seeding ID: <span className="font-bold">{currentUser.id}</span>
                </div>
              </div>
            )}

            {/* Logout panel action */}
            <button
              onClick={handleSignOut}
              className="w-full py-2.5 rounded-xl bg-white/60 hover:bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-500 hover:text-red-600 shadow-neu-out transition flex items-center justify-center gap-2"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out Seeker Profile</span>
            </button>
          </div>

          {/* RIGHT PART: Consultation chat/Workspace */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* INQUIRY CONSOLE FORM */}
            <div className="bg-white/50 rounded-2xl p-5 border border-white/60 shadow-neu-out space-y-4">
              <div>
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-widest font-mono">Astral Consultant Console</h4>
                <p className="text-[10px] text-stone-400 mt-0.5">Submit spiritual, pathfinding, or celestial inquiries based on your birth constellations.</p>
              </div>

              {currentUser.isVerified ? (
                <form onSubmit={handleConsultSubmit} className="space-y-4">
                  
                  {/* Suggest templates */}
                  <div>
                    <p className="text-[9px] uppercase tracking-wider font-mono text-stone-400 mb-1.5 font-bold">Suggested Inquiry Starters</p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_QUESTIONS.map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setQuestion(q)}
                          className="px-3 py-1.5 bg-[#EBF2FA] hover:bg-stone-50 rounded-xl border border-stone-200/50 text-[10px] text-left text-purple-700 font-semibold max-w-full truncate shadow-neu-out-sm font-medium transition"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input form */}
                  <div className="flex gap-2.5 items-end">
                    <div className="flex-1">
                      <label className="block text-[9px] uppercase font-mono tracking-wider text-stone-400 mb-1 font-bold">Your Inquiry</label>
                      <textarea
                        required
                        rows={2}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="e.g. Please analyze my upcoming transit. How will planetary positions impact my career decisions this summer?"
                        className="w-full text-xs px-4 py-3 rounded-xl bg-[#EBF2FA] border border-stone-200 shadow-neu-in focus:outline-none focus:border-purple-400 text-stone-750 font-medium leading-relaxed resize-none"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={consulting || !question.trim()}
                      className="p-3.5 rounded-xl bg-purple-600 hover:bg-purple-750 text-white shadow-md transition disabled:opacity-50 h-11 flex items-center justify-center"
                      title="Transmit celestial question"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {consulting && (
                    <div className="flex items-center gap-2.5 text-[10px] font-mono text-purple-600 font-bold animate-pulse">
                      <span className="h-2 w-2 rounded-full bg-purple-500 animate-bounce" />
                      <span>Scribing Celestial Calculations from Nakshatra charts... (Calling Server-Side Gemini)</span>
                    </div>
                  )}

                </form>
              ) : (
                <div className="p-5 text-center bg-stone-100/40 rounded-xl border border-stone-200/20 text-stone-500 space-y-2">
                  <HelpCircle className="h-8 w-8 text-stone-300 mx-auto animate-bounce" />
                  <h5 className="text-xs font-bold text-stone-800">Consultation Workspace Locked</h5>
                  <p className="text-[11px] text-stone-500 leading-relaxed max-w-sm mx-auto">
                    Astral questions use the server-side Gemini AI engine. For protection and security on Akash's ledger, consultations unlock as soon as Akash activates your seeker key.
                  </p>
                </div>
              )}
            </div>

            {/* CONSULTATION HISTORY */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-stone-850 uppercase tracking-widest font-mono pl-1">Historical Cosmic Inquiries ({currentUser.consultations?.length || 0})</h4>
              
              {(currentUser.consultations?.length === 0) ? (
                <div className="p-8 text-center text-stone-400 text-xs bg-white/20 rounded-2xl border border-white/50 shadow-neu-in">
                  <p className="font-semibold">Your cosmic archive is currently empty.</p>
                  <p className="text-[10px] text-stone-400 mt-1">Once verified, your completed consultations will be permanently logged here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentUser.consultations?.slice().reverse().map((cons) => {
                    const isExpanded = expandedConsultation === cons.id;
                    return (
                      <div 
                        key={cons.id}
                        className={`bg-[#EBF2FA] rounded-2xl border border-white/50 pr-4 pl-4 transition-all ${
                          isExpanded 
                            ? "shadow-neu-in py-5" 
                            : "shadow-neu-out py-3.5 hover:shadow-neu-in-sm cursor-pointer"
                        }`}
                        onClick={() => !isExpanded && setExpandedConsultation(cons.id)}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 overflow-hidden">
                            <p className="text-[9px] font-mono font-bold text-purple-600 uppercase">Consulted on {new Date(cons.createdAt).toLocaleDateString()}</p>
                            <p className="text-xs font-bold text-stone-800 truncate mt-0.5">
                              "{cons.question}"
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedConsultation(isExpanded ? null : cons.id);
                            }}
                            className="p-1.5 rounded-full bg-white/80 border border-stone-200/50 text-stone-500"
                          >
                            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-stone-200/40 text-xs leading-relaxed space-y-3.5">
                            <div className="bg-purple-50 rounded-xl p-3 border border-purple-150/40 text-[11px] font-semibold text-purple-800">
                              <span className="font-mono text-[9px] uppercase tracking-wider block mb-1 text-purple-400">User Astrological Question:</span>
                              "{cons.question}"
                            </div>
                            
                            <div className="p-4 rounded-xl bg-white/75 border border-white shadow-neu-in text-stone-700 prose prose-indigo max-w-none space-y-3 text-justify">
                              <span className="font-mono text-[9px] uppercase tracking-wider block font-bold text-purple-600 mb-1">Celestial Synthesis Report:</span>
                              {cons.answer.split("\n\n").map((para, pIdx) => {
                                if (para.startsWith("##") || para.startsWith("###")) {
                                  return (
                                    <h5 key={pIdx} className="font-extrabold text-[#111827] text-xs uppercase tracking-wider mt-3">
                                      {para.replace(/#/g, "").trim()}
                                    </h5>
                                  );
                                }
                                if (para.startsWith("-") || para.startsWith("*")) {
                                  return (
                                    <ul key={pIdx} className="list-disc pl-5 my-1 space-y-1">
                                      {para.split("\n").map((li, liIdx) => (
                                        <li key={liIdx}>{li.replace(/^[\s-*]+/, "").trim()}</li>
                                      ))}
                                    </ul>
                                  );
                                }
                                return <p key={pIdx} className="leading-relaxed">{para}</p>;
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
