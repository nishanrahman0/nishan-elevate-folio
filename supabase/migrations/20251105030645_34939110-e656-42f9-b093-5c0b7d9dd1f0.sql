-- Add site_title to hero_content
ALTER TABLE public.hero_content ADD COLUMN IF NOT EXISTS site_title TEXT DEFAULT 'Nishan Rahman';