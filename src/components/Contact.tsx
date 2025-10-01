import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, Send } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    // Here you would typically send the form data to a backend
    toast.success("Message sent successfully! I'll get back to you soon.");
    
    // Reset form
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="section-padding bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Get In Touch</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Contact Info */}
          <div className="space-y-6 animate-slide-in-left">
            <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-xl">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <a href="tel:+8801601944455" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                    +880 1601 944455
                  </a>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-secondary to-accent rounded-xl">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a href="mailto:mdnishanrahman0@gmail.com" className="text-lg font-semibold text-foreground hover:text-primary transition-colors break-all">
                    mdnishanrahman0@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <p className="text-muted-foreground leading-relaxed">
                Feel free to reach out for collaborations, opportunities, or just to connect. 
                I'm always open to discussing data analytics, AI, and innovative solutions.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card rounded-2xl p-8 animate-slide-in-right">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="bg-background/50"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="bg-background/50"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message..."
                  rows={5}
                  className="bg-background/50 resize-none"
                />
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full">
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
