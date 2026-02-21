import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2, Award, Eye, EyeOff } from "lucide-react";
import { ImageUpload } from "./ImageUpload";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  icon_emoji: string;
  image_url?: string;
  display_order: number;
  hidden: boolean;
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
    image_url: "",
    link_url: "",
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

      setFormData({ title: "", issuer: "", icon_emoji: "📜", image_url: "", link_url: "" });
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
      image_url: cert.image_url || "",
      link_url: (cert as any).link_url || "",
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
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-amber-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-amber-500/10 via-yellow-500/10 to-orange-500/10 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b border-white/10 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 text-white">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                {editingId ? "Edit" : "Add"} Certificate
              </CardTitle>
              <CardDescription>Manage your certificates</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cert-title" className="text-foreground/80">Title</Label>
              <Input
                id="cert-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-background/50 border-white/20 focus:border-amber-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issuer" className="text-foreground/80">Issuer</Label>
              <Input
                id="issuer"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                className="bg-background/50 border-white/20 focus:border-amber-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emoji" className="text-foreground/80">Icon Emoji</Label>
              <Input
                id="emoji"
                value={formData.icon_emoji}
                onChange={(e) => setFormData({ ...formData, icon_emoji: e.target.value })}
                className="bg-background/50 border-white/20 focus:border-amber-500/50"
              />
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <ImageUpload
              currentImageUrl={formData.image_url}
              onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
              label="🏆 Certificate Image"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cert_link_url" className="text-foreground/80">Link URL (optional)</Label>
            <Input
              id="cert_link_url"
              value={formData.link_url}
              onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
              placeholder="https://..."
              className="bg-background/50 border-white/20 focus:border-amber-500/50"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700">
              {editingId ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {editingId ? "Update" : "Add"} Certificate
            </Button>
            {editingId && (
              <Button variant="outline" onClick={() => {
                setEditingId(null);
                setFormData({ title: "", issuer: "", icon_emoji: "📜", image_url: "", link_url: "" });
              }} className="border-white/20">
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/5 backdrop-blur-sm">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">🏅</span>
            Current Certificates
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {certificates.map((cert) => (
              <div key={cert.id} className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-500/5 to-yellow-500/5 border border-white/10 hover:border-amber-500/30 transition-all ${cert.hidden ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{cert.icon_emoji}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">{cert.title}</h3>
                    <p className="text-sm text-amber-400">{cert.issuer}</p>
                    {cert.hidden && <p className="text-xs text-muted-foreground">Hidden</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={async () => {
                    await supabase.from("certificates").update({ hidden: !cert.hidden }).eq("id", cert.id);
                    fetchCertificates();
                  }} className="border-white/20 hover:bg-amber-500/20 hover:text-amber-400" title={cert.hidden ? "Show" : "Hide"}>
                    {cert.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(cert)} className="border-white/20 hover:bg-amber-500/20 hover:text-amber-400">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(cert.id)} className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
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
