import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Edit2, Plus } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  organization: string;
  icon_name: string;
  color_gradient: string;
  display_order: number;
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
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit" : "Add"} Activity</CardTitle>
          <CardDescription>Manage extracurricular activities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Deputy Director of Documentation"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Input
              id="organization"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              placeholder="Rajshahi University Career Club"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon_name">Icon Name (Lucide)</Label>
            <Input
              id="icon_name"
              value={formData.icon_name}
              onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
              placeholder="Users, Award, Trophy, etc."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color_gradient">Color Gradient</Label>
            <Input
              id="color_gradient"
              value={formData.color_gradient}
              onChange={(e) => setFormData({ ...formData, color_gradient: e.target.value })}
              placeholder="from-primary to-secondary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="display_order">Display Order</Label>
            <Input
              id="display_order"
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave}>
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
                  });
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{activity.title}</h3>
                  <p className="text-sm text-muted-foreground">{activity.organization}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Icon: {activity.icon_name} | Gradient: {activity.color_gradient}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(activity)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(activity.id)}>
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
