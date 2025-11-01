-- Ensure public bucket for images exists and policies are set
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'portfolio-images') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('portfolio-images', 'portfolio-images', true);
  ELSE
    -- Ensure bucket is public
    UPDATE storage.buckets SET public = true WHERE id = 'portfolio-images';
  END IF;
END $$;

-- Public read policy for the bucket
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
      AND tablename = 'objects' 
      AND policyname = 'Public read for portfolio-images'
  ) THEN
    CREATE POLICY "Public read for portfolio-images"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'portfolio-images');
  END IF;
END $$;

-- Admins can manage objects in the bucket
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
      AND tablename = 'objects' 
      AND policyname = 'Admins manage portfolio-images'
  ) THEN
    CREATE POLICY "Admins manage portfolio-images"
    ON storage.objects
    FOR ALL TO authenticated
    USING (
      bucket_id = 'portfolio-images' 
      AND has_role(auth.uid(), 'admin'::app_role)
    )
    WITH CHECK (
      bucket_id = 'portfolio-images' 
      AND has_role(auth.uid(), 'admin'::app_role)
    );
  END IF;
END $$;

-- Add link_url columns where needed
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS link_url TEXT;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS link_url TEXT;
ALTER TABLE public.education ADD COLUMN IF NOT EXISTS link_url TEXT;
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS link_url TEXT;