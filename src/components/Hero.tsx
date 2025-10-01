import { Button } from "@/components/ui/button";
import { Download, Mail, Linkedin, Github, Twitter, Instagram } from "lucide-react";
import profilePhoto from "@/assets/profile-photo.jpg";

const Hero = () => {
  const handleDownloadResume = () => {
    // This will be implemented when the resume PDF is uploaded
    alert("Resume download will be available soon!");
  };

  const handleContactClick = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 animate-gradient" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
          {/* Profile Photo */}
          <div className="animate-fade-in">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent rounded-full blur-2xl opacity-50 animate-glow" />
              <img
                src={profilePhoto}
                alt="Nishan Rahman"
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-4 border-white shadow-2xl"
              />
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center md:text-left max-w-2xl animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="gradient-text">Nishan Rahman</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-medium">
              Aspiring Data Analyst | Tech Explorer | AI Enthusiast
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-8">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={handleDownloadResume}
                className="group"
              >
                <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Download Resume
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleContactClick}
              >
                <Mail className="mr-2 h-5 w-5" />
                Contact Me
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 justify-center md:justify-start">
              <a
                href="https://linkedin.com/in/nishanrahman"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full glass-card hover:scale-110 transition-transform"
              >
                <Linkedin className="h-6 w-6 text-primary" />
              </a>
              <a
                href="https://github.com/nishanrahman"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full glass-card hover:scale-110 transition-transform"
              >
                <Github className="h-6 w-6 text-primary" />
              </a>
              <a
                href="https://twitter.com/nishanrahman"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full glass-card hover:scale-110 transition-transform"
              >
                <Twitter className="h-6 w-6 text-primary" />
              </a>
              <a
                href="https://instagram.com/nishanrahman"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full glass-card hover:scale-110 transition-transform"
              >
                <Instagram className="h-6 w-6 text-primary" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
