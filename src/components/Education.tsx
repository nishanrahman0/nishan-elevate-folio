import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import ruLogo from "@/assets/ru-logo.png";
import ruMonument from "@/assets/ru-monument.jpg";
import { supabase } from "@/integrations/supabase/client";

const Education = () => {
  const [education, setEducation] = useState({
    institution: "",
    degree: "",
    duration: "",
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    const { data } = await supabase
      .from("education")
      .select("*")
      .maybeSingle();

    if (data) {
      setEducation({
        institution: data.institution,
        degree: data.degree,
        duration: data.duration,
      });
    }
  };
  return (
    <section id="education" className="section-padding bg-gradient-to-bl from-background via-secondary/5 to-background relative overflow-hidden">
      {/* Floating decorative shapes - hidden on mobile */}
      <div className="hidden md:block absolute top-20 right-20 w-32 h-32 border-2 border-primary/20 rounded-full animate-pulse" />
      <div className="hidden md:block absolute bottom-40 left-20 w-24 h-24 border-2 border-accent/20 rounded-full animate-pulse delay-1000" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Education</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        <div className="glass-card rounded-2xl p-6 md:p-12 animate-scale-in hover:shadow-2xl transition-shadow">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex-shrink-0">
                <img 
                  src={ruLogo} 
                  alt="University of Rajshahi Logo" 
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                />
              </div>
              <div className="flex-1 md:hidden">
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {education.institution}
                </h3>
                <p className="text-lg text-primary font-semibold mb-1">
                  {education.degree}
                </p>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{education.duration}</span>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {education.institution}
              </h3>
              <p className="text-xl text-primary font-semibold mb-2">
                {education.degree}
              </p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{education.duration}</span>
              </div>
            </div>
            
            <div className="flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
              <img 
                src={ruMonument} 
                alt="University of Rajshahi Monument" 
                className="w-full md:w-32 h-32 md:h-32 object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
