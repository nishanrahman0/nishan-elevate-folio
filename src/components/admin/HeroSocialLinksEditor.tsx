import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2, Link2 } from "lucide-react";

interface SocialLink {
  id: string;
  label: string;
  icon_name: string;
  url: string;
  display_order: number;
}

export function HeroSocialLinksEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: "",
    icon_name: "Link",
    url: "",
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from("hero_social_links")
        .select("*")
        .order("display_order");

      if (error) throw error;
      setLinks(data || []);
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
    try {
      if (editingId) {
        const { error } = await supabase
          .from("hero_social_links")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("hero_social_links")
          .insert([{ ...formData, display_order: links.length + 1 }]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: editingId ? "Link updated" : "Link added",
      });

      setFormData({ label: "", icon_name: "Link", url: "" });
      setEditingId(null);
      fetchLinks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (link: SocialLink) => {
    setEditingId(link.id);
    setFormData({
      label: link.label,
      icon_name: link.icon_name,
      url: link.url,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("hero_social_links")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Link deleted",
      });

      fetchLinks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-pink-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-pink-500/10 via-rose-500/10 to-red-500/10 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b border-white/10 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 text-white">
              <Link2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                {editingId ? "Edit" : "Add"} Social Link
              </CardTitle>
              <CardDescription>Add custom social media links with icons</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="label" className="text-foreground/80">Label</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g., Twitter, YouTube"
                className="bg-background/50 border-white/20 focus:border-pink-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon_name" className="text-foreground/80">Icon Name (Lucide)</Label>
              <Input
                id="icon_name"
                value={formData.icon_name}
                onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                placeholder="Twitter, Youtube, Mail, etc."
                className="bg-background/50 border-white/20 focus:border-pink-500/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="url" className="text-foreground/80">URL</Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
              className="bg-background/50 border-white/20 focus:border-pink-500/50"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700">
              {editingId ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {editingId ? "Update" : "Add"} Link
            </Button>
            {editingId && (
              <Button variant="outline" onClick={() => {
                setEditingId(null);
                setFormData({ label: "", icon_name: "Link", url: "" });
              }} className="border-white/20">
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/5 backdrop-blur-sm">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">🔗</span>
            Current Social Links
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {links.map((link) => (
              <div key={link.id} className="flex items-start justify-between p-4 rounded-xl bg-gradient-to-r from-pink-500/5 to-rose-500/5 border border-white/10 hover:border-pink-500/30 transition-all">
                <div>
                  <h3 className="font-semibold text-foreground">{link.label}</h3>
                  <p className="text-sm text-pink-400">Icon: {link.icon_name}</p>
                  <p className="text-sm text-muted-foreground truncate max-w-md">{link.url}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(link)} className="border-white/20 hover:bg-pink-500/20 hover:text-pink-400">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(link.id)} className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
