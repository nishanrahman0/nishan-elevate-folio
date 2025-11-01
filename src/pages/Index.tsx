import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Education from "@/components/Education";
import Certificates from "@/components/Certificates";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Extracurricular from "@/components/Extracurricular";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AdminPanel from "@/components/AdminPanel";
import { ChatBot } from "@/components/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen">
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
      <Extracurricular />
      <Contact />
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;
