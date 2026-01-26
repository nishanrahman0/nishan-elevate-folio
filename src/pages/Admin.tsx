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
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Sparkles,
  Globe,
  Copyright
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
import { FooterEditor } from "@/components/admin/FooterEditor";
import { cn } from "@/lib/utils";

const menuItems = [
  { id: "hero", label: "Hero & Branding", icon: Sparkles, description: "Logo, name, profile & social links", color: "from-violet-500 to-purple-500" },
  { id: "navigation", label: "Navigation", icon: Globe, description: "Menu items & routes", color: "from-blue-500 to-cyan-500" },
  { id: "theme", label: "Theme & Colors", icon: Palette, description: "Customize appearance", color: "from-pink-500 to-rose-500" },
  { id: "about", label: "About Section", icon: User, description: "About me content", color: "from-emerald-500 to-teal-500" },
  { id: "skills", label: "Skills", icon: Zap, description: "Your skills list", color: "from-amber-500 to-orange-500" },
  { id: "experience", label: "Experience", icon: Briefcase, description: "Work history", color: "from-indigo-500 to-blue-500" },
  { id: "education", label: "Education", icon: GraduationCap, description: "Academic background", color: "from-cyan-500 to-blue-500" },
  { id: "certificates", label: "Certificates", icon: Award, description: "Credentials & awards", color: "from-yellow-500 to-amber-500" },
  { id: "activities", label: "Activities", icon: Users, description: "Extracurricular", color: "from-green-500 to-emerald-500" },
  { id: "events", label: "Events", icon: Calendar, description: "Events & photos", color: "from-purple-500 to-violet-500" },
  { id: "blog", label: "Blog Posts", icon: FileText, description: "Articles & posts", color: "from-rose-500 to-pink-500" },
  { id: "projects", label: "Projects", icon: FolderOpen, description: "Portfolio projects", color: "from-teal-500 to-cyan-500" },
  { id: "contact", label: "Contact Info", icon: Mail, description: "Contact details", color: "from-blue-500 to-indigo-500" },
  { id: "footer", label: "Footer", icon: Copyright, description: "Footer content", color: "from-slate-500 to-gray-500" },
  { id: "ads", label: "Running Ads", icon: Megaphone, description: "Promotional ads", color: "from-orange-500 to-red-500" },
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-violet-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-violet-200 font-medium">Loading admin panel...</p>
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
      case "footer": return <FooterEditor />;
      default: return <HeroEditor />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 h-full bg-slate-900/80 backdrop-blur-2xl border-r border-white/10 transition-all duration-300 z-50 flex flex-col",
          sidebarCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className={cn("flex items-center gap-3", sidebarCollapsed && "justify-center")}>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="font-bold text-lg text-white">Admin Panel</h1>
                  <p className="text-xs text-violet-300">Content Management</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-8 text-violet-300 hover:text-white hover:bg-white/10"
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
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left group relative overflow-hidden",
                  isActive 
                    ? "bg-gradient-to-r shadow-lg" 
                    : "hover:bg-white/5 text-slate-400 hover:text-white"
                )}
                style={isActive ? { backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` } : {}}
              >
                {isActive && (
                  <div className={cn("absolute inset-0 bg-gradient-to-r opacity-100", item.color)} />
                )}
                <div className={cn(
                  "relative z-10 w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all",
                  isActive 
                    ? "bg-white/20" 
                    : `bg-gradient-to-br ${item.color} opacity-60 group-hover:opacity-100`
                )}>
                  <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-white")} />
                </div>
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0 relative z-10">
                    <p className={cn("text-sm font-medium truncate", isActive ? "text-white" : "")}>{item.label}</p>
                    <p className={cn("text-xs truncate", isActive ? "text-white/70" : "text-slate-500")}>{item.description}</p>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          {!sidebarCollapsed && (
            <div className="mb-3 px-2">
              <p className="text-xs text-violet-300 truncate">{user?.email}</p>
            </div>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size={sidebarCollapsed ? "icon" : "default"}
              onClick={() => navigate("/")}
              className={cn(
                "flex-1 border-white/20 bg-white/5 hover:bg-white/10 text-white",
                sidebarCollapsed && "flex-none"
              )}
            >
              <Home className="h-4 w-4" />
              {!sidebarCollapsed && <span className="ml-2">View Site</span>}
            </Button>
            <Button
              size="icon"
              onClick={handleSignOut}
              title="Sign Out"
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-0"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300 relative z-10",
          sidebarCollapsed ? "ml-20" : "ml-72"
        )}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-slate-900/50 backdrop-blur-2xl border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {activeMenuItem && (
                <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg", activeMenuItem.color)}>
                  <activeMenuItem.icon className="h-6 w-6 text-white" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {activeMenuItem?.label || "Dashboard"}
                </h2>
                <p className="text-violet-300 text-sm mt-0.5">
                  {activeMenuItem?.description || "Manage your portfolio content"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg shadow-violet-500/25"
              >
                <Home className="h-4 w-4 mr-2" />
                Preview Site
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
