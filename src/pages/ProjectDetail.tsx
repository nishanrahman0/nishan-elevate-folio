import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

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
                <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
                  {project.title}
                </h1>

                <div
                  className="prose prose-sm md:prose-lg max-w-none text-foreground"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />

                {project.link_url && (
                  <a
                    href={project.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Project
                  </a>
                )}
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
