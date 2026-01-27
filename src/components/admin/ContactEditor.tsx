import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Mail } from "lucide-react";

export function ContactEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contactId, setContactId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    heading: "Get In Touch",
    description: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchContactContent();
  }, []);

  const fetchContactContent = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_content")
        .select("*")
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setContactId(data.id);
        setFormData({
          heading: data.heading || "Get In Touch",
          description: data.description || "",
          email: data.email || "",
          phone: data.phone || "",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (contactId) {
        const { error } = await supabase
          .from("contact_content")
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq("id", contactId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("contact_content")
          .insert([formData])
          .select()
          .single();

        if (error) throw error;
        if (data) setContactId(data.id);
      }

      toast({
        title: "Success",
        description: "Contact section updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-sky-400" /></div>;
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-sky-500/10 via-blue-500/10 to-indigo-500/10 backdrop-blur-sm shadow-xl">
      <CardHeader className="border-b border-white/10 bg-gradient-to-r from-sky-500/20 to-blue-500/20 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 text-white">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
              Contact Section
            </CardTitle>
            <CardDescription>Edit your contact information and messaging</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <Label htmlFor="heading" className="text-foreground/80">Heading</Label>
          <Input
            id="heading"
            value={formData.heading}
            onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
            placeholder="Get In Touch"
            className="bg-background/50 border-white/20 focus:border-sky-500/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description" className="text-foreground/80">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Feel free to reach out..."
            rows={3}
            className="bg-background/50 border-white/20 focus:border-sky-500/50"
          />
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-r from-sky-500/10 to-blue-500/10 border border-sky-500/20 space-y-4">
          <h3 className="font-semibold text-sky-400 flex items-center gap-2">
            📬 Contact Details
          </h3>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground/80">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your.email@example.com"
              className="bg-background/50 border-white/20 focus:border-sky-500/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground/80">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 234 567 8900"
              className="bg-background/50 border-white/20 focus:border-sky-500/50"
            />
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700">
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}
