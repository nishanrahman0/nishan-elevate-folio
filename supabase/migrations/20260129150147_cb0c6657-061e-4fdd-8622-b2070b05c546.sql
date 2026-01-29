-- Create SEO settings table
CREATE TABLE public.seo_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name TEXT NOT NULL UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  keywords TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "SEO settings are viewable by everyone" 
ON public.seo_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage SEO settings" 
ON public.seo_settings 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_seo_settings_updated_at
BEFORE UPDATE ON public.seo_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add resume_url to hero_content
ALTER TABLE public.hero_content ADD COLUMN resume_url TEXT;

-- Add logo_url to experiences (for organization logo)
ALTER TABLE public.experiences ADD COLUMN logo_url TEXT;

-- Add logo_url to extracurricular_activities (for organization logo)
ALTER TABLE public.extracurricular_activities ADD COLUMN logo_url TEXT;

-- Insert default SEO settings for main pages
INSERT INTO public.seo_settings (page_name, meta_title, meta_description) VALUES
('home', 'Nishan Rahman - Data Analyst & AI Developer', 'Portfolio of Nishan Rahman - Data Analyst and AI Agent Developer from Rajshahi, Bangladesh'),
('skills', 'Skills - Nishan Rahman', 'Technical and professional skills in data analytics, programming, and AI'),
('experience', 'Experience - Nishan Rahman', 'Professional experience and work history'),
('projects', 'Projects - Nishan Rahman', 'Portfolio of completed projects and work'),
('blog', 'Blog - Nishan Rahman', 'Articles and insights on data analytics and AI'),
('activities', 'Activities - Nishan Rahman', 'Extracurricular activities and club memberships'),
('events', 'Events - Nishan Rahman', 'Workshops, seminars, and events attended'),
('certificates', 'Certificates - Nishan Rahman', 'Professional certifications and courses completed');