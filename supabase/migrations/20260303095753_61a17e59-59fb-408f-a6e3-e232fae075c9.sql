
ALTER TABLE public.activity_tasks ADD COLUMN IF NOT EXISTS files jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS files jsonb DEFAULT '[]'::jsonb;
