import { Briefcase, Code, Calendar, TrendingUp } from "lucide-react";

const experiences = [
  {
    title: "Content Writer",
    company: "USA-based Company",
    duration: "3 months (May–July 2024)",
    description: "Created engaging content for various digital platforms",
    icon: Briefcase,
  },
  {
    title: "Google Data Analytics Projects",
    company: "Self-paced Learning",
    duration: "50+ hands-on projects",
    description: "Google Sheets, Tableau, BigQuery, R Programming",
    icon: Code,
  },
  {
    title: "Google Data Analytics Capstone",
    company: "Google Certificate Program",
    duration: "Completed Case Study",
    description: "End-to-end data analysis project demonstrating full data analytics lifecycle",
    icon: TrendingUp,
  },
];

const Experience = () => {
  return (
    <section id="experience" className="section-padding bg-gradient-to-tl from-muted/30 via-background to-primary/5 relative overflow-hidden">
      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-br-full" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-accent/10 to-transparent rounded-tl-full" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Work Experience & Projects</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform animate-fade-in-up group"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-xl w-fit mb-4 group-hover:shadow-lg transition-shadow">
                <exp.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-2">{exp.title}</h3>
              <p className="text-primary font-semibold mb-2">{exp.company}</p>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Calendar className="h-4 w-4" />
                <span>{exp.duration}</span>
              </div>
              
              <p className="text-sm text-muted-foreground">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
