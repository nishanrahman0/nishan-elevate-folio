import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Download, Play } from "lucide-react";
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
  videos: string[];
  link_url: string | null;
  client_url: string | null;
}

const getYouTubeId = (url: string): string | null => {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

const getVideoEmbed = (url: string): { embedUrl: string; type: string } | null => {
  const ytId = getYouTubeId(url);
  if (ytId) return { embedUrl: `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`, type: "youtube" };
  if (url.includes("facebook.com") || url.includes("fb.watch")) {
    return { embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=560`, type: "facebook" };
  }
  return null;
};

const VideoThumbnail = ({ url, alt, onClick }: { url: string; alt: string; onClick: () => void }) => {
  const ytId = getYouTubeId(url);
  const [imgSrc, setImgSrc] = useState(
    ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : ""
  );
  const [failed, setFailed] = useState(!ytId);

  if (failed) {
    return (
      <div
        className="aspect-video bg-muted/30 flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onClick}
      >
        <div className="text-center">
          <Play className="h-10 w-10 text-primary mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Play Video</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video relative cursor-pointer group" onClick={onClick}>
      <img
        src={imgSrc}
        alt={alt}
        className="w-full h-full object-cover"
        onError={() => {
          if (ytId && imgSrc.includes("maxresdefault")) {
            setImgSrc(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`);
          } else {
            setFailed(true);
          }
        }}
      />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
        <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <Play className="h-6 w-6 text-primary-foreground ml-1" />
        </div>
      </div>
    </div>
  );
};

const ActivityTaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("activity_tasks")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (data) {
        setTask({
          ...data,
          images: (data.images as string[]) || [],
          files: (data.files as string[]) || [],
          videos: (data.videos as string[]) || [],
          description: data.description,
          image_url: data.image_url,
          link_url: data.link_url,
          client_url: data.client_url,
        });
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

          {/* Videos Section */}
          {task.videos.length > 0 && (
            <div className="mb-8 space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" /> Videos
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {task.videos.map((videoUrl, i) => {
                  const embed = getVideoEmbed(videoUrl);
                  const thumb = getVideoThumbnail(videoUrl);
                  const isPlaying = playingVideo === videoUrl;

                  return (
                    <div key={i} className="rounded-xl overflow-hidden border border-border/40 bg-card/50">
                      {isPlaying && embed ? (
                        <div className="aspect-video">
                          <iframe
                            src={embed.embedUrl + "?autoplay=1"}
                            className="w-full h-full"
                            allowFullScreen
                            allow="autoplay; encrypted-media"
                            title={`Video ${i + 1}`}
                          />
                        </div>
                      ) : thumb ? (
                        <div
                          className="aspect-video relative cursor-pointer group"
                          onClick={() => embed ? setPlayingVideo(videoUrl) : window.open(videoUrl, "_blank")}
                        >
                          <img src={thumb} alt={`Video ${i + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                            <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="h-6 w-6 text-primary-foreground ml-1" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="aspect-video bg-muted/30 flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => embed ? setPlayingVideo(videoUrl) : window.open(videoUrl, "_blank")}
                        >
                          <div className="text-center">
                            <Play className="h-10 w-10 text-primary mx-auto mb-2" />
                            <p className="text-xs text-muted-foreground">Play Video</p>
                          </div>
                        </div>
                      )}
                      <div className="p-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground truncate flex-1">{videoUrl}</span>
                        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => window.open(videoUrl, "_blank")}>
                          Open
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
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
