import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Edit2, Plus, FolderOpen, X, Video, Play } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Project {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  image_url?: string;
  images?: string[];
  tags?: string[];
  videos?: string[];
  link_url?: string;
  client_url?: string;
  github_url?: string;
  display_order: number;
}

const getVideoThumbnail = (url: string): string | null => {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/mqdefault.jpg`;
  return null;
};

export function ProjectsEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [videoInput, setVideoInput] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon_name: "FolderOpen",
    image_url: "",
    images: [] as string[],
    files: [] as string[],
    tags: [] as string[],
    videos: [] as string[],
    link_url: "",
    client_url: "",
    github_url: "",
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
      setProjects((data || []).map(d => ({
        ...d,
        images: (d.images as string[]) || [],
        files: (d.files as string[]) || [],
        tags: (d.tags as string[]) || [],
        videos: (d.videos as string[]) || [],
      })));
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const dataToSave = {
        ...formData,
        image_url: formData.image_url || null,
        images: formData.images,
        files: formData.files,
        tags: formData.tags,
        videos: formData.videos,
        link_url: formData.link_url || null,
        client_url: formData.client_url || null,
        github_url: formData.github_url || null,
      };

      if (editingId) {
        const { error } = await supabase.from("projects").update(dataToSave).eq("id", editingId);
        if (error) throw error;
        toast({ title: "Success", description: "Project updated successfully" });
      } else {
        const { error } = await supabase.from("projects").insert([dataToSave]);
        if (error) throw error;
        toast({ title: "Success", description: "Project added successfully" });
      }
      resetForm();
      fetchProjects();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "", description: "", icon_name: "FolderOpen", image_url: "",
      images: [], files: [], tags: [], videos: [],
      link_url: "", client_url: "", github_url: "", display_order: 0,
    });
    setEditingId(null);
    setTagInput("");
    setVideoInput("");
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      icon_name: project.icon_name,
      image_url: project.image_url || "",
      images: (project.images as string[]) || [],
      files: (project as any).files || [],
      tags: (project.tags as string[]) || [],
      videos: (project.videos as string[]) || [],
      link_url: project.link_url || "",
      client_url: project.client_url || "",
      github_url: project.github_url || "",
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
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput("");
    }
  };

  const addVideo = () => {
    const url = videoInput.trim();
    if (url) {
      setFormData(prev => ({ ...prev, videos: [...prev.videos, url] }));
      setVideoInput("");
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-orange-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-orange-500/10 via-amber-500/10 to-yellow-500/10 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b border-white/10 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white">
              <FolderOpen className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                {editingId ? "Edit" : "Add"} Project
              </CardTitle>
              <CardDescription>Manage your projects</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label className="text-foreground/80">Title</Label>
            <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Project Title" className="bg-background/50 border-white/20" />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground/80">Description</Label>
            <ReactQuill theme="snow" value={formData.description} onChange={(value) => setFormData({ ...formData, description: value })} />
          </div>

          {/* Tags */}
          <div className="space-y-2 p-4 rounded-xl bg-white/5 border border-white/10">
            <Label className="text-foreground/80">🏷️ Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder="e.g., Data Analytics, Web Dev..."
                className="bg-background/50 border-white/20"
              />
              <Button type="button" variant="outline" size="sm" onClick={addTag} className="border-white/20">Add</Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Videos */}
          <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <Label className="flex items-center gap-2 text-foreground/80">
              <Video className="h-4 w-4" /> Videos (YouTube, LinkedIn, Facebook)
            </Label>
            <div className="flex gap-2">
              <Input
                value={videoInput}
                onChange={e => setVideoInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addVideo(); } }}
                placeholder="Paste video URL..."
                className="bg-background/50 border-white/20"
              />
              <Button type="button" variant="outline" size="sm" onClick={addVideo} className="border-white/20">Add</Button>
            </div>
            {formData.videos.map((videoUrl, index) => {
              const thumb = getVideoThumbnail(videoUrl);
              return (
                <div key={index} className="flex items-center gap-4 p-2 rounded-lg bg-background/30">
                  {thumb ? (
                    <img src={thumb} alt="Video thumbnail" className="w-24 h-16 object-cover rounded-lg border border-white/20" />
                  ) : (
                    <div className="w-24 h-16 rounded-lg bg-muted flex items-center justify-center border border-white/20">
                      <Play className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <span className="text-sm text-foreground/70 truncate flex-1">{videoUrl}</span>
                  <Button type="button" variant="destructive" size="sm" onClick={() => setFormData(prev => ({ ...prev, videos: prev.videos.filter((_, i) => i !== index) }))} className="bg-red-500/80 hover:bg-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            <Label className="text-foreground/80">Icon Name (Lucide)</Label>
            <Input value={formData.icon_name} onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })} placeholder="FolderOpen" className="bg-background/50 border-white/20" />
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <Label className="text-foreground/80">🖼️ Cover Image (optional)</Label>
            <ImageUpload currentImageUrl={formData.image_url} onImageUploaded={(url) => setFormData({ ...formData, image_url: url })} />
          </div>
          <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <Label className="flex items-center gap-2 text-foreground/80">📸 Project Images (multiple)</Label>
            {formData.images.map((imageUrl, index) => (
              <div key={index} className="flex items-center gap-4 p-2 rounded-lg bg-background/30">
                <img src={imageUrl} alt={`Project ${index + 1}`} className="w-24 h-24 object-cover rounded-lg border border-white/20" />
                <Button type="button" variant="destructive" size="sm" onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))} className="bg-red-500/80 hover:bg-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <ImageUpload onImageUploaded={(url) => setFormData(prev => ({ ...prev, images: [...prev.images, url] }))} label="Add Image" />
          </div>
          <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <Label className="flex items-center gap-2 text-foreground/80">📎 Project Files (PDF, PPTX, etc.)</Label>
            {formData.files.map((fileUrl, index) => (
              <div key={index} className="flex items-center gap-4 p-2 rounded-lg bg-background/30">
                <span className="text-sm text-foreground/70 truncate flex-1">{fileUrl.split('/').pop()?.split('?')[0]}</span>
                <Button type="button" variant="destructive" size="sm" onClick={() => setFormData(prev => ({ ...prev, files: prev.files.filter((_, i) => i !== index) }))} className="bg-red-500/80 hover:bg-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <ImageUpload onImageUploaded={(url) => setFormData(prev => ({ ...prev, files: [...prev.files, url] }))} label="Add File" accept=".pdf,.pptx,.ppt,.doc,.docx" allowNonImage />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground/80">Live URL (optional)</Label>
            <Input value={formData.link_url} onChange={(e) => setFormData({ ...formData, link_url: e.target.value })} placeholder="https://live-project.com" className="bg-background/50 border-white/20" />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground/80">Client URL (optional)</Label>
            <Input value={formData.client_url} onChange={(e) => setFormData({ ...formData, client_url: e.target.value })} placeholder="https://github.com/user/client-repo" className="bg-background/50 border-white/20" />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground/80">GitHub URL (optional)</Label>
            <Input value={formData.github_url} onChange={(e) => setFormData({ ...formData, github_url: e.target.value })} placeholder="https://github.com/user/project" className="bg-background/50 border-white/20" />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground/80">Display Order</Label>
            <Input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} className="bg-background/50 border-white/20" />
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700">
              {editingId ? <Edit2 className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {editingId ? "Update" : "Add"} Project
            </Button>
            {editingId && (
              <Button variant="outline" onClick={resetForm} className="border-white/20">Cancel</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/5 backdrop-blur-sm">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">📁</span>
            Current Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-orange-500/5 to-amber-500/5 border border-white/10 hover:border-orange-500/30 transition-all">
                <div className="flex items-center gap-4">
                  {project.image_url && (
                    <img src={project.image_url} alt={project.title} className="w-16 h-16 object-cover rounded-lg border border-white/20" />
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground">{project.title}</h3>
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(project)} className="hover:bg-orange-500/20 hover:text-orange-400">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(project.id)} className="hover:bg-red-500/20 hover:text-red-400">
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
