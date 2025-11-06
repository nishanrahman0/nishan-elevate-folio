import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";
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
import Navigation from "@/components/Navigation";

export default function Admin() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<string>(searchParams.get("tab") || "hero");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      
      <Navigation />
      
      <header className="border-b glass-card relative z-[60]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text">Content Management</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-8 relative z-10">
        <div className="glass-card rounded-2xl p-6">
          <Tabs value={tab} onValueChange={(v) => { setTab(v); setSearchParams({ tab: v }, { replace: true }); }} className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-1 h-auto flex-wrap">
              <TabsTrigger value="hero" className="text-xs sm:text-sm">Hero</TabsTrigger>
              <TabsTrigger value="navigation" className="text-xs sm:text-sm">Menu</TabsTrigger>
              <TabsTrigger value="theme" className="text-xs sm:text-sm">Theme</TabsTrigger>
              <TabsTrigger value="about" className="text-xs sm:text-sm">About</TabsTrigger>
              <TabsTrigger value="skills" className="text-xs sm:text-sm">Skills</TabsTrigger>
              <TabsTrigger value="experience" className="text-xs sm:text-sm">Experience</TabsTrigger>
              <TabsTrigger value="education" className="text-xs sm:text-sm">Education</TabsTrigger>
              <TabsTrigger value="certificates" className="text-xs sm:text-sm">Certificates</TabsTrigger>
              <TabsTrigger value="activities" className="text-xs sm:text-sm">Activities</TabsTrigger>
              <TabsTrigger value="events" className="text-xs sm:text-sm">Events</TabsTrigger>
              <TabsTrigger value="blog" className="text-xs sm:text-sm">Blog</TabsTrigger>
              <TabsTrigger value="contact" className="text-xs sm:text-sm">Contact</TabsTrigger>
              <TabsTrigger value="ads" className="text-xs sm:text-sm">Ads</TabsTrigger>
            </TabsList>

          <TabsContent value="hero">
            <HeroEditor />
          </TabsContent>

          <TabsContent value="about">
            <AboutEditor />
          </TabsContent>

          <TabsContent value="experience">
            <ExperienceEditor />
          </TabsContent>

          <TabsContent value="education">
            <EducationEditor />
          </TabsContent>

          <TabsContent value="certificates">
            <CertificatesEditor />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsEditor />
          </TabsContent>

          <TabsContent value="events">
            <EventsEditor />
          </TabsContent>

          <TabsContent value="blog">
            <BlogEditor />
          </TabsContent>

          <TabsContent value="activities">
            <ExtracurricularEditor />
          </TabsContent>

          <TabsContent value="navigation">
            <NavigationEditor />
          </TabsContent>

          <TabsContent value="theme">
            <ThemeEditor />
          </TabsContent>

          <TabsContent value="contact">
            <ContactEditor />
          </TabsContent>

          <TabsContent value="ads">
            <AdsEditor />
          </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
