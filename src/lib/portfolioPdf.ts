import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { supabase } from "@/integrations/supabase/client";

const stripHtml = (html: string | null | undefined) => {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || div.innerText || "").trim();
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const ytId = (url: string) => {
  const m = url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
};

const imgTag = (url: string, cls = "") =>
  url ? `<img src="${url}" crossorigin="anonymous" class="${cls}" style="max-width:100%;border-radius:8px;object-fit:cover" />` : "";

export async function generatePortfolioPdf(onProgress?: (msg: string) => void) {
  const log = (m: string) => onProgress?.(m);
  log("Fetching content...");

  const [
    hero, about, education, experiences, skills, projects, certificates,
    events, extras, extraContent, contact, orgs, roles, tasks, social
  ] = await Promise.all([
    supabase.from("hero_content").select("*").maybeSingle(),
    supabase.from("about_content").select("*").maybeSingle(),
    supabase.from("education").select("*").order("created_at"),
    supabase.from("experiences").select("*").order("display_order"),
    supabase.from("skills").select("*").order("display_order"),
    supabase.from("projects").select("*").order("display_order"),
    supabase.from("certificates").select("*").eq("hidden", false).order("display_order"),
    supabase.from("events").select("*").order("display_order"),
    supabase.from("extracurricular_activities").select("*").order("display_order"),
    supabase.from("extracurricular_content").select("*").maybeSingle(),
    supabase.from("contact_content").select("*").maybeSingle(),
    supabase.from("activity_organizations").select("*").eq("hidden", false).order("display_order"),
    supabase.from("activity_roles").select("*").order("display_order"),
    supabase.from("activity_tasks").select("*").order("display_order"),
    supabase.from("hero_social_links").select("*").order("display_order"),
  ]);

  const h = hero.data || ({} as any);
  const a = about.data || ({} as any);
  const c = contact.data || ({} as any);

  log("Building layout...");

  const socials: string[] = [];
  if (h.linkedin_url) socials.push(`LinkedIn: ${h.linkedin_url}`);
  if (h.github_url) socials.push(`GitHub: ${h.github_url}`);
  if (h.facebook_url) socials.push(`Facebook: ${h.facebook_url}`);
  if (h.instagram_url) socials.push(`Instagram: ${h.instagram_url}`);
  (social.data || []).forEach((s: any) => socials.push(`${s.label}: ${s.url}`));

  const html = `
  <div id="pdf-root" style="width:794px;background:#ffffff;color:#1a1a2e;font-family:'Helvetica',Arial,sans-serif;">
    <style>
      .page{padding:48px 56px;page-break-after:always;background:#fff;}
      .page:last-child{page-break-after:auto;}
      .h1{font-size:42px;font-weight:800;margin:0 0 6px;background:linear-gradient(90deg,#6366f1,#a855f7,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
      .h2{font-size:24px;font-weight:700;margin:0 0 16px;color:#4f46e5;border-bottom:3px solid #6366f1;padding-bottom:8px;display:inline-block;}
      .h3{font-size:18px;font-weight:700;margin:0 0 4px;color:#1a1a2e;}
      .muted{color:#64748b;font-size:13px;}
      .tag{display:inline-block;background:#eef2ff;color:#4f46e5;padding:3px 10px;border-radius:999px;font-size:11px;margin:2px 4px 2px 0;font-weight:600;}
      .card{border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:14px;background:#fafafe;}
      .grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
      .grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}
      .row{display:flex;gap:16px;align-items:flex-start;}
      p{margin:6px 0;line-height:1.55;font-size:13px;color:#334155;}
      .hero-bg{background:linear-gradient(135deg,#eef2ff 0%,#fce7f3 100%);border-radius:20px;padding:40px;text-align:center;}
      .avatar{width:140px;height:140px;border-radius:50%;object-fit:cover;border:5px solid #fff;box-shadow:0 8px 24px rgba(99,102,241,0.3);margin:0 auto 16px;display:block;}
      .thumb{width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:8px;}
      .logo-sm{width:40px;height:40px;border-radius:8px;object-fit:cover;}
    </style>

    <!-- COVER -->
    <div class="page">
      <div class="hero-bg">
        ${h.profile_image_url ? `<img class="avatar" src="${h.profile_image_url}" crossorigin="anonymous"/>` : ""}
        <h1 class="h1">${escapeHtml(h.name || "Portfolio")}</h1>
        <p style="font-size:16px;color:#475569;margin:8px 0 16px;">${escapeHtml(h.tagline || "")}</p>
        <div style="font-size:12px;color:#64748b;">
          ${c.email ? `📧 ${escapeHtml(c.email)} &nbsp;` : ""}
          ${c.phone ? `📱 ${escapeHtml(c.phone)}` : ""}
        </div>
        <div style="margin-top:14px;font-size:11px;color:#475569;">
          ${socials.map(s => `<div>${escapeHtml(s)}</div>`).join("")}
        </div>
      </div>
      ${a.content ? `
        <div style="margin-top:30px;">
          <h2 class="h2">About Me</h2>
          ${a.image_url ? imgTag(a.image_url, "") + `<div style="height:14px"></div>` : ""}
          <p>${escapeHtml(stripHtml(a.content))}</p>
        </div>` : ""}
    </div>

    <!-- EDUCATION & EXPERIENCE -->
    ${(education.data?.length || experiences.data?.length) ? `
    <div class="page">
      ${education.data?.length ? `
        <h2 class="h2">🎓 Education</h2>
        ${education.data.map((e: any) => `
          <div class="card">
            <div class="row">
              ${e.logo_url ? `<img class="logo-sm" src="${e.logo_url}" crossorigin="anonymous"/>` : ""}
              <div style="flex:1">
                <div class="h3">${escapeHtml(e.degree)}</div>
                <div class="muted">${escapeHtml(e.institution)} • ${escapeHtml(e.duration)}</div>
              </div>
            </div>
          </div>`).join("")}
      ` : ""}
      ${experiences.data?.length ? `
        <h2 class="h2" style="margin-top:24px;">💼 Experience</h2>
        ${experiences.data.map((e: any) => `
          <div class="card">
            <div class="row">
              ${e.logo_url ? `<img class="logo-sm" src="${e.logo_url}" crossorigin="anonymous"/>` : ""}
              <div style="flex:1">
                <div class="h3">${escapeHtml(e.title)}</div>
                <div class="muted">${escapeHtml(e.company)} • ${escapeHtml(e.duration)}</div>
                <p>${escapeHtml(stripHtml(e.description))}</p>
              </div>
            </div>
          </div>`).join("")}
      ` : ""}
    </div>` : ""}

    <!-- SKILLS -->
    ${skills.data?.length ? `
    <div class="page">
      <h2 class="h2">⚡ Skills</h2>
      <div>
        ${skills.data.map((s: any) => `<span class="tag">${escapeHtml(s.skill_name)}${s.category ? ` • ${escapeHtml(s.category)}` : ""}</span>`).join("")}
      </div>
    </div>` : ""}

    <!-- PROJECTS -->
    ${projects.data?.length ? `
    <div class="page">
      <h2 class="h2">🚀 Projects</h2>
      ${projects.data.map((p: any) => {
        const cover = p.image_url || (Array.isArray(p.images) && p.images[0]) || "";
        return `
        <div class="card">
          ${cover ? `<img class="thumb" src="${cover}" crossorigin="anonymous"/>` : ""}
          <div class="h3">${escapeHtml(p.title)}</div>
          <p>${escapeHtml(stripHtml(p.description))}</p>
          ${(p.tags || []).length ? `<div>${(p.tags || []).map((t: string) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>` : ""}
          <div class="muted" style="margin-top:6px;">
            ${p.link_url ? `🔗 ${escapeHtml(p.link_url)}<br/>` : ""}
            ${p.github_url ? `💻 ${escapeHtml(p.github_url)}` : ""}
          </div>
        </div>`;
      }).join("")}
    </div>` : ""}

    <!-- CERTIFICATES -->
    ${certificates.data?.length ? `
    <div class="page">
      <h2 class="h2">📜 Certificates</h2>
      <div class="grid2">
        ${certificates.data.map((c: any) => `
          <div class="card">
            ${c.image_url ? `<img class="thumb" src="${c.image_url}" crossorigin="anonymous"/>` : ""}
            <div class="h3">${c.icon_emoji || "📜"} ${escapeHtml(c.title)}</div>
            <div class="muted">${escapeHtml(c.issuer)}</div>
          </div>`).join("")}
      </div>
    </div>` : ""}

    <!-- ACTIVITIES -->
    ${(orgs.data?.length || extras.data?.length) ? `
    <div class="page">
      <h2 class="h2">🎯 Activities & Involvement</h2>
      ${extraContent.data?.content ? `<p>${escapeHtml(stripHtml(extraContent.data.content))}</p>` : ""}
      ${(orgs.data || []).map((o: any) => {
        const orgRoles = (roles.data || []).filter((r: any) => r.organization_id === o.id);
        return `
          <div class="card">
            <div class="row">
              ${o.logo_url ? `<img class="logo-sm" src="${o.logo_url}" crossorigin="anonymous"/>` : ""}
              <div style="flex:1">
                <div class="h3">${escapeHtml(o.name)}${o.short_name ? ` (${escapeHtml(o.short_name)})` : ""}</div>
                ${o.description ? `<p>${escapeHtml(stripHtml(o.description))}</p>` : ""}
                ${orgRoles.map((r: any) => {
                  const roleTasks = (tasks.data || []).filter((t: any) => t.role_id === r.id);
                  return `
                    <div style="margin-top:8px;">
                      <strong style="color:#4f46e5;font-size:13px;">${escapeHtml(r.role_name)}</strong>
                      ${roleTasks.map((t: any) => `<div class="muted" style="margin-left:12px;">• ${escapeHtml(t.title)}</div>`).join("")}
                    </div>`;
                }).join("")}
              </div>
            </div>
          </div>`;
      }).join("")}
      ${(extras.data || []).map((x: any) => `
        <div class="card">
          <div class="h3">${escapeHtml(x.title)}</div>
          <div class="muted">${escapeHtml(x.organization)}</div>
        </div>`).join("")}
    </div>` : ""}

    <!-- EVENTS -->
    ${events.data?.length ? `
    <div class="page">
      <h2 class="h2">📅 Events</h2>
      ${events.data.map((e: any) => {
        const cover = Array.isArray(e.images) && e.images[0];
        return `
          <div class="card">
            ${cover ? `<img class="thumb" src="${cover}" crossorigin="anonymous"/>` : ""}
            <div class="h3">${escapeHtml(e.title)}</div>
            <p>${escapeHtml(stripHtml(e.description))}</p>
          </div>`;
      }).join("")}
    </div>` : ""}

    <!-- CONTACT FOOTER -->
    <div class="page">
      <h2 class="h2">📬 Get In Touch</h2>
      <div class="card">
        ${c.heading ? `<div class="h3">${escapeHtml(c.heading)}</div>` : ""}
        ${c.description ? `<p>${escapeHtml(stripHtml(c.description))}</p>` : ""}
        ${c.email ? `<p>📧 ${escapeHtml(c.email)}</p>` : ""}
        ${c.phone ? `<p>📱 ${escapeHtml(c.phone)}</p>` : ""}
        ${socials.length ? `<div style="margin-top:10px;">${socials.map(s => `<div class="muted">${escapeHtml(s)}</div>`).join("")}</div>` : ""}
      </div>
      <p class="muted" style="text-align:center;margin-top:40px;">Generated from ${escapeHtml(h.site_title || h.name || "portfolio")} • ${new Date().toLocaleDateString()}</p>
    </div>
  </div>`;

  // Mount offscreen
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-10000px";
  container.style.top = "0";
  container.innerHTML = html;
  document.body.appendChild(container);

  log("Loading images...");
  const imgs = Array.from(container.querySelectorAll("img"));
  await Promise.all(imgs.map(img => new Promise<void>((res) => {
    if ((img as HTMLImageElement).complete) return res();
    img.addEventListener("load", () => res());
    img.addEventListener("error", () => res());
    setTimeout(() => res(), 5000);
  })));

  log("Rendering pages...");
  const pages = Array.from(container.querySelectorAll(".page")) as HTMLElement[];
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < pages.length; i++) {
    log(`Rendering ${i + 1}/${pages.length}...`);
    const canvas = await html2canvas(pages[i], {
      scale: 2, useCORS: true, allowTaint: true, backgroundColor: "#ffffff", logging: false,
    });
    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    const ratio = canvas.height / canvas.width;
    const imgH = pageW * ratio;
    if (i > 0) pdf.addPage();
    if (imgH <= pageH) {
      pdf.addImage(imgData, "JPEG", 0, 0, pageW, imgH);
    } else {
      // Slice tall pages across multiple PDF pages
      let remaining = imgH;
      let yOffset = 0;
      let first = true;
      while (remaining > 0) {
        if (!first) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, -yOffset, pageW, imgH);
        remaining -= pageH;
        yOffset += pageH;
        first = false;
      }
    }
  }

  document.body.removeChild(container);
  const filename = `${(h.name || "Portfolio").replace(/\s+/g, "_")}_Portfolio.pdf`;
  pdf.save(filename);
  log("Done!");
}
