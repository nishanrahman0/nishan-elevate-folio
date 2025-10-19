import { useState, useEffect } from "react";
import { BarChart3, Code, Palette } from "lucide-react";
import * as Icons from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Skill {
  id: string;
  category: string;
  skill_name: string;
  icon_name: string;
  color_gradient: string;
}

interface SkillCategory {
  category: string;
  icon: any;
  color: string;
  skills: string[];
}

const Skills = () => {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("display_order");

    if (data) {
      // Group skills by category
      const grouped = data.reduce((acc: Record<string, Skill[]>, skill: Skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      }, {});

      // Convert to array format
      const categories = Object.entries(grouped).map(([category, skills]) => {
        const firstSkill = skills[0];
        const IconComponent = (Icons as any)[firstSkill.icon_name] || Code;
        return {
          category,
          icon: IconComponent,
          color: firstSkill.color_gradient,
          skills: skills.map((s) => s.skill_name),
        };
      });

      setSkillCategories(categories);
    }
  };
  return (
    <section id="skills" className="section-padding bg-gradient-to-br from-background via-accent/5 to-secondary/5 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-40 left-10 w-72 h-72 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-l from-secondary/10 to-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
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
