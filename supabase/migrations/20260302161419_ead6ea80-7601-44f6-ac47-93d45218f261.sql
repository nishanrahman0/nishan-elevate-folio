
-- Add hidden column to navigation_items
ALTER TABLE public.navigation_items ADD COLUMN hidden boolean NOT NULL DEFAULT false;

-- Create activity_organizations table
CREATE TABLE public.activity_organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  banner_url text,
  logo_url text,
  display_order integer DEFAULT 0,
  hidden boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view activity organizations" ON public.activity_organizations FOR SELECT USING (true);
CREATE POLICY "Admins can manage activity organizations" ON public.activity_organizations FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create activity_roles table
CREATE TABLE public.activity_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.activity_organizations(id) ON DELETE CASCADE,
  role_name text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view activity roles" ON public.activity_roles FOR SELECT USING (true);
CREATE POLICY "Admins can manage activity roles" ON public.activity_roles FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create activity_tasks table (like projects)
CREATE TABLE public.activity_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid NOT NULL REFERENCES public.activity_roles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  image_url text,
  images jsonb DEFAULT '[]'::jsonb,
  link_url text,
  client_url text,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view activity tasks" ON public.activity_tasks FOR SELECT USING (true);
CREATE POLICY "Admins can manage activity tasks" ON public.activity_tasks FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Update trigger for timestamps
CREATE TRIGGER update_activity_organizations_updated_at BEFORE UPDATE ON public.activity_organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_activity_roles_updated_at BEFORE UPDATE ON public.activity_roles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_activity_tasks_updated_at BEFORE UPDATE ON public.activity_tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
