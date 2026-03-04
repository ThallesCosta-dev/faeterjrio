-- Migration: Suporte a múltiplos anexos (PDF) por post

-- 1) Tabela de anexos
CREATE TABLE IF NOT EXISTS public.post_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_post_attachments_post_id ON public.post_attachments(post_id);

-- 2) RLS
ALTER TABLE public.post_attachments ENABLE ROW LEVEL SECURITY;

-- 3) Policies
-- Leitura pública somente para anexos de posts publicados
DROP POLICY IF EXISTS "Post attachments public read" ON public.post_attachments;
CREATE POLICY "Post attachments public read"
ON public.post_attachments
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.posts p
    WHERE p.id = post_id
      AND p.status = 'published'
  )
);

-- Admins e editors gerenciam anexos
DROP POLICY IF EXISTS "Admins e editors gerenciam anexos" ON public.post_attachments;
CREATE POLICY "Admins e editors gerenciam anexos"
ON public.post_attachments
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'editor')
  )
);
