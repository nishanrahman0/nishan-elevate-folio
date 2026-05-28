import jsPDF from "jspdf";
import { supabase } from "@/integrations/supabase/client";

/**
 * Professional, native jsPDF portfolio generator.
 * - Vector text (selectable, crisp at any zoom)
 * - Editorial layout: cover, accent bars, two-column sections, tag chips
 * - Page headers/footers with page numbers
 * - Photos embedded as raster only where appropriate (avatar, logos, project covers)
 */

// ---------- Theme ----------
const THEME = {
  primary: [79, 70, 229] as [number, number, number],   // indigo-600
  accent: [168, 85, 247] as [number, number, number],   // purple-500
  pink: [236, 72, 153] as [number, number, number],
  ink: [15, 23, 42] as [number, number, number],        // slate-900
  body: [51, 65, 85] as [number, number, number],       // slate-700
  muted: [100, 116, 139] as [number, number, number],   // slate-500
  hair: [226, 232, 240] as [number, number, number],    // slate-200
  chipBg: [238, 242, 255] as [number, number, number],  // indigo-50
  pageBg: [255, 255, 255] as [number, number, number],
  coverBg: [248, 250, 252] as [number, number, number],
};

const M = { x: 18, top: 22, bottom: 20 }; // mm margins
const A4 = { w: 210, h: 297 };

// ---------- Helpers ----------
const stripHtml = (html: string | null | undefined) => {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || div.innerText || "").replace(/\s+/g, " ").trim();
};

async function urlToDataURL(url: string): Promise<{ data: string; type: "JPEG" | "PNG"; w: number; h: number } | null> {
  if (!url) return null;
  try {
    const res = await fetch(url, { mode: "cors" });
    const blob = await res.blob();
    const dataUrl: string = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
    const dims = await new Promise<{ w: number; h: number }>((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = () => resolve({ w: 1, h: 1 });
      img.src = dataUrl;
    });
    const type = dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG";
    return { data: dataUrl, type, w: dims.w, h: dims.h };
  } catch {
    return null;
  }
}

// ---------- Doc builder ----------
class Doc {
  pdf: jsPDF;
  y = M.top;
  pageNum = 1;
  name = "";
  tagline = "";

  constructor() {
    this.pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
  }

  setName(n: string, t: string) { this.name = n; this.tagline = t; }

  ensure(spaceNeeded: number) {
    if (this.y + spaceNeeded > A4.h - M.bottom) this.addPage();
  }

  addPage() {
    this.pdf.addPage();
    this.pageNum++;
    this.y = M.top;
    this.drawChrome();
  }

  drawChrome() {
    const p = this.pdf;
    // Top hairline + tiny name
    p.setDrawColor(...THEME.hair);
    p.setLineWidth(0.2);
    p.line(M.x, 12, A4.w - M.x, 12);
    p.setFontSize(8);
    p.setFont("helvetica", "bold");
    p.setTextColor(...THEME.primary);
    p.text(this.name.toUpperCase(), M.x, 9);
    p.setFont("helvetica", "normal");
    p.setTextColor(...THEME.muted);
    p.text(this.tagline, A4.w - M.x, 9, { align: "right" });

    // Footer
    p.setDrawColor(...THEME.hair);
    p.line(M.x, A4.h - 14, A4.w - M.x, A4.h - 14);
    p.setFontSize(8);
    p.setTextColor(...THEME.muted);
    p.text("nishanrahman.me", M.x, A4.h - 9);
    p.text(`Page ${this.pageNum}`, A4.w - M.x, A4.h - 9, { align: "right" });
  }

  sectionTitle(label: string) {
    this.ensure(18);
    const p = this.pdf;
    // Accent bar
    p.setFillColor(...THEME.primary);
    p.rect(M.x, this.y, 3, 7, "F");
    p.setFillColor(...THEME.accent);
    p.rect(M.x + 3, this.y, 3, 7, "F");
    p.setFont("helvetica", "bold");
    p.setFontSize(16);
    p.setTextColor(...THEME.ink);
    p.text(label.toUpperCase(), M.x + 10, this.y + 5.5);
    this.y += 11;
    // underline hairline
    p.setDrawColor(...THEME.hair);
    p.setLineWidth(0.2);
    p.line(M.x, this.y, A4.w - M.x, this.y);
    this.y += 5;
  }

