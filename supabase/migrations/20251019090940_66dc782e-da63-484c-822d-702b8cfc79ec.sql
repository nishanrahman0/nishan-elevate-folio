-- Create tables for editable content

-- Hero section
CREATE TABLE public.hero_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tagline text NOT NULL,
  profile_image_url text,
  linkedin_url text,
  github_url text,
  facebook_url text,
  instagram_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- About section
CREATE TABLE public.about_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Experience entries
CREATE TABLE public.experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  duration text NOT NULL,
  description text NOT NULL,
  icon_name text NOT NULL DEFAULT 'Briefcase',
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Education entries
CREATE TABLE public.education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution text NOT NULL,
  degree text NOT NULL,
  duration text NOT NULL,
  logo_url text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Certificates
CREATE TABLE public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issuer text NOT NULL,
  icon_emoji text NOT NULL DEFAULT '📜',
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Skills
CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  skill_name text NOT NULL,
  icon_name text NOT NULL DEFAULT 'Code',
  color_gradient text NOT NULL DEFAULT 'from-primary to-secondary',
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Everyone can read, only admins can modify
CREATE POLICY "Anyone can view hero content"
  ON public.hero_content FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage hero content"
  ON public.hero_content FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view about content"
  ON public.about_content FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage about content"
  ON public.about_content FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view experiences"
  ON public.experiences FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage experiences"
  ON public.experiences FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view education"
  ON public.education FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage education"
  ON public.education FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view certificates"
  ON public.certificates FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage certificates"
  ON public.certificates FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view skills"
  ON public.skills FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage skills"
  ON public.skills FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert default data
INSERT INTO public.hero_content (name, tagline, linkedin_url, github_url, facebook_url, instagram_url)
VALUES (
  'Nishan Rahman',
  'Aspiring Data Analyst | Tech Explorer | AI Enthusiast',
  'https://www.linkedin.com/in/nishanrahmanofficial/',
  'https://github.com/nishanrahman0',
  'https://www.facebook.com/nishan.rahman.2024',
  'https://www.instagram.com/mdnishanrahman?utm_source=qr&igsh=MWk3ZGw3YzVwZGY2cg=='
);

INSERT INTO public.about_content (content)
VALUES (
  'I''m a Management Studies student at the University of Rajshahi with strong skills in Data Analytics, Visualization, and AI tools. Passionate about solving business problems with data-driven solutions and modern productivity tools.'
);

INSERT INTO public.experiences (title, company, duration, description, icon_name, display_order)
VALUES
  ('Content Writer', 'USA-based Company', '3 months (May–July 2024)', 'Created engaging content for various digital platforms', 'Briefcase', 1),
  ('Google Data Analytics Projects', 'Self-paced Learning', '50+ hands-on projects', 'Google Sheets, Tableau, BigQuery, R Programming', 'Code', 2),
  ('Google Data Analytics Capstone', 'Google Certificate Program', 'Completed Case Study', 'End-to-end data analysis project demonstrating full data analytics lifecycle', 'TrendingUp', 3);

INSERT INTO public.education (institution, degree, duration)
VALUES ('University of Rajshahi', 'BBA in Management Studies', 'September 2023 – Present');

INSERT INTO public.certificates (title, issuer, icon_emoji, display_order)
VALUES
  ('Google Data Analytics', 'Google', '📊', 1),
  ('Technical Support Fundamentals', 'Google', '🛠️', 2),
  ('Mastering Supervision', 'Professional Certificate', '👥', 3),
  ('Generative AI for Business', 'Professional Certificate', '🤖', 4);

INSERT INTO public.skills (category, skill_name, icon_name, color_gradient, display_order)
VALUES
  ('Data Analytics & Visualization', 'Excel', 'BarChart3', 'from-primary to-secondary', 1),
  ('Data Analytics & Visualization', 'Google Sheets', 'BarChart3', 'from-primary to-secondary', 2),
  ('Data Analytics & Visualization', 'Tableau', 'BarChart3', 'from-primary to-secondary', 3),
  ('Data Analytics & Visualization', 'Power BI', 'BarChart3', 'from-primary to-secondary', 4),
  ('Data Analytics & Visualization', 'R', 'BarChart3', 'from-primary to-secondary', 5),
  ('Data Analytics & Visualization', 'Python', 'BarChart3', 'from-primary to-secondary', 6),
  ('Data Analytics & Visualization', 'SQL', 'BarChart3', 'from-primary to-secondary', 7),
  ('Productivity & Design Tools', 'MS Office', 'Palette', 'from-accent to-primary', 8),
  ('Productivity & Design Tools', 'Google Docs', 'Palette', 'from-accent to-primary', 9),
  ('Productivity & Design Tools', 'Canva', 'Palette', 'from-accent to-primary', 10),
  ('Productivity & Design Tools', 'After Effects', 'Palette', 'from-accent to-primary', 11),
  ('Productivity & Design Tools', 'Drive Management', 'Palette', 'from-accent to-primary', 12);