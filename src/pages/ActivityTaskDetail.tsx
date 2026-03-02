import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface TaskDetail {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  images: string[];
  link_url: string | null;
  client_url: string | null;
}

const ActivityTaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<TaskDetail | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("activity_tasks")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (data) {
        setTask({ ...data, images: (data.images as string[]) || [], description: data.description, image_url: data.image_url, link_url: data.link_url, client_url: data.client_url });
      }
    };
    fetch();
  }, [id]);

  if (!task) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const allImages = [
    ...(task.image_url ? [task.image_url] : []),
    ...task.images.filter(img => img !== task.image_url),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
      <Navigation />
      <div className="pt-24 pb-16 min-h-screen relative z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-6">{task.title}</h1>

          {allImages.length > 0 && (
            <div className="mb-8">
              {allImages.length === 1 ? (
                <img src={allImages[0]} alt={task.title} className="w-full rounded-2xl object-cover max-h-[500px]" />
              ) : (
                <Carousel plugins={[Autoplay({ delay: 4000 })]} className="w-full">
                  <CarouselContent>
                    {allImages.map((img, i) => (
                      <CarouselItem key={i}>
                        <img src={img} alt={`${task.title} ${i + 1}`} className="w-full rounded-2xl object-cover max-h-[500px]" />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              )}
            </div>
          )}

          {task.description && (
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8" dangerouslySetInnerHTML={{ __html: task.description }} />
          )}

          <div className="flex gap-3 flex-wrap">
            {task.link_url && (
              <Button onClick={() => window.open(task.link_url!, "_blank")} className="rounded-full">Live</Button>
            )}
            {task.client_url && (
              <Button variant="outline" onClick={() => window.open(task.client_url!, "_blank")} className="rounded-full">Client</Button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ActivityTaskDetail;
