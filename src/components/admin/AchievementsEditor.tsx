import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2, Trophy, Eye, EyeOff, Star } from "lucide-react";
import { ImageUpload } from "./ImageUpload";

interface Achievement {
  id: string;
  title: string;
  description: string | null;
  date_text: string | null;
  issuer: string | null;
  images: string[];
  video_url: string | null;
  link_url: string | null;
  highlighted: boolean;
  hidden: boolean;
  display_order: number;
}

const empty = {
  title: "", description: "", date_text: "", issuer: "",
  images: [] as string[], video_url: "", link_url: "",
  highlighted: false, hidden: false, display_order: 0,
};

export function AchievementsEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Achievement[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const { data, error } = await supabase.from("achievements").select("*").order("display_order");
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else setItems((data || []).map((a: any) => ({ ...a, images: Array.isArray(a.images) ? a.images : [] })));
    setLoading(false);
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        description: form.description || null,
        date_text: form.date_text || null,
        issuer: form.issuer || null,
        video_url: form.video_url || null,
        link_url: form.link_url || null,
      };
      if (editingId) {
        const { error } = await supabase.from("achievements").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("achievements").insert([{ ...payload, display_order: items.length + 1 }]);
        if (error) throw error;
      }
      toast({ title: "Success", description: editingId ? "Achievement updated" : "Achievement added" });
      setForm(empty); setEditingId(null); fetchAll();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleEdit = (a: Achievement) => {
    setEditingId(a.id);
    setForm({
      title: a.title, description: a.description || "", date_text: a.date_text || "",
      issuer: a.issuer || "", images: a.images || [], video_url: a.video_url || "",
      link_url: a.link_url || "", highlighted: a.highlighted, hidden: a.hidden,
      display_order: a.display_order,
    });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("achievements").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); fetchAll(); }
  };

  const toggleField = async (a: Achievement, field: "highlighted" | "hidden") => {
    await supabase.from("achievements").update({ [field]: !a[field] }).eq("id", a.id);
    fetchAll();
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-yellow-400" /></div>;

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b border-white/10 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {editingId ? "Edit" : "Add"} Achievement
              </CardTitle>
              <CardDescription>Awards, recognitions and milestones</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="bg-background/50 border-white/20" />
            </div>
            <div className="space-y-2">
              <Label>Issuer / Organization</Label>
              <Input value={form.issuer} onChange={e => setForm({ ...form, issuer: e.target.value })} className="bg-background/50 border-white/20" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date (e.g. "March 2025")</Label>
              <Input value={form.date_text} onChange={e => setForm({ ...form, date_text: e.target.value })} className="bg-background/50 border-white/20" />
            </div>
            <div className="space-y-2">
              <Label>Display Order</Label>
              <Input type="number" value={form.display_order} onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} className="bg-background/50 border-white/20" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="bg-background/50 border-white/20" />
          </div>

          <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">
            <Label>📸 Photos (multiple)</Label>
            <ImageUpload currentImageUrl="" onImageUploaded={(url) => setForm(f => ({ ...f, images: [...f.images, url] }))} label="Add photo" />
            {form.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                    <button onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 text-xs">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>🎥 Video URL (YouTube / Facebook / LinkedIn)</Label>
              <Input value={form.video_url} onChange={e => setForm({ ...form, video_url: e.target.value })} placeholder="https://youtu.be/..." className="bg-background/50 border-white/20" />
            </div>
            <div className="space-y-2">
              <Label>🔗 Link URL</Label>
              <Input value={form.link_url} onChange={e => setForm({ ...form, link_url: e.target.value })} placeholder="https://..." className="bg-background/50 border-white/20" />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <Switch checked={form.highlighted} onCheckedChange={c => setForm({ ...form, highlighted: c })} />
              <Label className="flex items-center gap-1.5"><Star className="h-4 w-4 text-yellow-500" /> Highlight on homepage</Label>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
              <Switch checked={form.hidden} onCheckedChange={c => setForm({ ...form, hidden: c })} />
              <Label>Hidden (don't show publicly)</Label>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="bg-gradient-to-r from-yellow-500 to-orange-600">
              {editingId ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {editingId ? "Update" : "Add"} Achievement
            </Button>
            {editingId && <Button variant="outline" onClick={() => { setEditingId(null); setForm(empty); }} className="border-white/20">Cancel</Button>}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/5 backdrop-blur-sm">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-yellow-400" /> Current Achievements</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {items.map((a) => (
            <div key={a.id} className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-yellow-500/5 to-orange-500/5 border border-white/10 ${a.hidden ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-3 min-w-0">
                {a.images[0] && <img src={a.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                <div className="min-w-0">
                  <p className="font-semibold truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{a.issuer}{a.date_text ? ` · ${a.date_text}` : ""}</p>
                </div>
                {a.highlighted && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 shrink-0" />}
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => toggleField(a, "highlighted")} title="Highlight">
                  <Star className={`h-4 w-4 ${a.highlighted ? "fill-yellow-500 text-yellow-500" : ""}`} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toggleField(a, "hidden")}>
                  {a.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(a)}><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(a.id)} className="hover:bg-red-500/20 hover:text-red-400"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-center text-muted-foreground py-8">No achievements yet</p>}
        </CardContent>
      </Card>
    </div>
  );
}
