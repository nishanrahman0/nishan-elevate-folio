import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Contact = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: contactContent } = useQuery({
    queryKey: ["contact-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_content")
        .select("*")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-message', {
        body: {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
      });

      if (error) throw error;

      toast.success("Message sent successfully! I'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again or contact me directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <Navigation />
      <div className="pt-24 pb-16 min-h-screen relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">{contactContent?.heading || "Get In Touch"}</h1>
              {contactContent?.description && (
                <p className="text-lg text-muted-foreground max-w-2xl mt-4">
                  {contactContent.description}
                </p>
              )}
            </div>
            {isAdmin && (
              <Button variant="outline" onClick={() => navigate("/admin?tab=contact")}>Manage Contact</Button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6 animate-slide-in-left">
              <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-xl">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <a href={`tel:${contactContent?.phone || "+8801601944455"}`} className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                      {contactContent?.phone || "+880 1601 944455"}
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
                    <a href={`mailto:${contactContent?.email || "mdnishanrahman0@gmail.com"}`} className="text-lg font-semibold text-foreground hover:text-primary transition-colors break-all">
                      {contactContent?.email || "mdnishanrahman0@gmail.com"}
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

                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  <Send className="mr-2 h-5 w-5" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
