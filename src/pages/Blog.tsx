import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  images: string[];
  videos: string[];
  published: boolean;
  created_at: string;
}

const Blog = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/5">
      <Navigation />
      <div className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">Blog</h1>
            {isAdmin && (
              <Button variant="outline" onClick={() => navigate("/admin?tab=blog")}>Manage Posts</Button>
            )}
          </div>
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading posts...</p>
          ) : !posts || posts.length === 0 ? (
            <p className="text-center text-muted-foreground">No blog posts yet.</p>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <Card key={post.id} className="glass-card overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(post.created_at), "MMMM d, yyyy")}</span>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
                    
                    {post.images && post.images.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {post.images.map((imageUrl, index) => (
                          <div key={index} className="rounded-lg overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={`${post.title} - Image ${index + 1}`}
                              className="w-full h-auto object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {post.videos && post.videos.length > 0 && (
                      <div className="space-y-4 mb-6">
                        {post.videos.map((videoUrl, index) => (
                          <video
                            key={index}
                            src={videoUrl}
                            controls
                            className="w-full rounded-lg"
                          />
                        ))}
                      </div>
                    )}
                    
                    <div 
                      className="prose prose-lg max-w-none text-foreground"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;