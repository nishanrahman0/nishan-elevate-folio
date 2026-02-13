import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ImageUpload } from "./ImageUpload";
import { Trash2, FileText, Sparkles, X } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  images: string[];
  videos: string[];
  published: boolean;
  created_at: string;
  category: string;
  tags: string[];
}

interface BlogComment {
  id: string;
  post_id: string;
  author_name: string;
  content: string;
  approved: boolean;
  created_at: string;
}

export function BlogEditor() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    images: [] as string[],
    videos: [] as string[],
    published: false,
    category: "General",
    tags: [] as string[],
  });

  const { data: posts } = useQuery({
    queryKey: ["blog-posts-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as any[]).map(p => ({
        ...p,
        images: p.images || [],
        videos: p.videos || [],
        tags: p.tags || [],
        category: p.category || "General",
      })) as BlogPost[];
    },
  });

  const { data: comments } = useQuery({
    queryKey: ["blog-comments-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_comments")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as BlogComment[];
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

  const approveComment = useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      const { error } = await supabase.from("blog_comments").update({ approved }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-comments-admin"] });
      queryClient.invalidateQueries({ queryKey: ["blog-comments"] });
      toast.success("Comment updated");
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_comments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-comments-admin"] });
      queryClient.invalidateQueries({ queryKey: ["blog-comments"] });
      toast.success("Comment deleted");
    },
  });

  const resetForm = () => {
    setFormData({ title: "", content: "", images: [], videos: [], published: false, category: "General", tags: [] });
    setEditingId(null);
    setTagInput("");
  };

  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setFormData({
      title: post.title,
      content: post.content,
      images: post.images || [],
      videos: post.videos || [],
      published: post.published,
      category: post.category || "General",
      tags: post.tags || [],
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

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const addVideoUrl = () => {
    const url = prompt("Enter video URL:");
    if (url) setFormData(prev => ({ ...prev, videos: [...prev.videos, url] }));
  };

  const removeVideo = (index: number) => {
    setFormData(prev => ({ ...prev, videos: prev.videos.filter((_, i) => i !== index) }));
  };

  const pendingComments = comments?.filter(c => !c.approved) || [];

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
              <Input id="title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required className="bg-background/50 border-white/20" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground/80">Category</Label>
                <Input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="bg-background/50 border-white/20" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    placeholder="Add a tag..."
                    className="bg-background/50 border-white/20"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addTag} className="border-white/20">Add</Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)}><X className="h-3 w-3" /></button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground/80">Content</Label>
              <RichTextEditor value={formData.content} onChange={value => setFormData({ ...formData, content: value })} placeholder="Write your blog post content here..." />
            </div>

            <div className="flex items-center space-x-2 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <Switch id="published" checked={formData.published} onCheckedChange={checked => setFormData({ ...formData, published: checked })} />
              <Label htmlFor="published" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-green-400" />Publish
              </Label>
            </div>

            <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <Label className="flex items-center gap-2 text-foreground/80">📷 Images</Label>
              {formData.images.map((imageUrl, index) => (
                <div key={index} className="flex items-center gap-4 p-2 rounded-lg bg-background/30">
                  <img src={imageUrl} alt={`Post ${index + 1}`} className="w-24 h-24 object-cover rounded-lg border border-white/20" />
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeImage(index)} className="bg-red-500/80 hover:bg-red-600"><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <ImageUpload onImageUploaded={handleImageUploaded} label="Add Image" />
            </div>

            <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-foreground/80">🎬 Videos</Label>
                <Button type="button" variant="outline" size="sm" onClick={addVideoUrl} className="border-white/20">Add Video URL</Button>
              </div>
              {formData.videos.map((videoUrl, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Input value={videoUrl} readOnly className="bg-background/30 border-white/20" />
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeVideo(index)} className="bg-red-500/80 hover:bg-red-600"><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                {editingId ? "Update" : "Create"} Post
              </Button>
              {editingId && <Button type="button" variant="outline" onClick={resetForm} className="border-white/20">Cancel</Button>}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Pending Comments */}
      {pendingComments.length > 0 && (
        <Card className="border-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">⏳ Pending Comments ({pendingComments.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingComments.map(comment => (
              <div key={comment.id} className="p-3 rounded-lg bg-background/30 flex justify-between items-start gap-4">
                <div>
                  <p className="font-semibold text-sm">{comment.author_name}</p>
                  <p className="text-sm text-muted-foreground">{comment.content}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" onClick={() => approveComment.mutate({ id: comment.id, approved: true })} className="bg-green-500/20 text-green-400 hover:bg-green-500/30">Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteComment.mutate(comment.id)} className="bg-red-500/20 text-red-400 hover:bg-red-500/30">Delete</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Existing Posts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2"><span className="text-2xl">📚</span>Existing Posts</h3>
        {posts?.map(post => (
          <Card key={post.id} className="border-0 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-foreground">{post.title}</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                    {post.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
                  </div>
                  <p className="text-xs mt-2">
                    <span className={`px-2 py-1 rounded-full ${post.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                    <span className="ml-2 text-muted-foreground">Images: {post.images?.length || 0}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleEdit(post)} className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(post.id)} className="bg-red-500/20 text-red-400 hover:bg-red-500/30">Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
