import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Github, Facebook, Instagram, Download, Eye, ChevronDown, ArrowDown } from "lucide-react";
import * as Icons from "lucide-react";
import profilePhoto from "@/assets/profile-photo.jpg";
import { supabase } from "@/integrations/supabase/client";
import DownloadPortfolioButton from "@/components/DownloadPortfolioButton";

interface SocialLink {
  id: string;
  label: string;
  icon_name: string;
  url: string;
}

const Hero = () => {
  const [heroData, setHeroData] = useState({
    name: "",
    tagline: "",
    resume_url: "",
    linkedin_url: "",
    github_url: "",
    facebook_url: "",
    instagram_url: "",
    profile_image_url: "",
  });
  const [customLinks, setCustomLinks] = useState<SocialLink[]>([]);
  const [showCvMenu, setShowCvMenu] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const cvMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHeroData();
    fetchCustomLinks();
    // Trigger entrance animation
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cvMenuRef.current && !cvMenuRef.current.contains(e.target as Node)) {
        setShowCvMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchHeroData = async () => {
    const { data } = await supabase
      .from("hero_content")
      .select("*")
      .maybeSingle();

    if (data) {
      setHeroData({
        name: data.name,
        tagline: data.tagline,
        resume_url: (data as any).resume_url || "",
        linkedin_url: data.linkedin_url || "",
        github_url: data.github_url || "",
        facebook_url: data.facebook_url || "",
        instagram_url: data.instagram_url || "",
        profile_image_url: data.profile_image_url || "",
      });
    }
  };

  const fetchCustomLinks = async () => {
    const { data } = await supabase
      .from("hero_social_links")
      .select("*")
      .order("display_order");
    if (data) setCustomLinks(data);
  };

  const handleContactClick = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDownloadCV = () => {
    if (!heroData.resume_url) return;
    const link = document.createElement("a");
    link.href = heroData.resume_url;
    link.download = "CV";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowCvMenu(false);
  };

  const handleScrollDown = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const imgSrc = heroData.profile_image_url || profilePhoto;

  const socialLinks = [
    { url: heroData.linkedin_url, icon: Linkedin, label: "LinkedIn" },
    { url: heroData.github_url, icon: Github, label: "GitHub" },
    { url: heroData.facebook_url, icon: Facebook, label: "Facebook" },
    { url: heroData.instagram_url, icon: Instagram, label: "Instagram" },
  ].filter(l => l.url);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-accent/5 to-secondary/8" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
          {/* Profile Photo */}
          <div className={`transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative group">
              <div className="absolute -inset-3 bg-gradient-to-r from-primary via-accent to-secondary rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full opacity-60" />
              <img
                src={imgSrc}
                alt={heroData.name || "Profile"}
                className="relative w-60 h-60 md:w-72 md:h-72 rounded-full object-cover shadow-2xl"
                loading="eager"
              />
            </div>
          </div>

          {/* Hero Content */}
          <div className={`text-center md:text-left max-w-2xl transition-all duration-1000 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {heroData.name && (
              <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
                <span className="gradient-text">{heroData.name}</span>
              </h1>
            )}
            
            {heroData.tagline && (
              <p className="text-lg md:text-xl text-muted-foreground mb-8 font-medium leading-relaxed">
                {heroData.tagline}
              </p>
            )}
            
            {/* CTA Buttons */}
            <div className={`flex flex-wrap justify-center md:justify-start gap-3 mb-8 transition-all duration-1000 delay-400 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Button 
                variant="hero" 
                size="lg" 
                onClick={handleContactClick}
                className="group"
              >
                <Mail className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Contact Me
              </Button>
              {heroData.resume_url && (
                <div className="relative" ref={cvMenuRef}>
                  <div className="flex">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      asChild
                      className="group rounded-r-none border-r-0"
                    >
                      <a href={heroData.resume_url} target="_blank" rel="noopener noreferrer">
                        <Eye className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                        View CV
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-l-none px-2"
                      onClick={() => setShowCvMenu(!showCvMenu)}
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${showCvMenu ? 'rotate-180' : ''}`} />
                    </Button>
                  </div>
                  {showCvMenu && (
                    <div className="absolute top-full mt-1 right-0 bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden min-w-[160px] animate-fade-in">
                      <button
                        onClick={handleDownloadCV}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-accent/10 transition-colors text-foreground"
                      >
                        <Download className="h-4 w-4" />
                        Download CV
                      </button>
                    </div>
                  )}
                </div>
              )}
              <DownloadPortfolioButton variant="outline" size="lg" />
            </div>

            {/* Social Links */}
            <div className={`flex gap-3 justify-center md:justify-start transition-all duration-1000 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {socialLinks.map(({ url, icon: Icon, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-3 rounded-xl glass-card hover:scale-110 hover:shadow-lg transition-all duration-300"
                >
                  <Icon className="h-5 w-5 text-primary" />
                </a>
              ))}
              {customLinks.map((link) => {
                const IconComponent = (Icons as any)[link.icon_name] || Icons.Link;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="p-3 rounded-xl glass-card hover:scale-110 hover:shadow-lg transition-all duration-300"
                  >
                    <IconComponent className="h-5 w-5 text-primary" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 p-2 rounded-full text-muted-foreground/50 hover:text-primary transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <ArrowDown className="h-5 w-5" />
      </button>
    </section>
  );
};

export default Hero;
