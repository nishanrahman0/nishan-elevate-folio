import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function FooterEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [footerId, setFooterId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    copyright_text: "© 2025 Nishan Rahman. All rights reserved.",
    show_year: true,
  });

  useEffect(() => {
    fetchFooterContent();
  }, []);

  const fetchFooterContent = async () => {
    try {
      const { data, error } = await supabase
        .from("footer_content")
        .select("*")
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFooterId(data.id);
        setFormData({
          copyright_text: data.copyright_text || "© 2025 Nishan Rahman. All rights reserved.",
          show_year: data.show_year ?? true,
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
      if (footerId) {
        const { error } = await supabase
          .from("footer_content")
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq("id", footerId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("footer_content")
          .insert([formData])
          .select()
          .single();

        if (error) throw error;
        if (data) setFooterId(data.id);
      }

      toast({
        title: "Success",
        description: "Footer updated successfully",
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
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Footer Settings</CardTitle>
        <CardDescription>Customize your footer copyright text</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="copyright_text">Copyright Text</Label>
          <Input
            id="copyright_text"
            value={formData.copyright_text}
            onChange={(e) => setFormData({ ...formData, copyright_text: e.target.value })}
            placeholder="© 2025 Your Name. All rights reserved."
            className="bg-background/50"
          />
          <p className="text-xs text-muted-foreground">
            This text appears in the footer of your website
          </p>
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
          <div className="space-y-0.5">
            <Label htmlFor="show_year">Auto-update Year</Label>
            <p className="text-xs text-muted-foreground">
              Automatically update the year in copyright text
            </p>
          </div>
          <Switch
            id="show_year"
            checked={formData.show_year}
            onCheckedChange={(checked) => setFormData({ ...formData, show_year: checked })}
          />
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Footer Settings
        </Button>
      </CardContent>
    </Card>
  );
}
