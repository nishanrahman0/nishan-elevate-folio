import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function Admin() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Content Management</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
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
        </Tabs>
      </main>
    </div>
  );
}
