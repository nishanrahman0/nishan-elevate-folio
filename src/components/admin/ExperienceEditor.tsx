import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";

interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
  icon_name: string;
  display_order: number;
}

export function ExperienceEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    duration: "",
    description: "",
    icon_name: "Briefcase",
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("display_order");

      if (error) throw error;
      setExperiences(data || []);
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
          .from("experiences")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("experiences")
          .insert([{ ...formData, display_order: experiences.length + 1 }]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: editingId ? "Experience updated" : "Experience added",
      });

      setFormData({ title: "", company: "", duration: "", description: "", icon_name: "Briefcase" });
      setEditingId(null);
      fetchExperiences();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setFormData({
      title: exp.title,
      company: exp.company,
      duration: exp.duration,
      description: exp.description,
      icon_name: exp.icon_name,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("experiences")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Experience deleted",
      });

      fetchExperiences();
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
          <CardTitle>{editingId ? "Edit" : "Add"} Experience</CardTitle>
          <CardDescription>Manage your work experience and projects</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon Name</Label>
              <Input
                id="icon"
                value={formData.icon_name}
                onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                placeholder="Briefcase, Code, TrendingUp, etc."
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave}>
              {editingId ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {editingId ? "Update" : "Add"} Experience
            </Button>
            {editingId && (
              <Button variant="outline" onClick={() => {
                setEditingId(null);
                setFormData({ title: "", company: "", duration: "", description: "", icon_name: "Briefcase" });
              }}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Experiences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{exp.title}</h3>
                  <p className="text-sm text-muted-foreground">{exp.company} • {exp.duration}</p>
                  <p className="text-sm mt-1">{exp.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(exp)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(exp.id)}>
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
