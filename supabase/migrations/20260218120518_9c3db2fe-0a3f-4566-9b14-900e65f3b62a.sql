
-- Add view_count column to blog_posts
ALTER TABLE public.blog_posts ADD COLUMN view_count integer NOT NULL DEFAULT 0;
