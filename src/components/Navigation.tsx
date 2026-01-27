import { useState, useEffect } from "react";
import { Menu, X, LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface NavItem {
  label: string;
  href: string;
  isRoute?: boolean;
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [logoUrl, setLogoUrl] = useState("");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchNavItems();
    fetchLogo();
  }, []);

  const fetchNavItems = async () => {
    try {
      const { data, error } = await supabase
        .from("navigation_items")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      setNavItems(data?.map(item => ({
        label: item.label,
        href: item.href,
        isRoute: item.is_route
      })) || []);
    } catch (error) {
      console.error("Error fetching navigation items:", error);
    }
  };

  const fetchLogo = async () => {
    try {
      const { data, error } = await supabase
        .from("hero_content")
        .select("logo_url")
        .maybeSingle();
      
      if (error) throw error;
      setLogoUrl(data?.logo_url || "");
    } catch (error) {
      console.error("Error fetching logo:", error);
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

const handleNavClick = (href: string, isRoute?: boolean) => {
  setIsOpen(false);
  
  // If it's a route (like /education, /skills), navigate to it
  if (isRoute || href.startsWith('/')) {
    navigate(href);
    return;
  }
  
  // For anchor links like #about
  if (location.pathname !== "/") {
    // Navigate to homepage with the anchor
    navigate("/");
    setTimeout(() => {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return;
  }
  
  // On homepage, just scroll to the element
  const element = document.querySelector(href);
  element?.scrollIntoView({ behavior: "smooth" });
};

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-card shadow-lg py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#home");
            }}
            className="text-2xl font-bold gradient-text flex items-center gap-2"
          >
            {logoUrl && <img src={logoUrl} alt="Logo" className="h-8 w-8 object-contain" />}
            {!logoUrl && "NR"}
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href, item.isRoute);
                }}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
            {user && (
              <>
                <Button onClick={() => navigate("/admin")} variant="ghost" size="sm">
                  Admin
                </Button>
                <Button onClick={signOut} variant="ghost" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 glass-card rounded-2xl p-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href, item.isRoute);
                  }}
                  className="text-foreground hover:text-primary transition-colors font-medium py-2"
                >
                  {item.label}
                </a>
              ))}
              {user && (
                <Button onClick={signOut} variant="ghost" size="sm" className="w-full justify-start">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
