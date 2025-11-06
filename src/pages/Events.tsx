import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface Event {
  id: string;
  title: string;
  description: string;
  caption: string | null;
  images: string[];
  display_order: number;
}

const Events = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("display_order");
      
      if (error) throw error;
      return data as Event[];
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <Navigation />
      <div className="pt-24 pb-16 min-h-screen relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">Events</h1>
            {isAdmin && (
              <Button variant="outline" onClick={() => navigate("/admin?tab=events")}>Manage Events</Button>
            )}
          </div>
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading events...</p>
          ) : !events || events.length === 0 ? (
            <p className="text-center text-muted-foreground">No events yet.</p>
          ) : (
            <div className="space-y-12">
              {events.map((event) => (
                <Card key={event.id} className="glass-card overflow-hidden">
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold mb-4 gradient-text">{event.title}</h2>
                    
                    <p className="text-lg text-foreground mb-6 leading-relaxed">{event.description}</p>
                    
                    {event.images && event.images.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {event.images.map((imageUrl, index) => (
                          <div key={index} className="rounded-lg overflow-hidden hover:scale-105 transition-transform">
                            <img
                              src={imageUrl}
                              alt={`${event.title} - Image ${index + 1}`}
                              className="w-full h-64 object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {event.caption && (
                      <p className="text-sm text-muted-foreground italic mt-4 border-l-4 border-primary pl-4">
                        {event.caption}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Events;