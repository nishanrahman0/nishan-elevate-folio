-- Restore the navigation items that were deleted
INSERT INTO public.navigation_items (label, href, is_route, display_order) VALUES
('Certificates', '/certificates', true, 3),
('Skills', '/skills', true, 4),
('Experience', '/experience', true, 5),
('Events', '/events', true, 6),
('Activities', '/activities', true, 7),
('Blog', '/blog', true, 8),
('Projects', '/projects', true, 9);