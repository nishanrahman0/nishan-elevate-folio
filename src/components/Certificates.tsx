import { useState, useEffect } from "react";
import { Award, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  icon_emoji: string;
  image_url?: string;
  link_url?: string;
}

const Certificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    const { data } = await supabase
      .from("certificates")
      .select("*")
      .order("display_order");

    if (data) {
      setCertificates(data);
    }
  };
  return (
    <section id="certificates" className="section-padding bg-gradient-to-tr from-muted/40 via-primary/5 to-background relative overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Certificates</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
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
    </section>
  );
};

export default Certificates;
