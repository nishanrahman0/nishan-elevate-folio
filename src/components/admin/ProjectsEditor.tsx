import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Edit2, Plus } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Project {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  image_url?: string;
  link_url?: string;
  display_order: number;
}

export function ProjectsEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon_name: "FolderOpen",
    image_url: "",
    link_url: "",
    display_order: 0,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setProjects(data || []);
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
      const dataToSave = {
        ...formData,
        image_url: formData.image_url || null,
        link_url: formData.link_url || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from("projects")
          .update(dataToSave)
          .eq("id", editingId);
        if (error) throw error;
        toast({ title: "Success", description: "Project updated successfully" });
      } else {
        const { error } = await supabase
          .from("projects")
          .insert([dataToSave]);
        if (error) throw error;
        toast({ title: "Success", description: "Project added successfully" });
      }
      resetForm();
      fetchProjects();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      icon_name: "FolderOpen",
      image_url: "",
      link_url: "",
      display_order: 0,
    });
    setEditingId(null);
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      icon_name: project.icon_name,
      image_url: project.image_url || "",
      link_url: project.link_url || "",
      display_order: project.display_order,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Success", description: "Project deleted successfully" });
      fetchProjects();
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
          <CardTitle>{editingId ? "Edit" : "Add"} Project</CardTitle>
          <CardDescription>Manage your projects</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Project Title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon_name">Icon Name (Lucide)</Label>
            <Input
              id="icon_name"
              value={formData.icon_name}
              onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
              placeholder="FolderOpen"
            />
          </div>
          <div className="space-y-2">
            <Label>Project Image</Label>
            <ImageUpload
              currentImageUrl={formData.image_url}
              onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link_url">Link URL (optional)</Label>
            <Input
              id="link_url"
              value={formData.link_url}
              onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
              placeholder="https://example.com"
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
              {editingId ? "Update" : "Add"} Project
            </Button>
            {editingId && (
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  {project.image_url && (
                    <img src={project.image_url} alt={project.title} className="w-16 h-16 object-cover rounded" />
                  )}
                  <div>
                    <h3 className="font-semibold">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.icon_name}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(project.id)}>
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