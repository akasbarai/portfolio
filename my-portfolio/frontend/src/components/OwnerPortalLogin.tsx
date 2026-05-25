import React, { useState } from "react";
import { Lock, Unlock, Eye, EyeOff, ShieldAlert, KeyRound, Mail, ArrowLeft } from "lucide-react";

interface OwnerPortalLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export default function OwnerPortalLogin({ onLoginSuccess, onCancel }: OwnerPortalLoginProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please input the owner passcode.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Try again.");
      }

      // Store in session storage
      sessionStorage.setItem("owner_token", data.token);
      onLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error verifying credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 bg-[#EBF2FA]" id="owner-auth-container">
      <div 
        className="w-full max-w-md bg-[#EBF2FA] rounded-[32px] p-8 shadow-neu-out border border-white/70 relative transition-transform duration-300"
        id="owner-auth-card"
      >
        {/* Cancel/Back Navigation link */}
        <button
          onClick={onCancel}
          className="absolute top-6 left-6 p-2 rounded-full bg-[#EBF2FA] shadow-neu-out-sm border border-white/60 hover:shadow-neu-in text-stone-500 hover:text-stone-900 transition-all duration-200"
          title="Return to Public Portfolio"
          id="auth-back-btn"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        {/* Security Shield Visual */}
        <div className="flex flex-col items-center text-center mt-6 mb-8">
          <div className="w-16 h-16 rounded-full bg-[#EBF2FA] shadow-neu-out border border-white flex items-center justify-center mb-4 text-teal-600 relative">
            <div className={`absolute inset-0 rounded-full border-2 border-dashed border-teal-400/40 ${loading ? "animate-spin" : ""}`} />
            {loading ? (
              <KeyRound className="h-6 w-6 text-teal-600" />
            ) : (
              <Lock className="h-6 w-6 text-teal-600 animate-pulse" />
            )}
          </div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900 font-sans">
            Akash's Portal
          </h1>
          <p className="text-[10px] tracking-wider uppercase font-mono font-bold text-teal-700 mt-1">
            Owner Authentication Gateway
          </p>
          <p className="text-xs text-stone-400 mt-2.5 max-w-xs leading-relaxed">
            Enter your strong administrative passcode to unlock database write permissions, draft edits, and server-side Gemini assistants.
          </p>
        </div>

        {/* Identity Badge */}
        <div 
          className="mb-6 p-3.5 rounded-2xl bg-stone-100/40 border border-white shadow-neu-in flex items-center gap-3" 
          id="identity-badge"
        >
          <div className="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-md">
            <Mail className="h-4 w-4 text-[#EBF2FA]" />
          </div>
          <div className="text-left leading-tight">
            <p className="text-[9px] uppercase font-mono font-bold text-stone-400">Authorized Administrator</p>
            <p className="text-xs font-bold text-stone-850">akasbarai560@gmail.com</p>
          </div>
          <span className="ml-auto w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
        </div>

        {/* Auth Error Display */}
        {error && (
          <div 
            className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200/50 text-red-700 text-xs font-semibold flex items-start gap-2.5 shadow-neu-in-sm animate-in fade-in duration-200"
            id="auth-error-display"
          >
            <ShieldAlert className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
            <span className="leading-normal">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5" id="auth-form">
          <div id="password-input-group">
            <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-stone-400 mb-2">
              Supreme Portal Passcode
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter owner passcode"
                className="w-full text-xs px-4 py-3 rounded-2xl bg-[#EBF2FA] border border-stone-200 shadow-neu-in focus:outline-none focus:border-teal-400 text-stone-800 pr-12 font-mono font-bold placeholder-stone-300"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition"
                title={showPassword ? "Hide passcode" : "Reveal passcode"}
                id="toggle-reveal-pass-btn"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Prompt/Guide */}
          <div className="text-[10px] leading-tight text-center text-stone-400 p-2 border border-dashed border-stone-200/60 rounded-xl bg-stone-100/20 shadow-neu-in-sm">
            <span className="font-bold font-mono">Secure setup:</span>
            <span className="font-mono ml-1 text-stone-500">Use the OWNER_PORTAL_PASSWORD configured in your local environment.</span>
          </div>

          {/* Action Trigger Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs tracking-wider border border-teal-500 hover:border-teal-600 shadow-neu-out hover:scale-[1.01] active:scale-98 active:shadow-neu-in disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
            id="auth-submit-btn"
          >
            {loading ? (
              <>
                <Unlock className="h-4 w-4 animate-bounce" />
                <span>Unlocking Systems...</span>
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4" />
                <span>Unlock Akash's Portal</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
