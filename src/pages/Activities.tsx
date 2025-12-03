import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface Activity {
  id: string;
  title: string;
  organization: string;
  icon_name: string;
  color_gradient: string;
  display_order: number;
  image_url?: string;
}

const Activities = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from("extracurricular_activities")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <Navigation />
      <div className="pt-24 pb-16 min-h-screen relative z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">Extracurricular Activities</h1>
            {isAdmin && (
              <Button variant="outline" onClick={() => navigate("/admin?tab=activities")}>Manage Activities</Button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {activities.map((activity, index) => {
              const IconComponent = Icons[activity.icon_name as keyof typeof Icons] as React.ComponentType<{ className?: string }> || Icons.Users;
              return (
                <div
                  key={activity.id}
                  className="glass-card rounded-2xl p-8 hover:scale-105 transition-transform animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {activity.image_url ? (
                    <div className="rounded-xl mb-4 p-1 bg-gradient-to-br from-primary/20 to-accent/20">
                      <img src={activity.image_url} alt={activity.title} className="w-full h-48 object-cover rounded-lg" />
                    </div>
                  ) : (
                    <div className={`p-4 bg-gradient-to-br ${activity.color_gradient} rounded-xl w-fit mb-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-foreground mb-2">{activity.title}</h3>
                  <p className="text-primary font-semibold">{activity.organization}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Activities;
