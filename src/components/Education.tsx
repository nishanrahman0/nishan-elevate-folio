import { GraduationCap, Calendar } from "lucide-react";

const Education = () => {
  return (
    <section id="education" className="section-padding bg-gradient-to-bl from-background via-secondary/5 to-background relative overflow-hidden">
      {/* Floating decorative shapes */}
      <div className="absolute top-20 right-20 w-32 h-32 border-2 border-primary/20 rounded-full animate-pulse" />
      <div className="absolute bottom-40 left-20 w-24 h-24 border-2 border-accent/20 rounded-full animate-pulse delay-1000" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Education</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        <div className="glass-card rounded-2xl p-8 md:p-12 animate-scale-in hover:shadow-2xl transition-shadow">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                University of Rajshahi
              </h3>
              <p className="text-xl text-primary font-semibold mb-2">
                BBA in Management Studies
              </p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>September 2023 – Present</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
