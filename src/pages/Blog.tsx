import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search, Clock, Tag, MessageCircle, Send } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

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

function estimateReadTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

const Blog = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [commentForms, setCommentForms] = useState<Record<string, { name: string; content: string }>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
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

  const { data: allComments } = useQuery({
    queryKey: ["blog-comments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_comments")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as BlogComment[];
    },
  });

  const submitComment = useMutation({
    mutationFn: async ({ postId, name, content }: { postId: string; name: string; content: string }) => {
      const { error } = await supabase.from("blog_comments").insert([{
        post_id: postId,
        author_name: name,
        content,
      }]);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blog-comments"] });
      toast.success("Comment submitted! It will appear after approval.");
      setCommentForms(prev => ({ ...prev, [variables.postId]: { name: "", content: "" } }));
    },
    onError: () => toast.error("Failed to submit comment"),
  });

  // Derive categories and tags
  const categories = [...new Set(posts?.map(p => p.category) || [])];
  const allTags = [...new Set(posts?.flatMap(p => p.tags) || [])];

  // Filter posts
  const filtered = posts?.filter(post => {
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesCategory && matchesTag;
  });

  const getCommentForm = (postId: string) => commentForms[postId] || { name: "", content: "" };
  const getPostComments = (postId: string) => allComments?.filter(c => c.post_id === postId) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <Navigation />
      <div className="pt-24 pb-16 min-h-screen relative z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">Blog</h1>
            {isAdmin && (
              <Button variant="outline" onClick={() => navigate("/admin?tab=blog")}>Manage Posts</Button>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>

          {/* Category & Tag Filters */}
          {(categories.length > 0 || allTags.length > 0) && (
            <div className="space-y-3 mb-8">
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={!selectedCategory ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(null)}
                  >All</Badge>
                  {categories.map(cat => (
                    <Badge
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                    >{cat}</Badge>
                  ))}
                </div>
              )}
              {allTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {allTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTag === tag ? "secondary" : "outline"}
                      className="cursor-pointer text-xs"
                      onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                    >{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading posts...</p>
          ) : !filtered || filtered.length === 0 ? (
            <p className="text-center text-muted-foreground">No blog posts found.</p>
          ) : (
            <div className="space-y-8">
              {filtered.map((post) => {
                const readTime = estimateReadTime(post.content);
                const comments = getPostComments(post.id);
                const form = getCommentForm(post.id);
                const showComments = expandedComments[post.id];

                return (
                  <Card key={post.id} className="glass-card overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(post.created_at), "MMMM d, yyyy")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {readTime} min read
                        </span>
                        <Badge variant="secondary">{post.category}</Badge>
                      </div>
                      
                      <h2 className="text-2xl font-bold mb-3">{post.title}</h2>

                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      )}
                      
                      {post.images && post.images.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          {post.images.map((imageUrl, index) => (
                            <div key={index} className="rounded-lg overflow-hidden">
                              <img src={imageUrl} alt={`${post.title} - Image ${index + 1}`} className="w-full h-auto object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {post.videos && post.videos.length > 0 && (
                        <div className="space-y-4 mb-6">
                          {post.videos.map((videoUrl, index) => (
                            <video key={index} src={videoUrl} controls className="w-full rounded-lg" />
                          ))}
                        </div>
                      )}
                      
                      <div 
                        className="prose prose-lg max-w-none text-foreground"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />

                      {/* Comments Section */}
                      <div className="mt-6 pt-6 border-t border-border/50">
                        <button
                          onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <MessageCircle className="h-4 w-4" />
                          {comments.length} Comment{comments.length !== 1 ? "s" : ""}
                        </button>

                        {showComments && (
                          <div className="mt-4 space-y-4">
                            {comments.map(comment => (
                              <div key={comment.id} className="p-3 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm">{comment.author_name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {format(new Date(comment.created_at), "MMM d, yyyy")}
                                  </span>
                                </div>
                                <p className="text-sm text-foreground/80">{comment.content}</p>
                              </div>
                            ))}

                            {/* Comment Form */}
                            <div className="space-y-2 pt-2">
                              <Input
                                placeholder="Your name"
                                value={form.name}
                                onChange={e => setCommentForms(prev => ({
                                  ...prev, [post.id]: { ...getCommentForm(post.id), name: e.target.value }
                                }))}
                                className="bg-background/50"
                              />
                              <div className="flex gap-2">
                                <Textarea
                                  placeholder="Write a comment..."
                                  value={form.content}
                                  onChange={e => setCommentForms(prev => ({
                                    ...prev, [post.id]: { ...getCommentForm(post.id), content: e.target.value }
                                  }))}
                                  className="bg-background/50 min-h-[60px]"
                                  rows={2}
                                />
                                <Button
                                  size="icon"
                                  disabled={!form.name.trim() || !form.content.trim()}
                                  onClick={() => submitComment.mutate({
                                    postId: post.id,
                                    name: form.name.trim(),
                                    content: form.content.trim(),
                                  })}
                                >
                                  <Send className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