  body(text: string, opts: { size?: number; color?: [number, number, number]; bold?: boolean; gap?: number; indent?: number; maxWidth?: number } = {}) {
    if (!text) return;
    const p = this.pdf;
    p.setFont("helvetica", opts.bold ? "bold" : "normal");
    p.setFontSize(opts.size ?? 10);
    p.setTextColor(...(opts.color ?? THEME.body));
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

  rule() {
    const p = this.pdf;
    this.ensure(4);
    p.setDrawColor(...THEME.hair);
    p.setLineWidth(0.2);
    p.line(M.x, this.y, A4.w - M.x, this.y);
    this.y += 3;
  }

  chips(items: string[]) {
    if (!items.length) return;
    const p = this.pdf;
    p.setFont("helvetica", "bold");
    p.setFontSize(8.5);
    const padX = 2.5, padY = 1.6, gap = 2, lh = 6;
    let x = M.x, lineY = this.y;
    this.ensure(lh + 2);
    for (const raw of items) {
      const txt = raw.trim();
      if (!txt) continue;
      const w = p.getTextWidth(txt) + padX * 2;
      if (x + w > A4.w - M.x) {
        x = M.x;
        lineY += lh + gap;
        this.ensure(lh + 2);
      }
      p.setFillColor(...THEME.chipBg);
      p.roundedRect(x, lineY, w, lh - 1, 1.5, 1.5, "F");
      p.setTextColor(...THEME.primary);
      p.text(txt, x + padX, lineY + 3.6);
      x += w + gap;
    }
    this.y = lineY + lh + 2;
  }

  async image(url: string, x: number, y: number, w: number, h: number, opts: { round?: boolean } = {}) {
    const img = await urlToDataURL(url);
    if (!img) return false;
    // Maintain aspect: cover
    const p = this.pdf;
    if (opts.round) {
      // jsPDF lacks clipping circles easily; draw image then a thin ring
      try { p.addImage(img.data, img.type, x, y, w, h, undefined, "FAST"); } catch {}
      p.setDrawColor(...THEME.primary);
      p.setLineWidth(0.6);
      p.circle(x + w / 2, y + h / 2, w / 2, "S");
    } else {
      try { p.addImage(img.data, img.type, x, y, w, h, undefined, "FAST"); } catch {}
    }
    return true;
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

  log("Designing PDF...");
  const doc = new Doc();
  doc.setName(h.name || "Portfolio", h.tagline || "");
  const pdf = doc.pdf;

  // ============ COVER PAGE ============
  // Full bleed gradient-like backdrop using stacked rectangles
  pdf.setFillColor(...THEME.coverBg);
  pdf.rect(0, 0, A4.w, A4.h, "F");
  // Decorative bands
  pdf.setFillColor(...THEME.primary);
  pdf.rect(0, 0, A4.w, 4, "F");
  pdf.setFillColor(...THEME.accent);
  pdf.rect(0, 4, A4.w, 1.5, "F");

  // Decorative corner block
  pdf.setFillColor(...THEME.primary);
  pdf.rect(A4.w - 60, 30, 60, 60, "F");
  pdf.setFillColor(...THEME.accent);
  pdf.rect(A4.w - 50, 40, 50, 50, "F");
  pdf.setFillColor(...THEME.pink);
  pdf.rect(A4.w - 40, 50, 40, 40, "F");

  // Avatar
  log("Loading profile image...");
  if (h.profile_image_url) {
    await doc.image(h.profile_image_url, M.x, 40, 50, 50, { round: true });
  }

  // Name & tagline
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(38);
  pdf.setTextColor(...THEME.ink);
  pdf.text(h.name || "Portfolio", M.x, 110);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(14);
  pdf.setTextColor(...THEME.primary);
  const taglineLines = pdf.splitTextToSize(h.tagline || "", A4.w - M.x * 2) as string[];
  let ty = 120;
  for (const l of taglineLines) { pdf.text(l, M.x, ty); ty += 6; }

  // Divider
  pdf.setDrawColor(...THEME.primary);
  pdf.setLineWidth(1.2);
  pdf.line(M.x, ty + 6, M.x + 40, ty + 6);

  // Contact block
  let cy = ty + 18;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(...THEME.muted);
  pdf.text("CONTACT", M.x, cy);
  cy += 6;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(...THEME.body);
  if (c.email) { pdf.text(`Email   ${c.email}`, M.x, cy); cy += 5.5; }
  if (c.phone) { pdf.text(`Phone   ${c.phone}`, M.x, cy); cy += 5.5; }
  pdf.text(`Web     nishanrahman.me`, M.x, cy); cy += 8;

  // Socials
  const socialItems: string[] = [];
  if (h.linkedin_url) socialItems.push(`LinkedIn: ${h.linkedin_url}`);
  if (h.github_url) socialItems.push(`GitHub: ${h.github_url}`);
  if (h.facebook_url) socialItems.push(`Facebook: ${h.facebook_url}`);
  if (h.instagram_url) socialItems.push(`Instagram: ${h.instagram_url}`);
  (social.data || []).forEach((s: any) => socialItems.push(`${s.label}: ${s.url}`));
  if (socialItems.length) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(...THEME.muted);
    pdf.text("LINKS", M.x, cy);
    cy += 6;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(...THEME.body);
    for (const s of socialItems.slice(0, 6)) {
      const lines = pdf.splitTextToSize(s, A4.w - M.x * 2) as string[];
      for (const line of lines) { pdf.text(line, M.x, cy); cy += 4.8; }
    }
  }

  // Bottom label
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(...THEME.primary);
  pdf.text("PORTFOLIO  •  " + new Date().getFullYear(), M.x, A4.h - 16);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(...THEME.muted);
  pdf.text("A curated overview of work, education, and experience.", M.x, A4.h - 11);

  // ============ CONTENT PAGES ============
  doc.addPage();

  // ABOUT
  if (a.content) {
    doc.sectionTitle("About");
    doc.body(stripHtml(a.content), { size: 10.5, gap: 4 });
  }

  // EDUCATION
  if (education.data?.length) {
    doc.sectionTitle("Education");
    for (const e of education.data as any[]) {
      doc.ensure(16);
      doc.body(e.degree || "", { bold: true, size: 11.5, color: THEME.ink, gap: 0.5 });
      doc.body(`${e.institution || ""} • ${e.duration || ""}`, { size: 9.5, color: THEME.muted, gap: 3 });
      if (e.description) doc.body(stripHtml(e.description), { size: 10, gap: 3 });
      doc.rule();
    }
  }

  // EXPERIENCE
  if (experiences.data?.length) {
    doc.sectionTitle("Experience");
    for (const e of experiences.data as any[]) {
      doc.ensure(18);
      doc.body(e.title || "", { bold: true, size: 11.5, color: THEME.ink, gap: 0.5 });
      doc.body(`${e.company || ""} • ${e.duration || ""}`, { size: 9.5, color: THEME.muted, gap: 3 });
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
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(s.skill_name);
    }
    for (const [cat, list] of Object.entries(grouped)) {
      doc.body(cat, { bold: true, size: 10.5, color: THEME.primary, gap: 1.5 });
      doc.chips(list);
    }
  }

  // PROJECTS
  if (projects.data?.length) {
    doc.sectionTitle("Projects");
    for (const p of projects.data as any[]) {
      doc.ensure(40);
      const cover = p.image_url || (Array.isArray(p.images) && p.images[0]) || "";
      const startY = doc.y;
      const imgW = 38, imgH = 26;
      let textX = M.x;
      let textW = A4.w - M.x * 2;
      if (cover) {
        await doc.image(cover, M.x, startY, imgW, imgH);
        textX = M.x + imgW + 5;
        textW = A4.w - M.x - textX;
      }
      // Title + desc area
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11.5);
      pdf.setTextColor(...THEME.ink);
      const titleLines = pdf.splitTextToSize(p.title || "", textW) as string[];
      let yy = startY + 4;
      for (const l of titleLines) { pdf.text(l, textX, yy); yy += 5; }
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9.5);
      pdf.setTextColor(...THEME.body);
      const descLines = pdf.splitTextToSize(stripHtml(p.description), textW) as string[];
      for (const l of descLines.slice(0, 4)) { pdf.text(l, textX, yy); yy += 4; }
      const blockBottom = Math.max(yy, startY + imgH);
      doc.y = blockBottom + 2;
      if ((p.tags || []).length) doc.chips(p.tags as string[]);
      if (p.link_url || p.github_url) {
        const links = [p.link_url && `Live: ${p.link_url}`, p.github_url && `Code: ${p.github_url}`].filter(Boolean) as string[];
        doc.body(links.join("    "), { size: 8.5, color: THEME.muted, gap: 2 });
      }
      doc.rule();
    }
  }

  // CERTIFICATES
  if (certificates.data?.length) {
    doc.sectionTitle("Certifications");
    // Two-column list
    const colW = (A4.w - M.x * 2 - 6) / 2;
    let col = 0;
    let rowY = doc.y;
    for (const cert of certificates.data as any[]) {
      const x = M.x + col * (colW + 6);
      // Estimate height
      const cardH = 18;
      if (col === 0) doc.ensure(cardH + 2);
      const yStart = col === 0 ? doc.y : rowY;
      pdf.setDrawColor(...THEME.hair);
      pdf.setLineWidth(0.2);
      pdf.roundedRect(x, yStart, colW, cardH, 1.5, 1.5, "S");
      pdf.setFillColor(...THEME.primary);
      pdf.rect(x, yStart, 1.5, cardH, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9.5);
      pdf.setTextColor(...THEME.ink);
      const tLines = pdf.splitTextToSize(cert.title || "", colW - 6) as string[];
      pdf.text(tLines.slice(0, 2), x + 4, yStart + 5);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.setTextColor(...THEME.muted);
      pdf.text(pdf.splitTextToSize(cert.issuer || "", colW - 6).slice(0, 1), x + 4, yStart + cardH - 3);
      if (col === 0) rowY = doc.y;
      col = col === 0 ? 1 : 0;
      if (col === 0) doc.y = rowY + cardH + 3;
    }
    if (col === 1) doc.y = rowY + 20;
  }

  // ACTIVITIES
  if (orgs.data?.length || extras.data?.length) {
    doc.sectionTitle("Activities & Involvement");
    if (extraContent.data?.content) doc.body(stripHtml(extraContent.data.content), { size: 10, gap: 3 });
    for (const o of (orgs.data || []) as any[]) {
      doc.ensure(14);
      doc.body(o.name + (o.short_name ? ` (${o.short_name})` : ""), { bold: true, size: 11, color: THEME.ink, gap: 0.5 });
      if (o.description) doc.body(stripHtml(o.description), { size: 9.5, gap: 2 });
      const orgRoles = (roles.data || []).filter((r: any) => r.organization_id === o.id);
      for (const r of orgRoles as any[]) {
        doc.body(r.role_name, { bold: true, size: 10, color: THEME.primary, indent: 4, gap: 1 });
        const roleTasks = (tasks.data || []).filter((t: any) => t.role_id === r.id);
        for (const t of roleTasks as any[]) {
          doc.body("•  " + t.title, { size: 9.5, color: THEME.body, indent: 8, gap: 0.5 });
        }
      }
      doc.rule();
    }
    for (const x of (extras.data || []) as any[]) {
      doc.body(x.title, { bold: true, size: 10.5, color: THEME.ink, gap: 0.5 });
      doc.body(x.organization || "", { size: 9.5, color: THEME.muted, gap: 3 });
    }
  }

  // EVENTS
  if (events.data?.length) {
    doc.sectionTitle("Events");
    for (const e of events.data as any[]) {
      doc.ensure(14);
      doc.body(e.title || "", { bold: true, size: 11, color: THEME.ink, gap: 0.5 });
      if (e.description) doc.body(stripHtml(e.description), { size: 9.5, gap: 3 });
      doc.rule();
    }
  }

  // CONTACT
  doc.sectionTitle("Get In Touch");
  if (c.heading) doc.body(c.heading, { bold: true, size: 12, color: THEME.ink, gap: 1 });
  if (c.description) doc.body(stripHtml(c.description), { size: 10, gap: 3 });
  if (c.email) doc.body(`Email: ${c.email}`, { size: 10, gap: 1 });
  if (c.phone) doc.body(`Phone: ${c.phone}`, { size: 10, gap: 1 });
  doc.body(`Website: https://nishanrahman.me`, { size: 10, gap: 3 });

  // Apply chrome to all non-cover pages
  const total = (pdf as any).internal.getNumberOfPages();
  for (let i = 2; i <= total; i++) {
    pdf.setPage(i);
    // Redraw chrome — done implicitly when addPage() called. For safety set page numbers footer:
    pdf.setDrawColor(...THEME.hair);
    pdf.setLineWidth(0.2);
    pdf.setFontSize(8);
    pdf.setTextColor(...THEME.muted);
    // Footer page indicator (overwrite to ensure correct numbering)
    pdf.setFillColor(255, 255, 255);
    pdf.rect(A4.w - M.x - 25, A4.h - 12, 25, 6, "F");
    pdf.text(`Page ${i - 1} / ${total - 1}`, A4.w - M.x, A4.h - 9, { align: "right" });
  }

  const filename = `${(h.name || "Portfolio").replace(/\s+/g, "_")}_Portfolio.pdf`;
  pdf.save(filename);
  log("Done!");
}
