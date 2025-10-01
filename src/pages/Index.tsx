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

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Education />
      <Certificates />
      <Skills />
      <Experience />
      <Extracurricular />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
