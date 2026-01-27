import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, PanelBottom } from "lucide-react";
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
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>;
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-500/10 via-gray-500/10 to-zinc-500/10 backdrop-blur-sm shadow-xl">
      <CardHeader className="border-b border-white/10 bg-gradient-to-r from-slate-500/20 to-gray-500/20 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500 to-gray-600 text-white">
            <PanelBottom className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl bg-gradient-to-r from-slate-400 to-gray-400 bg-clip-text text-transparent">
              Footer Settings
            </CardTitle>
            <CardDescription>Customize your footer copyright text</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <Label htmlFor="copyright_text" className="text-foreground/80">Copyright Text</Label>
          <Input
            id="copyright_text"
            value={formData.copyright_text}
            onChange={(e) => setFormData({ ...formData, copyright_text: e.target.value })}
            placeholder="© 2025 Your Name. All rights reserved."
            className="bg-background/50 border-white/20 focus:border-slate-500/50"
          />
          <p className="text-xs text-muted-foreground">
            This text appears in the footer of your website
          </p>
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-500/10 to-gray-500/10 border border-slate-500/20">
          <div className="space-y-0.5">
            <Label htmlFor="show_year" className="text-foreground/80">Auto-update Year</Label>
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

        <Button onClick={handleSave} disabled={saving} className="w-full bg-gradient-to-r from-slate-500 to-gray-600 hover:from-slate-600 hover:to-gray-700">
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
