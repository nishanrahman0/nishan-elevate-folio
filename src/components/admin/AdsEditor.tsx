import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ImageUpload } from "./ImageUpload";
import { Trash2 } from "lucide-react";

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
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Ad" : "Create New Ad"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <ImageUpload
              currentImageUrl={formData.image_url}
              onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
              label="Ad Image"
            />

            <div>
              <Label htmlFor="link_url">Link URL (optional)</Label>
              <Input
                id="link_url"
                type="url"
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
              <Label htmlFor="active">Active</Label>
            </div>

            <div className="flex gap-2">
              <Button type="submit">{editingId ? "Update" : "Create"} Ad</Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Existing Ads</h3>
        {ads?.map((ad) => (
          <Card key={ad.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start gap-4">
                {ad.image_url && (
                  <img src={ad.image_url} alt={ad.title} className="w-24 h-24 object-cover rounded" />
                )}
                <div className="flex-1">
                  <h4 className="font-bold">{ad.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{ad.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {ad.active ? "Active" : "Inactive"} | Order: {ad.display_order}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleEdit(ad)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(ad.id)}
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