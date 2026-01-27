import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ImageUpload } from "./ImageUpload";
import { Trash2, Megaphone, Sparkles } from "lucide-react";

interface RunningAd {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  link_url: string | null;
  display_order: number;
  active: boolean;
}

export function AdsEditor() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    link_url: "",
    display_order: 0,
    active: true,
  });

  const { data: ads } = useQuery({
    queryKey: ["running-ads-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("running_ads")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as RunningAd[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("running_ads").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["running-ads-admin"] });
      queryClient.invalidateQueries({ queryKey: ["running-ads"] });
      toast.success("Ad created successfully");
      resetForm();
    },
    onError: () => toast.error("Failed to create ad"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from("running_ads").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["running-ads-admin"] });
      queryClient.invalidateQueries({ queryKey: ["running-ads"] });
      toast.success("Ad updated successfully");
      resetForm();
    },
    onError: () => toast.error("Failed to update ad"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("running_ads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["running-ads-admin"] });
      queryClient.invalidateQueries({ queryKey: ["running-ads"] });
      toast.success("Ad deleted successfully");
    },
    onError: () => toast.error("Failed to delete ad"),
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
      link_url: "",
      display_order: 0,
      active: true,
    });
    setEditingId(null);
  };

  const handleEdit = (ad: RunningAd) => {
    setEditingId(ad.id);
    setFormData({
      title: ad.title,
      description: ad.description,
      image_url: ad.image_url || "",
      link_url: ad.link_url || "",
      display_order: ad.display_order,
      active: ad.active,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-fuchsia-500/10 via-purple-500/10 to-violet-500/10 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b border-white/10 bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white">
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
                {editingId ? "Edit Ad" : "Create New Ad"}
              </CardTitle>
              <CardDescription>Manage running advertisements</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground/80">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="bg-background/50 border-white/20 focus:border-fuchsia-500/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground/80">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="bg-background/50 border-white/20 focus:border-fuchsia-500/50"
              />
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <ImageUpload
                currentImageUrl={formData.image_url}
                onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                label="📢 Ad Image"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link_url" className="text-foreground/80">Link URL (optional)</Label>
              <Input
                id="link_url"
                type="url"
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                placeholder="https://example.com"
                className="bg-background/50 border-white/20 focus:border-fuchsia-500/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order" className="text-foreground/80">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                className="bg-background/50 border-white/20 focus:border-fuchsia-500/50"
              />
            </div>

            <div className="flex items-center space-x-2 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
              <Label htmlFor="active" className="flex items-center gap-2 text-foreground/80">
                <Sparkles className="h-4 w-4 text-green-400" />
                Active
              </Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700">
                {editingId ? "Update" : "Create"} Ad
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm} className="border-white/20">
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-xl">📣</span>
          Existing Ads
        </h3>
        {ads?.map((ad) => (
          <Card key={ad.id} className="border-0 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex justify-between items-start gap-4">
                {ad.image_url && (
                  <img src={ad.image_url} alt={ad.title} className="w-24 h-24 object-cover rounded-lg border border-white/20" />
                )}
                <div className="flex-1">
                  <h4 className="font-bold text-foreground">{ad.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{ad.description}</p>
                  <p className="text-xs mt-2">
                    <span className={`px-2 py-1 rounded-full ${ad.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {ad.active ? "Active" : "Inactive"}
                    </span>
                    <span className="ml-2 text-muted-foreground">Order: {ad.display_order}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleEdit(ad)} className="bg-fuchsia-500/20 text-fuchsia-400 hover:bg-fuchsia-500/30">
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(ad.id)}
                    className="bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
