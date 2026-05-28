import jsPDF from "jspdf";
import { supabase } from "@/integrations/supabase/client";

/**
 * Designer-grade native jsPDF portfolio.
 * - Editorial two-column cover with sidebar
 * - Vector text (selectable)
 * - Robust image loading (fetch -> Image+canvas fallback) for Supabase / CORS-tricky hosts
 */

// ---------- Theme ----------
const T = {
  ink: [12, 16, 35] as [number, number, number],          // near-black navy
  sidebar: [17, 20, 45] as [number, number, number],      // deep indigo
  sidebarTxt: [226, 232, 255] as [number, number, number],
  sidebarMuted: [148, 163, 220] as [number, number, number],
  accent: [129, 140, 248] as [number, number, number],    // indigo-400
  accent2: [232, 121, 249] as [number, number, number],   // fuchsia-400
  primary: [79, 70, 229] as [number, number, number],
  body: [51, 65, 85] as [number, number, number],
  muted: [100, 116, 139] as [number, number, number],
  hair: [226, 232, 240] as [number, number, number],
  chipBg: [238, 242, 255] as [number, number, number],
  bg: [255, 255, 255] as [number, number, number],
};

const M = { x: 18, top: 22, bottom: 18 };
const A4 = { w: 210, h: 297 };

// ---------- Helpers ----------
const stripHtml = (html: string | null | undefined) => {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || div.innerText || "").replace(/\s+/g, " ").trim();
};

/** Robust image -> dataURL. Tries fetch first, then Image+canvas as fallback. */
async function loadImage(url: string): Promise<{ data: string; type: "JPEG" | "PNG"; w: number; h: number } | null> {
  if (!url) return null;
  // Try fetch
  try {
    const res = await fetch(url, { mode: "cors", cache: "no-cache" });
    if (res.ok) {
      const blob = await res.blob();
      const data: string = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = reject;
        r.readAsDataURL(blob);
      });
      const dims = await new Promise<{ w: number; h: number }>((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
        img.onerror = () => resolve({ w: 1, h: 1 });
        img.src = data;
      });
      const type = data.startsWith("data:image/png") ? "PNG" : "JPEG";
      return { data, type, w: dims.w, h: dims.h };
    }
  } catch {}

  // Fallback: load via Image + canvas (works when server sends ACAO but fetch is blocked)
  try {
    const dataUrl: { data: string; w: number; h: number } | null = await new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(null);
          ctx.drawImage(img, 0, 0);
          resolve({ data: canvas.toDataURL("image/jpeg", 0.9), w: img.naturalWidth, h: img.naturalHeight });
        } catch { resolve(null); }
      };
      img.onerror = () => resolve(null);
      img.src = url + (url.includes("?") ? "&" : "?") + "_pdf=1";
    });
    if (dataUrl) return { data: dataUrl.data, type: "JPEG", w: dataUrl.w, h: dataUrl.h };
  } catch {}
  return null;
}

// ---------- Doc builder ----------
class Doc {
  pdf: jsPDF;
  y = M.top;
  pageIdx = 1;        // 1 = cover
  contentPage = 0;    // counter for content-only pages
  name = ""; tagline = "";

  constructor() {
    this.pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
  }

  ensure(h: number) {
    if (this.y + h > A4.h - M.bottom) this.addContentPage();
  }

  addContentPage() {
    this.pdf.addPage();
    this.pageIdx++;
    this.contentPage++;
    this.y = M.top;
    this.drawChrome();
  }

  drawChrome() {
    const p = this.pdf;
    // Slim top accent
    p.setFillColor(...T.primary);
    p.rect(0, 0, A4.w, 2.5, "F");
    p.setFillColor(...T.accent2);
    p.rect(0, 2.5, A4.w * 0.35, 1, "F");

    // Header brand
    p.setFont("helvetica", "bold");
    p.setFontSize(9);
    p.setTextColor(...T.ink);
    p.text(this.name.toUpperCase(), M.x, 11);
    p.setFont("helvetica", "normal");
    p.setFontSize(8);
    p.setTextColor(...T.muted);
    const tag = this.pdf.splitTextToSize(this.tagline, 110)[0] || "";
    p.text(tag, A4.w - M.x, 11, { align: "right" });
    p.setDrawColor(...T.hair);
    p.setLineWidth(0.2);
    p.line(M.x, 14, A4.w - M.x, 14);

    // Footer
    p.setDrawColor(...T.hair);
    p.line(M.x, A4.h - 12, A4.w - M.x, A4.h - 12);
    p.setFontSize(8);
    p.setTextColor(...T.muted);
    p.text("nishanrahman.me", M.x, A4.h - 7);
    p.text(`${this.contentPage}`, A4.w - M.x, A4.h - 7, { align: "right" });
  }

