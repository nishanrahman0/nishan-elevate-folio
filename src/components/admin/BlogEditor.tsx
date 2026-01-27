import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ImageUpload } from "./ImageUpload";
import { Trash2, FileText, Sparkles } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  images: string[];
  videos: string[];
  published: boolean;
  created_at: string;
}

export function BlogEditor() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    images: [] as string[],
    videos: [] as string[],
    published: false,
  });

  const { data: posts } = useQuery({
    queryKey: ["blog-posts-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("blog_posts").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts-admin"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast.success("Blog post created successfully");
      resetForm();
    },
    onError: () => toast.error("Failed to create blog post"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from("blog_posts").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts-admin"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast.success("Blog post updated successfully");
      resetForm();
    },
    onError: () => toast.error("Failed to update blog post"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts-admin"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast.success("Blog post deleted successfully");
    },
    onError: () => toast.error("Failed to delete blog post"),
  });

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      images: [],
      videos: [],
      published: false,
    });
    setEditingId(null);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setFormData({
      title: post.title,
      content: post.content,
      images: post.images || [],
      videos: post.videos || [],
      published: post.published,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleImageUploaded = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, url],
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addVideoUrl = () => {
    const url = prompt("Enter video URL:");
    if (url) {
      setFormData((prev) => ({
        ...prev,
        videos: [...prev.videos, url],
      }));
    }
  };

  const removeVideo = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-indigo-500/10 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b border-white/10 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                {editingId ? "Edit Blog Post" : "Create New Blog Post"}
              </CardTitle>
              <CardDescription>Share your thoughts and experiences</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground/80">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="bg-background/50 border-white/20 focus:border-pink-500/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-foreground/80">Content</Label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="Write your blog post content here..."
              />
            </div>

            <div className="flex items-center space-x-2 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
              <Label htmlFor="published" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-green-400" />
                Publish
              </Label>
            </div>

            <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <Label className="flex items-center gap-2 text-foreground/80">
                📷 Images
              </Label>
              {formData.images.map((imageUrl, index) => (
                <div key={index} className="flex items-center gap-4 p-2 rounded-lg bg-background/30">
                  <img src={imageUrl} alt={`Post ${index + 1}`} className="w-24 h-24 object-cover rounded-lg border border-white/20" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage(index)}
                    className="bg-red-500/80 hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <ImageUpload onImageUploaded={handleImageUploaded} label="Add Image" />
            </div>

            <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-foreground/80">
                  🎬 Videos
                </Label>
                <Button type="button" variant="outline" size="sm" onClick={addVideoUrl} className="border-white/20">
                  Add Video URL
                </Button>
              </div>
              {formData.videos.map((videoUrl, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Input value={videoUrl} readOnly className="bg-background/30 border-white/20" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeVideo(index)}
                    className="bg-red-500/80 hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                {editingId ? "Update" : "Create"} Post
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm} className="border-white/20">
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-2xl">📚</span>
          Existing Posts
        </h3>
        {posts?.map((post) => (
          <Card key={post.id} className="border-0 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-foreground">{post.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                  <p className="text-xs mt-2">
                    <span className={`px-2 py-1 rounded-full ${post.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                    <span className="ml-2 text-muted-foreground">Images: {post.images?.length || 0}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleEdit(post)} className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(post.id)}
                    className="bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
