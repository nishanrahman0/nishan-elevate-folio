import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { supabase } from "@/integrations/supabase/client";

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
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    supabase
      .from("hero_content")
      .select("logo_url")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.logo_url) {
          setLogoUrl(data.logo_url);
        }
        // Show splash for 1.5s then fade out
        setTimeout(() => setFadeOut(true), 1200);
        setTimeout(() => onDone(), 1800);
      });
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt="Logo"
          className="w-24 h-24 md:w-32 md:h-32 object-contain animate-scale-in"
        />
      ) : (
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      )}
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
