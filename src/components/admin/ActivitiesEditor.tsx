import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Edit2, Plus, Building2, UserCheck, ListTodo, Eye, EyeOff, ChevronDown, ChevronRight } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { Switch } from "@/components/ui/switch";

// --- Types ---
interface Organization {
  id: string;
  name: string;
  short_name: string | null;
  description: string | null;
  banner_url: string | null;
  logo_url: string | null;
  display_order: number;
  hidden: boolean;
}

interface Role {
  id: string;
  organization_id: string;
  role_name: string;
  display_order: number;
}

interface Task {
  id: string;
  role_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  images: string[];
  files: string[];
  link_url: string | null;
  client_url: string | null;
  display_order: number;
}

export function ActivitiesEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Expanded state
  const [expandedOrg, setExpandedOrg] = useState<string | null>(null);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  // Org form
  const [editingOrgId, setEditingOrgId] = useState<string | null>(null);
  const [orgForm, setOrgForm] = useState({ name: "", description: "", banner_url: "", logo_url: "", display_order: 0, hidden: false });

  // Role form
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleForm, setRoleForm] = useState({ role_name: "", display_order: 0, organization_id: "" });

  // Task form
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskForm, setTaskForm] = useState({ title: "", description: "", image_url: "", images: [] as string[], files: [] as string[], link_url: "", client_url: "", display_order: 0, role_id: "" });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [orgRes, roleRes, taskRes] = await Promise.all([
        supabase.from("activity_organizations").select("*").order("display_order"),
        supabase.from("activity_roles").select("*").order("display_order"),
        supabase.from("activity_tasks").select("*").order("display_order"),
      ]);
      setOrganizations(orgRes.data || []);
      setRoles(roleRes.data || []);
      setTasks((taskRes.data || []).map(t => ({ ...t, images: (t.images as string[]) || [], files: (t.files as string[]) || [] })));
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  // --- Organization CRUD ---
  const resetOrgForm = () => { setOrgForm({ name: "", description: "", banner_url: "", logo_url: "", display_order: 0, hidden: false }); setEditingOrgId(null); };
  const handleSaveOrg = async () => {
    try {
      const payload = { name: orgForm.name, description: orgForm.description || null, banner_url: orgForm.banner_url || null, logo_url: orgForm.logo_url || null, display_order: orgForm.display_order, hidden: orgForm.hidden };
      if (editingOrgId) {
        const { error } = await supabase.from("activity_organizations").update(payload).eq("id", editingOrgId);
        if (error) throw error;
        toast({ title: "Updated", description: "Organization updated" });
      } else {
        const { error } = await supabase.from("activity_organizations").insert([payload]);
        if (error) throw error;
        toast({ title: "Added", description: "Organization added" });
      }
      resetOrgForm(); fetchAll();
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };
  const handleEditOrg = (org: Organization) => { setEditingOrgId(org.id); setOrgForm({ name: org.name, description: org.description || "", banner_url: org.banner_url || "", logo_url: org.logo_url || "", display_order: org.display_order, hidden: org.hidden }); };
  const handleDeleteOrg = async (id: string) => {
    const { error } = await supabase.from("activity_organizations").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Deleted", description: "Organization deleted" }); fetchAll();
  };
  const toggleOrgHidden = async (org: Organization) => {
    const { error } = await supabase.from("activity_organizations").update({ hidden: !org.hidden }).eq("id", org.id);
    if (!error) fetchAll();
  };

  // --- Role CRUD ---
  const resetRoleForm = () => { setRoleForm({ role_name: "", display_order: 0, organization_id: "" }); setEditingRoleId(null); };
  const handleSaveRole = async (orgId: string) => {
    try {
      const payload = { role_name: roleForm.role_name, display_order: roleForm.display_order, organization_id: orgId };
      if (editingRoleId) {
        const { error } = await supabase.from("activity_roles").update({ role_name: roleForm.role_name, display_order: roleForm.display_order }).eq("id", editingRoleId);
        if (error) throw error;
        toast({ title: "Updated", description: "Role updated" });
      } else {
        const { error } = await supabase.from("activity_roles").insert([payload]);
        if (error) throw error;
        toast({ title: "Added", description: "Role added" });
      }
      resetRoleForm(); fetchAll();
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };
  const handleEditRole = (role: Role) => { setEditingRoleId(role.id); setRoleForm({ role_name: role.role_name, display_order: role.display_order, organization_id: role.organization_id }); };
  const handleDeleteRole = async (id: string) => {
    const { error } = await supabase.from("activity_roles").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Deleted", description: "Role deleted" }); fetchAll();
  };

  // --- Task CRUD ---
  const resetTaskForm = () => { setTaskForm({ title: "", description: "", image_url: "", images: [], files: [], link_url: "", client_url: "", display_order: 0, role_id: "" }); setEditingTaskId(null); };
  const handleSaveTask = async (roleId: string) => {
    try {
      const payload = { title: taskForm.title, description: taskForm.description || null, image_url: taskForm.image_url || null, images: taskForm.images, files: taskForm.files, link_url: taskForm.link_url || null, client_url: taskForm.client_url || null, display_order: taskForm.display_order, role_id: roleId };
      if (editingTaskId) {
        const { role_id, ...updatePayload } = payload;
        const { error } = await supabase.from("activity_tasks").update(updatePayload).eq("id", editingTaskId);
        if (error) throw error;
        toast({ title: "Updated", description: "Task updated" });
      } else {
        const { error } = await supabase.from("activity_tasks").insert([payload]);
        if (error) throw error;
        toast({ title: "Added", description: "Task added" });
      }
      resetTaskForm(); fetchAll();
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };
  const handleEditTask = (task: Task) => { setEditingTaskId(task.id); setTaskForm({ title: task.title, description: task.description || "", image_url: task.image_url || "", images: task.images, files: task.files || [], link_url: task.link_url || "", client_url: task.client_url || "", display_order: task.display_order, role_id: task.role_id }); };
  const handleDeleteTask = async (id: string) => {
    const { error } = await supabase.from("activity_tasks").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Deleted", description: "Task deleted" }); fetchAll();
  };
  const addTaskImage = (url: string) => { setTaskForm(f => ({ ...f, images: [...f.images, url] })); };
  const removeTaskImage = (index: number) => { setTaskForm(f => ({ ...f, images: f.images.filter((_, i) => i !== index) })); };
  const addTaskFile = (url: string) => { setTaskForm(f => ({ ...f, files: [...f.files, url] })); };
  const removeTaskFile = (index: number) => { setTaskForm(f => ({ ...f, files: f.files.filter((_, i) => i !== index) })); };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-rose-400" /></div>;

  return (
    <div className="space-y-6">
      {/* Organization Form */}
      <Card className="border-0 bg-gradient-to-br from-rose-500/10 via-pink-500/10 to-fuchsia-500/10 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b border-white/10 bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 text-white"><Building2 className="h-5 w-5" /></div>
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                {editingOrgId ? "Edit" : "Add"} Organization
              </CardTitle>
              <CardDescription>Manage activity organizations</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground/80">Organization Name</Label>
              <Input value={orgForm.name} onChange={e => setOrgForm({ ...orgForm, name: e.target.value })} placeholder="Rajshahi University Career Club" className="bg-background/50 border-white/20" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/80">Display Order</Label>
              <Input type="number" value={orgForm.display_order} onChange={e => setOrgForm({ ...orgForm, display_order: parseInt(e.target.value) || 0 })} className="bg-background/50 border-white/20" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-foreground/80">Description</Label>
            <Textarea value={orgForm.description} onChange={e => setOrgForm({ ...orgForm, description: e.target.value })} placeholder="About the organization..." className="bg-background/50 border-white/20" />
          </div>
          <div className="flex items-center space-x-2 p-4 rounded-xl bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20">
            <Switch checked={orgForm.hidden} onCheckedChange={checked => setOrgForm({ ...orgForm, hidden: checked })} />
            <Label className="text-foreground/80">Hidden (not shown on public page)</Label>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <ImageUpload currentImageUrl={orgForm.banner_url} onImageUploaded={url => setOrgForm({ ...orgForm, banner_url: url })} label="🖼️ Banner (optional)" />
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <ImageUpload currentImageUrl={orgForm.logo_url} onImageUploaded={url => setOrgForm({ ...orgForm, logo_url: url })} label="🏢 Logo (optional)" />
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSaveOrg} className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700">
              {editingOrgId ? <Edit2 className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {editingOrgId ? "Update" : "Add"} Organization
            </Button>
            {editingOrgId && <Button variant="outline" onClick={resetOrgForm} className="border-white/20">Cancel</Button>}
          </div>
        </CardContent>
      </Card>

      {/* Organizations List */}
      <Card className="border-0 bg-white/5 backdrop-blur-sm">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="flex items-center gap-2"><span className="text-xl">🏛️</span> Organizations</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {organizations.map(org => (
            <div key={org.id} className="rounded-xl border border-white/10 overflow-hidden">
              {/* Org Row */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-500/5 to-pink-500/5 hover:from-rose-500/10 hover:to-pink-500/10 transition-all cursor-pointer"
                onClick={() => setExpandedOrg(expandedOrg === org.id ? null : org.id)}>
                <div className="flex items-center gap-3">
                  {expandedOrg === org.id ? <ChevronDown className="h-4 w-4 text-rose-400" /> : <ChevronRight className="h-4 w-4 text-rose-400" />}
                  <div>
                    <h3 className="font-semibold text-foreground">{org.name}</h3>
                    <p className="text-xs text-muted-foreground">Order: {org.display_order} | {org.hidden ? "Hidden" : "Visible"}</p>
                  </div>
                </div>
                <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" onClick={() => toggleOrgHidden(org)} className="hover:bg-rose-500/20">
                    {org.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEditOrg(org)} className="hover:bg-rose-500/20 hover:text-rose-400"><Edit2 className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteOrg(org.id)} className="hover:bg-red-500/20 hover:text-red-400"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>

              {/* Expanded: Roles */}
              {expandedOrg === org.id && (
                <div className="p-4 border-t border-white/10 bg-white/[0.02] space-y-4">
                  {/* Add Role Form */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 space-y-3">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-indigo-400" />
                      <Label className="text-indigo-300 font-semibold">{editingRoleId ? "Edit" : "Add"} Role</Label>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Input value={roleForm.role_name} onChange={e => setRoleForm({ ...roleForm, role_name: e.target.value })} placeholder="As a Member" className="bg-background/50 border-white/20" />
                      <Input type="number" value={roleForm.display_order} onChange={e => setRoleForm({ ...roleForm, display_order: parseInt(e.target.value) || 0 })} placeholder="Order" className="bg-background/50 border-white/20" />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSaveRole(org.id)} className="bg-gradient-to-r from-indigo-500 to-blue-600">
                        {editingRoleId ? "Update" : "Add"} Role
                      </Button>
                      {editingRoleId && <Button size="sm" variant="outline" onClick={resetRoleForm} className="border-white/20">Cancel</Button>}
                    </div>
                  </div>

                  {/* Existing Roles */}
                  {roles.filter(r => r.organization_id === org.id).map(role => (
                    <div key={role.id} className="rounded-lg border border-white/10 overflow-hidden">
                      <div className="flex items-center justify-between p-3 bg-indigo-500/5 cursor-pointer"
                        onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)}>
                        <div className="flex items-center gap-2">
                          {expandedRole === role.id ? <ChevronDown className="h-3 w-3 text-indigo-400" /> : <ChevronRight className="h-3 w-3 text-indigo-400" />}
                          <span className="font-medium text-sm text-foreground">{role.role_name}</span>
                          <span className="text-xs text-muted-foreground">(Order: {role.display_order})</span>
                        </div>
                        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" onClick={() => handleEditRole(role)} className="h-7 hover:bg-indigo-500/20"><Edit2 className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteRole(role.id)} className="h-7 hover:bg-red-500/20"><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </div>

                      {/* Expanded: Tasks */}
                      {expandedRole === role.id && (
                        <div className="p-3 border-t border-white/10 bg-white/[0.02] space-y-3">
                          {/* Add Task Form */}
                          <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 space-y-3">
                            <div className="flex items-center gap-2">
                              <ListTodo className="h-4 w-4 text-emerald-400" />
                              <Label className="text-emerald-300 font-semibold">{editingTaskId ? "Edit" : "Add"} Task</Label>
                            </div>
                            <Input value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="Task title" className="bg-background/50 border-white/20" />
                            <Textarea value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} placeholder="Description (optional)" className="bg-background/50 border-white/20" rows={2} />
                            <div className="grid md:grid-cols-3 gap-3">
                              <Input value={taskForm.link_url} onChange={e => setTaskForm({ ...taskForm, link_url: e.target.value })} placeholder="Live URL (optional)" className="bg-background/50 border-white/20" />
                              <Input value={taskForm.client_url} onChange={e => setTaskForm({ ...taskForm, client_url: e.target.value })} placeholder="Client URL (optional)" className="bg-background/50 border-white/20" />
                              <Input type="number" value={taskForm.display_order} onChange={e => setTaskForm({ ...taskForm, display_order: parseInt(e.target.value) || 0 })} placeholder="Order" className="bg-background/50 border-white/20" />
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <ImageUpload currentImageUrl={taskForm.image_url} onImageUploaded={url => setTaskForm({ ...taskForm, image_url: url })} label="📷 Cover Image" />
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">
                              <Label className="text-foreground/80">📸 Additional Images</Label>
                              <ImageUpload currentImageUrl="" onImageUploaded={addTaskImage} label="Add Image" />
                              {taskForm.images.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {taskForm.images.map((img, i) => (
                                    <div key={i} className="relative group">
                                      <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                                      <button onClick={() => removeTaskImage(i)} className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">{"×"}</button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            {/* Files Upload */}
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">
                              <Label className="text-foreground/80">📎 Attached Files (PDF, PPTX, etc.)</Label>
                              <ImageUpload currentImageUrl="" onImageUploaded={addTaskFile} label="Add File" accept=".pdf,.pptx,.ppt,.doc,.docx" allowNonImage />
                              {taskForm.files.length > 0 && (
                                <div className="space-y-1 mt-2">
                                  {taskForm.files.map((file, i) => (
                                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-background/30">
                                      <span className="text-xs text-foreground/70 truncate flex-1">{file.split('/').pop()?.split('?')[0]}</span>
                                      <button onClick={() => removeTaskFile(i)} className="bg-destructive text-destructive-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">{"×"}</button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleSaveTask(role.id)} className="bg-gradient-to-r from-emerald-500 to-teal-600">
                                {editingTaskId ? "Update" : "Add"} Task
                              </Button>
                              {editingTaskId && <Button size="sm" variant="outline" onClick={resetTaskForm} className="border-white/20">Cancel</Button>}
                            </div>
                          </div>

                          {/* Task List */}
                          {tasks.filter(t => t.role_id === role.id).map(task => (
                            <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5 border border-white/10">
                              <div className="flex items-center gap-3">
                                {task.image_url && <img src={task.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                                <div>
                                  <p className="font-medium text-sm">{task.title}</p>
                                  <p className="text-xs text-muted-foreground">{task.images.length} images</p>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => handleEditTask(task)} className="h-7 hover:bg-emerald-500/20"><Edit2 className="h-3 w-3" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task.id)} className="h-7 hover:bg-red-500/20"><Trash2 className="h-3 w-3" /></Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
