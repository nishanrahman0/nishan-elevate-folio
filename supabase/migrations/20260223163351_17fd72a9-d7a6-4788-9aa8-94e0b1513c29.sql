ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS client_url text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS github_url text;