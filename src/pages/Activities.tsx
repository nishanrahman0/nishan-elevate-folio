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
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-accent/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-16 left-[10%] w-1.5 h-1.5 bg-primary/40 rounded-full animate-float-slow" />
        <div className="absolute top-28 left-[25%] w-1 h-1 bg-accent/50 rounded-full animate-float-medium" />
        <div className="absolute top-20 right-[15%] w-2 h-2 bg-primary/30 rounded-full animate-float-fast" />
        <div className="absolute top-36 right-[30%] w-1 h-1 bg-accent/40 rounded-full animate-float-slow delay-700" />
        <div className="absolute top-12 left-[50%] w-1.5 h-1.5 bg-primary/25 rounded-full animate-float-medium delay-300" />
        <div className="absolute top-40 left-[70%] w-1 h-1 bg-accent/35 rounded-full animate-float-fast delay-1000" />
        <div className="absolute top-24 left-[40%] w-0.5 h-0.5 bg-primary/50 rounded-full animate-float-slow delay-500" />
        <div className="absolute top-32 right-[45%] w-1.5 h-1.5 bg-accent/25 rounded-full animate-float-medium delay-700" />
      </div>

      <Navigation />
      <div className="pt-24 pb-16 min-h-screen relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header with glow */}
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute -top-8 -left-8 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute -top-4 left-20 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-pulse delay-500 pointer-events-none" />
            <div className="relative">
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">Activities</h1>
              <p className="text-muted-foreground text-sm md:text-base">Organizations & contributions</p>
            </div>
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => navigate("/admin?tab=activities")}>Manage</Button>
            )}
          </div>

          {organizations.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No activities yet.</p>
            </div>
          )}

          {/* Organization Selector Chips */}
          {organizations.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {organizations.map((org) => {
                const isActive = selectedOrg === org.id;
                return (
                  <button
                    key={org.id}
                    onClick={() => setSelectedOrg(org.id)}
                    className={`
                      group relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium
                      transition-all duration-300 border
                      ${isActive
                        ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 scale-[1.02]'
                        : 'bg-card/60 backdrop-blur-sm text-foreground/80 border-border/50 hover:border-primary/40 hover:bg-card hover:shadow-md'
                      }
                    `}
                  >
                    {org.logo_url && (
                      <img
                        src={org.logo_url}
                        alt=""
                        className={`w-5 h-5 rounded-md object-contain ${isActive ? 'brightness-0 invert' : ''}`}
                      />
                    )}
                    <span>{org.short_name || org.name}</span>
                    {org.roles.length > 0 && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-md ${isActive ? 'bg-primary-foreground/20' : 'bg-muted text-muted-foreground'}`}>
                        {org.roles.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Selected Organization Content */}
          {selectedOrgData && (
            <div className="space-y-6 animate-fade-in">
              {/* Org Profile Card */}
              <div className="rounded-2xl overflow-hidden border border-border/40 bg-card/50 backdrop-blur-sm shadow-xl">
                {/* Banner */}
                {selectedOrgData.banner_url && (
                  <div className="w-full h-40 md:h-56 overflow-hidden relative">
                    <img src={selectedOrgData.banner_url} alt={selectedOrgData.name} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                  </div>
                )}

                <div className={`px-6 md:px-8 pb-6 ${selectedOrgData.banner_url ? '-mt-14 relative z-10' : 'pt-6'}`}>
                  <div className="flex items-end gap-5">
                    {selectedOrgData.logo_url && (
                      <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl border-4 border-card bg-card shadow-xl overflow-hidden">
                        <img src={selectedOrgData.logo_url} alt="" className="w-full h-full object-contain p-2" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 pb-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">{selectedOrgData.name}</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedOrgData.roles.length} position{selectedOrgData.roles.length !== 1 ? 's' : ''} · {selectedOrgData.roles.reduce((a, r) => a + r.tasks.length, 0)} tasks
                      </p>
                    </div>
                  </div>

                  {selectedOrgData.description && (
                    <div className="mt-5 p-4 rounded-xl bg-muted/40 border border-border/30">
                      <p className="text-foreground/70 text-sm leading-relaxed">{selectedOrgData.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Positions */}
              {selectedOrgData.roles.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">Positions</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedOrgData.roles.map((role) => {
                      const isActive = activeRoles[selectedOrgData.id] === role.id;
                      return (
                        <button
                          key={role.id}
                          onClick={() => setActiveRoles((prev) => ({ ...prev, [selectedOrgData.id]: role.id }))}
                          className={`
                            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
                            ${isActive
                              ? 'bg-accent text-accent-foreground border-accent shadow-md'
                              : 'bg-card/60 text-foreground/70 border-border/40 hover:border-accent/40 hover:bg-card'
                            }
                          `}
                        >
                          {role.role_name}
                          <span className={`ml-2 text-xs ${isActive ? 'text-accent-foreground/70' : 'text-muted-foreground'}`}>
                            ({role.tasks.length})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tasks Grid */}
              {activeRole && activeRole.tasks.length > 0 ? (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-1">
                    Tasks — {activeRole.role_name}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeRole.tasks.map((task, i) => {
                      const coverImage = getCoverImage(task);
                      return (
                        <div
                          key={task.id}
                          className="group rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 animate-fade-in-up"
                          style={{ animationDelay: `${i * 60}ms` }}
                        >
                          {/* Image */}
                          <div className="aspect-[16/10] overflow-hidden bg-muted/30">
                            {coverImage ? (
                              <img src={coverImage} alt={task.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/10">
                                <span className="text-3xl opacity-30">📌</span>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-4">
                            <h4 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 mb-3">
                              {task.title}
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs rounded-lg px-3"
                                onClick={() => navigate(`/activity-task/${task.id}`)}
                              >
                                Details
                              </Button>
                              {task.link_url && (
                                <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg px-3" onClick={() => openDoc(task.link_url!)}>
                                  <ExternalLink className="h-3 w-3 mr-1" /> Live
                                </Button>
                              )}
                              {task.client_url && (
                                <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg px-3" onClick={() => openDoc(task.client_url!)}>
                                  Client
                                </Button>
                              )}
                              {task.files && task.files.map((file, fi) => (
                                <Button key={fi} variant="outline" size="sm" className="h-7 text-xs rounded-lg px-3" onClick={() => openDoc(file)}>
                                  <FileText className="h-3 w-3 mr-1" /> Doc {fi + 1}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : activeRole ? (
                <p className="text-muted-foreground text-sm text-center py-10">No tasks for this position yet.</p>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Document Viewer */}
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
