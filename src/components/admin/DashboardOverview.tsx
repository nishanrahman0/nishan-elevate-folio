import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  FolderOpen, 
  Calendar, 
  Award, 
  Zap, 
  Briefcase, 
  Users, 
  GraduationCap,
  TrendingUp,
  Activity
} from "lucide-react";

interface Stats {
  blogPosts: number;
  projects: number;
  events: number;
  certificates: number;
  skills: number;
  experiences: number;
  activities: number;
  education: number;
}

interface RecentItem {
  id: string;
  title: string;
  type: string;
  date: string;
}

export function DashboardOverview() {
  const [stats, setStats] = useState<Stats>({
    blogPosts: 0,
    projects: 0,
    events: 0,
    certificates: 0,
    skills: 0,
    experiences: 0,
    activities: 0,
    education: 0,
  });
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, []);

  const fetchStats = async () => {
    try {
      const [blogs, projects, events, certificates, skills, experiences, activities, education] = await Promise.all([
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("certificates").select("id", { count: "exact", head: true }),
        supabase.from("skills").select("id", { count: "exact", head: true }),
        supabase.from("experiences").select("id", { count: "exact", head: true }),
        supabase.from("extracurricular_activities").select("id", { count: "exact", head: true }),
        supabase.from("education").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        blogPosts: blogs.count || 0,
        projects: projects.count || 0,
        events: events.count || 0,
        certificates: certificates.count || 0,
        skills: skills.count || 0,
        experiences: experiences.count || 0,
        activities: activities.count || 0,
        education: education.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const [blogs, projects, events] = await Promise.all([
        supabase.from("blog_posts").select("id, title, created_at").order("created_at", { ascending: false }).limit(3),
        supabase.from("projects").select("id, title, created_at").order("created_at", { ascending: false }).limit(3),
        supabase.from("events").select("id, title, created_at").order("created_at", { ascending: false }).limit(3),
      ]);

      const items: RecentItem[] = [
        ...(blogs.data?.map(b => ({ id: b.id, title: b.title, type: "Blog Post", date: b.created_at })) || []),
        ...(projects.data?.map(p => ({ id: p.id, title: p.title, type: "Project", date: p.created_at })) || []),
        ...(events.data?.map(e => ({ id: e.id, title: e.title, type: "Event", date: e.created_at })) || []),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);

      setRecentItems(items);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
    }
  };

  const statCards = [
    { label: "Blog Posts", value: stats.blogPosts, icon: FileText, color: "from-rose-500 to-pink-500", bg: "bg-rose-500/10" },
    { label: "Projects", value: stats.projects, icon: FolderOpen, color: "from-teal-500 to-cyan-500", bg: "bg-teal-500/10" },
    { label: "Events", value: stats.events, icon: Calendar, color: "from-purple-500 to-violet-500", bg: "bg-purple-500/10" },
    { label: "Certificates", value: stats.certificates, icon: Award, color: "from-yellow-500 to-amber-500", bg: "bg-yellow-500/10" },
    { label: "Skills", value: stats.skills, icon: Zap, color: "from-amber-500 to-orange-500", bg: "bg-amber-500/10" },
    { label: "Experience", value: stats.experiences, icon: Briefcase, color: "from-indigo-500 to-blue-500", bg: "bg-indigo-500/10" },
    { label: "Activities", value: stats.activities, icon: Users, color: "from-green-500 to-emerald-500", bg: "bg-green-500/10" },
    { label: "Education", value: stats.education, icon: GraduationCap, color: "from-cyan-500 to-blue-500", bg: "bg-cyan-500/10" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-10 h-10 border-4 border-violet-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 p-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-8 w-8 text-white/90" />
            <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          </div>
          <p className="text-white/80 text-lg">
            Welcome back! Here's an overview of your portfolio content.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="bg-slate-800/50 border-white/10 overflow-hidden group hover:bg-slate-800/70 transition-all">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="bg-slate-800/50 border-white/10">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-white text-xl">Recent Activity</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {recentItems.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No recent activity. Start creating content!</p>
          ) : (
            <div className="space-y-3">
              {recentItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-400 to-purple-400" />
                    <div>
                      <p className="text-white font-medium">{item.title}</p>
                      <p className="text-slate-400 text-sm">{item.type}</p>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm">
                    {new Date(item.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-white/10">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">💡 Quick Tips</h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-violet-400 mt-1">•</span>
              <span>Update your Hero section to personalize the site branding</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-400 mt-1">•</span>
              <span>Add images to your Experience and Events for visual appeal</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-400 mt-1">•</span>
              <span>Customize the Theme & Colors to match your brand</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-400 mt-1">•</span>
              <span>Keep your skills and certificates up to date</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
