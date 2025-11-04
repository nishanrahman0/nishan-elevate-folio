import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
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
    profile_image_url: "",
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
          profile_image_url: data.profile_image_url || "",
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
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>Edit your homepage hero content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <ImageUpload
            currentImageUrl={formData.profile_image_url}
            onImageUploaded={(url) => setFormData({ ...formData, profile_image_url: url })}
            label="Profile Photo"
          />
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input
              id="linkedin"
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub URL</Label>
            <Input
              id="github"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook URL</Label>
            <Input
              id="facebook"
              value={formData.facebook_url}
              onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram URL</Label>
            <Input
              id="instagram"
              value={formData.instagram_url}
              onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
            />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>
      
      <HeroSocialLinksEditor />
    </div>
  );
}
