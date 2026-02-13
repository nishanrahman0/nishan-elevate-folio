
-- Add category and tags to blog_posts
ALTER TABLE public.blog_posts 
ADD COLUMN category text DEFAULT 'General',
ADD COLUMN tags text[] DEFAULT '{}';

-- Create blog_comments table
CREATE TABLE public.blog_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_email text,
  content text NOT NULL,
  approved boolean DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved comments
CREATE POLICY "Anyone can view approved comments"
ON public.blog_comments
FOR SELECT
USING (approved = true OR has_role(auth.uid(), 'admin'::app_role));

-- Anyone can insert comments (public blog)
CREATE POLICY "Anyone can submit comments"
ON public.blog_comments
FOR INSERT
WITH CHECK (true);

-- Admins can manage comments
CREATE POLICY "Admins can manage comments"
ON public.blog_comments
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Index for faster lookups
CREATE INDEX idx_blog_comments_post_id ON public.blog_comments(post_id);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX idx_blog_posts_tags ON public.blog_posts USING GIN(tags);
