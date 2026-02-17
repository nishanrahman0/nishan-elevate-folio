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
import { Calendar, Search, Clock, Tag, MessageCircle, Send, TrendingUp, Newspaper } from "lucide-react";
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

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function getExcerpt(content: string, maxLength = 150): string {
  const text = stripHtml(content);
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

const Blog = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
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
        images: Array.isArray(p.images) ? p.images : [],
        videos: Array.isArray(p.videos) ? p.videos : [],
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

  const categories = [...new Set(posts?.map(p => p.category) || [])];
  const allTags = [...new Set(posts?.flatMap(p => p.tags) || [])];

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

  const featuredPost = filtered?.[0];
  const gridPosts = filtered?.slice(1) || [];

  const getPostImage = (post: BlogPost): string | null => {
    if (post.images && post.images.length > 0) return post.images[0] as string;
    return null;
  };

  const renderExpandedPost = (post: BlogPost) => {
    const readTime = estimateReadTime(post.content);
    const comments = getPostComments(post.id);
    const form = getCommentForm(post.id);
    const showComments = expandedComments[post.id];

    return (
      <Card className="glass-card overflow-hidden animate-fade-in">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-6 pb-0">
            <Button variant="ghost" size="sm" onClick={() => setExpandedPost(null)}>
              ← Back to News
            </Button>
          </div>
          <div className="p-6 pt-4">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
              <Badge variant="secondary" className="font-medium">{post.category}</Badge>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(post.created_at), "MMMM d, yyyy")}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {readTime} min read
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{post.title}</h1>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
            )}

            {post.images && post.images.length > 0 && (
              <div className="mb-6">
                <img
                  src={post.images[0] as string}
                  alt={post.title}
                  className="w-full h-auto max-h-[500px] object-cover rounded-xl"
                />
                {post.images.length > 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                    {(post.images as string[]).slice(1).map((url, i) => (
                      <img key={i} src={url} alt={`${post.title} ${i + 2}`} className="w-full h-40 object-cover rounded-lg" />
                    ))}
                  </div>
                )}
              </div>
            )}

            {post.videos && post.videos.length > 0 && (
              <div className="space-y-4 mb-6">
                {(post.videos as string[]).map((videoUrl, index) => (
                  <video key={index} src={videoUrl} controls className="w-full rounded-lg" />
                ))}
              </div>
            )}

            <div
              className="prose prose-lg max-w-none text-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Comments */}
            <div className="mt-8 pt-6 border-t border-border/50">
              <button
                onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
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
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <Navigation />

      <div className="pt-24 pb-16 min-h-screen relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* News Portal Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Newspaper className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">News Portal</h1>
                <p className="text-muted-foreground text-sm">Latest updates, stories & insights</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Button variant="outline" size="sm" onClick={() => navigate("/admin?tab=blog")}>
                  Manage Posts
                </Button>
              )}
            </div>
          </div>

          {/* Ticker Bar */}
          {filtered && filtered.length > 0 && !expandedPost && (
            <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-primary/5 border border-primary/10 overflow-hidden">
              <Badge className="shrink-0 bg-primary text-primary-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Trending
              </Badge>
              <div className="overflow-hidden whitespace-nowrap">
                <div className="inline-flex gap-8 animate-marquee text-sm text-muted-foreground">
                  {filtered.slice(0, 5).map(post => (
                    <span
                      key={post.id}
                      className="cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => setExpandedPost(post.id)}
                    >
                      {post.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search & Filters */}
          {!expandedPost && (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/60 backdrop-blur-sm"
                />
              </div>

              {(categories.length > 0 || allTags.length > 0) && (
                <div className="space-y-2 mb-8">
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
                    <div className="flex flex-wrap gap-2 items-center">
                      <Tag className="h-3.5 w-3.5 text-muted-foreground" />
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
            </>
          )}

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-72 rounded-xl bg-muted/30 animate-pulse" />
              ))}
            </div>
          ) : expandedPost && filtered ? (
            (() => {
              const post = filtered.find(p => p.id === expandedPost);
              return post ? renderExpandedPost(post) : <p className="text-center text-muted-foreground">Post not found.</p>;
            })()
          ) : !filtered || filtered.length === 0 ? (
            <div className="text-center py-20">
              <Newspaper className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No news articles found.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Featured / Hero Post */}
              {featuredPost && (
                <Card
                  className="glass-card overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300"
                  onClick={() => setExpandedPost(featuredPost.id)}
                >
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden bg-muted">
                        {getPostImage(featuredPost) ? (
                          <img
                            src={getPostImage(featuredPost)!}
                            alt={featuredPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full min-h-[250px] flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                            <Newspaper className="h-16 w-16 text-muted-foreground/30" />
                          </div>
                        )}
                        <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">Featured</Badge>
                      </div>
                      <div className="p-6 md:p-8 flex flex-col justify-center">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
                          <Badge variant="secondary" className="text-xs">{featuredPost.category}</Badge>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(featuredPost.created_at), "MMM d, yyyy")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {estimateReadTime(featuredPost.content)} min
                          </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-3">
                          {featuredPost.title}
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
                          {getExcerpt(featuredPost.content, 200)}
                        </p>
                        {featuredPost.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {featuredPost.tags.slice(0, 4).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {getPostComments(featuredPost.id).length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Grid of Posts */}
              {gridPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gridPosts.map(post => {
                    const img = getPostImage(post);
                    const readTime = estimateReadTime(post.content);
                    const comments = getPostComments(post.id);

                    return (
                      <Card
                        key={post.id}
                        className="glass-card overflow-hidden cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        onClick={() => setExpandedPost(post.id)}
                      >
                        <CardContent className="p-0">
                          <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                            {img ? (
                              <img
                                src={img}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                                <Newspaper className="h-10 w-10 text-muted-foreground/20" />
                              </div>
                            )}
                            <Badge className="absolute top-3 left-3 text-xs" variant="secondary">
                              {post.category}
                            </Badge>
                          </div>
                          <div className="p-5">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(post.created_at), "MMM d, yyyy")}
                              </span>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {readTime} min
                              </span>
                            </div>
                            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                              {getExcerpt(post.content, 100)}
                            </p>
                            <div className="flex items-center justify-between">
                              {post.tags.length > 0 && (
                                <div className="flex gap-1">
                                  {post.tags.slice(0, 2).map(tag => (
                                    <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">{tag}</Badge>
                                  ))}
                                </div>
                              )}
                              <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                                <MessageCircle className="h-3 w-3" />
                                {comments.length}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
