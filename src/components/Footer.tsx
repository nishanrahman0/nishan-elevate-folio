import { Link } from "react-router-dom";
import { Settings, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const [copyrightText, setCopyrightText] = useState("© 2025 Nishan Rahman. All rights reserved.");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const fetchFooterContent = async () => {
      const { data } = await supabase
        .from("footer_content")
        .select("copyright_text, show_year")
        .maybeSingle();

      if (data) {
        let text = data.copyright_text || "© 2025 Nishan Rahman. All rights reserved.";
        if (data.show_year) {
          const currentYear = new Date().getFullYear();
          text = text.replace(/©\s*\d{4}/, `© ${currentYear}`);
        }
        setCopyrightText(text);
      }
    };
    fetchFooterContent();
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <footer className="py-6 border-t border-border/50 bg-muted/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {copyrightText}
          </p>
          <Link to="/auth">
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground/30 hover:text-muted-foreground opacity-30 hover:opacity-60 transition-opacity">
              <Settings className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </footer>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`
          fixed bottom-6 right-6 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25
          transition-all duration-300 hover:scale-110 hover:shadow-xl
          ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        `}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </>
  );
};

export default Footer;
