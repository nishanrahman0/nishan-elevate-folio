import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">About Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        <div className="glass-card rounded-2xl p-8 md:p-12 animate-fade-in-up">
          <div 
            className="prose prose-lg max-w-none text-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </section>
  );
};

export default About;
