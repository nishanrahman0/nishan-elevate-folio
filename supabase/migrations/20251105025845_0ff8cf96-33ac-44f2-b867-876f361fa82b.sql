-- Create extracurricular_activities table
CREATE TABLE public.extracurricular_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Users',
  color_gradient TEXT NOT NULL DEFAULT 'from-primary to-secondary',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.extracurricular_activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view extracurricular activities" 
ON public.extracurricular_activities 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage extracurricular activities" 
ON public.extracurricular_activities 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for timestamps
CREATE TRIGGER update_extracurricular_activities_updated_at
BEFORE UPDATE ON public.extracurricular_activities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add logo_url to hero_content if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'hero_content' AND column_name = 'logo_url') THEN
    ALTER TABLE public.hero_content ADD COLUMN logo_url TEXT;
  END IF;
END $$;

-- Insert default extracurricular activities
INSERT INTO public.extracurricular_activities (title, organization, icon_name, color_gradient, display_order)
VALUES 
  ('Deputy Director of Documentation', 'Rajshahi University Career Club', 'Users', 'from-primary to-secondary', 1),
  ('Volunteer', 'Hult Prize RU 2024–25', 'Award', 'from-accent to-primary', 2);