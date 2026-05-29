-- Highlights flag for homepage feature
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS highlighted boolean NOT NULL DEFAULT false;
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS skill_type text NOT NULL DEFAULT 'technical';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS highlighted boolean NOT NULL DEFAULT false;
ALTER TABLE public.activity_tasks ADD COLUMN IF NOT EXISTS highlighted boolean NOT NULL DEFAULT false;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS highlighted boolean NOT NULL DEFAULT false;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS highlighted boolean NOT NULL DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS highlighted boolean NOT NULL DEFAULT false;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS highlighted boolean NOT NULL DEFAULT false;

-- Achievements table
CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date_text text,
  issuer text,
  images jsonb DEFAULT '[]'::jsonb,
  video_url text,
  link_url text,
  highlighted boolean NOT NULL DEFAULT false,
  hidden boolean NOT NULL DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.achievements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.achievements TO authenticated;
GRANT ALL ON public.achievements TO service_role;

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievements"
ON public.achievements FOR SELECT
USING (true);

CREATE POLICY "Admins can manage achievements"
ON public.achievements FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_achievements_updated_at
BEFORE UPDATE ON public.achievements
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();