-- Add running_ads table for editable ads section
CREATE TABLE public.running_ads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  link_url TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.running_ads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active ads"
ON public.running_ads
FOR SELECT
USING (active = true);

CREATE POLICY "Admins can manage ads"
ON public.running_ads
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for timestamps
CREATE TRIGGER update_running_ads_updated_at
BEFORE UPDATE ON public.running_ads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add image_url to extracurricular_activities table
ALTER TABLE public.extracurricular_activities
ADD COLUMN image_url TEXT;