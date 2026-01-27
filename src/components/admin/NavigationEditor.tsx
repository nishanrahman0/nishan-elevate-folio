import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Edit2, Plus, Menu } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface NavItem {
  id: string;
  label: string;
  href: string;
  is_route: boolean;
  display_order: number;
}

export function NavigationEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: "",
    href: "",
    is_route: false,
    display_order: 0,
  });

  useEffect(() => {
    fetchNavItems();
  }, []);

  const fetchNavItems = async () => {
    try {
      const { data, error } = await supabase
        .from("navigation_items")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setNavItems(data || []);
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
          .from("navigation_items")
          .update(formData)
          .eq("id", editingId);
        if (error) throw error;
        toast({ title: "Success", description: "Menu item updated successfully" });
      } else {
        const { error } = await supabase
          .from("navigation_items")
          .insert([formData]);
        if (error) throw error;
        toast({ title: "Success", description: "Menu item added successfully" });
      }
      setFormData({
        label: "",
        href: "",
        is_route: false,
        display_order: 0,
      });
      setEditingId(null);
      fetchNavItems();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: NavItem) => {
    setEditingId(item.id);
    setFormData({
      label: item.label,
      href: item.href,
      is_route: item.is_route,
      display_order: item.display_order,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("navigation_items")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast({ title: "Success", description: "Menu item deleted successfully" });
      fetchNavItems();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-lime-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-lime-500/10 via-green-500/10 to-emerald-500/10 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b border-white/10 bg-gradient-to-r from-lime-500/20 to-green-500/20 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-lime-500 to-green-600 text-white">
              <Menu className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-lime-400 to-green-400 bg-clip-text text-transparent">
                {editingId ? "Edit" : "Add"} Menu Item
              </CardTitle>
              <CardDescription>Manage navigation menu items</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="label" className="text-foreground/80">Label</Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="Home"
              className="bg-background/50 border-white/20 focus:border-lime-500/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="href" className="text-foreground/80">Link (URL or #section)</Label>
            <Input
              id="href"
              value={formData.href}
              onChange={(e) => setFormData({ ...formData, href: e.target.value })}
              placeholder="#home or /blog"
              className="bg-background/50 border-white/20 focus:border-lime-500/50"
            />
          </div>
          <div className="flex items-center space-x-2 p-4 rounded-xl bg-gradient-to-r from-lime-500/10 to-green-500/10 border border-lime-500/20">
            <Switch
              id="is_route"
              checked={formData.is_route}
              onCheckedChange={(checked) => setFormData({ ...formData, is_route: checked })}
            />
            <Label htmlFor="is_route" className="text-foreground/80">Is Route (use for pages like /blog)</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="display_order" className="text-foreground/80">Display Order</Label>
            <Input
              id="display_order"
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              className="bg-background/50 border-white/20 focus:border-lime-500/50"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700">
              {editingId ? <Edit2 className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {editingId ? "Update" : "Add"} Menu Item
            </Button>
            {editingId && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    label: "",
                    href: "",
                    is_route: false,
                    display_order: 0,
                  });
                }}
                className="border-white/20"
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/5 backdrop-blur-sm">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">🧭</span>
            Current Menu Items
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {navItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-lime-500/5 to-green-500/5 border border-white/10 hover:border-lime-500/30 transition-all">
                <div>
                  <h3 className="font-semibold text-foreground">{item.label}</h3>
                  <p className="text-sm text-lime-400">
                    {item.href} {item.is_route && <span className="text-green-400">(Route)</span>}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="hover:bg-lime-500/20 hover:text-lime-400">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="hover:bg-red-500/20 hover:text-red-400">
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
