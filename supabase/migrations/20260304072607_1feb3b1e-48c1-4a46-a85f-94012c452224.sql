
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'::text[];
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS videos jsonb DEFAULT '[]'::jsonb;