  sectionTitle(label: string) {
    this.ensure(16);
    const p = this.pdf;
    // Eyebrow accent line + label
    p.setFillColor(...T.primary);
    p.rect(M.x, this.y + 1.5, 8, 1.6, "F");
    p.setFont("helvetica", "bold");
    p.setFontSize(8.5);
    p.setTextColor(...T.primary);
    p.text("SECTION", M.x + 11, this.y + 3);
    this.y += 6;
    p.setFont("helvetica", "bold");
    p.setFontSize(20);
    p.setTextColor(...T.ink);
    p.text(label, M.x, this.y + 5);
    this.y += 9;
    p.setDrawColor(...T.hair);
    p.setLineWidth(0.2);
    p.line(M.x, this.y, A4.w - M.x, this.y);
    this.y += 5;
  }

  body(text: string, opts: { size?: number; color?: [number, number, number]; bold?: boolean; gap?: number; indent?: number; maxWidth?: number } = {}) {
    if (!text) return;
    const p = this.pdf;
    p.setFont("helvetica", opts.bold ? "bold" : "normal");
    p.setFontSize(opts.size ?? 10);
    p.setTextColor(...(opts.color ?? T.body));
    const x = M.x + (opts.indent ?? 0);
    const width = opts.maxWidth ?? (A4.w - M.x * 2 - (opts.indent ?? 0));
    const lines = p.splitTextToSize(text, width) as string[];
    const lh = (opts.size ?? 10) * 0.42;
    for (const line of lines) {
      this.ensure(lh + 1);
      p.text(line, x, this.y);
      this.y += lh;
    }
    this.y += opts.gap ?? 1.5;
  }

  rule(gap = 3) {
    this.ensure(4);
    this.pdf.setDrawColor(...T.hair);
    this.pdf.setLineWidth(0.2);
    this.pdf.line(M.x, this.y, A4.w - M.x, this.y);
    this.y += gap;
  }

  chips(items: string[]) {
    if (!items.length) return;
    const p = this.pdf;
    p.setFont("helvetica", "bold");
    p.setFontSize(8.5);
    const padX = 2.5, gap = 2, lh = 6;
    let x = M.x, lineY = this.y;
    this.ensure(lh + 2);
    for (const raw of items) {
      const txt = (raw || "").trim();
      if (!txt) continue;
      const w = p.getTextWidth(txt) + padX * 2;
      if (x + w > A4.w - M.x) { x = M.x; lineY += lh + gap; this.ensure(lh + 2); }
      p.setFillColor(...T.chipBg);
      p.roundedRect(x, lineY, w, lh - 1, 1.5, 1.5, "F");
      p.setTextColor(...T.primary);
      p.text(txt, x + padX, lineY + 3.6);
      x += w + gap;
    }
    this.y = lineY + lh + 2;
  }
}

