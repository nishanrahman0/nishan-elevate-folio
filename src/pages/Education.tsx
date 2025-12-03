import { useState, useEffect } from "react";
import { Calendar, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  duration: string;
  logo_url?: string;
  image_url?: string;
  link_url?: string;
}

const Education = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [educationList, setEducationList] = useState<EducationItem[]>([]);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    const { data } = await supabase
      .from("education")
      .select("*")
      .order("created_at");

    if (data) {
      setEducationList(data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <Navigation />
      <div className="pt-24 pb-16 min-h-screen relative z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">Education</h1>
            {isAdmin && (
              <Button variant="outline" onClick={() => navigate("/admin?tab=education")}>Manage Education</Button>
            )}
          </div>

          <div className="space-y-6">
            {educationList.map((edu, index) => {
              const Wrapper = edu.link_url ? 'a' : 'div';
              const wrapperProps = edu.link_url ? { href: edu.link_url, target: "_blank", rel: "noopener noreferrer" } : {};

              return (
                <Wrapper 
                  key={edu.id} 
                  {...wrapperProps}
                  className="glass-card rounded-2xl p-6 md:p-12 animate-scale-in hover:shadow-2xl transition-shadow block"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      {edu.logo_url && (
                        <div className="flex-shrink-0">
                          <img 
                            src={edu.logo_url} 
                            alt={`${edu.institution} Logo`}
                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                          />
                        </div>
                      )}
                      <div className="flex-1 md:hidden">
                        <h3 className="text-xl font-bold text-foreground mb-1 flex items-center gap-2">
                          {edu.institution}
                          {edu.link_url && <ExternalLink className="h-4 w-4 text-primary" />}
                        </h3>
                        <p className="text-lg text-primary font-semibold mb-1">
                          {edu.degree}
                        </p>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>{edu.duration}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="hidden md:block flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                        {edu.institution}
                        {edu.link_url && <ExternalLink className="h-5 w-5 text-primary" />}
                      </h3>
                      <p className="text-xl text-primary font-semibold mb-2">
                        {edu.degree}
                      </p>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{edu.duration}</span>
                      </div>
                    </div>
                    
                    {edu.image_url && (
                      <div className="flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
                        <div className="rounded-xl p-1 bg-gradient-to-br from-primary/20 to-accent/20">
                          <img 
                            src={edu.image_url} 
                            alt={`${edu.institution} Campus`}
                            className="w-full md:w-64 h-40 md:h-40 object-cover rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>
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

export default Education;
