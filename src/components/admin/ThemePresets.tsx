import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export interface ThemePreset {
  name: string;
  emoji: string;
  colors: { primary: string; secondary: string; accent: string };
}

export const PREDEFINED_THEMES: ThemePreset[] = [
  { name: "Default", emoji: "🔮", colors: { primary: "250 80% 60%", secondary: "220 70% 55%", accent: "280 70% 65%" } },
  { name: "Glacier", emoji: "🧊", colors: { primary: "199 89% 48%", secondary: "210 100% 60%", accent: "180 70% 50%" } },
  { name: "Harvest", emoji: "🌾", colors: { primary: "30 90% 55%", secondary: "45 95% 50%", accent: "15 85% 50%" } },
  { name: "Lavender", emoji: "💜", colors: { primary: "270 60% 65%", secondary: "290 50% 60%", accent: "310 55% 60%" } },
  { name: "Brutalist", emoji: "🏗️", colors: { primary: "0 0% 20%", secondary: "0 0% 40%", accent: "0 85% 55%" } },
  { name: "Obsidian", emoji: "🖤", colors: { primary: "240 10% 25%", secondary: "240 15% 35%", accent: "45 90% 55%" } },
  { name: "Orchid", emoji: "🌸", colors: { primary: "330 70% 60%", secondary: "350 65% 55%", accent: "300 60% 65%" } },
  { name: "Solar", emoji: "☀️", colors: { primary: "45 95% 55%", secondary: "25 90% 50%", accent: "10 85% 55%" } },
  { name: "Tide", emoji: "🌊", colors: { primary: "185 75% 45%", secondary: "200 80% 50%", accent: "165 70% 45%" } },
  { name: "Verdant", emoji: "🌿", colors: { primary: "145 65% 42%", secondary: "160 60% 45%", accent: "120 55% 50%" } },
  { name: "Rose Gold", emoji: "🌹", colors: { primary: "350 60% 65%", secondary: "20 50% 60%", accent: "340 55% 55%" } },
  { name: "Midnight", emoji: "🌙", colors: { primary: "230 70% 50%", secondary: "250 60% 45%", accent: "210 80% 60%" } },
  { name: "Emerald", emoji: "💎", colors: { primary: "160 85% 40%", secondary: "140 70% 45%", accent: "175 75% 42%" } },
  { name: "Sunset", emoji: "🌅", colors: { primary: "15 85% 55%", secondary: "35 90% 55%", accent: "350 75% 55%" } },
  { name: "Neon", emoji: "⚡", colors: { primary: "280 100% 65%", secondary: "320 100% 60%", accent: "170 100% 50%" } },
  { name: "Coral", emoji: "🐚", colors: { primary: "12 76% 61%", secondary: "25 70% 58%", accent: "350 65% 60%" } },
  { name: "Arctic", emoji: "❄️", colors: { primary: "200 80% 55%", secondary: "220 75% 60%", accent: "190 85% 48%" } },
  { name: "Amber", emoji: "🍯", colors: { primary: "38 92% 50%", secondary: "28 85% 48%", accent: "48 90% 55%" } },
  { name: "Slate", emoji: "🪨", colors: { primary: "215 20% 50%", secondary: "220 15% 45%", accent: "200 25% 55%" } },
  { name: "Cherry", emoji: "🍒", colors: { primary: "345 80% 50%", secondary: "355 75% 55%", accent: "330 70% 55%" } },
];

interface ThemePresetsGridProps {
  currentColors: { primary: string; secondary: string; accent: string };
  onSelectPreset: (colors: { primary: string; secondary: string; accent: string }) => void;
}

export function ThemePresetsGrid({ currentColors, onSelectPreset }: ThemePresetsGridProps) {
  const isActive = (preset: ThemePreset) =>
    preset.colors.primary === currentColors.primary &&
    preset.colors.secondary === currentColors.secondary &&
    preset.colors.accent === currentColors.accent;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground/70">🎭 Quick Presets</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {PREDEFINED_THEMES.map((preset) => {
          const active = isActive(preset);
          return (
            <Button
              key={preset.name}
              variant="outline"
              onClick={() => onSelectPreset(preset.colors)}
              className={`relative h-auto py-3 px-3 flex flex-col items-center gap-2 border transition-all ${
                active
                  ? "border-primary ring-2 ring-primary/30 bg-primary/10"
                  : "border-white/15 hover:border-white/30 hover:bg-white/5"
              }`}
            >
              {active && (
                <div className="absolute top-1 right-1">
                  <Check className="h-3.5 w-3.5 text-primary" />
                </div>
              )}
              <div className="flex gap-1">
                <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: `hsl(${preset.colors.primary})` }} />
                <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: `hsl(${preset.colors.secondary})` }} />
                <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: `hsl(${preset.colors.accent})` }} />
              </div>
              <span className="text-xs font-medium">{preset.emoji} {preset.name}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
