import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  icon_emoji: string;
  display_order: number;
}

export function CertificatesEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    icon_emoji: "📜",
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("display_order");

      if (error) throw error;
      setCertificates(data || []);
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
    try {
      if (editingId) {
        const { error } = await supabase
          .from("certificates")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("certificates")
          .insert([{ ...formData, display_order: certificates.length + 1 }]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: editingId ? "Certificate updated" : "Certificate added",
      });

      setFormData({ title: "", issuer: "", icon_emoji: "📜" });
      setEditingId(null);
      fetchCertificates();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (cert: Certificate) => {
    setEditingId(cert.id);
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      icon_emoji: cert.icon_emoji,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("certificates")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Certificate deleted",
      });

      fetchCertificates();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit" : "Add"} Certificate</CardTitle>
          <CardDescription>Manage your certificates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cert-title">Title</Label>
              <Input
                id="cert-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issuer">Issuer</Label>
              <Input
                id="issuer"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emoji">Icon Emoji</Label>
              <Input
                id="emoji"
                value={formData.icon_emoji}
                onChange={(e) => setFormData({ ...formData, icon_emoji: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave}>
              {editingId ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {editingId ? "Update" : "Add"} Certificate
            </Button>
            {editingId && (
              <Button variant="outline" onClick={() => {
                setEditingId(null);
                setFormData({ title: "", issuer: "", icon_emoji: "📜" });
              }}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{cert.icon_emoji}</span>
                  <div>
                    <h3 className="font-semibold">{cert.title}</h3>
                    <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(cert)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(cert.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
