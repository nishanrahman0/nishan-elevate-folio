import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Load saved theme colors from localStorage
const savedColors = localStorage.getItem('theme-colors');
if (savedColors) {
  try {
    const colors = JSON.parse(savedColors);
    const root = document.documentElement;
    if (colors.primary) root.style.setProperty('--primary', colors.primary);
    if (colors.secondary) root.style.setProperty('--secondary', colors.secondary);
    if (colors.accent) root.style.setProperty('--accent', colors.accent);
  } catch (e) {
    console.error('Failed to load saved theme:', e);
  }
}

function SplashScreen({ onDone }: { onDone: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 1100);
    const t2 = setTimeout(() => onDone(), 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#05060d] transition-opacity duration-500 overflow-hidden ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      aria-hidden="true"
    >
      {/* Grid floor */}
      <div className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.18) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(circle at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 30%, transparent 75%)",
        }}
      />
      {/* Scanline */}
      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_24px_4px_rgba(34,211,238,0.7)] splash-scan" />

      {/* Core */}
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative w-28 h-28">
          {/* Rotating rings */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 splash-spin-slow shadow-[0_0_30px_rgba(34,211,238,0.4)]" />
          <div className="absolute inset-2 rounded-full border-2 border-blue-500/20 border-b-blue-500 splash-spin-rev" />
          <div className="absolute inset-4 rounded-full border border-cyan-300/40 border-l-cyan-300 splash-spin-slow" />
          {/* Pulsing core */}
          <div className="absolute inset-[34%] rounded-full bg-cyan-400 splash-pulse shadow-[0_0_40px_10px_rgba(34,211,238,0.7)]" />
        </div>

        <div className="font-mono text-cyan-300/90 text-[11px] tracking-[0.4em] uppercase splash-flicker">
          Initializing System
        </div>
        <div className="h-[2px] w-48 bg-cyan-400/10 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-cyan-400 to-transparent splash-bar" />
        </div>
      </div>

      <style>{`
        @keyframes splash-spin-slow { to { transform: rotate(360deg); } }
        @keyframes splash-spin-rev  { to { transform: rotate(-360deg); } }
        @keyframes splash-pulse     { 0%,100% { transform: scale(1); opacity: .9; } 50% { transform: scale(1.25); opacity: 1; } }
        @keyframes splash-bar       { 0% { transform: translateX(-150%); } 100% { transform: translateX(450%); } }
        @keyframes splash-scan      { 0% { transform: translateY(-20vh); } 100% { transform: translateY(120vh); } }
        @keyframes splash-flicker   { 0%,100% { opacity: 1; } 45% { opacity: .55; } 55% { opacity: .9; } }
        .splash-spin-slow { animation: splash-spin-slow 3.5s linear infinite; }
        .splash-spin-rev  { animation: splash-spin-rev 2.2s linear infinite; }
        .splash-pulse     { animation: splash-pulse 1.4s ease-in-out infinite; }
        .splash-bar       { animation: splash-bar 1.4s ease-in-out infinite; }
        .splash-scan      { animation: splash-scan 1.8s linear infinite; }
        .splash-flicker   { animation: splash-flicker 1.6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function Root() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      <App />
    </>
  );
}

createRoot(document.getElementById("root")!).render(<Root />);

