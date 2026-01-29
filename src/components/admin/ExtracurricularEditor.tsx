import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Edit2, Plus, Users } from "lucide-react";
import { ImageUpload } from "./ImageUpload";

interface Activity {
  id: string;
  title: string;
  organization: string;
  icon_name: string;
  color_gradient: string;
  display_order: number;
  image_url?: string | null;
  logo_url?: string | null;
}

export function ExtracurricularEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    icon_name: "Users",
    color_gradient: "from-primary to-secondary",
    display_order: 0,
    image_url: "",
    logo_url: "",
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from("extracurricular_activities")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setActivities(data || []);
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
          .from("extracurricular_activities")
          .update(formData)
          .eq("id", editingId);
        if (error) throw error;
        toast({ title: "Success", description: "Activity updated successfully" });
      } else {
        const { error } = await supabase
          .from("extracurricular_activities")
          .insert([formData]);
        if (error) throw error;
        toast({ title: "Success", description: "Activity added successfully" });
      }
      setFormData({
        title: "",
        organization: "",
        icon_name: "Users",
        color_gradient: "from-primary to-secondary",
        display_order: 0,
        image_url: "",
        logo_url: "",
      });
      setEditingId(null);
      fetchActivities();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingId(activity.id);
    setFormData({
      title: activity.title,
      organization: activity.organization,
      icon_name: activity.icon_name,
      color_gradient: activity.color_gradient,
      display_order: activity.display_order,
      image_url: activity.image_url || "",
      logo_url: activity.logo_url || "",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("extracurricular_activities")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast({ title: "Success", description: "Activity deleted successfully" });
      fetchActivities();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-rose-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-rose-500/10 via-pink-500/10 to-fuchsia-500/10 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b border-white/10 bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 text-white">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                {editingId ? "Edit" : "Add"} Activity
              </CardTitle>
              <CardDescription>Manage extracurricular activities</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground/80">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Deputy Director of Documentation"
                className="bg-background/50 border-white/20 focus:border-rose-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization" className="text-foreground/80">Organization</Label>
              <Input
                id="organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="Rajshahi University Career Club"
                className="bg-background/50 border-white/20 focus:border-rose-500/50"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon_name" className="text-foreground/80">Icon Name (Lucide)</Label>
              <Input
                id="icon_name"
                value={formData.icon_name}
                onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                placeholder="Users, Award, Trophy, etc."
                className="bg-background/50 border-white/20 focus:border-rose-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color_gradient" className="text-foreground/80">Color Gradient</Label>
              <Input
                id="color_gradient"
                value={formData.color_gradient}
                onChange={(e) => setFormData({ ...formData, color_gradient: e.target.value })}
                placeholder="from-primary to-secondary"
                className="bg-background/50 border-white/20 focus:border-rose-500/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="display_order" className="text-foreground/80">Display Order</Label>
            <Input
              id="display_order"
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              className="bg-background/50 border-white/20 focus:border-rose-500/50"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <ImageUpload
                currentImageUrl={formData.logo_url}
                onImageUploaded={(url) => setFormData({ ...formData, logo_url: url })}
                label="🏢 Organization Logo"
              />
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <ImageUpload
                currentImageUrl={formData.image_url}
                onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                label="🎭 Activity Image (optional)"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700">
              {editingId ? <Edit2 className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {editingId ? "Update" : "Add"} Activity
            </Button>
            {editingId && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    title: "",
                    organization: "",
                    icon_name: "Users",
                    color_gradient: "from-primary to-secondary",
                    display_order: 0,
                    image_url: "",
                    logo_url: "",
                  });
                }}
                className="border-white/20"
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/5 backdrop-blur-sm">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            Current Activities
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-rose-500/5 to-pink-500/5 border border-white/10 hover:border-rose-500/30 transition-all">
                <div>
                  <h3 className="font-semibold text-foreground">{activity.title}</h3>
                  <p className="text-sm text-rose-400">{activity.organization}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Icon: {activity.icon_name} | Gradient: {activity.color_gradient}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(activity)} className="hover:bg-rose-500/20 hover:text-rose-400">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(activity.id)} className="hover:bg-red-500/20 hover:text-red-400">
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
