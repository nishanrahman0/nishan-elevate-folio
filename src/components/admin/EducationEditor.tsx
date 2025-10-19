import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function EducationEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [educationId, setEducationId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    duration: "",
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setEducationId(data.id);
        setFormData({
          institution: data.institution || "",
          degree: data.degree || "",
          duration: data.duration || "",
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
      const { error } = await supabase
        .from("education")
        .update(formData)
        .eq("id", educationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Education updated successfully",
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
        <CardTitle>Education</CardTitle>
        <CardDescription>Edit your education information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="institution">Institution</Label>
          <Input
            id="institution"
            value={formData.institution}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="degree">Degree</Label>
          <Input
            id="degree"
            value={formData.degree}
            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
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
