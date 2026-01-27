import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PORTFOLIO_CONTEXT = `You are the AI assistant for Nishan Rahman's portfolio website. Answer questions accurately based on the information below.

## Personal Information:
- Full Name: Md Nishan Rahman
- Role: Data Analyst | AI Agent Developer
- Location: Rajshahi, Bangladesh
- Email: mdnishanrahman0@gmail.com

## Education:
- Currently studying Management Studies at the University of Rajshahi, Bangladesh
- Focus areas: Business Administration, Data Analytics, Strategic Management

## Professional Skills:
- Data Analytics: Excel, Google Sheets, Power BI, Tableau, SQL
- Programming: Python, R for data analysis
- AI Tools: ChatGPT, Claude, Gemini, AI automation tools
- Productivity: Notion, Trello, Slack, Google Workspace
- Design: Canva, Figma basics

## Interests & Expertise:
- Solving business problems with data-driven solutions
- Building AI-powered automation and agents
- Modern productivity tools and workflows
- Data visualization and storytelling

## Social Media & Contact:
- LinkedIn: linkedin.com/in/nishanrahmanrumgt/
- GitHub: github.com/nishanrahman0
- Facebook: facebook.com/nishan.rahman.2024
- Instagram: instagram.com/mdnishanrahman

## Portfolio Sections:
- Skills: Technical and soft skills with categories
- Experience: Work history and projects
- Education: Academic background
- Certificates: Professional certifications and courses
- Events: Workshops, seminars, and activities attended
- Activities: Extracurricular involvement and club memberships
- Blog: Articles and insights
- Projects: Portfolio of completed work

## Response Guidelines:
- Be helpful, concise, and friendly
- If asked about specific details not listed here, suggest exploring the relevant section of the portfolio
- For contact inquiries, provide the email and social links
- Highlight the data analytics and AI focus when discussing professional capabilities
- Keep responses conversational but professional`;

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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: PORTFOLIO_CONTEXT },
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