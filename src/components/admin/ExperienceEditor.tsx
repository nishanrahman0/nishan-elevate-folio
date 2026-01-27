import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2, Briefcase } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
  icon_name: string;
  image_url?: string;
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
    image_url: "",
    link_url: "",
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

      setFormData({ title: "", company: "", duration: "", description: "", icon_name: "Briefcase", image_url: "", link_url: "" });
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
      image_url: exp.image_url || "",
      link_url: (exp as any).link_url || "",
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
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-indigo-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b border-white/10 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {editingId ? "Edit" : "Add"} Experience
              </CardTitle>
              <CardDescription>Manage your work experience and projects</CardDescription>
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
                className="bg-background/50 border-white/20 focus:border-indigo-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-foreground/80">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="bg-background/50 border-white/20 focus:border-indigo-500/50"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-foreground/80">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="bg-background/50 border-white/20 focus:border-indigo-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon" className="text-foreground/80">Icon Name</Label>
              <Input
                id="icon"
                value={formData.icon_name}
                onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                placeholder="Briefcase, Code, TrendingUp, etc."
                className="bg-background/50 border-white/20 focus:border-indigo-500/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground/80">Description</Label>
            <RichTextEditor
              value={formData.description}
              onChange={(val) => setFormData({ ...formData, description: val })}
              placeholder="Describe the role, impact, and tools..."
            />
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <ImageUpload
              currentImageUrl={formData.image_url}
              onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
              label="🖼️ Experience Image"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp_link_url" className="text-foreground/80">Link URL (optional)</Label>
            <Input
              id="exp_link_url"
              value={formData.link_url}
              onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
              placeholder="https://..."
              className="bg-background/50 border-white/20 focus:border-indigo-500/50"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
              {editingId ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {editingId ? "Update" : "Add"} Experience
            </Button>
            {editingId && (
              <Button variant="outline" onClick={() => {
                setEditingId(null);
                setFormData({ title: "", company: "", duration: "", description: "", icon_name: "Briefcase", image_url: "", link_url: "" });
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
            <span className="text-xl">💼</span>
            Current Experiences
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="flex items-start justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-white/10 hover:border-indigo-500/30 transition-all">
                <div>
                  <h3 className="font-semibold text-foreground">{exp.title}</h3>
                  <p className="text-sm text-indigo-400">{exp.company} • {exp.duration}</p>
                  <p className="text-sm mt-1 text-muted-foreground line-clamp-2">{exp.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(exp)} className="border-white/20 hover:bg-indigo-500/20 hover:text-indigo-400">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(exp.id)} className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
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
