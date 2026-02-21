import { useState, useEffect } from "react";
import { FolderOpen } from "lucide-react";
import * as Icons from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface Project {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  image_url?: string;
  images?: string[];
  link_url?: string;
}

const Projects = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("display_order");

    if (data) {
      setProjects(data.map(d => ({ ...d, images: (d.images as string[]) || [] })));
    }
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || FolderOpen;
  };

  const getCoverImage = (project: Project): string | null => {
    if (project.image_url) return project.image_url;
    if (project.images && project.images.length > 0) return project.images[0];
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-tl from-accent/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <Navigation />
      <div className="pt-24 pb-16 min-h-screen relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">Projects</h1>
            {isAdmin && (
              <Button variant="outline" onClick={() => navigate("/admin?tab=projects")}>Manage Projects</Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {projects.map((project, index) => {
              const IconComponent = getIcon(project.icon_name);
              const coverImage = getCoverImage(project);

              return (
                <div
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="glass-card rounded-2xl overflow-hidden hover:scale-105 transition-transform animate-fade-in-up group cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {coverImage ? (
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                      <IconComponent className="h-16 w-16 text-primary/60" />
                    </div>
                  )}
                  <div className="p-3 md:p-4">
                    <h3 className="text-sm md:text-base font-bold text-foreground text-center line-clamp-2">
                      {project.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Projects;
