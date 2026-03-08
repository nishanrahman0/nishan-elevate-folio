import { useState, useEffect } from "react";
import { FolderOpen, Play, ExternalLink, Github, Search, ArrowRight, Eye } from "lucide-react";
import * as Icons from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  const [search, setSearch] = useState("");

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
    if (project.videos && project.videos.length > 0) {
      const thumb = getVideoThumbnail(project.videos[0]);
      if (thumb) return thumb;
    }
    return null;
  };

  const filtered = projects.filter(p => {
    const matchesTag = activeTag === "All" || p.tags?.includes(activeTag);
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });

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
                    <FolderOpen className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-primary tracking-wide uppercase">
                    Portfolio
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                  Projects
                </h1>
                <p className="text-muted-foreground mt-3 text-lg max-w-xl">
                  Showcasing real-world projects built with modern tools and technologies.
                </p>
              </div>
              {isAdmin && (
                <Button variant="outline" size="sm" onClick={() => navigate("/admin?tab=projects")} className="shrink-0">
                  Manage
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground text-2xl">{projects.length}</span>
              <span className="-ml-4">projects</span>
              <div className="w-px h-5 bg-border" />
              <span className="font-semibold text-foreground text-2xl">{allTags.length}</span>
              <span className="-ml-4">categories</span>
            </div>
          </div>

          {/* Search & Tag Filters */}
          <div className="mb-10 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-card border-border/60 h-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveTag("All")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  activeTag === "All"
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag === activeTag ? "All" : tag)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    activeTag === tag
                      ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((project, index) => {
              const IconComponent = getIcon(project.icon_name);
              const coverImage = getCoverImage(project);
              const hasVideo = project.videos && project.videos.length > 0;

              return (
                <article
                  key={project.id}
                  className="group bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {/* Cover */}
                  {coverImage ? (
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <img
                        src={coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {hasVideo && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <Play className="h-6 w-6 text-primary-foreground ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 flex items-center justify-center">
                      <IconComponent className="h-16 w-16 text-primary/40" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {project.title}
                    </h3>

                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {project.tags.map(tag => (
                          <span key={tag} className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary border border-primary/15">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                      <button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Details
                      </button>
                      {project.link_url && (
                        <a
                          href={project.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Live
                        </a>
                      )}
                      {project.client_url && (
                        <a
                          href={project.client_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Client
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto p-2 rounded-lg bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {filtered.length === 0 && projects.length > 0 && (
            <div className="text-center py-20">
              <FolderOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No projects match your search.</p>
              <button
                onClick={() => { setSearch(""); setActiveTag("All"); }}
                className="text-primary text-sm mt-2 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Projects;
