import { useState, useEffect } from "react";
import { Award, ExternalLink, Search, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [search, setSearch] = useState("");
  const [selectedIssuer, setSelectedIssuer] = useState<string | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    const { data } = await supabase
      .from("certificates")
      .select("*")
      .eq("hidden", false)
      .order("display_order");
    if (data) setCertificates(data);
  };

  const issuers = [...new Set(certificates.map((c) => c.issuer))];

  const filtered = certificates.filter((cert) => {
    const matchesSearch =
      cert.title.toLowerCase().includes(search.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(search.toLowerCase());
    const matchesIssuer = !selectedIssuer || cert.issuer === selectedIssuer;
    return matchesSearch && matchesIssuer;
  });

  return (
    <div className="min-h-screen bg-background relative">
      {/* Subtle ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent/[0.04] rounded-full blur-[120px]" />
      </div>

      <Navigation />

      <main className="relative z-10 pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-primary tracking-wide uppercase">
                    Professional Development
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                  Certifications
                </h1>
                <p className="text-muted-foreground mt-3 text-lg max-w-xl">
                  A curated collection of professional certifications and courses completed.
                </p>
              </div>
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/admin?tab=certificates")}
                  className="shrink-0"
                >
                  Manage
                </Button>
              )}
            </div>

            {/* Stats bar */}
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground text-2xl">{certificates.length}</span>
              <span className="-ml-4">certifications earned</span>
              <div className="w-px h-5 bg-border" />
              <span className="font-semibold text-foreground text-2xl">{issuers.length}</span>
              <span className="-ml-4">organizations</span>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="mb-10 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search certifications..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-card border-border/60 h-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedIssuer(null)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  !selectedIssuer
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                All
              </button>
              {issuers.map((issuer) => (
                <button
                  key={issuer}
                  onClick={() => setSelectedIssuer(issuer === selectedIssuer ? null : issuer)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selectedIssuer === issuer
                      ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {issuer}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((cert, index) => (
              <article
                key={cert.id}
                className="group relative bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {/* Image */}
                {cert.image_url ? (
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={cert.image_url}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 flex items-center justify-center">
                    <span className="text-7xl">{cert.icon_emoji}</span>
                  </div>
                )}

                {/* Content */}
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
                        aria-label={`View ${cert.title} certificate`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && certificates.length > 0 && (
            <div className="text-center py-20">
              <Filter className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No certifications match your search.</p>
              <button
                onClick={() => { setSearch(""); setSelectedIssuer(null); }}
                className="text-primary text-sm mt-2 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Certificates;
