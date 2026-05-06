import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

function chunkText(text: string, chunkSize = 1000, overlap = 150): string[] {
  const cleaned = text.replace(/\s+/g, " ").trim();
  const chunks: string[] = [];
  let i = 0;
  while (i < cleaned.length) {
    let end = Math.min(i + chunkSize, cleaned.length);
    if (end < cleaned.length) {
      const slice = cleaned.slice(i, end);
      const lastPeriod = Math.max(
        slice.lastIndexOf(". "),
        slice.lastIndexOf("? "),
        slice.lastIndexOf("! "),
        slice.lastIndexOf("。"),
        slice.lastIndexOf("！"),
        slice.lastIndexOf("？"),
      );
      if (lastPeriod > chunkSize * 0.5) end = i + lastPeriod + 1;
    }
    chunks.push(cleaned.slice(i, end).trim());
    i = end - overlap;
    if (i < 0) i = 0;
  }
  return chunks.filter((c) => c.length > 30);
}

async function embedBatch(texts: string[]): Promise<number[][]> {
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/text-embedding-004",
      input: texts,
    }),
  });
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`Embedding failed [${resp.status}]: ${t}`);
  }
  const data = await resp.json();
  return data.data.map((d: any) => d.embedding);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  let bookIdForError: string | null = null;
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: roleData } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admins only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { bookId, text } = body;
    bookIdForError = bookId ?? null;

    if (!bookId || typeof bookId !== "string") {
      return new Response(JSON.stringify({ error: "bookId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!text || typeof text !== "string" || text.trim().length < 100) {
      return new Response(JSON.stringify({ error: "text required (min 100 chars)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: book, error: bookErr } = await admin
      .from("chatbot_books")
      .select("*")
      .eq("id", bookId)
      .single();
    if (bookErr || !book) throw new Error("Book not found");

    // One-book-at-a-time: wipe older books
    const { data: olderBooks } = await admin
      .from("chatbot_books")
      .select("id, file_path")
      .neq("id", bookId);
    if (olderBooks && olderBooks.length > 0) {
      const oldIds = olderBooks.map((b) => b.id);
      const oldPaths = olderBooks.map((b) => b.file_path).filter(Boolean);
      await admin.from("chatbot_books").delete().in("id", oldIds);
      if (oldPaths.length) await admin.storage.from("chatbot-books").remove(oldPaths);
    }

    const chunks = chunkText(text);
    console.log(`Book ${book.title}: ${chunks.length} chunks from ${text.length} chars`);

    const BATCH = 50;
    let inserted = 0;
    for (let i = 0; i < chunks.length; i += BATCH) {
      const batch = chunks.slice(i, i + BATCH);
      const embeddings = await embedBatch(batch);
      const rows = batch.map((content, idx) => ({
        book_id: bookId,
        chunk_index: i + idx,
        content,
        embedding: embeddings[idx] as any,
      }));
      const { error: insErr } = await admin.from("chatbot_book_chunks").insert(rows);
      if (insErr) throw new Error(`Insert chunks failed: ${insErr.message}`);
      inserted += rows.length;
    }

    await admin
      .from("chatbot_books")
      .update({ status: "ready", chunk_count: inserted, error_message: null })
      .eq("id", bookId);

    return new Response(JSON.stringify({ success: true, chunks: inserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ingest-book error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (bookIdForError) {
      try {
        const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        await admin
          .from("chatbot_books")
          .update({ status: "failed", error_message: msg })
          .eq("id", bookIdForError);
      } catch {}
    }
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
