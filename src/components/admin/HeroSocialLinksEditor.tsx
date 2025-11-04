import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";

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
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit" : "Add"} Social Link</CardTitle>
          <CardDescription>Add custom social media links with icons</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g., Twitter, YouTube"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon_name">Icon Name (Lucide)</Label>
              <Input
                id="icon_name"
                value={formData.icon_name}
                onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                placeholder="Twitter, Youtube, Mail, etc."
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave}>
              {editingId ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {editingId ? "Update" : "Add"} Link
            </Button>
            {editingId && (
              <Button variant="outline" onClick={() => {
                setEditingId(null);
                setFormData({ label: "", icon_name: "Link", url: "" });
              }}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Social Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {links.map((link) => (
              <div key={link.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{link.label}</h3>
                  <p className="text-sm text-muted-foreground">Icon: {link.icon_name}</p>
                  <p className="text-sm text-muted-foreground truncate max-w-md">{link.url}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(link)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(link.id)}>
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
