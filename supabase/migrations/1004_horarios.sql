-- Grade de horários publicada pelo CMS (upload do PDF gerado pelo Coruja).
-- Pode ser executado mesmo que uma versão anterior deste script já tenha sido aplicada:
-- as políticas antigas, que deixavam qualquer usuário logado alterar a grade, são substituídas.

CREATE TABLE IF NOT EXISTS public.horarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  periodo_letivo text NOT NULL,
  curso text NOT NULL,
  data jsonb NOT NULL,
  pdf_name text,
  pdf_path text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_horarios_active ON public.horarios (is_active) WHERE is_active = true;

ALTER TABLE public.horarios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins e editors podem inserir horários" ON public.horarios;
DROP POLICY IF EXISTS "Admins e editors podem atualizar horários" ON public.horarios;
DROP POLICY IF EXISTS "Leitura pública de horários ativos" ON public.horarios;
DROP POLICY IF EXISTS "Equipe gerencia horários" ON public.horarios;

CREATE POLICY "Leitura pública de horários ativos" ON public.horarios
  FOR SELECT USING (is_active = true);

CREATE POLICY "Equipe gerencia horários" ON public.horarios
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

CREATE OR REPLACE FUNCTION public.handle_horarios_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_horarios_update ON public.horarios;
CREATE TRIGGER on_horarios_update
  BEFORE UPDATE ON public.horarios
  FOR EACH ROW EXECUTE FUNCTION public.handle_horarios_updated_at();
