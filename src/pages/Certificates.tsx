import { useState, useEffect } from "react";
import { Award, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  icon_emoji: string;
  image_url?: string;
  link_url?: string;
}

const Certificates = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    const { data } = await supabase
      .from("certificates")
      .select("*")
      .eq("hidden", false)
      .order("display_order");

    if (data) {
      setCertificates(data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-tl from-accent/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <Navigation />
      <div className="pt-24 pb-16 min-h-screen relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">Certificates</h1>
            {isAdmin && (
              <Button variant="outline" onClick={() => navigate("/admin?tab=certificates")}>Manage Certificates</Button>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert, index) => {
              const Wrapper = cert.link_url ? 'a' : 'div';
              const wrapperProps = cert.link_url ? { href: cert.link_url, target: "_blank", rel: "noopener noreferrer" } : {};
              
              return (
                <Wrapper
                  key={cert.id}
                  {...wrapperProps}
                  className="glass-card rounded-2xl p-8 text-center hover:scale-105 hover:shadow-2xl transition-all animate-fade-in-up block group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {cert.image_url ? (
                    <div className="rounded-xl mb-6 p-2 bg-gradient-to-br from-primary/30 to-accent/30 shadow-lg">
                      <img src={cert.image_url} alt={cert.title} className="w-full h-56 object-cover rounded-lg" />
                    </div>
                  ) : (
                    <div className="text-6xl mb-6">{cert.icon_emoji}</div>
                  )}
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold text-foreground">{cert.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  <CheckCircle2 className="h-6 w-6 text-primary mx-auto mt-4" />
                </Wrapper>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Certificates;
