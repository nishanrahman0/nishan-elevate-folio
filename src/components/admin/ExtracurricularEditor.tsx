import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

export function ExtracurricularEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contentId, setContentId] = useState<string | null>(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("extracurricular_content")
        .select("*")
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setContentId(data.id);
        setContent(data.content || "");
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
          .from("extracurricular_content")
          .update({ content, updated_at: new Date().toISOString() })
          .eq("id", contentId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("extracurricular_content")
          .insert([{ content }]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Content updated successfully",
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
        <CardTitle>Extracurricular Activities</CardTitle>
        <CardDescription>Edit your extracurricular activities section</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Describe your extracurricular activities..."
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
