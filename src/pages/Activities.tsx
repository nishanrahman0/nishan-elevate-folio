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
  const [activeRoles, setActiveRoles] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [orgsRes, rolesRes, tasksRes] = await Promise.all([
        supabase.from("activity_organizations").select("*").eq("hidden", false).order("display_order", { ascending: true }),
        supabase.from("activity_roles").select("*").order("display_order", { ascending: true }),
        supabase.from("activity_tasks").select("*").order("display_order", { ascending: true }),
      ]);

      const orgs = orgsRes.data;
      const roles = rolesRes.data;
      const tasks = tasksRes.data;
      if (!orgs) return;

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

      // Set default active role per org
      const defaults: Record<string, string> = {};
      organized.forEach((org) => {
        if (org.roles.length > 0) {
          defaults[org.id] = org.roles[0].id;
        }
      });
      setActiveRoles(defaults);
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

  const getActiveRole = (org: Organization): ActivityRole | undefined => {
    const activeId = activeRoles[org.id];
    return org.roles.find((r) => r.id === activeId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <Navigation />
      <div className="pt-24 pb-16 min-h-screen relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">Extracurricular Activities</h1>
            {isAdmin && (
              <Button variant="outline" onClick={() => navigate("/admin?tab=activities")}>Manage</Button>
            )}
          </div>

          {organizations.length === 0 && (
            <p className="text-muted-foreground text-center py-16">No activities yet.</p>
          )}

          <div className="space-y-14">
            {organizations.map((org, orgIndex) => {
              const activeRole = getActiveRole(org);
              return (
                <section
                  key={org.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${orgIndex * 150}ms` }}
                >
                  {/* Organization Card */}
                  <div className="glass-card rounded-2xl p-6 md:p-8 mb-6">
                    {/* Banner */}
                    {org.banner_url && (
                      <div className="w-full h-32 md:h-44 rounded-xl overflow-hidden mb-6 -mt-2">
                        <img src={org.banner_url} alt={org.name} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-5 items-start">
                      {/* Logo */}
                      {org.logo_url && (
                        <div className="flex-shrink-0">
                          <img
                            src={org.logo_url}
                            alt={`${org.name} logo`}
                            className="w-20 h-20 md:w-24 md:h-24 object-contain rounded-xl border border-border/30 bg-background/50 p-2"
                            loading="lazy"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                          {org.name}
                        </h2>
                        {org.description && (
                          <p className="text-foreground/70 text-sm md:text-base leading-relaxed">
                            {org.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Role Tabs */}
                  {org.roles.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-8">
                      {org.roles.map((role) => (
                        <Button
                          key={role.id}
                          variant={activeRoles[org.id] === role.id ? "default" : "outline"}
                          size="sm"
                          className="rounded-full px-5"
                          onClick={() => setActiveRoles((prev) => ({ ...prev, [org.id]: role.id }))}
                        >
                          {role.role_name}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Tasks for Active Role */}
                  {activeRole && activeRole.tasks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {activeRole.tasks.map((task, taskIndex) => {
                        const coverImage = getCoverImage(task);
                        return (
                          <div
                            key={task.id}
                            className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden hover:border-primary/40 transition-all hover:shadow-lg animate-fade-in-up"
                            style={{ animationDelay: `${taskIndex * 80}ms` }}
                          >
                            {coverImage ? (
                              <div className="aspect-video overflow-hidden m-3 rounded-xl">
                                <img src={coverImage} alt={task.title} className="w-full h-full object-cover" loading="lazy" />
                              </div>
                            ) : (
                              <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 m-3 rounded-xl">
                                <span className="text-4xl text-primary/30">📌</span>
                              </div>
                            )}
                            <h4 className="text-lg font-bold text-primary text-center px-4 pt-1">
                              {task.title}
                            </h4>
                            <div className="flex items-center justify-center gap-2 p-4 pt-2 pb-5 flex-wrap">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full px-5 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                                onClick={() => navigate(`/activity-task/${task.id}`)}
                              >
                                Details
                              </Button>
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
                  ) : activeRole ? (
                    <p className="text-muted-foreground text-sm italic text-center py-6">No tasks added for this role yet.</p>
                  ) : null}
                </section>
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
