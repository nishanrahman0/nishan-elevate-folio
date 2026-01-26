-- Create footer_content table for customizable footer
CREATE TABLE public.footer_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  copyright_text TEXT NOT NULL DEFAULT '© 2025 Nishan Rahman. All rights reserved.',
  show_year BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.footer_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view footer content"
ON public.footer_content
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage footer content"
ON public.footer_content
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default data
INSERT INTO public.footer_content (copyright_text) VALUES ('© 2025 Nishan Rahman. All rights reserved.');