import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function ThemeEditor() {
  const { toast } = useToast();
  const [colors, setColors] = useState({
    primary: "250 80% 60%",
    secondary: "220 70% 55%",
    accent: "280 70% 65%",
  });

  useEffect(() => {
    // Load current theme from CSS variables
    const root = document.documentElement;
    const primaryValue = getComputedStyle(root).getPropertyValue('--primary').trim();
    const secondaryValue = getComputedStyle(root).getPropertyValue('--secondary').trim();
    const accentValue = getComputedStyle(root).getPropertyValue('--accent').trim();
    
    if (primaryValue) setColors(prev => ({ ...prev, primary: primaryValue }));
    if (secondaryValue) setColors(prev => ({ ...prev, secondary: secondaryValue }));
    if (accentValue) setColors(prev => ({ ...prev, accent: accentValue }));
  }, []);

  const handleColorChange = (colorType: keyof typeof colors, value: string) => {
    setColors(prev => ({ ...prev, [colorType]: value }));
  };

  const applyTheme = () => {
    const root = document.documentElement;
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--accent', colors.accent);
    
    // Save to localStorage
    localStorage.setItem('theme-colors', JSON.stringify(colors));
    
    toast({
      title: "Theme Updated",
      description: "Your custom color scheme has been applied successfully.",
    });
  };

  const resetTheme = () => {
    const defaultColors = {
      primary: "250 80% 60%",
      secondary: "220 70% 55%",
      accent: "280 70% 65%",
    };
    
    setColors(defaultColors);
    const root = document.documentElement;
    root.style.setProperty('--primary', defaultColors.primary);
    root.style.setProperty('--secondary', defaultColors.secondary);
    root.style.setProperty('--accent', defaultColors.accent);
    
    localStorage.removeItem('theme-colors');
    
    toast({
      title: "Theme Reset",
      description: "Colors have been reset to default.",
    });
  };

  const hslToHex = (hsl: string) => {
    const [h, s, l] = hsl.split(' ').map(v => parseFloat(v));
    const hDecimal = h / 360;
    const sDecimal = s / 100;
    const lDecimal = l / 100;
    
    const c = (1 - Math.abs(2 * lDecimal - 1)) * sDecimal;
    const x = c * (1 - Math.abs((hDecimal * 6) % 2 - 1));
    const m = lDecimal - c / 2;
    
    let r = 0, g = 0, b = 0;
    
    if (0 <= hDecimal && hDecimal < 1/6) {
      r = c; g = x; b = 0;
    } else if (1/6 <= hDecimal && hDecimal < 2/6) {
      r = x; g = c; b = 0;
    } else if (2/6 <= hDecimal && hDecimal < 3/6) {
      r = 0; g = c; b = x;
    } else if (3/6 <= hDecimal && hDecimal < 4/6) {
      r = 0; g = x; b = c;
    } else if (4/6 <= hDecimal && hDecimal < 5/6) {
      r = x; g = 0; b = c;
    } else {
      r = c; g = 0; b = x;
    }
    
    const toHex = (n: number) => {
      const hex = Math.round((n + m) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Customization</CardTitle>
        <CardDescription>Customize your website's color scheme</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primary-color">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                id="primary-color"
                type="color"
                value={hslToHex(colors.primary)}
                onChange={(e) => handleColorChange('primary', hexToHsl(e.target.value))}
                className="w-20 h-10 cursor-pointer"
              />
              <Input
                value={colors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                placeholder="250 80% 60%"
              />
            </div>
            <div className="h-10 rounded-md" style={{ backgroundColor: `hsl(${colors.primary})` }} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondary-color">Secondary Color</Label>
            <div className="flex gap-2">
              <Input
                id="secondary-color"
                type="color"
                value={hslToHex(colors.secondary)}
                onChange={(e) => handleColorChange('secondary', hexToHsl(e.target.value))}
                className="w-20 h-10 cursor-pointer"
              />
              <Input
                value={colors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                placeholder="220 70% 55%"
              />
            </div>
            <div className="h-10 rounded-md" style={{ backgroundColor: `hsl(${colors.secondary})` }} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accent-color">Accent Color</Label>
            <div className="flex gap-2">
              <Input
                id="accent-color"
                type="color"
                value={hslToHex(colors.accent)}
                onChange={(e) => handleColorChange('accent', hexToHsl(e.target.value))}
                className="w-20 h-10 cursor-pointer"
              />
              <Input
                value={colors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                placeholder="280 70% 65%"
              />
            </div>
            <div className="h-10 rounded-md" style={{ backgroundColor: `hsl(${colors.accent})` }} />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={applyTheme}>Apply Theme</Button>
          <Button onClick={resetTheme} variant="outline">Reset to Default</Button>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Note: Theme changes are saved in your browser. Use HSL format (e.g., "250 80% 60%") for colors.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}