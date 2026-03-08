import { useState, useEffect } from "react";
import {
  Code, Database, BarChart3, Brain, Wrench, Globe, Palette, Terminal,
  Cloud, Smartphone, Lock, Cog, PenTool, FileSpreadsheet, LineChart,
  Server, Cpu, Layers, Search, Zap
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface Skill {
  id: string;
  category: string;
  skill_name: string;
  icon_name: string;
  color_gradient: string;
  image_url?: string;
  link_url?: string;
}

interface SkillItem {
  name: string;
  image_url?: string;
  link_url?: string;
}

interface SkillCategory {
  category: string;
  icon: any;
  color: string;
  skills: SkillItem[];
}

const getCategoryIcon = (categoryName: string) => {
  const lc = categoryName.toLowerCase();
  if (lc.includes("programming") || lc.includes("coding") || lc.includes("development")) return Code;
  if (lc.includes("data") && lc.includes("analy")) return BarChart3;
  if (lc.includes("database") || lc.includes("sql")) return Database;
  if (lc.includes("ai") || lc.includes("machine learning") || lc.includes("artificial")) return Brain;
  if (lc.includes("web") || lc.includes("frontend") || lc.includes("front-end")) return Globe;
  if (lc.includes("design") || lc.includes("ui") || lc.includes("ux")) return Palette;
  if (lc.includes("tool") || lc.includes("productivity")) return Wrench;
  if (lc.includes("terminal") || lc.includes("command") || lc.includes("cli")) return Terminal;
  if (lc.includes("cloud") || lc.includes("aws") || lc.includes("azure")) return Cloud;
  if (lc.includes("mobile") || lc.includes("app")) return Smartphone;
  if (lc.includes("security") || lc.includes("cyber")) return Lock;
  if (lc.includes("devops") || lc.includes("automation")) return Cog;
  if (lc.includes("visual") || lc.includes("graphic")) return PenTool;
  if (lc.includes("excel") || lc.includes("spreadsheet") || lc.includes("sheet")) return FileSpreadsheet;
  if (lc.includes("business") || lc.includes("intelligence") || lc.includes("bi")) return LineChart;
  if (lc.includes("backend") || lc.includes("server")) return Server;
  if (lc.includes("hardware") || lc.includes("embedded")) return Cpu;
  if (lc.includes("framework") || lc.includes("library")) return Layers;
  return Code;
};

const Skills = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [search, setSearch] = useState("");
  const [totalSkills, setTotalSkills] = useState(0);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("display_order");

    if (data) {
      setTotalSkills(data.length);
      const grouped = data.reduce((acc: Record<string, Skill[]>, skill: Skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
      }, {});

      const categories = Object.entries(grouped).map(([category, skills]) => {
        const firstSkill = skills[0];
        return {
          category,
          icon: getCategoryIcon(category),
          color: firstSkill.color_gradient,
          skills: skills.map((s) => ({ name: s.skill_name, image_url: (s as any).image_url, link_url: (s as any).link_url })),
        };
      });
      setSkillCategories(categories);
    }
  };

  const filtered = search
    ? skillCategories
        .map(cat => ({
          ...cat,
          skills: cat.skills.filter(s => s.name.toLowerCase().includes(search.toLowerCase())),
        }))
        .filter(cat => cat.skills.length > 0 || cat.category.toLowerCase().includes(search.toLowerCase()))
    : skillCategories;

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent/[0.04] rounded-full blur-[120px]" />
      </div>

      <Navigation />

      <main className="relative z-10 pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-primary tracking-wide uppercase">
                    Technical Expertise
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                  Skills
                </h1>
                <p className="text-muted-foreground mt-3 text-lg max-w-xl">
                  Tools, technologies, and frameworks I work with daily.
                </p>
              </div>
              {isAdmin && (
                <Button variant="outline" size="sm" onClick={() => navigate("/admin?tab=skills")} className="shrink-0">
                  Manage
                </Button>
              )}
            </div>

            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground text-2xl">{totalSkills}</span>
              <span className="-ml-4">skills</span>
              <div className="w-px h-5 bg-border" />
              <span className="font-semibold text-foreground text-2xl">{skillCategories.length}</span>
              <span className="-ml-4">categories</span>
            </div>
          </div>

          {/* Search */}
          <div className="mb-10">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-card border-border/60 h-10"
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((category, index) => (
              <article
                key={category.category}
                className="group bg-card border border-border/60 rounded-2xl p-6 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {/* Category header */}
                <div className="flex items-center gap-3.5 mb-5">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} shadow-lg`}>
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground leading-tight">{category.category}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{category.skills.length} skills</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => {
                    const inner = (
                      <span className="inline-flex items-center gap-2 px-3.5 py-2 bg-muted/50 border border-border/60 rounded-xl text-sm font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all cursor-default">
                        {skill.image_url ? (
                          <img src={skill.image_url} alt={skill.name} className="w-4.5 h-4.5 rounded object-contain" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                        )}
                        {skill.name}
                      </span>
                    );
                    return skill.link_url ? (
                      <a key={skillIndex} href={skill.link_url} target="_blank" rel="noopener noreferrer" className="cursor-pointer">{inner}</a>
                    ) : (
                      <div key={skillIndex}>{inner}</div>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && skillCategories.length > 0 && (
            <div className="text-center py-20">
              <Zap className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No skills match your search.</p>
              <button onClick={() => setSearch("")} className="text-primary text-sm mt-2 hover:underline">
                Clear search
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Skills;
