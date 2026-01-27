import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Save } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

export function AboutEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutId, setAboutId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const { data, error } = await supabase
        .from("about_content")
        .select("*")
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setAboutId(data.id);
        setContent(data.content || "");
        setImageUrl(data.image_url || "");
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
      const { error } = await supabase
        .from("about_content")
        .update({ content, image_url: imageUrl, updated_at: new Date().toISOString() })
        .eq("id", aboutId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "About section updated successfully",
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
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-emerald-400" /></div>;
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-teal-500/10 backdrop-blur-sm shadow-xl">
      <CardHeader className="border-b border-white/10 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white">
            <User className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              About Section
            </CardTitle>
            <CardDescription>Edit your about me content</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <Label htmlFor="content" className="text-foreground/80 flex items-center gap-2">
            ✍️ About Content
          </Label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Write about yourself..."
          />
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <ImageUpload
            currentImageUrl={imageUrl}
            onImageUploaded={setImageUrl}
            label="📷 About Section Image"
          />
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700">
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
