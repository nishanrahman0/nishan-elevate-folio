import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { ImageUpload } from "./ImageUpload";
import { Trash2, Calendar } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface Event {
  id: string;
  title: string;
  description: string;
  caption: string | null;
  images: string[];
  display_order: number;
}

export function EventsEditor() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    caption: "",
    images: [] as string[],
    display_order: 0,
  });

  const { data: events } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as Event[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("events").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event created successfully");
      resetForm();
    },
    onError: () => toast.error("Failed to create event"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from("events").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event updated successfully");
      resetForm();
    },
    onError: () => toast.error("Failed to update event"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event deleted successfully");
    },
    onError: () => toast.error("Failed to delete event"),
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      caption: "",
      images: [],
      display_order: 0,
    });
    setEditingId(null);
  };

  const handleEdit = (event: Event) => {
    setEditingId(event.id);
    setFormData({
      title: event.title,
      description: event.description,
      caption: event.caption || "",
      images: event.images || [],
      display_order: event.display_order,
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

  const handleImageUploaded = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, url],
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-cyan-500/10 via-teal-500/10 to-emerald-500/10 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b border-white/10 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 text-white">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                {editingId ? "Edit Event" : "Create New Event"}
              </CardTitle>
              <CardDescription>Manage your events and memories</CardDescription>
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
                className="bg-background/50 border-white/20 focus:border-cyan-500/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground/80">Description</Label>
              <RichTextEditor
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                placeholder="Describe the event..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="caption" className="text-foreground/80">Caption (Optional)</Label>
              <Input
                id="caption"
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                className="bg-background/50 border-white/20 focus:border-cyan-500/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order" className="text-foreground/80">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                className="bg-background/50 border-white/20 focus:border-cyan-500/50"
              />
            </div>

            <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <Label className="flex items-center gap-2 text-foreground/80">
                📸 Event Images
              </Label>
              {formData.images.map((imageUrl, index) => (
                <div key={index} className="flex items-center gap-4 p-2 rounded-lg bg-background/30">
                  <img src={imageUrl} alt={`Event ${index + 1}`} className="w-24 h-24 object-cover rounded-lg border border-white/20" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage(index)}
                    className="bg-red-500/80 hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <ImageUpload
                onImageUploaded={handleImageUploaded}
                label="Add Image"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700">
                {editingId ? "Update" : "Create"} Event
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
          <span className="text-xl">📅</span>
          Existing Events
        </h3>
        {events?.map((event) => (
          <Card key={event.id} className="border-0 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-foreground">{event.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                  <p className="text-xs text-cyan-400 mt-2">Images: {event.images?.length || 0}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleEdit(event)} className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(event.id)}
                    className="bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  >
                    Delete
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
