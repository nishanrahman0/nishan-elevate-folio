import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="py-8 border-t border-border bg-muted/20">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <p className="text-muted-foreground">
          © 2025 Nishan Rahman. All rights reserved.
        </p>
        <Link to="/auth">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Settings className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
