# Portfolio Documentation & Suggestions

A complete guide to everything you can manage from the **Admin Panel** of this portfolio, plus features commonly seen in top-tier portfolios that you could add next.

---

## 1. What you can currently add / manage

Open the admin panel at **`/admin`** (gear icon in the footer). All sections below are CMS-driven — edits appear on the live site immediately.

### Branding & Site
| Section | What you control |
| --- | --- |
| **Hero & Branding** | Logo, site title, your name, tagline, profile image, resume URL, social links, hero social icons. |
| **Navigation** | Menu labels, links, order, show/hide items, route vs anchor links. |
| **Theme & Colors** | Full color palette, gradients, fonts via theme presets — no code needed. |
| **SEO Settings** | Per-page meta title, description, keywords, OG image. |
| **Footer** | Copyright text & year toggle. |

### Content Sections
| Section | What you control |
| --- | --- |
| **About** | Rich-text bio (HTML). |
| **Education** | Degree, institution, duration, logos, links. |
| **Experience** | Job title, company, duration, description, logos, links, **highlight** ⭐ |
| **Skills** | Skill name, category, icon, logo image, link, **Technical / Soft** type, **highlight** ⭐ |
| **Certificates** | Title, issuer, image, link, hide/show, **highlight** ⭐ |
| **Projects** | Title, description, tags, images, videos, files, GitHub/client URLs, **highlight** ⭐ |
| **Activities** | Organization → Role → Task hierarchy, multiple images, video links (YT/FB/LinkedIn), files, **highlight** ⭐ |
| **Events** | Title, caption, multiple images, **highlight** ⭐ |
| **Achievements** | Title, issuer, date, description, multiple photos, video link, external link, **highlight** ⭐, hide/show |
| **Blog Posts** | Title, content (rich text), category, tags, images, videos, publish toggle, **highlight** ⭐ |
| **Contact** | Heading, description, email, phone — form sends to your inbox via Resend. |
| **Ads** | Custom HTML/script ads + Google AdSense management. |

### Homepage Highlights ⭐ (NEW)
Anything marked **highlighted** in the admin appears in the **Highlights** section on the homepage automatically — projects, certificates, activities, achievements, experience, events, skills, and blog posts. Toggle the star icon to feature/unfeature.

### Achievements page (hidden by default)
Lives at **`/achievements`**. Toggle it visible by adding it to **Navigation** when ready.

---

## 2. Suggested features to add next

Common in top portfolios, not yet in yours:

### Trust / credibility
- **Testimonials / Recommendations** — quote, author, role, photo, LinkedIn link.
- **Press & Media mentions** — logo wall of publications that featured you.
- **Clients / Brands worked with** — logo carousel.
- **Stats counters** — animated numbers (projects shipped, years experience, certifications, etc.).

### Engagement
- **Newsletter signup** (Resend + a `subscribers` table) — capture leads.
- **Guest book / wall** — visitors leave a public note.
- **"Now" page** — what you're currently working on, reading, learning (a popular trend).
- **Visitor counter / analytics dashboard** (Plausible, Umami, or Lovable analytics).
- **Comments on blog posts** (already in schema — needs UI).
- **Reactions / claps** on blog posts and projects.

### Discoverability
- **Search across the whole site** (Cmd+K command palette).
- **Tag / filter pages** for blog and projects.
- **RSS feed** for blog.
- **Auto-generated OG images** per blog post.

### Personalization
- **Light / dark / system theme toggle** (currently forced dark).
- **Language switcher** (i18n — English / Bangla).
- **Reading time** on blog posts.
- **Related posts / projects** recommendations.

### Professional add-ons
- **Public CV page** (`/cv`) — printable HTML version, not just PDF.
- **Speaking engagements** — talks, conferences, slides.
- **Publications / Research papers** with DOI links.
- **Open source contributions** — pulled live from GitHub API.
- **Spotify / Last.fm now-playing** widget.
- **Wakatime coding stats** widget.
- **Uptime / status page** for your services.

### Conversion
- **"Book a call" / Calendly embed** on Contact.
- **Service / pricing page** if you take on freelance work.
- **Case studies** — long-form project deep-dives with problem → process → outcome.

### Technical
- **Image gallery / lightbox** for events & achievements.
- **PWA support** — installable on phones, works offline.
- **Sitemap auto-generated** from DB (currently static).
- **Schema.org structured data** for blog posts, projects, person (partial today).
- **Web Vitals** monitoring.

---

## 3. How highlights work (technical note)

Each highlightable table has a `highlighted boolean` column. The homepage `<Highlights />` component fetches all rows where `highlighted = true` across:
`projects`, `certificates`, `activity_tasks`, `achievements`, `experiences`, `events`, `blog_posts`, `skills`.

Items are grouped by kind and rendered in a unified card grid with deep links back to their detail pages.

---

## 4. How skill types work

`skills.skill_type` is `'technical'` (default) or `'soft'`. The Skills page shows two tabs so visitors can switch between hard skills (tools, languages, frameworks) and soft skills (communication, leadership, teamwork).

Set the type from **Admin → Skills**.

---

_Last updated: when this file was generated._
