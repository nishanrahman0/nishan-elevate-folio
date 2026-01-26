import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const [copyrightText, setCopyrightText] = useState("© 2025 Nishan Rahman. All rights reserved.");

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

  return (
    <footer className="py-8 border-t border-border bg-muted/20">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <p className="text-muted-foreground">
          {copyrightText}
        </p>
        <Link to="/auth">
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground/50 hover:text-muted-foreground opacity-30 hover:opacity-60 transition-opacity">
            <Settings className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
