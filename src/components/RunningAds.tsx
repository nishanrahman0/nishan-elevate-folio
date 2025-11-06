import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface RunningAd {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  link_url: string | null;
  display_order: number;
  active: boolean;
}

const RunningAds = () => {
  const { data: ads } = useQuery({
    queryKey: ["running-ads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("running_ads")
        .select("*")
        .eq("active", true)
        .order("display_order");
      
      if (error) throw error;
      return data as RunningAd[];
    },
  });

  if (!ads || ads.length === 0) return null;

  return (
    <section className="section-padding bg-gradient-to-b from-accent/5 via-primary/10 to-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-accent/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Running Ads</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad, index) => (
            <Card 
              key={ad.id} 
              className="glass-card overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {ad.image_url && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={ad.image_url}
                    alt={ad.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 gradient-text">{ad.title}</h3>
                <p className="text-muted-foreground mb-4">{ad.description}</p>
                {ad.link_url && (
                  <a
                    href={ad.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors"
                  >
                    Learn More <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RunningAds;