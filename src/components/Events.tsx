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
    <section id="events" className="section-padding bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Events</h2>
        <div className="grid gap-8 max-w-5xl mx-auto">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardContent className="p-6">
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

                <p className="text-foreground/80 mb-4 whitespace-pre-wrap">{event.description}</p>
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