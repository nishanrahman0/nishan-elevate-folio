import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface Event {
  id: string;
  title: string;
  description: string;
  caption: string | null;
  images: string[];
  display_order: number;
}

const Events = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data as Event[];
    },
  });

  if (isLoading) {
    return (
      <section id="events" className="section-padding">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Events</h2>
          <p className="text-center text-muted-foreground">Loading events...</p>
        </div>
      </section>
    );
  }

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <section id="events" className="section-padding bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
      {/* Enhanced gradient orbs */}
      <div className="absolute top-20 left-10 w-[700px] h-[700px] bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-20 right-10 w-[750px] h-[750px] bg-gradient-to-l from-accent/20 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse delay-700" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Events</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>
        
        <div className="grid gap-8 max-w-5xl mx-auto">
          {events.map((event) => (
            <Card key={event.id} className="glass-card overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 gradient-text">{event.title}</h3>
                
                {event.images && event.images.length > 0 && (
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    plugins={[
                      Autoplay({
                        delay: 3000,
                      }),
                    ]}
                    className="w-full mb-6"
                  >
                    <CarouselContent>
                      {event.images.map((imageUrl, index) => (
                        <CarouselItem key={index}>
                          <div className="aspect-video relative rounded-lg overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={`${event.title} - Image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </Carousel>
                )}

                <div 
                  className="prose prose-lg max-w-none mb-4 text-foreground/80"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
                {event.caption && (
                  <p className="text-sm text-muted-foreground italic">{event.caption}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;