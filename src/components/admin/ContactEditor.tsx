import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

export function ContactEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contentId, setContentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_content")
        .select("*")
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setContentId(data.id);
        setFormData({
          heading: data.heading || "",
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
      if (contentId) {
        const { error } = await supabase
          .from("contact_content")
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq("id", contentId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("contact_content")
          .insert([formData]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Contact section updated successfully",
      });
      
      fetchContent();
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
        <CardDescription>Edit your contact section content</CardDescription>
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
          <RichTextEditor
            value={formData.description}
            onChange={(val) => setFormData({ ...formData, description: val })}
            placeholder="Contact description..."
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
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
              placeholder="+123 456 7890"
            />
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}
