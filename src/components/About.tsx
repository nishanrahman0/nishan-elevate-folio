import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import aboutIllustration from "@/assets/about-illustration.png";

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
          <div className="relative w-full flex items-center justify-center animate-fade-in order-2 lg:order-1">
            <img 
              src={aboutIllustration} 
              alt="Developer working at a desk with floating technology icons" 
              className="w-full max-w-lg object-contain floating-icon"
            />
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
