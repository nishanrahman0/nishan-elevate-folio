import { useState, useEffect } from "react";
import { Menu, X, LogOut, ChevronRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
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
  const [siteName, setSiteName] = useState("");
  const [showSiteName, setShowSiteName] = useState(true);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchNavItems();
    fetchBranding();
  }, []);

  const fetchNavItems = async () => {
    try {
      const { data, error } = await supabase
        .from("navigation_items")
        .select("*")
        .eq("hidden", false)
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

  const fetchBranding = async () => {
    try {
      const { data, error } = await supabase
        .from("hero_content")
        .select("logo_url, site_title, name, show_site_name")
        .maybeSingle();
      
      if (error) throw error;
      setLogoUrl(data?.logo_url || "");
      setSiteName(data?.site_title || data?.name || "");
      setShowSiteName((data as any)?.show_site_name ?? true);
    } catch (error) {
      console.error("Error fetching branding:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href.startsWith("/")) return location.pathname === href;
    if (href.startsWith("#") && location.pathname === "/") return true;
    return false;
  };

  const handleNavClick = (href: string, isRoute?: boolean) => {
    setIsOpen(false);
    if (isRoute || href.startsWith('/')) {
      navigate(href);
      return;
    }
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-xl bg-background/80 shadow-lg shadow-primary/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); handleNavClick("#home"); }}
              className="flex items-center gap-2.5 group"
            >
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-9 w-9 object-contain rounded-lg group-hover:scale-105 transition-transform" />
              ) : (
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {siteName.slice(0, 2).toUpperCase() || "NR"}
                </div>
              )}
              {showSiteName && siteName && (
                <span className="text-lg font-bold text-foreground hidden sm:inline">{siteName}</span>
              )}
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.href, item.isRoute); }}
                  className={`
                    px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive(item.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                    }
                  `}
                >
                  {item.label}
                </a>
              ))}
              <div className="ml-2 flex items-center gap-1">
                <ThemeToggle />
                {user && (
                  <>
                    <Button onClick={() => navigate("/admin")} variant="ghost" size="sm" className="text-xs">
                      Admin
                    </Button>
                    <Button onClick={signOut} variant="ghost" size="sm" className="text-xs">
                      <LogOut className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-card/95 backdrop-blur-xl border-l border-border shadow-2xl animate-slide-in-right">
            <div className="flex flex-col h-full pt-20 px-4 pb-6">
              <div className="flex-1 space-y-1">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(item.href, item.isRoute); }}
                    className={`
                      flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all
                      ${isActive(item.href)
                        ? 'text-primary bg-primary/10'
                        : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                      }
                    `}
                  >
                    {item.label}
                    <ChevronRight className="h-4 w-4 opacity-30" />
                  </a>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex items-center justify-between px-4">
                  <span className="text-xs text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
                {user && (
                  <>
                    <Button onClick={() => { setIsOpen(false); navigate("/admin"); }} variant="ghost" size="sm" className="w-full justify-start text-xs">
                      Admin Panel
                    </Button>
                    <Button onClick={() => { setIsOpen(false); signOut(); }} variant="ghost" size="sm" className="w-full justify-start text-xs text-destructive">
                      <LogOut className="h-3.5 w-3.5 mr-2" />
                      Sign Out
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
