import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2, GraduationCap } from "lucide-react";
import { ImageUpload } from "./ImageUpload";

interface Education {
  id: string;
  institution: string;
  degree: string;
  duration: string;
  logo_url?: string;
  image_url?: string;
}

export function EducationEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    duration: "",
    logo_url: "",
    image_url: "",
    link_url: "",
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("created_at");

      if (error) throw error;
      setEducationList(data || []);
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
          .from("education")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("education")
          .insert([formData]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: editingId ? "Education updated" : "Education added",
      });

      setFormData({ institution: "", degree: "", duration: "", logo_url: "", image_url: "", link_url: "" });
      setEditingId(null);
      fetchEducation();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (edu: Education) => {
    setEditingId(edu.id);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      duration: edu.duration,
      logo_url: edu.logo_url || "",
      image_url: edu.image_url || "",
      link_url: (edu as any).link_url || "",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("education")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Education deleted",
      });

      fetchEducation();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-blue-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b border-white/10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {editingId ? "Edit" : "Add"} Education
              </CardTitle>
              <CardDescription>Manage your education information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="institution" className="text-foreground/80">Institution</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="bg-background/50 border-white/20 focus:border-blue-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="degree" className="text-foreground/80">Degree</Label>
              <Input
                id="degree"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="bg-background/50 border-white/20 focus:border-blue-500/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-foreground/80">Duration</Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="bg-background/50 border-white/20 focus:border-blue-500/50"
            />
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <ImageUpload
              currentImageUrl={formData.logo_url}
              onImageUploaded={(url) => setFormData({ ...formData, logo_url: url })}
              label="🏫 Institution Logo"
            />
            <ImageUpload
              currentImageUrl={formData.image_url}
              onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
              label="🏛️ Campus Image"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link_url" className="text-foreground/80">Link URL (optional)</Label>
            <Input
              id="link_url"
              value={formData.link_url}
              onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
              placeholder="https://..."
              className="bg-background/50 border-white/20 focus:border-blue-500/50"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700">
              {editingId ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {editingId ? "Update" : "Add"} Education
            </Button>
            {editingId && (
              <Button variant="outline" onClick={() => {
                setEditingId(null);
                setFormData({ institution: "", degree: "", duration: "", logo_url: "", image_url: "", link_url: "" });
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
            <span className="text-xl">🎓</span>
            Current Education
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {educationList.map((edu) => (
              <div key={edu.id} className="flex items-start justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-white/10 hover:border-blue-500/30 transition-all">
                <div className="flex gap-4">
                  {edu.logo_url && (
                    <img src={edu.logo_url} alt="Logo" className="w-16 h-16 object-contain rounded-lg border border-white/20" />
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground">{edu.institution}</h3>
                    <p className="text-sm text-muted-foreground">{edu.degree}</p>
                    <p className="text-sm text-blue-400">{edu.duration}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(edu)} className="border-white/20 hover:bg-blue-500/20 hover:text-blue-400">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(edu.id)} className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
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
