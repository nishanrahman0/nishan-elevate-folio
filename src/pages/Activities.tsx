import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { FileText, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ActivityTask {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  images?: string[];
  files?: string[];
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
  short_name?: string;
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
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [activeRoles, setActiveRoles] = useState<Record<string, string>>({});
  const [docViewerUrl, setDocViewerUrl] = useState<string | null>(null);

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
        short_name: (org as any).short_name || undefined,
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
                files: (t.files as string[]) || [],
                link_url: t.link_url || undefined,
                client_url: t.client_url || undefined,
              })),
          })),
      }));

      const defaults: Record<string, string> = {};
      organized.forEach((org) => {
        if (org.roles.length > 0) defaults[org.id] = org.roles[0].id;
      });
      setActiveRoles(defaults);
      setOrganizations(organized);
      if (organized.length > 0) setSelectedOrg(organized[0].id);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const getCoverImage = (task: ActivityTask): string | null => {
    if (task.image_url) return task.image_url;
    if (task.images && task.images.length > 0) return task.images[0];
    return null;
  };

  const selectedOrgData = organizations.find((o) => o.id === selectedOrg);
  const activeRole = selectedOrgData?.roles.find((r) => r.id === activeRoles[selectedOrgData.id]);

  const isDocUrl = (url: string) => {
    const lower = url.toLowerCase();
    return lower.endsWith(".pdf") || lower.endsWith(".doc") || lower.endsWith(".docx");
  };

  const openDoc = (url: string) => {
    if (isDocUrl(url)) {
      setDocViewerUrl(url);
    } else {
      window.open(url, "_blank");
    }
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

          {/* Organization buttons - side by side */}
          {organizations.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-8">
              {organizations.map((org) => (
                <Button
                  key={org.id}
                  variant={selectedOrg === org.id ? "default" : "outline"}
                  className="rounded-full px-6 py-2 gap-2"
                  onClick={() => setSelectedOrg(org.id)}
                >
                  {org.logo_url && (
                    <img src={org.logo_url} alt="" className="w-5 h-5 rounded-full object-contain" />
                  )}
                  {org.name}
                </Button>
              ))}
            </div>
          )}

          {/* Selected organization content */}
          {selectedOrgData && (
          <div className="space-y-6 animate-fade-in">
              {/* Organization Header Card */}
              <div className="glass-card rounded-2xl overflow-hidden">
                {/* Banner */}
                {selectedOrgData.banner_url && (
                  <div className="w-full h-36 md:h-52 overflow-hidden relative">
                    <img src={selectedOrgData.banner_url} alt={selectedOrgData.name} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  </div>
                )}

                <div className={`p-6 md:p-8 ${selectedOrgData.banner_url ? '-mt-16 relative z-10' : ''}`}>
                  <div className="flex items-start gap-5">
                    {/* Org Logo */}
                    {selectedOrgData.logo_url && (
                      <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl border-4 border-background bg-card shadow-xl overflow-hidden">
                        <img
                          src={selectedOrgData.logo_url}
                          alt={`${selectedOrgData.name} logo`}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 pt-2">
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                        {selectedOrgData.name}
                      </h2>
                      {selectedOrgData.roles.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {selectedOrgData.roles.length} position{selectedOrgData.roles.length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* About Section */}
                  {selectedOrgData.description && (
                    <div className="mt-6 p-5 rounded-xl bg-muted/30 border border-border/30">
                      <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">About the Organization</h3>
                      <p className="text-foreground/70 text-sm md:text-base leading-relaxed">
                        {selectedOrgData.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Positions / Roles */}
              {selectedOrgData.roles.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3 px-1">Positions</h3>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {selectedOrgData.roles.map((role) => (
                      <Button
                        key={role.id}
                        variant={activeRoles[selectedOrgData.id] === role.id ? "default" : "outline"}
                        size="sm"
                        className="rounded-full px-5"
                        onClick={() => setActiveRoles((prev) => ({ ...prev, [selectedOrgData.id]: role.id }))}
                      >
                        {role.role_name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks for Active Role */}
              {activeRole && activeRole.tasks.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3 px-1">
                    Tasks under {activeRole.role_name}
                  </h3>
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
                                onClick={() => openDoc(task.link_url!)}
                              >
                                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                                Live
                              </Button>
                            )}
                            {task.client_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full px-5 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                                onClick={() => openDoc(task.client_url!)}
                              >
                                Client
                              </Button>
                            )}
                            {task.files && task.files.length > 0 && task.files.map((file, fi) => (
                              <Button
                                key={fi}
                                variant="outline"
                                size="sm"
                                className="rounded-full px-4 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                                onClick={() => openDoc(file)}
                              >
                                <FileText className="h-3.5 w-3.5 mr-1" />
                                Doc {fi + 1}
                              </Button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : activeRole ? (
                <p className="text-muted-foreground text-sm italic text-center py-6">No tasks added for this role yet.</p>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Inline Document Viewer Dialog */}
      <Dialog open={!!docViewerUrl} onOpenChange={() => setDocViewerUrl(null)}>
        <DialogContent className="max-w-4xl w-[95vw] h-[85vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Document Viewer</DialogTitle>
          </DialogHeader>
          {docViewerUrl && (
            <div className="flex-1 p-4 pt-2 h-full">
              <iframe
                src={docViewerUrl.toLowerCase().endsWith(".pdf")
                  ? docViewerUrl
                  : `https://docs.google.com/gview?url=${encodeURIComponent(docViewerUrl)}&embedded=true`
                }
                className="w-full h-full rounded-lg border border-border"
                title="Document"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Activities;
