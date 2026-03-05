import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SkillIcon {
  label: string;
  image_url: string | null;
  color: string;
}

const About = () => {
  const [content, setContent] = useState("");
  const [skillIcons, setSkillIcons] = useState<SkillIcon[]>([]);

  useEffect(() => {
    fetchAboutContent();
    fetchSkillIcons();
  }, []);

  const fetchAboutContent = async () => {
    const { data } = await supabase
      .from("about_content")
      .select("content")
      .maybeSingle();
    if (data) setContent(data.content);
  };

  const fetchSkillIcons = async () => {
    const { data } = await supabase
      .from("skills")
      .select("skill_name, image_url, color_gradient")
      .order("display_order")
      .limit(10);
    if (data) {
      const colors = ["#E44D26", "#264DE4", "#F7DF1E", "#3178C6", "#61DAFB", "#8B5CF6", "#10B981", "#F59E0B", "#EC4899", "#06B6D4"];
      setSkillIcons(data.map((s, i) => ({
        label: s.skill_name,
        image_url: s.image_url,
        color: colors[i % colors.length],
      })));
    }
  };

  // Position icons in an arc around the top-right of the monitor
  const getIconPosition = (index: number, total: number) => {
    // Place icons in a semicircle above and to the right of the monitor
    const positions = [
      { x: 52, y: 5 },   // top center-right
      { x: 68, y: 3 },   // top right
      { x: 78, y: 12 },  // right upper
      { x: 82, y: 26 },  // right middle
      { x: 78, y: 40 },  // right lower
      { x: 38, y: 3 },   // top center-left
      { x: 25, y: 8 },   // left upper
      { x: 18, y: 22 },  // left middle
      { x: 85, y: 52 },  // far right lower
      { x: 15, y: 38 },  // far left lower
    ];
    return positions[index % positions.length];
  };

  return (
    <section id="about" className="section-padding bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">About Nishan</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Illustration Side */}
          <div className="relative w-full h-[420px] md:h-[500px] animate-fade-in order-2 lg:order-1">
            {/* Subtle diagonal lines */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
              {[...Array(5)].map((_, i) => (
                <line key={i} x1={`${35 + i * 14}%`} y1="0%" x2={`${15 + i * 14}%`} y2="100%" stroke="currentColor" strokeWidth="1" className="text-primary" />
              ))}
            </svg>

            {/* Person at desk SVG - isometric style */}
            <div className="absolute bottom-4 left-1/2 -translate-x-[45%]">
              <svg width="360" height="360" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
                
                {/* === FLOOR SHADOW === */}
                <ellipse cx="200" cy="370" rx="160" ry="18" fill="currentColor" className="text-primary/5" />

                {/* === DESK (isometric) === */}
                {/* Desk top - flat surface, person sits behind it */}
                <path d="M80 260 L320 240 L320 248 L80 268 Z" fill="#67E8F9" />
                <path d="M80 260 L320 240 L320 243 L80 263 Z" fill="#22D3EE" />
                {/* Desk front face */}
                <path d="M80 263 L80 268 L320 248 L320 243 Z" fill="#0E7490" opacity="0.4" />
                {/* Desk legs */}
                <line x1="100" y1="268" x2="95" y2="355" stroke="#5EEAD4" strokeWidth="4" strokeLinecap="round" />
                <line x1="300" y1="248" x2="305" y2="345" stroke="#5EEAD4" strokeWidth="4" strokeLinecap="round" />
                <line x1="195" y1="258" x2="195" y2="355" stroke="#5EEAD4" strokeWidth="3" strokeLinecap="round" />

                {/* === CHAIR === */}
                {/* Chair wheels/base */}
                <ellipse cx="148" cy="358" rx="32" ry="5" fill="#D946A8" opacity="0.5" />
                <line x1="120" y1="360" x2="133" y2="352" stroke="#D946A8" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="176" y1="360" x2="163" y2="352" stroke="#D946A8" strokeWidth="2.5" strokeLinecap="round" />
                {/* Chair pole */}
                <line x1="148" y1="355" x2="148" y2="325" stroke="#D946A8" strokeWidth="3" />
                {/* Chair seat */}
                <path d="M115 318 Q148 330 181 318 L176 305 Q148 315 120 305 Z" fill="#F59E0B" />
                {/* Chair back */}
                <path d="M118 305 Q112 260 125 240 L155 240 Q168 260 162 305" fill="#F59E0B" />
                <path d="M123 300 Q118 265 128 248 L150 248 Q160 265 155 300" fill="#DA8B09" />

                {/* === PERSON (seated in chair, facing desk/monitor) === */}
                {/* Person is facing right toward the monitor */}
                
                {/* Legs - bent at knees, feet under desk */}
                <path d="M135 318 L145 340 L160 342" stroke="#1E3A5F" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M160 318 L170 335 L185 338" stroke="#1E3A5F" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                {/* Shoes */}
                <ellipse cx="165" cy="343" rx="10" ry="5" fill="#EC4899" />
                <ellipse cx="190" cy="339" rx="10" ry="5" fill="#EC4899" />
                
                {/* Torso - seated upright, leaning slightly forward */}
                <path d="M125 270 Q130 310 148 318 Q165 318 170 275" fill="#EC4899" />
                <path d="M130 275 Q134 308 148 315 Q160 313 164 278" fill="#DB2777" />

                {/* Left arm - reaching to keyboard on desk */}
                <path d="M130 282 Q120 295 130 305 Q155 310 200 260" stroke="#FBBF7A" strokeWidth="8" strokeLinecap="round" fill="none" />
                {/* Right arm */}
                <path d="M165 282 Q180 295 210 258" stroke="#FBBF7A" strokeWidth="8" strokeLinecap="round" fill="none" />
                {/* Hands on keyboard area */}
                <circle cx="200" cy="258" r="5.5" fill="#FBBF7A" />
                <circle cx="210" cy="256" r="5.5" fill="#FBBF7A" />

                {/* Head - facing right toward screen */}
                <circle cx="150" cy="248" r="24" fill="#FBBF7A" />
                {/* Hair */}
                <path d="M126 243 Q128 220 150 215 Q172 218 176 240 Q170 225 150 222 Q132 225 126 243" fill="#1E3A5F" />
                {/* Side profile hint - ear */}
                <ellipse cx="174" cy="250" rx="4" ry="6" fill="#E5A96A" />
                {/* Glasses */}
                <circle cx="142" cy="250" r="7" stroke="#4B5563" strokeWidth="1.8" fill="none" />
                <circle cx="158" cy="249" r="7" stroke="#4B5563" strokeWidth="1.8" fill="none" />
                <line x1="149" y1="250" x2="151" y2="249" stroke="#4B5563" strokeWidth="1.5" />
                <line x1="165" y1="248" x2="174" y2="248" stroke="#4B5563" strokeWidth="1.5" />
                {/* Eyes looking at screen */}
                <circle cx="143" cy="249" r="1.5" fill="#1E293B" />
                <circle cx="159" cy="248" r="1.5" fill="#1E293B" />
                {/* Slight smile */}
                <path d="M146 257 Q150 261 155 257" stroke="#C68A56" strokeWidth="1.2" fill="none" strokeLinecap="round" />

                {/* === MONITOR (on desk, in front of person) === */}
                {/* Monitor screen */}
                <rect x="220" y="175" width="110" height="78" rx="5" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
                {/* Screen glow */}
                <rect x="220" y="175" width="110" height="78" rx="5" fill="#38BDF8" opacity="0.05" />
                {/* Code lines on screen */}
                <rect x="230" y="186" width="45" height="3.5" rx="1.5" fill="#F97316" opacity="0.9" />
                <rect x="230" y="194" width="85" height="2.5" rx="1" fill="#94A3B8" opacity="0.4" />
                <rect x="230" y="200" width="70" height="2.5" rx="1" fill="#94A3B8" opacity="0.4" />
                <rect x="230" y="206" width="90" height="2.5" rx="1" fill="#38BDF8" opacity="0.3" />
                <rect x="230" y="212" width="55" height="2.5" rx="1" fill="#94A3B8" opacity="0.4" />
                <rect x="230" y="218" width="78" height="2.5" rx="1" fill="#10B981" opacity="0.3" />
                <rect x="230" y="224" width="65" height="2.5" rx="1" fill="#94A3B8" opacity="0.4" />
                <rect x="230" y="230" width="42" height="2.5" rx="1" fill="#94A3B8" opacity="0.4" />
                <rect x="230" y="236" width="60" height="2.5" rx="1" fill="#8B5CF6" opacity="0.3" />
                <rect x="230" y="242" width="35" height="2.5" rx="1" fill="#94A3B8" opacity="0.4" />
                {/* Monitor stand */}
                <rect x="268" y="253" width="14" height="8" fill="#64748B" />
                <rect x="260" y="259" width="30" height="4" rx="2" fill="#64748B" />

                {/* === KEYBOARD === */}
                <rect x="190" y="254" width="55" height="12" rx="3" fill="#E2E8F0" opacity="0.85" />
                {/* Keys */}
                <rect x="194" y="257" width="6" height="3" rx="1" fill="#94A3B8" opacity="0.5" />
                <rect x="202" y="257" width="6" height="3" rx="1" fill="#94A3B8" opacity="0.5" />
                <rect x="210" y="257" width="6" height="3" rx="1" fill="#94A3B8" opacity="0.5" />
                <rect x="218" y="257" width="6" height="3" rx="1" fill="#94A3B8" opacity="0.5" />
                <rect x="226" y="257" width="6" height="3" rx="1" fill="#94A3B8" opacity="0.5" />
                <rect x="234" y="257" width="6" height="3" rx="1" fill="#94A3B8" opacity="0.5" />
                <rect x="194" y="262" width="6" height="3" rx="1" fill="#94A3B8" opacity="0.4" />
                <rect x="202" y="262" width="6" height="3" rx="1" fill="#94A3B8" opacity="0.4" />
                <rect x="210" y="262" width="6" height="3" rx="1" fill="#94A3B8" opacity="0.4" />
                <rect x="218" y="262" width="6" height="3" rx="1" fill="#94A3B8" opacity="0.4" />
                <rect x="226" y="262" width="6" height="3" rx="1" fill="#94A3B8" opacity="0.4" />
                <rect x="234" y="262" width="6" height="3" rx="1" fill="#94A3B8" opacity="0.4" />

                {/* === COFFEE MUG === */}
                <rect x="310" y="248" width="14" height="14" rx="3" fill="#EA580C" />
                <path d="M324 251 Q332 255 324 260" stroke="#EA580C" strokeWidth="2" fill="none" />
                {/* Steam */}
                <path d="M314 243 Q316 237 313 231" stroke="#94A3B8" strokeWidth="1" opacity="0.4" fill="none" />
                <path d="M319 244 Q321 236 318 229" stroke="#94A3B8" strokeWidth="1" opacity="0.4" fill="none" />
              </svg>
            </div>

            {/* Floating skill icons - positioned around the monitor area */}
            {skillIcons.map((item, index) => {
              const pos = getIconPosition(index, skillIcons.length);
              return (
                <div
                  key={index}
                  className="absolute floating-icon z-20"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    animationDelay: `${index * 0.35}s`,
                    animationDuration: `${3 + (index % 4) * 0.4}s`,
                  }}
                >
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg shadow-lg backdrop-blur-sm border border-white/10 transition-transform hover:scale-110 cursor-default bg-background/80">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.label} className="w-5 h-5 rounded object-contain" />
                    ) : (
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-bold text-white"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.label.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="text-[11px] font-semibold text-foreground/80">{item.label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Text Side */}
          <div className="glass-card rounded-2xl p-8 md:p-12 animate-fade-in-up order-1 lg:order-2">
            <div 
              className="prose prose-lg max-w-none text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
