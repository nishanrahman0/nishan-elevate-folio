import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Search, Edit, Globe } from "lucide-react";
import { ImageUpload } from "./ImageUpload";

interface SEOSetting {
  id: string;
  page_name: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  keywords: string | null;
}

export function SEOEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seoSettings, setSeoSettings] = useState<SEOSetting[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    page_name: "",
    meta_title: "",
    meta_description: "",
    og_image_url: "",
    keywords: "",
  });

  useEffect(() => {
    fetchSEOSettings();
  }, []);

  const fetchSEOSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("seo_settings")
        .select("*")
        .order("page_name");

      if (error) throw error;
      setSeoSettings(data || []);
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

  const handleEdit = (setting: SEOSetting) => {
    setEditingId(setting.id);
    setFormData({
      page_name: setting.page_name,
      meta_title: setting.meta_title || "",
      meta_description: setting.meta_description || "",
      og_image_url: setting.og_image_url || "",
      keywords: setting.keywords || "",
    });
  };

  const handleSave = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("seo_settings")
        .update({
          meta_title: formData.meta_title,
          meta_description: formData.meta_description,
          og_image_url: formData.og_image_url,
          keywords: formData.keywords,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "SEO settings updated successfully",
      });

      setEditingId(null);
      setFormData({ page_name: "", meta_title: "", meta_description: "", og_image_url: "", keywords: "" });
      fetchSEOSettings();
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

  const getPageIcon = (pageName: string) => {
    const icons: Record<string, string> = {
      home: "🏠",
      skills: "💡",
      experience: "💼",
      projects: "🚀",
      blog: "📝",
      activities: "🎯",
      events: "📅",
      certificates: "🏆",
    };
    return icons[pageName] || "📄";
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-teal-400" /></div>;
  }

  return (
    <div className="space-y-6">
      {editingId && (
        <Card className="border-0 bg-gradient-to-br from-teal-500/10 via-cyan-500/10 to-blue-500/10 backdrop-blur-sm shadow-xl">
          <CardHeader className="border-b border-white/10 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 text-white">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  Edit SEO for "{formData.page_name}"
                </CardTitle>
                <CardDescription>Optimize search visibility for this page</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="meta_title" className="text-foreground/80">Meta Title (60 chars max)</Label>
              <Input
                id="meta_title"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                placeholder="Page title for search engines"
                maxLength={60}
                className="bg-background/50 border-white/20 focus:border-teal-500/50"
              />
              <p className="text-xs text-muted-foreground">{formData.meta_title.length}/60 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_description" className="text-foreground/80">Meta Description (160 chars max)</Label>
              <Textarea
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                placeholder="Brief description for search results"
                maxLength={160}
                className="bg-background/50 border-white/20 focus:border-teal-500/50 resize-none"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">{formData.meta_description.length}/160 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords" className="text-foreground/80">Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="data analyst, portfolio, AI developer"
                className="bg-background/50 border-white/20 focus:border-teal-500/50"
              />
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <ImageUpload
                currentImageUrl={formData.og_image_url}
                onImageUploaded={(url) => setFormData({ ...formData, og_image_url: url })}
                label="🖼️ Open Graph Image (for social sharing)"
              />
              <p className="text-xs text-muted-foreground mt-2">Recommended size: 1200x630 pixels</p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save SEO Settings
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ page_name: "", meta_title: "", meta_description: "", og_image_url: "", keywords: "" });
                }}
                className="border-white/20"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-0 bg-white/5 backdrop-blur-sm">
        <CardHeader className="border-b border-white/10 bg-gradient-to-r from-teal-500/10 to-cyan-500/10">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-teal-400" />
            <CardTitle className="text-lg">SEO Settings by Page</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {seoSettings.map((setting) => (
              <div key={setting.id} className="flex items-start justify-between p-4 rounded-xl bg-gradient-to-r from-teal-500/5 to-cyan-500/5 border border-white/10 hover:border-teal-500/30 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getPageIcon(setting.page_name)}</span>
                    <h3 className="font-semibold text-foreground capitalize">{setting.page_name}</h3>
                  </div>
                  <p className="text-sm text-teal-400">{setting.meta_title || "No title set"}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {setting.meta_description || "No description set"}
                  </p>
                  {setting.keywords && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {setting.keywords.split(",").slice(0, 3).map((keyword, i) => (
                        <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-teal-500/20 text-teal-400">
                          {keyword.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={() => handleEdit(setting)} className="border-white/20 hover:bg-teal-500/20 hover:text-teal-400">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
