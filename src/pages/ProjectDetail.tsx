import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, FileText, Download } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const getVideoEmbed = (url: string): string | null => {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Facebook video
  if (url.includes("facebook.com") || url.includes("fb.watch")) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
  }
  // LinkedIn video (no embed support, fallback to link)
  return null;
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id!)
        .single();

      if (error) throw error;
      return {
        ...data,
        images: (data.images as string[]) || [],
        files: (data.files as string[]) || [],
        tags: (data.tags as string[]) || [],
        videos: (data.videos as string[]) || [],
      };
    },
    enabled: !!id,
  });

  const getAllImages = (): string[] => {
    if (!project) return [];
    const imgs: string[] = [];
    if (project.image_url) imgs.push(project.image_url);
    if (project.images) imgs.push(...project.images);
    return imgs;
  };

  const allImages = getAllImages();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-tl from-accent/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <Navigation />
      <div className="pt-24 pb-16 min-h-screen relative z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/projects")}
            className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>

          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading project...</p>
          ) : !project ? (
            <p className="text-center text-muted-foreground">Project not found.</p>
          ) : (
            <div className="glass-card rounded-2xl overflow-hidden">
              {allImages.length > 1 ? (
                <Carousel
                  opts={{ loop: true }}
                  plugins={[Autoplay({ delay: 4000 })]}
                  className="w-full"
                >
                  <CarouselContent>
                    {allImages.map((img, i) => (
                      <CarouselItem key={i}>
                        <img
                          src={img}
                          alt={`${project.title} - ${i + 1}`}
                          className="w-full h-64 md:h-96 object-cover"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </Carousel>
              ) : allImages.length === 1 ? (
                <img
                  src={allImages[0]}
                  alt={project.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
              ) : null}

              <div className="p-6 md:p-10">
                <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                  {project.title}
                </h1>

                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                )}

                <div
                  className="prose prose-sm md:prose-lg max-w-none text-foreground"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />

                {/* Videos Section */}
                {project.videos && project.videos.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Videos</h3>
                    <div className="grid gap-4">
                      {project.videos.map((videoUrl: string, i: number) => {
                        const embedUrl = getVideoEmbed(videoUrl);
                        if (embedUrl) {
                          return (
                            <div key={i} className="aspect-video rounded-xl overflow-hidden border border-border/50">
                              <iframe
                                src={embedUrl}
                                className="w-full h-full"
                                allowFullScreen
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                                title={`Video ${i + 1}`}
                              />
                            </div>
                          );
                        }
                        // Fallback for LinkedIn or unsupported
                        return (
                          <a
                            key={i}
                            href={videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/30 hover:border-primary/40 transition-colors"
                          >
                            <ExternalLink className="h-5 w-5 text-primary" />
                            <span className="text-sm text-foreground/80">Watch on {videoUrl.includes('linkedin') ? 'LinkedIn' : 'External Platform'}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Files Section */}
                {project.files && project.files.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Attached Files</h3>
                    <div className="grid gap-4">
                      {project.files.map((fileUrl: string, i: number) => {
                        const fileName = fileUrl.split('/').pop()?.split('?')[0] || `File ${i + 1}`;
                        const isPdf = fileUrl.toLowerCase().includes('.pdf');
                        return (
                          <div key={i} className="space-y-2">
                            {isPdf && (
                              <iframe src={fileUrl} className="w-full h-[600px] rounded-xl border border-border/50" title={fileName} />
                            )}
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/30">
                              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                              <span className="text-sm text-foreground/80 truncate flex-1">{fileName}</span>
                              <Button size="sm" variant="outline" className="rounded-full gap-2" onClick={() => window.open(fileUrl, '_blank')}>
                                <Download className="h-3 w-3" /> {isPdf ? 'View' : 'Download'}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-8">
                  {project.link_url && (
                    <a href={project.link_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                      <ExternalLink className="h-4 w-4" /> Live
                    </a>
                  )}
                  {project.client_url && (
                    <a href={project.client_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-primary text-primary font-semibold hover:bg-primary/10 transition-colors">
                      <ExternalLink className="h-4 w-4" /> Client
                    </a>
                  )}
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-primary text-primary font-semibold hover:bg-primary/10 transition-colors">
                      <ExternalLink className="h-4 w-4" /> GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
