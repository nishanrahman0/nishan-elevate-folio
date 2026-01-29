import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function fetchPortfolioData() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch all portfolio data in parallel
  const [
    heroResult,
    skillsResult,
    experiencesResult,
    activitiesResult,
    educationResult,
    certificatesResult,
    eventsResult,
    projectsResult,
    contactResult,
    aboutResult,
  ] = await Promise.all([
    supabase.from("hero_content").select("*").maybeSingle(),
    supabase.from("skills").select("*").order("display_order"),
    supabase.from("experiences").select("*").order("display_order"),
    supabase.from("extracurricular_activities").select("*").order("display_order"),
    supabase.from("education").select("*"),
    supabase.from("certificates").select("*").order("display_order"),
    supabase.from("events").select("*").order("display_order"),
    supabase.from("projects").select("*").order("display_order"),
    supabase.from("contact_content").select("*").maybeSingle(),
    supabase.from("about_content").select("*").maybeSingle(),
  ]);

  return {
    hero: heroResult.data,
    skills: skillsResult.data || [],
    experiences: experiencesResult.data || [],
    activities: activitiesResult.data || [],
    education: educationResult.data || [],
    certificates: certificatesResult.data || [],
    events: eventsResult.data || [],
    projects: projectsResult.data || [],
    contact: contactResult.data,
    about: aboutResult.data,
  };
}

function buildDynamicContext(data: any) {
  const hero = data.hero;
  const name = hero?.name || "Nishan Rahman";
  const tagline = hero?.tagline || "Data Analyst & AI Developer";

  // Group skills by category
  const skillsByCategory: Record<string, string[]> = {};
  data.skills.forEach((skill: any) => {
    if (!skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = [];
    }
    skillsByCategory[skill.category].push(skill.skill_name);
  });

  const skillsText = Object.entries(skillsByCategory)
    .map(([category, skills]) => `- ${category}: ${skills.join(", ")}`)
    .join("\n");

  // Format experiences
  const experiencesText = data.experiences
    .map((exp: any) => `- ${exp.title} at ${exp.company} (${exp.duration}): ${exp.description.replace(/<[^>]*>/g, '')}`)
    .join("\n");

  // Format activities  
  const activitiesText = data.activities
    .map((act: any) => `- ${act.title} at ${act.organization}`)
    .join("\n");

  // Format education
  const educationText = data.education
    .map((edu: any) => `- ${edu.degree} from ${edu.institution} (${edu.duration})`)
    .join("\n");

  // Format certificates
  const certificatesText = data.certificates
    .map((cert: any) => `- ${cert.title} by ${cert.issuer}`)
    .join("\n");

  // Format events
  const eventsText = data.events
    .map((evt: any) => `- ${evt.title}: ${evt.description.replace(/<[^>]*>/g, '')}`)
    .join("\n");

  // Format projects
  const projectsText = data.projects
    .map((proj: any) => `- ${proj.title}: ${proj.description.replace(/<[^>]*>/g, '')}`)
    .join("\n");

  const contact = data.contact;
  const contactText = contact
    ? `Email: ${contact.email || "Not provided"}, Phone: ${contact.phone || "Not provided"}`
    : "Contact information available on the website";

  const aboutText = data.about?.content?.replace(/<[^>]*>/g, '') || "";

  return `You are the AI assistant for ${name}'s portfolio website. Answer questions accurately and specifically based on the ACTUAL portfolio data below. NEVER say you don't have specific information if it's provided below.

## Personal Information:
- Full Name: ${name}
- Role/Tagline: ${tagline}
- Email: ${contact?.email || "mdnishanrahman0@gmail.com"}
${contact?.phone ? `- Phone: ${contact.phone}` : ""}

## About:
${aboutText || "A passionate professional focused on data analytics and AI development."}

## Education:
${educationText || "Currently studying at University of Rajshahi, Bangladesh"}

## Skills by Category:
${skillsText || "Various technical and professional skills"}

## Professional Experience:
${experiencesText || "Building experience in data analytics and AI"}

## Extracurricular Activities:
${activitiesText || "Active in various clubs and organizations"}

## Certifications:
${certificatesText || "Various professional certifications"}

## Events & Workshops Attended:
${eventsText || "Participated in various workshops and seminars"}

## Projects:
${projectsText || "Working on various data analytics and AI projects"}

## Contact Information:
${contactText}

## Social Media:
- LinkedIn: ${hero?.linkedin_url || "linkedin.com/in/nishanrahmanrumgt/"}
- GitHub: ${hero?.github_url || "github.com/nishanrahman0"}
- Facebook: ${hero?.facebook_url || "facebook.com/nishan.rahman.2024"}
- Instagram: ${hero?.instagram_url || "instagram.com/mdnishanrahman"}

## Response Guidelines:
- Be helpful, specific, and friendly
- ALWAYS use the actual data provided above to answer questions
- For activities questions, list the SPECIFIC activities from the data above
- For skills questions, list the SPECIFIC skills by category
- For experience questions, describe the SPECIFIC roles and companies
- Keep responses conversational but informative
- If asked about something not in the data, politely say you don't have that specific information`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Fetch real portfolio data from database
    const portfolioData = await fetchPortfolioData();
    const dynamicContext = buildDynamicContext(portfolioData);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: dynamicContext },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
