-- Simulados ENADE
-- Alunos não acessam estas tabelas diretamente: identificação, envio de respostas,
-- correção e IA passam pela Edge Function "simulado" (service role).
-- A equipe do CMS (admin/editor) gerencia tudo pelo painel.

CREATE TABLE IF NOT EXISTS public.simulados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descricao text,
  questoes jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'aberto' CHECK (status IN ('aberto', 'fechado')),
  ai_analise text,
  ai_analise_em timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.simulado_participantes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  simulado_id uuid NOT NULL REFERENCES public.simulados(id) ON DELETE CASCADE,
  email text NOT NULL,
  nome text,
  matricula text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (simulado_id, email)
);

CREATE TABLE IF NOT EXISTS public.simulado_respostas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  simulado_id uuid NOT NULL REFERENCES public.simulados(id) ON DELETE CASCADE,
  email text NOT NULL,
  respostas jsonb NOT NULL DEFAULT '{}'::jsonb,
  acertos int NOT NULL DEFAULT 0,
  total int NOT NULL DEFAULT 0,
  nota numeric(5,2) NOT NULL DEFAULT 0,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  ai_feedback text,
  ai_feedback_em timestamptz,
  UNIQUE (simulado_id, email)
);

-- Tópico e explicação do gabarito de cada questão ENADE ("examId:idx"), gerados por IA
-- a partir da imagem. Compartilhado entre simulados: cada questão só é analisada uma vez.
CREATE TABLE IF NOT EXISTS public.enade_questao_topicos (
  key text PRIMARY KEY,
  topico text NOT NULL,
  subtopico text,
  resumo text,
  explicacao text,
  modelo text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS simulado_participantes_simulado_idx ON public.simulado_participantes (simulado_id);
CREATE INDEX IF NOT EXISTS simulado_respostas_simulado_idx ON public.simulado_respostas (simulado_id);

ALTER TABLE public.simulados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulado_participantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulado_respostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enade_questao_topicos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Equipe gerencia simulados" ON public.simulados;
CREATE POLICY "Equipe gerencia simulados" ON public.simulados
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

DROP POLICY IF EXISTS "Equipe gerencia participantes" ON public.simulado_participantes;
CREATE POLICY "Equipe gerencia participantes" ON public.simulado_participantes
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

-- Respostas só são gravadas pela Edge Function (nota calculada no servidor).
-- A equipe pode ler e apagar (para liberar nova tentativa).
DROP POLICY IF EXISTS "Equipe lê respostas" ON public.simulado_respostas;
CREATE POLICY "Equipe lê respostas" ON public.simulado_respostas
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

DROP POLICY IF EXISTS "Equipe remove respostas" ON public.simulado_respostas;
CREATE POLICY "Equipe remove respostas" ON public.simulado_respostas
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

DROP POLICY IF EXISTS "Equipe lê tópicos" ON public.enade_questao_topicos;
CREATE POLICY "Equipe lê tópicos" ON public.enade_questao_topicos
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));
