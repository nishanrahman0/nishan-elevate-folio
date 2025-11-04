-- Create table for extracurricular activities content
CREATE TABLE IF NOT EXISTS public.extracurricular_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  content TEXT NOT NULL DEFAULT ''
);

-- Create table for contact section content
CREATE TABLE IF NOT EXISTS public.contact_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  heading TEXT NOT NULL DEFAULT 'Get In Touch',
  description TEXT NOT NULL DEFAULT '',
  email TEXT,
  phone TEXT
);

-- Enable RLS
ALTER TABLE public.extracurricular_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_content ENABLE ROW LEVEL SECURITY;

-- Policies for extracurricular_content
CREATE POLICY "Anyone can view extracurricular content"
ON public.extracurricular_content
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage extracurricular content"
ON public.extracurricular_content
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Policies for contact_content
CREATE POLICY "Anyone can view contact content"
ON public.contact_content
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage contact content"
ON public.contact_content
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_extracurricular_content_updated_at
BEFORE UPDATE ON public.extracurricular_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_content_updated_at
BEFORE UPDATE ON public.contact_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();