import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const floatingIcons = [
  { label: "HTML", color: "#E44D26", textColor: "#fff", delay: 0, x: 58, y: 8 },
  { label: "CSS", color: "#264DE4", textColor: "#fff", delay: 0.8, x: 30, y: 14 },
  { label: "JS", color: "#F7DF1E", textColor: "#000", delay: 1.6, x: 75, y: 12 },
  { label: "TS", color: "#3178C6", textColor: "#fff", delay: 0.4, x: 72, y: 28 },
  { label: "React", color: "#61DAFB", textColor: "#000", delay: 1.2, x: 38, y: 5 },
  { label: "AI", color: "#8B5CF6", textColor: "#fff", delay: 2, x: 18, y: 6 },
  { label: "Data", color: "#10B981", textColor: "#fff", delay: 1.4, x: 80, y: 42 },
  { label: "Biz", color: "#F59E0B", textColor: "#000", delay: 0.6, x: 12, y: 38 },
];

const About = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    const { data } = await supabase
      .from("about_content")
      .select("content")
      .maybeSingle();

    if (data) {
      setContent(data.content);
    }
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
          <div className="relative w-full h-[420px] md:h-[480px] animate-fade-in order-2 lg:order-1">
            {/* Diagonal lines background */}
            <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              {[...Array(6)].map((_, i) => (
                <line
                  key={i}
                  x1={`${30 + i * 12}%`}
                  y1="0%"
                  x2={`${10 + i * 12}%`}
                  y2="100%"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-primary"
                />
              ))}
            </svg>

            {/* Person at desk - SVG illustration */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <svg width="320" height="300" viewBox="0 0 320 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
                {/* Chair */}
                {/* Chair base/wheels */}
                <ellipse cx="105" cy="280" rx="35" ry="6" fill="#D946A8" opacity="0.7"/>
                <line x1="105" y1="280" x2="105" y2="250" stroke="#D946A8" strokeWidth="3"/>
                <line x1="75" y1="283" x2="90" y2="275" stroke="#D946A8" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="135" y1="283" x2="120" y2="275" stroke="#D946A8" strokeWidth="2.5" strokeLinecap="round"/>
                {/* Chair seat */}
                <path d="M65 245 Q105 260 145 245 L140 230 Q105 242 70 230 Z" fill="#F59E0B"/>
                {/* Chair back */}
                <path d="M68 230 Q62 185 72 170 Q90 155 105 160 L100 230" fill="#F59E0B"/>
                <path d="M72 225 Q68 190 75 175 Q88 165 98 168 L95 225" fill="#DA8B09"/>

                {/* Person body */}
                {/* Legs */}
                <path d="M100 245 L110 270 L120 270" stroke="#1E3A5F" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M120 245 L135 265 L148 268" stroke="#1E3A5F" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Shoes */}
                <ellipse cx="125" cy="271" rx="10" ry="5" fill="#EC4899"/>
                <ellipse cx="152" cy="269" rx="10" ry="5" fill="#EC4899"/>

                {/* Torso */}
                <path d="M88 185 Q95 240 115 245 Q130 245 135 195" fill="#EC4899" opacity="0.9"/>
                <path d="M92 190 Q98 235 113 242 Q125 240 130 198" fill="#DB2777"/>

                {/* Arms */}
                {/* Left arm reaching to keyboard */}
                <path d="M92 200 Q80 215 95 225 Q130 230 160 215" stroke="#FBBF7A" strokeWidth="7" strokeLinecap="round" fill="none"/>
                {/* Right arm reaching to keyboard */}
                <path d="M130 200 Q145 215 170 210" stroke="#FBBF7A" strokeWidth="7" strokeLinecap="round" fill="none"/>
                {/* Hands */}
                <circle cx="160" cy="214" r="5" fill="#FBBF7A"/>
                <circle cx="170" cy="209" r="5" fill="#FBBF7A"/>

                {/* Head */}
                <circle cx="110" cy="170" r="22" fill="#FBBF7A"/>
                {/* Hair */}
                <path d="M88 165 Q90 145 110 140 Q130 140 135 158 Q132 150 110 148 Q92 150 88 165" fill="#1E3A5F"/>
                {/* Glasses */}
                <circle cx="103" cy="170" r="6" stroke="#4B5563" strokeWidth="1.5" fill="none"/>
                <circle cx="118" cy="170" r="6" stroke="#4B5563" strokeWidth="1.5" fill="none"/>
                <line x1="109" y1="170" x2="112" y2="170" stroke="#4B5563" strokeWidth="1.5"/>

                {/* Desk */}
                {/* Desk top surface */}
                <path d="M140 218 L300 195 L300 202 L140 225 Z" fill="#67E8F9" opacity="0.9"/>
                <path d="M140 218 L300 195 L300 198 L140 221 Z" fill="#22D3EE"/>
                {/* Desk legs */}
                <line x1="155" y1="225" x2="150" y2="285" stroke="#5EEAD4" strokeWidth="4"/>
                <line x1="285" y1="200" x2="290" y2="275" stroke="#5EEAD4" strokeWidth="4"/>

                {/* Monitor */}
                {/* Monitor screen */}
                <rect x="175" y="140" width="100" height="70" rx="4" fill="#1E293B" stroke="#38BDF8" strokeWidth="2"/>
                {/* Screen content - code lines */}
                <rect x="182" y="150" width="60" height="3" rx="1" fill="#F97316" opacity="0.8"/>
                <rect x="182" y="157" width="80" height="2" rx="1" fill="#94A3B8" opacity="0.5"/>
                <rect x="182" y="163" width="70" height="2" rx="1" fill="#94A3B8" opacity="0.5"/>
                <rect x="182" y="169" width="85" height="2" rx="1" fill="#94A3B8" opacity="0.5"/>
                <rect x="182" y="175" width="50" height="2" rx="1" fill="#94A3B8" opacity="0.5"/>
                <rect x="182" y="181" width="75" height="2" rx="1" fill="#94A3B8" opacity="0.5"/>
                <rect x="182" y="187" width="60" height="2" rx="1" fill="#94A3B8" opacity="0.5"/>
                <rect x="182" y="193" width="40" height="2" rx="1" fill="#94A3B8" opacity="0.5"/>
                {/* Monitor stand */}
                <rect x="218" y="210" width="14" height="10" fill="#64748B"/>
                <rect x="210" y="218" width="30" height="4" rx="2" fill="#64748B"/>

                {/* Coffee mug */}
                <rect x="265" y="205" width="15" height="14" rx="3" fill="#EA580C"/>
                <path d="M280 208 Q288 211 280 216" stroke="#EA580C" strokeWidth="2" fill="none"/>
                {/* Steam */}
                <path d="M270 200 Q272 195 269 190" stroke="#94A3B8" strokeWidth="1" opacity="0.5" fill="none"/>
                <path d="M275 201 Q277 194 274 188" stroke="#94A3B8" strokeWidth="1" opacity="0.5" fill="none"/>

                {/* Keyboard */}
                <rect x="155" y="212" width="45" height="10" rx="2" fill="#CBD5E1" opacity="0.8"/>
                <rect x="157" y="214" width="5" height="3" rx="0.5" fill="#94A3B8" opacity="0.6"/>
                <rect x="164" y="214" width="5" height="3" rx="0.5" fill="#94A3B8" opacity="0.6"/>
                <rect x="171" y="214" width="5" height="3" rx="0.5" fill="#94A3B8" opacity="0.6"/>
                <rect x="178" y="214" width="5" height="3" rx="0.5" fill="#94A3B8" opacity="0.6"/>
                <rect x="185" y="214" width="5" height="3" rx="0.5" fill="#94A3B8" opacity="0.6"/>
                <rect x="192" y="214" width="5" height="3" rx="0.5" fill="#94A3B8" opacity="0.6"/>
              </svg>
            </div>

            {/* Floating skill icons */}
            {floatingIcons.map((item, index) => (
              <div
                key={index}
                className="absolute floating-icon"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  animationDelay: `${item.delay}s`,
                  animationDuration: `${3 + (index % 3) * 0.5}s`,
                }}
              >
                <div
                  className="px-3 py-1.5 rounded-md text-xs font-bold shadow-lg transition-transform hover:scale-125 cursor-default"
                  style={{ backgroundColor: item.color, color: item.textColor }}
                >
                  {item.label}
                </div>
              </div>
            ))}
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
