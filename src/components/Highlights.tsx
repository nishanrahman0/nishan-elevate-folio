import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star, Award, Zap, FolderOpen, Users, Calendar, FileText, Briefcase, Trophy, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface HighlightItem {
  id: string;
  kind: string;
  title: string;
  subtitle?: string;
  image?: string | null;
  href: string;
  icon: any;
  color: string;
}

const Highlights = () => {
  const [items, setItems] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const load = async () => {
      const [skills, certs, tasks, projects, exps, events, blogs, achievements] = await Promise.all([
        supabase.from("skills").select("id,skill_name,category,image_url").eq("highlighted", true).limit(12),
        supabase.from("certificates").select("id,title,issuer,image_url,link_url").eq("highlighted", true).eq("hidden", false).limit(8),
        supabase.from("activity_tasks").select("id,title,description,image_url").eq("highlighted", true).limit(8),
        supabase.from("projects").select("id,title,description,image_url").eq("highlighted", true).limit(8),
        supabase.from("experiences").select("id,title,company,image_url").eq("highlighted", true).limit(6),
        supabase.from("events").select("id,title,caption,images").eq("highlighted", true).limit(6),
        supabase.from("blog_posts").select("id,title,category,images").eq("highlighted", true).eq("published", true).limit(6),
        supabase.from("achievements").select("id,title,description,images").eq("highlighted", true).eq("hidden", false).limit(6),
      ]);

      const out: HighlightItem[] = [];

      (projects.data || []).forEach((p: any) => out.push({
        id: p.id, kind: "Project", title: p.title, subtitle: p.description?.slice(0, 80),
        image: p.image_url, href: `/projects/${p.id}`, icon: FolderOpen, color: "from-teal-500 to-cyan-500",
      }));

      (certs.data || []).forEach((c: any) => out.push({
        id: c.id, kind: "Certificate", title: c.title, subtitle: c.issuer,
        image: c.image_url, href: c.link_url || "/certificates", icon: Award, color: "from-amber-500 to-yellow-500",
      }));

      (tasks.data || []).forEach((t: any) => out.push({
        id: t.id, kind: "Activity", title: t.title, subtitle: t.description?.slice(0, 80),
        image: t.image_url, href: `/activity-task/${t.id}`, icon: Users, color: "from-rose-500 to-pink-500",
      }));

      (achievements.data || []).forEach((a: any) => out.push({
        id: a.id, kind: "Achievement", title: a.title, subtitle: a.description?.slice(0, 80),
        image: Array.isArray(a.images) && a.images[0] ? a.images[0] : null,
        href: "/achievements", icon: Trophy, color: "from-yellow-500 to-orange-500",
      }));

      (exps.data || []).forEach((e: any) => out.push({
        id: e.id, kind: "Experience", title: e.title, subtitle: e.company,
        image: e.image_url, href: "/experience", icon: Briefcase, color: "from-indigo-500 to-blue-500",
      }));

      (events.data || []).forEach((e: any) => out.push({
        id: e.id, kind: "Event", title: e.title, subtitle: e.caption,
        image: Array.isArray(e.images) && e.images[0] ? e.images[0] : null,
        href: "/events", icon: Calendar, color: "from-purple-500 to-violet-500",
      }));

      (blogs.data || []).forEach((b: any) => out.push({
        id: b.id, kind: "Blog", title: b.title, subtitle: b.category,
        image: Array.isArray(b.images) && b.images[0] ? b.images[0] : null,
        href: "/blog", icon: FileText, color: "from-rose-500 to-pink-500",
      }));

      (skills.data || []).forEach((s: any) => out.push({
        id: s.id, kind: "Skill", title: s.skill_name, subtitle: s.category,
        image: s.image_url, href: "/skills", icon: Zap, color: "from-amber-500 to-orange-500",
      }));

      setItems(out);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return null;
  if (items.length === 0 && !isAdmin) return null;

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
            A curated selection of standout work across projects, certificates, activities, and more.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mt-6" />
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-primary/30 bg-card/50 p-10 text-center">
            <Sparkles className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No highlights yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              Only you can see this message. Open the Admin panel and click the star icon on any project,
              certificate, activity, skill, experience, event, blog post, or achievement to feature it here.
            </p>
            <Link to="/admin" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Go to Admin <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it, idx) => {
            const Icon = it.icon;
            const Wrapper: any = it.href.startsWith("http") ? "a" : Link;
            const wrapperProps: any = it.href.startsWith("http")
              ? { href: it.href, target: "_blank", rel: "noopener noreferrer" }
              : { to: it.href };
            return (
              <Wrapper
                key={`${it.kind}-${it.id}`}
                {...wrapperProps}
                className="group relative overflow-hidden rounded-2xl bg-card border border-border/60 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {it.image && (
                  <div className="aspect-[16/10] overflow-hidden bg-muted/30">
                    <img src={it.image} alt={it.title} loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-md bg-gradient-to-br ${it.color}`}>
                      <Icon className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{it.kind}</span>
                  </div>
                  <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">{it.title}</h3>
                  {it.subtitle && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{it.subtitle}</p>}
                  <div className="flex items-center gap-1 text-xs text-primary mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    View <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Wrapper>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
};

export default Highlights;
