
-- Enable pgvector for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Books table (one row per uploaded book)
CREATE TABLE public.chatbot_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing',
  chunk_count INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chatbot_books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage books"
ON public.chatbot_books
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone authenticated can view books"
ON public.chatbot_books
FOR SELECT
TO authenticated
USING (true);

CREATE TRIGGER update_chatbot_books_updated_at
BEFORE UPDATE ON public.chatbot_books
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Chunks with embeddings (768-dim for Gemini text-embedding-004)
CREATE TABLE public.chatbot_book_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES public.chatbot_books(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding vector(768),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chatbot_book_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage chunks"
ON public.chatbot_book_chunks
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX chatbot_book_chunks_embedding_idx
ON public.chatbot_book_chunks
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX chatbot_book_chunks_book_id_idx ON public.chatbot_book_chunks(book_id);

-- RPC for similarity search (used by edge function with service role)
CREATE OR REPLACE FUNCTION public.match_book_chunks(
  query_embedding vector(768),
  match_count INTEGER DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  similarity FLOAT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    c.id,
    c.content,
    1 - (c.embedding <=> query_embedding) AS similarity
  FROM public.chatbot_book_chunks c
  WHERE c.embedding IS NOT NULL
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Storage bucket for book PDFs (private, admins only)
INSERT INTO storage.buckets (id, name, public)
VALUES ('chatbot-books', 'chatbot-books', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins can upload book files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'chatbot-books' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read book files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'chatbot-books' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete book files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'chatbot-books' AND public.has_role(auth.uid(), 'admin'));
