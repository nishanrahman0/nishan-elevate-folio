import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ActivityTask {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  images?: string[];
  link_url?: string;
  client_url?: string;
  display_order: number;
}

interface ActivityRole {
  id: string;
  organization_id: string;
  role_name: string;
  display_order: number;
  tasks: ActivityTask[];
}

interface Organization {
  id: string;
  name: string;
  description?: string;
  banner_url?: string;
  logo_url?: string;
  display_order: number;
  hidden: boolean;
  roles: ActivityRole[];
}

const Activities = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: orgs } = await supabase
        .from("activity_organizations")
        .select("*")
        .eq("hidden", false)
        .order("display_order", { ascending: true });

      if (!orgs) return;

      const { data: roles } = await supabase
        .from("activity_roles")
        .select("*")
        .order("display_order", { ascending: true });

      const { data: tasks } = await supabase
        .from("activity_tasks")
        .select("*")
        .order("display_order", { ascending: true });

      const organized: Organization[] = orgs.map((org) => ({
        ...org,
        description: org.description || undefined,
        banner_url: org.banner_url || undefined,
        logo_url: org.logo_url || undefined,
        roles: (roles || [])
          .filter((r) => r.organization_id === org.id)
          .map((role) => ({
            ...role,
            tasks: (tasks || [])
              .filter((t) => t.role_id === role.id)
              .map((t) => ({
                ...t,
                description: t.description || undefined,
                image_url: t.image_url || undefined,
                images: (t.images as string[]) || [],
                link_url: t.link_url || undefined,
                client_url: t.client_url || undefined,
              })),
          })),
      }));

      setOrganizations(organized);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const getCoverImage = (task: ActivityTask): string | null => {
    if (task.image_url) return task.image_url;
    if (task.images && task.images.length > 0) return task.images[0];
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <Navigation />
      <div className="pt-24 pb-16 min-h-screen relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">Extracurricular Activities</h1>
            {isAdmin && (
              <Button variant="outline" onClick={() => navigate("/admin?tab=activities")}>Manage Activities</Button>
            )}
          </div>

          {organizations.length === 0 && (
            <p className="text-muted-foreground text-center py-16">No activities yet.</p>
          )}

          <div className="space-y-16">
            {organizations.map((org, orgIndex) => (
              <section
                key={org.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${orgIndex * 200}ms` }}
              >
                {/* Organization Header */}
                <h2 className="text-2xl md:text-3xl font-bold text-primary uppercase tracking-wide mb-2">
                  {org.name}
                </h2>

                {/* Banner */}
                {org.banner_url && (
                  <div className="w-full h-24 md:h-36 rounded-xl overflow-hidden mb-6">
                    <img src={org.banner_url} alt={org.name} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Description + Logo */}
                {(org.description || org.logo_url) && (
                  <div className="flex flex-col md:flex-row gap-6 mb-8">
                    {org.description && (
                      <p className="flex-1 text-foreground/80 text-base md:text-lg leading-relaxed text-justify">
                        {org.description}
                      </p>
                    )}
                    {org.logo_url && (
                      <div className="flex-shrink-0 flex items-start justify-center">
                        <img src={org.logo_url} alt={`${org.name} logo`} className="w-28 h-28 md:w-36 md:h-36 object-contain" />
                      </div>
                    )}
                  </div>
                )}

                {/* Roles */}
                {org.roles.map((role) => (
                  <div key={role.id} className="mb-10">
                    <div className="inline-block mb-4">
                      <h3 className="text-xl md:text-2xl font-bold bg-primary text-primary-foreground px-4 py-1.5 rounded-lg">
                        {role.role_name}
                      </h3>
                    </div>

                    {/* Tasks Grid (like Projects) */}
                    {role.tasks.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {role.tasks.map((task, taskIndex) => {
                          const coverImage = getCoverImage(task);
                          return (
                            <div
                              key={task.id}
                              className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden hover:border-primary/40 transition-colors animate-fade-in-up"
                              style={{ animationDelay: `${taskIndex * 100}ms` }}
                            >
                              {coverImage ? (
                                <div className="aspect-video overflow-hidden m-4 rounded-xl">
                                  <img src={coverImage} alt={task.title} className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 m-4 rounded-xl">
                                  <span className="text-4xl text-primary/40">📌</span>
                                </div>
                              )}
                              <h4 className="text-lg md:text-xl font-bold text-primary text-center px-4 pt-2">
                                {task.title}
                              </h4>
                              <div className="flex items-center justify-center gap-3 p-4 pt-3 pb-6 flex-wrap">
                                {task.description && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full px-5 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                                    onClick={() => navigate(`/activity-task/${task.id}`)}
                                  >
                                    Details
                                  </Button>
                                )}
                                {task.link_url && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full px-5 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                                    onClick={() => window.open(task.link_url, "_blank")}
                                  >
                                    Live
                                  </Button>
                                )}
                                {task.client_url && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full px-5 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                                    onClick={() => window.open(task.client_url, "_blank")}
                                  >
                                    Client
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm italic">No tasks added yet.</p>
                    )}
                  </div>
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Activities;
