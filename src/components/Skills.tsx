import { BarChart3, Code, Palette, Database } from "lucide-react";

const skillCategories = [
  {
    category: "Data Analytics & Visualization",
    icon: BarChart3,
    color: "from-blue-500 to-cyan-500",
    skills: ["Excel", "Google Sheets", "Tableau", "Power BI", "R", "Python", "SQL"],
  },
  {
    category: "Productivity & Design Tools",
    icon: Palette,
    color: "from-purple-500 to-pink-500",
    skills: ["MS Office", "Google Docs", "Canva", "After Effects", "Drive Management"],
  },
];

const Skills = () => {
  return (
    <section id="skills" className="section-padding">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Skills</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-8 animate-slide-in-left hover:shadow-2xl transition-shadow"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 bg-gradient-to-br ${category.color} rounded-xl`}>
                  <category.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{category.category}</h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-full text-sm font-medium text-foreground hover:scale-105 transition-transform"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
