-- Create table for arbitrary social links shown in the hero section
CREATE TABLE IF NOT EXISTS public.hero_social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  label TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Link',
  url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.hero_social_links ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view hero social links"
ON public.hero_social_links
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage hero social links"
ON public.hero_social_links
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Trigger to update updated_at
DROP TRIGGER IF EXISTS update_hero_social_links_updated_at ON public.hero_social_links;
CREATE TRIGGER update_hero_social_links_updated_at
BEFORE UPDATE ON public.hero_social_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();