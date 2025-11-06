import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Section</CardTitle>
        <CardDescription>Edit your contact information and messaging</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="heading">Heading</Label>
          <Input
            id="heading"
            value={formData.heading}
            onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
            placeholder="Get In Touch"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Feel free to reach out..."
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your.email@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 234 567 8900"
          />
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}