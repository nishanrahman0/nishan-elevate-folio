import { Users, Award } from "lucide-react";

const activities = [
  {
    title: "Deputy Director of Documentation",
    organization: "Rajshahi University Career Club",
    icon: Users,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Volunteer",
    organization: "Hult Prize RU 2024–25",
    icon: Award,
    gradient: "from-purple-500 to-pink-500",
  },
];

const Extracurricular = () => {
  return (
    <section id="extracurricular" className="section-padding">
      <div className="container mx-auto max-w-4xl">
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
