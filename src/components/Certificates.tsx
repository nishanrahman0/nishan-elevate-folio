import { useState, useEffect } from "react";
import { Award, ExternalLink } from "lucide-react";
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
      .eq("hidden", false)
      .order("display_order")
      .limit(6);
    if (data) setCertificates(data);
  };

  return (
    <section
      id="certificates"
      className="section-padding bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/[0.06] rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/[0.06] rounded-full blur-[100px]" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Certifications</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.map((cert, index) => (
            <article
              key={cert.id}
              className="group relative bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {cert.image_url ? (
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={cert.image_url}
                    alt={cert.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 flex items-center justify-center">
                  <span className="text-7xl">{cert.icon_emoji}</span>
                </div>
              )}

              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/60" />
                      {cert.issuer}
                    </p>
                  </div>
                  {cert.link_url && (
                    <a
                      href={cert.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;