// ---------- Main ----------
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

  const h = (hero.data || {}) as any;
  const a = (about.data || {}) as any;
  const c = (contact.data || {}) as any;

  log("Loading profile photo...");
  const profileImg = h.profile_image_url ? await loadImage(h.profile_image_url) : null;

  log("Designing cover...");
  const doc = new Doc();
  doc.name = h.name || "Portfolio";
  doc.tagline = h.tagline || "";
  const pdf = doc.pdf;

  // ============ COVER ============
  // Left dark sidebar
  const sbW = 78;
  pdf.setFillColor(...T.sidebar);
  pdf.rect(0, 0, sbW, A4.h, "F");
  // Decorative diagonal bands
  pdf.setFillColor(...T.accent);
  pdf.rect(0, 0, sbW, 3, "F");
  pdf.setFillColor(...T.accent2);
  pdf.rect(0, A4.h - 4, sbW, 4, "F");
  // Faint circle motif
  pdf.setDrawColor(...T.accent);
  pdf.setLineWidth(0.4);
  pdf.circle(sbW - 6, A4.h - 50, 28, "S");
  pdf.circle(sbW - 6, A4.h - 50, 18, "S");

  // Photo (large, framed)
  const photoX = 14, photoY = 22, photoSize = 50;
  if (profileImg) {
    // White border behind
    pdf.setFillColor(255, 255, 255);
    pdf.rect(photoX - 2, photoY - 2, photoSize + 4, photoSize + 4, "F");
    try {
      pdf.addImage(profileImg.data, profileImg.type, photoX, photoY, photoSize, photoSize, undefined, "FAST");
    } catch {}
  } else {
    // Placeholder initials block
    pdf.setFillColor(...T.accent);
    pdf.rect(photoX, photoY, photoSize, photoSize, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(36);
    pdf.setTextColor(255, 255, 255);
    const initials = (h.name || "NR").split(/\s+/).map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
    pdf.text(initials, photoX + photoSize / 2, photoY + photoSize / 2 + 5, { align: "center" });
  }

  // Sidebar: contact / links
  let sy = photoY + photoSize + 14;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(...T.accent);
  pdf.text("CONTACT", photoX, sy); sy += 5;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  pdf.setTextColor(...T.sidebarTxt);
  const sbInner = sbW - photoX - 4;
  const write = (s: string) => {
    const lines = pdf.splitTextToSize(s, sbInner) as string[];
    for (const l of lines) { pdf.text(l, photoX, sy); sy += 4; }
  };
  if (c.email) write(c.email);
  if (c.phone) write(c.phone);
  write("nishanrahman.me");
  sy += 4;

  // Links
  const linkItems: { label: string; url: string }[] = [];
  if (h.linkedin_url) linkItems.push({ label: "LinkedIn", url: h.linkedin_url });
  if (h.github_url) linkItems.push({ label: "GitHub", url: h.github_url });
  if (h.facebook_url) linkItems.push({ label: "Facebook", url: h.facebook_url });
  if (h.instagram_url) linkItems.push({ label: "Instagram", url: h.instagram_url });
  (social.data || []).forEach((s: any) => linkItems.push({ label: s.label, url: s.url }));

  if (linkItems.length) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(...T.accent);
    pdf.text("LINKS", photoX, sy); sy += 5;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    for (const l of linkItems.slice(0, 8)) {
      pdf.setTextColor(...T.sidebarMuted);
      pdf.text(l.label.toUpperCase(), photoX, sy); sy += 3.5;
      pdf.setTextColor(...T.sidebarTxt);
      const urlLines = pdf.splitTextToSize(l.url.replace(/^https?:\/\//, ""), sbInner) as string[];
      for (const u of urlLines.slice(0, 2)) { pdf.text(u, photoX, sy); sy += 3.5; }
      sy += 1.5;
      if (sy > A4.h - 30) break;
    }
  }

  // Right side: title block
  const rx = sbW + 14;
  const rW = A4.w - rx - 14;
  // Eyebrow
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(...T.primary);
  pdf.text("PORTFOLIO  •  " + new Date().getFullYear(), rx, 32);
  // Accent bar
  pdf.setFillColor(...T.primary);
  pdf.rect(rx, 36, 18, 1.4, "F");

  // Name (huge)
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(40);
  pdf.setTextColor(...T.ink);
  const nameLines = pdf.splitTextToSize(h.name || "Portfolio", rW) as string[];
  let ny = 52;
  for (const l of nameLines) { pdf.text(l, rx, ny); ny += 14; }

  // Tagline
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(14);
  pdf.setTextColor(...T.primary);
  const tagLines = pdf.splitTextToSize(h.tagline || "", rW) as string[];
  ny += 2;
  for (const l of tagLines) { pdf.text(l, rx, ny); ny += 6.5; }

  // Divider
  pdf.setDrawColor(...T.hair);
  pdf.setLineWidth(0.4);
  pdf.line(rx, ny + 4, rx + rW, ny + 4);
  ny += 12;

  // About snippet on cover (fills space nicely)
  if (a.content) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(...T.primary);
    pdf.text("ABOUT", rx, ny); ny += 6;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10.5);
    pdf.setTextColor(...T.body);
    const txt = stripHtml(a.content);
    const aboutLines = pdf.splitTextToSize(txt, rW) as string[];
    const maxLines = Math.floor((A4.h - ny - 60) / 4.6);
    for (const l of aboutLines.slice(0, maxLines)) { pdf.text(l, rx, ny); ny += 4.6; }
  }

  // Highlights at bottom of cover
  const highlights: { num: string; label: string }[] = [
    { num: String(projects.data?.length || 0), label: "Projects" },
    { num: String(certificates.data?.length || 0), label: "Certificates" },
    { num: String(skills.data?.length || 0), label: "Skills" },
    { num: String(orgs.data?.length || 0), label: "Organizations" },
  ];
  const hy = A4.h - 38;
  const cellW = rW / highlights.length;
  highlights.forEach((it, i) => {
    const x = rx + i * cellW;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(24);
    pdf.setTextColor(...T.primary);
    pdf.text(it.num, x, hy);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(...T.muted);
    pdf.text(it.label.toUpperCase(), x, hy + 5);
  });
  // Bottom accent
  pdf.setFillColor(...T.primary);
  pdf.rect(rx, A4.h - 22, rW, 0.8, "F");
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(...T.muted);
  pdf.text("A curated overview of work, education, projects and activities.", rx, A4.h - 16);

  // ============ CONTENT ============
  doc.addContentPage();

  // EDUCATION
  if (education.data?.length) {
    doc.sectionTitle("Education");
    for (const e of education.data as any[]) {
      doc.ensure(16);
      doc.body(e.degree || "", { bold: true, size: 11.5, color: T.ink, gap: 0.5 });
      doc.body(`${e.institution || ""}  •  ${e.duration || ""}`, { size: 9.5, color: T.muted, gap: 2.5 });
      if (e.description) doc.body(stripHtml(e.description), { size: 10, gap: 3 });
      doc.rule();
    }
  }

  // EXPERIENCE
  if (experiences.data?.length) {
    doc.sectionTitle("Experience");
    for (const e of experiences.data as any[]) {
      doc.ensure(18);
      doc.body(e.title || "", { bold: true, size: 11.5, color: T.ink, gap: 0.5 });
      doc.body(`${e.company || ""}  •  ${e.duration || ""}`, { size: 9.5, color: T.muted, gap: 2.5 });
      if (e.description) doc.body(stripHtml(e.description), { size: 10, gap: 3 });
      doc.rule();
    }
  }

  // SKILLS
  if (skills.data?.length) {
    doc.sectionTitle("Skills");
    const grouped: Record<string, string[]> = {};
    for (const s of skills.data as any[]) {
      const cat = s.category || "General";
      (grouped[cat] = grouped[cat] || []).push(s.skill_name);
    }
    for (const [cat, list] of Object.entries(grouped)) {
      doc.body(cat, { bold: true, size: 10.5, color: T.primary, gap: 1.5 });
      doc.chips(list);
    }
  }

  // PROJECTS
  if (projects.data?.length) {
    doc.sectionTitle("Projects");
    for (const p of projects.data as any[]) {
      doc.ensure(32);
      const coverUrl = p.image_url || (Array.isArray(p.images) && p.images[0]) || "";
      const startY = doc.y;
      const imgW = 38, imgH = 26;
      let textX = M.x, textW = A4.w - M.x * 2;
      if (coverUrl) {
        const img = await loadImage(coverUrl);
        if (img) {
          try { pdf.addImage(img.data, img.type, M.x, startY, imgW, imgH, undefined, "FAST"); } catch {}
          textX = M.x + imgW + 5;
          textW = A4.w - M.x - textX;
        }
      }
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11.5);
      pdf.setTextColor(...T.ink);
      const titleLines = pdf.splitTextToSize(p.title || "", textW) as string[];
      let yy = startY + 4;
      for (const l of titleLines.slice(0, 2)) { pdf.text(l, textX, yy); yy += 5; }
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9.5);
      pdf.setTextColor(...T.body);
      const descLines = pdf.splitTextToSize(stripHtml(p.description), textW) as string[];
      for (const l of descLines.slice(0, 4)) { pdf.text(l, textX, yy); yy += 4; }
      doc.y = Math.max(yy, startY + imgH) + 2;
      if ((p.tags || []).length) doc.chips(p.tags as string[]);
      if (p.link_url || p.github_url) {
        const links = [p.link_url && `Live: ${p.link_url}`, p.github_url && `Code: ${p.github_url}`].filter(Boolean) as string[];
        doc.body(links.join("    "), { size: 8.5, color: T.muted, gap: 2 });
      }
      doc.rule();
    }
  }

  // CERTIFICATES — two-column grid
  if (certificates.data?.length) {
    doc.sectionTitle("Certifications");
    const colW = (A4.w - M.x * 2 - 6) / 2;
    const cardH = 18;
    const list = certificates.data as any[];
    for (let i = 0; i < list.length; i += 2) {
      doc.ensure(cardH + 3);
      const yStart = doc.y;
      for (let j = 0; j < 2 && i + j < list.length; j++) {
        const cert = list[i + j];
        const x = M.x + j * (colW + 6);
        pdf.setDrawColor(...T.hair);
        pdf.setLineWidth(0.2);
        pdf.roundedRect(x, yStart, colW, cardH, 1.5, 1.5, "S");
        pdf.setFillColor(...T.primary);
        pdf.rect(x, yStart, 1.5, cardH, "F");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9.5);
        pdf.setTextColor(...T.ink);
        const tLines = pdf.splitTextToSize(cert.title || "", colW - 6) as string[];
        pdf.text(tLines.slice(0, 2), x + 4, yStart + 5);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8.5);
        pdf.setTextColor(...T.muted);
        pdf.text(pdf.splitTextToSize(cert.issuer || "", colW - 6).slice(0, 1), x + 4, yStart + cardH - 3);
      }
      doc.y = yStart + cardH + 3;
    }
  }

  // ACTIVITIES
  if (orgs.data?.length || extras.data?.length) {
    doc.sectionTitle("Activities & Involvement");
    if (extraContent.data?.content) doc.body(stripHtml(extraContent.data.content), { size: 10, gap: 3 });
    for (const o of (orgs.data || []) as any[]) {
      doc.ensure(14);
      doc.body(o.name + (o.short_name ? `  (${o.short_name})` : ""), { bold: true, size: 11, color: T.ink, gap: 0.5 });
      if (o.description) doc.body(stripHtml(o.description), { size: 9.5, gap: 2 });
      const orgRoles = (roles.data || []).filter((r: any) => r.organization_id === o.id);
      for (const r of orgRoles as any[]) {
        doc.body(r.role_name, { bold: true, size: 10, color: T.primary, indent: 4, gap: 1 });
        const roleTasks = (tasks.data || []).filter((t: any) => t.role_id === r.id);
        for (const t of roleTasks as any[]) {
          doc.body("•  " + t.title, { size: 9.5, color: T.body, indent: 8, gap: 0.5 });
        }
      }
      doc.rule();
    }
    for (const x of (extras.data || []) as any[]) {
      doc.body(x.title, { bold: true, size: 10.5, color: T.ink, gap: 0.5 });
      doc.body(x.organization || "", { size: 9.5, color: T.muted, gap: 3 });
    }
  }

  // EVENTS
  if (events.data?.length) {
    doc.sectionTitle("Events");
    for (const e of events.data as any[]) {
      doc.ensure(14);
      doc.body(e.title || "", { bold: true, size: 11, color: T.ink, gap: 0.5 });
      if (e.description) doc.body(stripHtml(e.description), { size: 9.5, gap: 3 });
      doc.rule();
    }
  }

  // CONTACT
  doc.sectionTitle("Get In Touch");
  if (c.heading) doc.body(c.heading, { bold: true, size: 12, color: T.ink, gap: 1 });
  if (c.description) doc.body(stripHtml(c.description), { size: 10, gap: 3 });
  if (c.email) doc.body(`Email   ${c.email}`, { size: 10, gap: 1 });
  if (c.phone) doc.body(`Phone   ${c.phone}`, { size: 10, gap: 1 });
  doc.body(`Website   https://nishanrahman.me`, { size: 10, gap: 3 });

  const filename = `${(h.name || "Portfolio").replace(/\s+/g, "_")}_Portfolio.pdf`;
  pdf.save(filename);
  log("Done!");
}
