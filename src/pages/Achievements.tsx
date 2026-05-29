import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Trophy, ExternalLink, Play } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Achievement {
  id: string;
  title: string;
  description: string | null;
  date_text: string | null;
  issuer: string | null;
  images: string[];
  video_url: string | null;
  link_url: string | null;
}

const getEmbed = (url: string): string | null => {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  if (url.includes("facebook.com")) return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
  if (url.includes("linkedin.com")) return url;
  return url;
};

const getThumb = (url: string): string | null => {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return yt ? `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg` : null;
};

const Achievements = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Achievement[]>([]);

  useEffect(() => {
    supabase.from("achievements").select("*").eq("hidden", false).order("display_order").then(({ data }) => {
      setItems((data || []).map((a: any) => ({ ...a, images: Array.isArray(a.images) ? a.images : [] })));
    });
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-yellow-500/[0.05] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-orange-500/[0.05] rounded-full blur-[120px]" />
      </div>

      <Navigation />

      <main className="relative z-10 pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-12 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                </div>
                <span className="text-sm font-medium text-yellow-500 tracking-wide uppercase">Recognition</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Achievements</h1>
              <p className="text-muted-foreground mt-3 text-lg max-w-xl">
                Awards, recognitions, and milestones I'm proud of.
              </p>
            </div>
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => navigate("/admin?tab=achievements")}>
                Manage
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p>No achievements published yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {items.map((a, idx) => (
                <article
                  key={a.id}
                  className="bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-yellow-500/40 hover:shadow-xl hover:shadow-yellow-500/5 transition-all animate-fade-in-up"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  {a.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-1 bg-muted/30">
                      {a.images.slice(0, 4).map((img, i) => (
                        <img key={i} src={img} alt={a.title} loading="lazy"
                          className={`object-cover w-full ${a.images.length === 1 ? 'col-span-2 aspect-[16/9]' : 'aspect-square'}`} />
                      ))}
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1">{a.title}</h3>
                    {(a.issuer || a.date_text) && (
                      <p className="text-sm text-yellow-500 font-medium mb-2">
                        {[a.issuer, a.date_text].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    {a.description && <p className="text-sm text-muted-foreground mb-4">{a.description}</p>}

                    {a.video_url && (
                      <div className="mb-4 rounded-xl overflow-hidden border border-border/60 aspect-video bg-black">
                        {getEmbed(a.video_url) ? (
                          <iframe src={getEmbed(a.video_url)!} className="w-full h-full" allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                        ) : (
                          <a href={a.video_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-full text-primary">
                            {getThumb(a.video_url) && <img src={getThumb(a.video_url)!} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />}
                            <Play className="h-12 w-12 relative" />
                          </a>
                        )}
                      </div>
                    )}

                    {a.link_url && (
                      <a href={a.link_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                        Learn more <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Achievements;
