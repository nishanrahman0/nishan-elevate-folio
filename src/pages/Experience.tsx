import { useState, useEffect } from "react";
import { Briefcase, Calendar } from "lucide-react";
import * as Icons from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
  icon_name: string;
  image_url?: string;
  link_url?: string;
}

const Experience = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    const { data } = await supabase
      .from("experiences")
      .select("*")
      .order("display_order");

    if (data) {
      setExperiences(data);
    }
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Briefcase;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-tl from-accent/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <Navigation />
      <div className="pt-24 pb-16 min-h-screen relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">Work Experience & Projects</h1>
            {isAdmin && (
              <Button variant="outline" onClick={() => navigate("/admin?tab=experience")}>Manage Experience</Button>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map((exp, index) => {
              const IconComponent = getIcon(exp.icon_name);
              const Wrapper = exp.link_url ? 'a' : 'div';
              const wrapperProps = exp.link_url ? { href: exp.link_url, target: "_blank", rel: "noopener noreferrer" } : {};
              
              return (
                <Wrapper
                  key={exp.id}
                  {...wrapperProps}
                  className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform animate-fade-in-up group block"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {exp.image_url ? (
                    <div className="rounded-xl mb-4 p-1 bg-gradient-to-br from-primary/20 to-accent/20">
                      <img src={exp.image_url} alt={exp.title} className="w-full h-48 object-cover rounded-lg" />
                    </div>
                  ) : (
                    <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-xl w-fit mb-4 group-hover:shadow-lg transition-shadow">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                  )}
                
                  <h3 className="text-xl font-bold text-foreground mb-2">{exp.title}</h3>
                  <p className="text-primary font-semibold mb-2">{exp.company}</p>
                
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>{exp.duration}</span>
                  </div>
                
                  <div 
                    className="prose prose-sm md:prose-base max-w-none text-foreground"
                    dangerouslySetInnerHTML={{ __html: exp.description }}
                  />
                </Wrapper>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Experience;
