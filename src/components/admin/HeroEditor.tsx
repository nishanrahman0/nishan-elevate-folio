import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Home } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { HeroSocialLinksEditor } from "./HeroSocialLinksEditor";

export function HeroEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroId, setHeroId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    site_title: "",
    profile_image_url: "",
    logo_url: "",
    resume_url: "",
    linkedin_url: "",
    github_url: "",
    facebook_url: "",
    instagram_url: "",
  });

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async () => {
    try {
      const { data, error } = await supabase
        .from("hero_content")
        .select("*")
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setHeroId(data.id);
        setFormData({
          name: data.name || "",
          tagline: data.tagline || "",
          site_title: data.site_title || "",
          profile_image_url: data.profile_image_url || "",
          logo_url: data.logo_url || "",
          resume_url: (data as any).resume_url || "",
          linkedin_url: data.linkedin_url || "",
          github_url: data.github_url || "",
          facebook_url: data.facebook_url || "",
          instagram_url: data.instagram_url || "",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("hero_content")
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq("id", heroId);

      if (error) throw error;

      // Update document title
      document.title = formData.site_title || formData.name;

      toast({
        title: "Success",
        description: "Hero section updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-violet-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b border-white/10 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Hero Section
              </CardTitle>
              <CardDescription>Edit your homepage hero content</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 space-y-4">
            <h3 className="font-semibold text-violet-400 flex items-center gap-2">
              🌐 Website Settings
            </h3>
            <div className="space-y-2">
              <Label htmlFor="site_title" className="text-foreground/80">Website Title (Browser Tab)</Label>
              <Input
                id="site_title"
                value={formData.site_title}
                onChange={(e) => setFormData({ ...formData, site_title: e.target.value })}
                placeholder="Nishan Rahman"
                className="bg-background/50 border-white/20 focus:border-violet-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground/80">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-background/50 border-white/20 focus:border-violet-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline" className="text-foreground/80">Tagline / Motto</Label>
              <Input
                id="tagline"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="bg-background/50 border-white/20 focus:border-violet-500/50"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="font-semibold text-purple-400 flex items-center gap-2">
              📷 Images
            </h3>
            <ImageUpload
              currentImageUrl={formData.profile_image_url}
              onImageUploaded={(url) => setFormData({ ...formData, profile_image_url: url })}
              label="Profile Photo"
            />
            <ImageUpload
              currentImageUrl={formData.logo_url}
              onImageUploaded={(url) => setFormData({ ...formData, logo_url: url })}
              label="Logo (appears in navigation)"
            />
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 space-y-4">
            <h3 className="font-semibold text-green-400 flex items-center gap-2">
              📄 Resume / CV
            </h3>
            <ImageUpload
              currentImageUrl={formData.resume_url}
              onImageUploaded={(url) => setFormData({ ...formData, resume_url: url })}
              label="Upload Resume (PDF or Image)"
            />
            <p className="text-xs text-muted-foreground">Upload your CV/Resume file. Visitors can download it from the hero section.</p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 space-y-4">
            <h3 className="font-semibold text-blue-400 flex items-center gap-2">
              🔗 Social Links (Quick)
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="text-foreground/80">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  className="bg-background/50 border-white/20 focus:border-blue-500/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github" className="text-foreground/80">GitHub URL</Label>
                <Input
                  id="github"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="bg-background/50 border-white/20 focus:border-blue-500/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook" className="text-foreground/80">Facebook URL</Label>
                <Input
                  id="facebook"
                  value={formData.facebook_url}
                  onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                  className="bg-background/50 border-white/20 focus:border-blue-500/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-foreground/80">Instagram URL</Label>
                <Input
                  id="instagram"
                  value={formData.instagram_url}
                  onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                  className="bg-background/50 border-white/20 focus:border-blue-500/50"
                />
              </div>
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </CardContent>
      </Card>
      
      <HeroSocialLinksEditor />
    </div>
  );
}
