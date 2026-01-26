import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  LogOut, 
  Home, 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Zap, 
  Calendar, 
  FileText, 
  Users, 
  Menu as MenuIcon, 
  Palette, 
  Mail, 
  Megaphone, 
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard
} from "lucide-react";
import { HeroEditor } from "@/components/admin/HeroEditor";
import { AboutEditor } from "@/components/admin/AboutEditor";
import { ExperienceEditor } from "@/components/admin/ExperienceEditor";
import { EducationEditor } from "@/components/admin/EducationEditor";
import { CertificatesEditor } from "@/components/admin/CertificatesEditor";
import { SkillsEditor } from "@/components/admin/SkillsEditor";
import { EventsEditor } from "@/components/admin/EventsEditor";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { ExtracurricularEditor } from "@/components/admin/ExtracurricularEditor";
import { NavigationEditor } from "@/components/admin/NavigationEditor";
import { ThemeEditor } from "@/components/admin/ThemeEditor";
import { ContactEditor } from "@/components/admin/ContactEditor";
import { AdsEditor } from "@/components/admin/AdsEditor";
import { ProjectsEditor } from "@/components/admin/ProjectsEditor";
import { cn } from "@/lib/utils";

const menuItems = [
  { id: "hero", label: "Hero Section", icon: Home, description: "Edit hero content, profile & social links" },
  { id: "navigation", label: "Navigation Menu", icon: MenuIcon, description: "Manage menu items & routes" },
  { id: "theme", label: "Theme & Styling", icon: Palette, description: "Customize colors & appearance" },
  { id: "about", label: "About", icon: User, description: "Edit about section content" },
  { id: "skills", label: "Skills", icon: Zap, description: "Manage your skills list" },
  { id: "experience", label: "Experience", icon: Briefcase, description: "Add/edit work experience" },
  { id: "education", label: "Education", icon: GraduationCap, description: "Manage education history" },
  { id: "certificates", label: "Certificates", icon: Award, description: "Add certificates & credentials" },
  { id: "activities", label: "Activities", icon: Users, description: "Extracurricular activities" },
  { id: "events", label: "Events", icon: Calendar, description: "Manage events & photos" },
  { id: "blog", label: "Blog Posts", icon: FileText, description: "Write & publish blog posts" },
  { id: "projects", label: "Projects", icon: FolderOpen, description: "Showcase your projects" },
  { id: "contact", label: "Contact Info", icon: Mail, description: "Update contact details" },
  { id: "ads", label: "Running Ads", icon: Megaphone, description: "Manage promotional ads" },
];

export default function Admin() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>(searchParams.get("tab") || "hero");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Signed out", description: "You have been logged out successfully" });
    navigate("/");
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId }, { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const activeMenuItem = menuItems.find(item => item.id === activeTab);

  const renderContent = () => {
    switch (activeTab) {
      case "hero": return <HeroEditor />;
      case "about": return <AboutEditor />;
      case "experience": return <ExperienceEditor />;
      case "education": return <EducationEditor />;
      case "certificates": return <CertificatesEditor />;
      case "skills": return <SkillsEditor />;
      case "events": return <EventsEditor />;
      case "blog": return <BlogEditor />;
      case "activities": return <ExtracurricularEditor />;
      case "navigation": return <NavigationEditor />;
      case "theme": return <ThemeEditor />;
      case "contact": return <ContactEditor />;
      case "ads": return <AdsEditor />;
      case "projects": return <ProjectsEditor />;
      default: return <HeroEditor />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 h-full bg-card/95 backdrop-blur-xl border-r border-border/50 transition-all duration-300 z-50 flex flex-col",
          sidebarCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className={cn("flex items-center gap-3", sidebarCollapsed && "justify-center")}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="font-bold text-lg">Admin Panel</h1>
                  <p className="text-xs text-muted-foreground">Content Management</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-8"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left group",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                    : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium truncate", isActive ? "text-primary-foreground" : "")}>{item.label}</p>
                    <p className={cn("text-xs truncate", isActive ? "text-primary-foreground/70" : "text-muted-foreground")}>{item.description}</p>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border/50">
          {!sidebarCollapsed && (
            <div className="mb-3 px-2">
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size={sidebarCollapsed ? "icon" : "default"}
              onClick={() => navigate("/")}
              className={cn("flex-1", sidebarCollapsed && "flex-none")}
            >
              <Home className="h-4 w-4" />
              {!sidebarCollapsed && <span className="ml-2">View Site</span>}
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={handleSignOut}
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarCollapsed ? "ml-20" : "ml-72"
        )}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3">
                {activeMenuItem && <activeMenuItem.icon className="h-6 w-6 text-primary" />}
                {activeMenuItem?.label || "Dashboard"}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {activeMenuItem?.description || "Manage your portfolio content"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                <Home className="h-4 w-4 mr-2" />
                Preview Site
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 shadow-xl">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
