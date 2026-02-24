-- =====================================================
-- MINI-CMS FAETERJ-RIO: Script de Configuração Supabase
-- =====================================================

-- 1. Criar a tabela 'posts'
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    author TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Criar índice para busca eficiente por slug
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);

-- 3. Criar índice para busca por status
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);

-- 4. Criar índice para ordenação por data
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- 5. Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Remover trigger se existir, depois criar
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;

CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Habilitar RLS (Row Level Security)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 7. Política: Permitir leitura pública de posts publicados
CREATE POLICY "Allow public read of published posts" 
ON posts 
FOR SELECT 
TO PUBLIC 
USING (status = 'published');

-- 8. Política: Permitir acesso total para usuários autenticados
CREATE POLICY "Allow full access for authenticated users" 
ON posts 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 9. STORAGE: Crie o bucket 'cms-images' manualmente no dashboard do Supabase
-- Acesse: Storage → New bucket → Nome: cms-images → Marque 'Public'
-- Depois configure as políticas de storage para upload (apenas autenticados) e leitura (pública)
