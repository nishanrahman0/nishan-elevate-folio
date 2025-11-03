import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Education from "@/components/Education";
import Certificates from "@/components/Certificates";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Events from "@/components/Events";
import Extracurricular from "@/components/Extracurricular";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AdminPanel from "@/components/AdminPanel";
import { ChatBot } from "@/components/ChatBot";

const Index = () => {
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
      <Certificates />
      <Skills />
      <Experience />
      <Events />
      <Extracurricular />
      <Contact />
      <Footer />
      <ChatBot />
      </div>
    </div>
  );
};

export default Index;
