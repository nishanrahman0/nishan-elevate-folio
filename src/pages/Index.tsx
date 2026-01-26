import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AdminPanel from "@/components/AdminPanel";
import { ChatBot } from "@/components/ChatBot";
import RunningAds from "@/components/RunningAds";

const Index = () => {
  useEffect(() => {
    const fetchSiteTitle = async () => {
      const { data } = await supabase
        .from("hero_content")
        .select("site_title, name")
        .maybeSingle();
      
      if (data) {
        document.title = data.site_title || data.name || "Nishan Rahman";
      }
    };
    fetchSiteTitle();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        <Navigation />
        <Hero />
        <About />
        <div className="container mx-auto px-4">
          <AdminPanel />
        </div>
        <Education />
        <RunningAds />
        <Contact />
        <Footer />
        <ChatBot />
      </div>
    </div>
  );
};

export default Index;
