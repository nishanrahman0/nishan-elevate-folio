import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import defaultIllustration from "@/assets/about-illustration.png";

interface SkillIcon {
  label: string;
  image_url: string | null;
  color: string;
}

const About = () => {
  const [content, setContent] = useState("");
  const [illustrationUrl, setIllustrationUrl] = useState<string>(defaultIllustration);
  const [skillIcons, setSkillIcons] = useState<SkillIcon[]>([]);

  useEffect(() => {
    fetchAboutContent();
    fetchSkillIcons();
  }, []);

  const fetchAboutContent = async () => {
    const { data } = await supabase
      .from("about_content")
      .select("content, image_url")
      .maybeSingle();
    if (data) {
      setContent(data.content);
      if (data.image_url) setIllustrationUrl(data.image_url);
    }
  };

  const fetchSkillIcons = async () => {
    const { data } = await supabase
      .from("skills")
      .select("skill_name, image_url, color_gradient")
      .order("display_order")
      .limit(8);
    if (data) {
      const colors = [
        "hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--secondary))",
        "#E44D26", "#264DE4", "#F7DF1E", "#3178C6", "#61DAFB"
      ];
      setSkillIcons(data.map((s, i) => ({
        label: s.skill_name,
        image_url: s.image_url,
        color: colors[i % colors.length],
      })));
    }
  };

  const getIconPosition = (index: number, total: number) => {
    // Distribute icons in an ellipse around the computer/desk area (lower portion)
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const rx = 32; // horizontal radius (tighter around desk)
    const ry = 18; // vertical radius (flatter ellipse)
    const cx = 48; // center x
    const cy = 72; // center y (shifted down to computer area)
    return {
      x: cx + rx * Math.cos(angle),
      y: cy + ry * Math.sin(angle),
    };
  };

  return (
    <section id="about" className="section-padding bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">About Me</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Illustration Side */}
          <div className="relative w-full h-[420px] md:h-[500px] order-2 lg:order-1 flex items-center justify-center">
            {/* Center illustration image */}
            <img
              src={illustrationUrl}
              alt="Developer working at desk"
              className="relative z-10 w-auto h-[280px] md:h-[340px] object-contain drop-shadow-2xl"
              loading="lazy"
            />

            {/* Floating skill icons */}
            {skillIcons.map((item, index) => {
              const pos = getIconPosition(index, skillIcons.length);
              return (
                <div
                  key={index}
                  className="absolute floating-icon z-20"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    animationDelay: `${index * 0.4}s`,
                    animationDuration: `${3 + (index % 3) * 0.5}s`,
                  }}
                >
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg shadow-md backdrop-blur-sm border border-border/30 bg-card/90 hover:scale-110 transition-transform cursor-default">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.label} className="w-5 h-5 rounded object-contain" />
                    ) : (
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-bold text-primary-foreground"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.label.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="text-[11px] font-semibold text-foreground/80 whitespace-nowrap">{item.label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Text Side */}
          <div className="glass-card rounded-2xl p-8 md:p-10 order-1 lg:order-2">
            <div 
              className="prose prose-lg max-w-none text-foreground leading-relaxed prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
