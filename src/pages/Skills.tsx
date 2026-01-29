import { useState, useEffect } from "react";
import { 
  Code, 
  Database, 
  BarChart3, 
  Brain, 
  Wrench, 
  Globe, 
  Palette, 
  Terminal, 
  Cloud, 
  Smartphone, 
  Lock, 
  Cog,
  PenTool,
  FileSpreadsheet,
  LineChart,
  Server,
  Cpu,
  Layers
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

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

// Map category names to appropriate icons
const getCategoryIcon = (categoryName: string) => {
  const lowerCategory = categoryName.toLowerCase();
  
  if (lowerCategory.includes("programming") || lowerCategory.includes("coding") || lowerCategory.includes("development")) {
    return Code;
  }
  if (lowerCategory.includes("data") && lowerCategory.includes("analy")) {
    return BarChart3;
  }
  if (lowerCategory.includes("database") || lowerCategory.includes("sql")) {
    return Database;
  }
  if (lowerCategory.includes("ai") || lowerCategory.includes("machine learning") || lowerCategory.includes("artificial")) {
    return Brain;
  }
  if (lowerCategory.includes("web") || lowerCategory.includes("frontend") || lowerCategory.includes("front-end")) {
    return Globe;
  }
  if (lowerCategory.includes("design") || lowerCategory.includes("ui") || lowerCategory.includes("ux")) {
    return Palette;
  }
  if (lowerCategory.includes("tool") || lowerCategory.includes("productivity")) {
    return Wrench;
  }
  if (lowerCategory.includes("terminal") || lowerCategory.includes("command") || lowerCategory.includes("cli")) {
    return Terminal;
  }
  if (lowerCategory.includes("cloud") || lowerCategory.includes("aws") || lowerCategory.includes("azure")) {
    return Cloud;
  }
  if (lowerCategory.includes("mobile") || lowerCategory.includes("app")) {
    return Smartphone;
  }
  if (lowerCategory.includes("security") || lowerCategory.includes("cyber")) {
    return Lock;
  }
  if (lowerCategory.includes("devops") || lowerCategory.includes("automation")) {
    return Cog;
  }
  if (lowerCategory.includes("visual") || lowerCategory.includes("graphic")) {
    return PenTool;
  }
  if (lowerCategory.includes("excel") || lowerCategory.includes("spreadsheet") || lowerCategory.includes("sheet")) {
    return FileSpreadsheet;
  }
  if (lowerCategory.includes("business") || lowerCategory.includes("intelligence") || lowerCategory.includes("bi")) {
    return LineChart;
  }
  if (lowerCategory.includes("backend") || lowerCategory.includes("server")) {
    return Server;
  }
  if (lowerCategory.includes("hardware") || lowerCategory.includes("embedded")) {
    return Cpu;
  }
  if (lowerCategory.includes("framework") || lowerCategory.includes("library")) {
    return Layers;
  }
  
  // Default icon
  return Code;
};

const Skills = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
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
      const grouped = data.reduce((acc: Record<string, Skill[]>, skill: Skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      }, {});

      const categories = Object.entries(grouped).map(([category, skills]) => {
        const firstSkill = skills[0];
        // Use auto-detection based on category name instead of stored icon
        const IconComponent = getCategoryIcon(category);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
      <div className="absolute top-40 left-10 w-[800px] h-[800px] bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[800px] h-[800px] bg-gradient-to-l from-accent/20 to-primary/20 rounded-full blur-3xl pointer-events-none" />
      <Navigation />
      <div className="pt-24 pb-16 min-h-screen relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">Skills</h1>
            {isAdmin && (
              <Button variant="outline" onClick={() => navigate("/admin?tab=skills")}>Manage Skills</Button>
            )}
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
      </div>
      <Footer />
    </div>
  );
};

export default Skills;
