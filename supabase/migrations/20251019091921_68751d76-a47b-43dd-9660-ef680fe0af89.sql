-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true);

-- Storage policies for portfolio images
CREATE POLICY "Anyone can view portfolio images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-images');

CREATE POLICY "Admins can upload portfolio images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'portfolio-images' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update portfolio images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'portfolio-images' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete portfolio images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'portfolio-images' 
    AND public.has_role(auth.uid(), 'admin')
  );

-- Add image_url columns to existing tables
ALTER TABLE public.about_content ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS image_url text;

-- Education already has logo_url and image_url, so we're good there