import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Activity {
  id: string;
  title: string;
  organization: string;
  icon_name: string;
  color_gradient: string;
  display_order: number;
}

const Extracurricular = () => {
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
    <section id="extracurricular" className="section-padding bg-gradient-to-br from-background via-secondary/5 to-accent/5 relative overflow-hidden">
      {/* Scattered dot pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary rounded-full animate-pulse" />
        <div className="absolute top-40 right-32 w-2 h-2 bg-accent rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-32 left-40 w-2 h-2 bg-secondary rounded-full animate-pulse delay-700" />
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-primary rounded-full animate-pulse delay-1000" />
      </div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Extracurricular Activities</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
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
                <div className={`p-4 bg-gradient-to-br ${activity.color_gradient} rounded-xl w-fit mb-4`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{activity.title}</h3>
                <p className="text-primary font-semibold">{activity.organization}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Extracurricular;
