import { useState, useEffect } from "react";
import { FolderOpen, Play } from "lucide-react";
import * as Icons from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  client_url?: string;
  github_url?: string;
  tags?: string[];
  videos?: string[];
}

const getVideoThumbnail = (url: string): string | null => {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  return null;
};

const Projects = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [activeTag, setActiveTag] = useState<string>("All");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("display_order");

    if (data) {
      const mapped = data.map(d => ({
        ...d,
        images: (d.images as string[]) || [],
        tags: (d.tags as string[]) || [],
        videos: (d.videos as string[]) || [],
      }));
      setProjects(mapped);
      // Extract unique tags
      const tags = new Set<string>();
      mapped.forEach(p => p.tags?.forEach((t: string) => tags.add(t)));
      setAllTags(Array.from(tags));
    }
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || FolderOpen;
  };

  const getCoverImage = (project: Project): string | null => {
    if (project.image_url) return project.image_url;
    if (project.images && project.images.length > 0) return project.images[0];
    // Check for video thumbnail
    if (project.videos && project.videos.length > 0) {
      const thumb = getVideoThumbnail(project.videos[0]);
      if (thumb) return thumb;
    }
    return null;
  };

  const filteredProjects = activeTag === "All"
    ? projects
    : projects.filter(p => p.tags?.includes(activeTag));

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

          {/* Tag filters */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <Button
                variant={activeTag === "All" ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setActiveTag("All")}
              >
                All
              </Button>
              {allTags.map(tag => (
                <Button
                  key={tag}
                  variant={activeTag === tag ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setActiveTag(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => {
              const IconComponent = getIcon(project.icon_name);
              const coverImage = getCoverImage(project);
              const hasVideo = project.videos && project.videos.length > 0;

              return (
                <div
                  key={project.id}
                  className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden animate-fade-in-up hover:border-primary/40 transition-colors"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {coverImage ? (
                    <div className="aspect-video overflow-hidden m-4 rounded-xl relative group">
                      <img
                        src={coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {hasVideo && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
                            <Play className="h-6 w-6 text-primary-foreground ml-1" />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 m-4 rounded-xl">
                      <IconComponent className="h-16 w-16 text-primary/60" />
                    </div>
                  )}
                  <h3 className="text-lg md:text-xl font-bold text-primary text-center px-4 pt-2">
                    {project.title}
                  </h3>
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center px-4 pt-2">
                      {project.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-3 p-4 pt-3 pb-6 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full px-5 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      Details
                    </Button>
                    {project.link_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full px-5 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                        onClick={() => window.open(project.link_url, "_blank")}
                      >
                        Live
                      </Button>
                    )}
                    {project.client_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full px-5 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                        onClick={() => window.open(project.client_url, "_blank")}
                      >
                        Client
                      </Button>
                    )}
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
