import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function retrieveBookContext(query: string, apiKey: string): Promise<string> {
  try {
    // Embed the query
    const embResp = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "google/text-embedding-004", input: query }),
    });
    if (!embResp.ok) {
      console.error("Embed query failed", await embResp.text());
      return "";
    }
    const embData = await embResp.json();
    const queryEmbedding = embData.data[0].embedding;

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await admin.rpc("match_book_chunks", {
      query_embedding: queryEmbedding,
      match_count: 5,
    });
    if (error) {
      console.error("match_book_chunks error:", error);
      return "";
    }
    if (!data || data.length === 0) return "";
    return data
      .map((c: any, i: number) => `[Excerpt ${i + 1}]\n${c.content}`)
      .join("\n\n");
  } catch (e) {
    console.error("retrieveBookContext error:", e);
    return "";
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid messages" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (body.messages.length > 50) {
      return new Response(JSON.stringify({ error: "Too many messages" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    for (const m of body.messages) {
      if (!m || typeof m.role !== "string" || typeof m.content !== "string") {
        return new Response(JSON.stringify({ error: "Malformed message" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (m.content.length > 4000) {
        return new Response(JSON.stringify({ error: "Message too long (max 4000 chars)" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }
    const messages = body.messages;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Get the most recent user query for retrieval
    const lastUser = [...messages].reverse().find((m: any) => m.role === "user");
    const bookContext = lastUser ? await retrieveBookContext(lastUser.content, LOVABLE_API_KEY) : "";

    const baseSystemPrompt = `You are a helpful AI assistant for Jovita Hub, a platform that connects script writers and video editors to create impactful short-form videos for social causes.

Key information about Jovita Hub:
- Script writers can earn $300-500 per month base fee plus sales commissions
- Video editors can earn $700-900 per month base fee plus sales commissions
- Combined script/video creators can earn $1000-1400 per month
- Sales commissions are $0.50 per video for first 100k sales, $1.00 for 100k-500k, $1.50 for 500k-1M, $2.00 for over 1M
- Creators keep intellectual property rights
- 10% of revenue goes to charity
- Platform facilitates collaboration between writers and editors
- Content focuses on storytelling and social impact

Answer questions clearly and concisely. If you don't know something specific about policies or technical details, be honest and suggest contacting support.`;

    const systemPrompt = bookContext
      ? `${baseSystemPrompt}\n\nYou also have access to the following excerpts from a reference book uploaded by the team. When the user's question relates to this content, prioritize answering from these excerpts and cite them as "the book". If the excerpts don't cover the question, fall back to your general knowledge of Jovita Hub.\n\n=== BOOK EXCERPTS ===\n${bookContext}\n=== END BOOK EXCERPTS ===`
      : baseSystemPrompt;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
