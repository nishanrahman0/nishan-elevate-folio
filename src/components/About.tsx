const About = () => {
  return (
    <section id="about" className="section-padding bg-gradient-to-br from-muted/30 via-background to-accent/5 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">About Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        <div className="glass-card rounded-2xl p-8 md:p-12 animate-fade-in-up">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            I'm a Management Studies student at the University of Rajshahi with strong skills in{" "}
            <span className="text-primary font-semibold">Data Analytics</span>,{" "}
            <span className="text-secondary font-semibold">Visualization</span>, and{" "}
            <span className="text-accent font-semibold">AI tools</span>. 
            Passionate about solving business problems with data-driven solutions and modern productivity tools.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
