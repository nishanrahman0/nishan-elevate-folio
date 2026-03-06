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

  // Position icons in an arc around the illustration
  const getIconPosition = (index: number) => {
    const positions = [
      { x: 5, y: 8 },    // top left
      { x: 25, y: 2 },   // top center-left
      { x: 55, y: 0 },   // top center
      { x: 75, y: 2 },   // top center-right
      { x: 90, y: 10 },  // top right
      { x: 92, y: 35 },  // right middle
      { x: 88, y: 58 },  // right lower
      { x: 0, y: 30 },   // left middle
      { x: 2, y: 55 },   // left lower
      { x: 45, y: 85 },  // bottom center
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
          <div className="relative w-full h-[420px] md:h-[500px] animate-fade-in order-2 lg:order-1 flex items-center justify-center">
            {/* Center illustration image */}
            <img
              src={illustrationUrl}
              alt="Developer working at desk"
              className="relative z-10 w-auto h-[300px] md:h-[380px] object-contain drop-shadow-2xl"
            />

            {/* Floating skill icons */}
            {skillIcons.map((item, index) => {
              const pos = getIconPosition(index);
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
