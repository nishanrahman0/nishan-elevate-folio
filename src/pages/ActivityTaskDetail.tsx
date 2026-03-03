import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Download } from "lucide-react";
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
  files: string[];
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
        setTask({ ...data, images: (data.images as string[]) || [], files: (data.files as string[]) || [], description: data.description, image_url: data.image_url, link_url: data.link_url, client_url: data.client_url });
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

          {/* Files Section */}
          {task.files.length > 0 && (
            <div className="mb-8 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Attached Files</h3>
              <div className="grid gap-4">
                {task.files.map((fileUrl, i) => {
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
