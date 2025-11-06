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

createRoot(document.getElementById("root")!).render(<App />);
