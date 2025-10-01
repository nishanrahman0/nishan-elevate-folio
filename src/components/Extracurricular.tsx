import { Users, Award } from "lucide-react";

const activities = [
  {
    title: "Deputy Director of Documentation",
    organization: "Rajshahi University Career Club",
    icon: Users,
    gradient: "from-primary to-secondary",
  },
  {
    title: "Volunteer",
    organization: "Hult Prize RU 2024–25",
    icon: Award,
    gradient: "from-accent to-primary",
  },
];

const Extracurricular = () => {
  return (
    <section id="extracurricular" className="section-padding bg-gradient-to-br from-background via-secondary/5 to-accent/5 relative overflow-hidden">
      {/* Scattered dot pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary rounded-full animate-pulse" />
        <div className="absolute top-40 right-32 w-2 h-2 bg-accent rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-32 left-40 w-2 h-2 bg-secondary rounded-full animate-pulse delay-700" />
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-primary rounded-full animate-pulse delay-1000" />
      </div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Extracurricular Activities</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-8 hover:scale-105 transition-transform animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={`p-4 bg-gradient-to-br ${activity.gradient} rounded-xl w-fit mb-4`}>
                <activity.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{activity.title}</h3>
              <p className="text-primary font-semibold">{activity.organization}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Extracurricular;
