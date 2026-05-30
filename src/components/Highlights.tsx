import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star, Award, Zap, FolderOpen, Users, Calendar, FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Item {
  id: string;
  title: string;
  subtitle?: string;
  image?: string | null;
  href: string;
}

interface Group {
  key: string;
  label: string;
  icon: any;
  color: string;
  viewAll: string;
  items: Item[];
}

const Highlights = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [projects, certs, tasks, skills, blogs] = await Promise.all([
        supabase.from("projects").select("id,title,description,image_url,created_at").order("created_at", { ascending: false }).limit(2),
        supabase.from("certificates").select("id,title,issuer,image_url,link_url,created_at").eq("hidden", false).order("created_at", { ascending: false }).limit(2),
        supabase.from("activity_tasks").select("id,title,description,image_url,created_at").order("created_at", { ascending: false }).limit(2),
        supabase.from("skills").select("id,skill_name,category,image_url,created_at").order("created_at", { ascending: false }).limit(2),
        supabase.from("blog_posts").select("id,title,category,images,created_at").eq("published", true).order("created_at", { ascending: false }).limit(2),
      ]);

      const out: Group[] = [
        {
          key: "projects", label: "Recent Projects", icon: FolderOpen,
          color: "from-teal-500 to-cyan-500", viewAll: "/projects",
          items: (projects.data || []).map((p: any) => ({
            id: p.id, title: p.title, subtitle: p.description?.replace(/<[^>]+>/g, "").slice(0, 90),
            image: p.image_url, href: `/projects/${p.id}`,
          })),
        },
        {
          key: "certificates", label: "Recent Certificates", icon: Award,
          color: "from-amber-500 to-yellow-500", viewAll: "/certificates",
          items: (certs.data || []).map((c: any) => ({
            id: c.id, title: c.title, subtitle: c.issuer,
            image: c.image_url, href: "/certificates",
          })),
        },
        {
          key: "activities", label: "Recent Activities", icon: Users,
          color: "from-rose-500 to-pink-500", viewAll: "/activities",
          items: (tasks.data || []).map((t: any) => ({
            id: t.id, title: t.title, subtitle: t.description?.replace(/<[^>]+>/g, "").slice(0, 90),
            image: t.image_url, href: `/activity-task/${t.id}`,
          })),
        },
        {
          key: "skills", label: "Recent Skills", icon: Zap,
          color: "from-indigo-500 to-violet-500", viewAll: "/skills",
          items: (skills.data || []).map((s: any) => ({
            id: s.id, title: s.skill_name, subtitle: s.category,
            image: s.image_url, href: "/skills",
          })),
        },
        {
          key: "blog", label: "Recent Blog Posts", icon: FileText,
          color: "from-fuchsia-500 to-pink-500", viewAll: "/blog",
          items: (blogs.data || []).map((b: any) => ({
            id: b.id, title: b.title, subtitle: b.category,
            image: Array.isArray(b.images) && b.images[0] ? b.images[0] : null,
            href: "/blog",
          })),
        },
      ].filter((g) => g.items.length > 0);

      setGroups(out);
      setLoading(false);
    };
    load();
  }, []);

  if (loading || groups.length === 0) return null;

  return (
    <section id="highlights" className="section-padding relative overflow-hidden">
      <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-primary/15 to-accent/15 rounded-full blur-3xl pointer-events-none" />
      <div className="container mx-auto max-w-6xl relative z-10 px-4">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Star className="h-4 w-4 text-primary fill-primary" />
            <span className="text-sm font-semibold text-primary tracking-wide uppercase">Featured</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Highlights</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The latest from across the portfolio — tap any section to see everything.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mt-6" />
        </div>

        <div className="space-y-14">
          {groups.map((g) => {
            const Icon = g.icon;
            return (
              <div key={g.key} className="animate-fade-in">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${g.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold">{g.label}</h3>
                  </div>
                  <Link
                    to={g.viewAll}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    View all <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  {g.items.map((it, idx) => (
                    <Link
                      key={it.id}
                      to={it.href}
                      className="group relative overflow-hidden rounded-2xl bg-card border border-border/60 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      {it.image && (
                        <div className="aspect-[16/10] overflow-hidden bg-muted/30">
                          <img
                            src={it.image}
                            alt={it.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <h4 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {it.title}
                        </h4>
                        {it.subtitle && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{it.subtitle}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Highlights;
