-- Create navigation_items table
CREATE TABLE public.navigation_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  is_route BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view navigation items"
ON public.navigation_items
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage navigation items"
ON public.navigation_items
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_navigation_items_updated_at
BEFORE UPDATE ON public.navigation_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed defaults to match current UI
INSERT INTO public.navigation_items (label, href, is_route, display_order) VALUES
('Home', '#home', false, 1),
('About', '#about', false, 2),
('Education', '#education', false, 3),
('Certificates', '#certificates', false, 4),
('Skills', '#skills', false, 5),
('Experience', '#experience', false, 6),
('Events', '#events', false, 7),
('Activities', '#extracurricular', false, 8),
('Blog', '/blog', true, 9),
('Contact', '#contact', false, 10);