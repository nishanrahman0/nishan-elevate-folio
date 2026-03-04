import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Code, BarChart3, Briefcase, Brain, Users, FileText } from "lucide-react";

const floatingIcons = [
  { icon: Code, label: "Technology", delay: 0, x: "left-[5%]", y: "top-[15%]" },
  { icon: BarChart3, label: "Analytics", delay: 1, x: "left-[15%]", y: "bottom-[20%]" },
  { icon: Briefcase, label: "Business", delay: 2, x: "right-[10%]", y: "top-[10%]" },
  { icon: Brain, label: "AI Tools", delay: 0.5, x: "right-[5%]", y: "bottom-[25%]" },
  { icon: Users, label: "Leadership", delay: 1.5, x: "left-[8%]", y: "top-[55%]" },
  { icon: FileText, label: "Productivity", delay: 2.5, x: "right-[12%]", y: "top-[50%]" },
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
          <div className="relative w-full h-[400px] md:h-[450px] animate-fade-in order-2 lg:order-1">
            {/* Central desk illustration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-56 h-56 md:w-64 md:h-64">
                {/* Desk */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-3 bg-gradient-to-r from-primary/40 to-accent/40 rounded-full blur-sm" />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-44 h-24 bg-gradient-to-br from-muted/80 to-muted rounded-lg border border-border/50" />
                {/* Monitor */}
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-36 h-28 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg border-2 border-primary/30 shadow-lg shadow-primary/10">
                  <div className="w-full h-full p-2 flex flex-col gap-1">
                    <div className="w-full h-1.5 bg-primary/30 rounded-full" />
                    <div className="w-3/4 h-1.5 bg-accent/30 rounded-full" />
                    <div className="w-5/6 h-1.5 bg-primary/20 rounded-full" />
                    <div className="w-2/3 h-1.5 bg-accent/20 rounded-full" />
                    <div className="flex gap-1 mt-auto">
                      <div className="w-4 h-4 bg-primary/30 rounded" />
                      <div className="w-4 h-4 bg-accent/30 rounded" />
                      <div className="w-4 h-4 bg-primary/20 rounded" />
                    </div>
                  </div>
                </div>
                {/* Monitor stand */}
                <div className="absolute bottom-[72px] left-1/2 -translate-x-1/2 w-4 h-6 bg-muted-foreground/20 rounded" />
                {/* Person silhouette */}
                <div className="absolute bottom-[110px] left-1/2 -translate-x-[70px]">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/40 to-accent/40 rounded-full" />
                  <div className="w-14 h-16 bg-gradient-to-br from-primary/30 to-accent/30 rounded-t-xl mt-1 -ml-2" />
                </div>
              </div>
            </div>

            {/* Floating icons */}
            {floatingIcons.map((item, index) => (
              <div
                key={index}
                className={`absolute ${item.x} ${item.y} floating-icon`}
                style={{ animationDelay: `${item.delay}s` }}
              >
                <div className="glass-card p-3 rounded-xl shadow-lg shadow-primary/10 hover:scale-110 transition-transform cursor-default group">
                  <item.icon className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.label}
                  </span>
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
