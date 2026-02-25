-- =====================================================
-- FAETERJ-RIO: Complete Database Setup (Clean Version)
-- =====================================================
-- 
-- Script único para criar o banco de dados do zero
-- Após executar, pode apagar todos os outros .sqls
-- =====================================================

-- 1. Habilitar extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Criar tabelas
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE,
    full_name TEXT,
    institutional_email TEXT,
    role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT DEFAULT '',
    cover_image TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    author TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Índices
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_profiles_email ON profiles(email);

-- 4. Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Habilitar RLS e criar políticas simples
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Profiles públicos" ON profiles FOR SELECT USING (true);
CREATE POLICY "Admins gerenciam profiles" ON profiles FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Posts
CREATE POLICY "Posts públicos" ON posts FOR SELECT USING (status = 'published');
CREATE POLICY "Admins e editors gerenciam posts" ON posts FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

-- 6. Storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('cms-images', 'cms-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage políticas
CREATE POLICY "Upload autenticado" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'cms-images' AND auth.role() = 'authenticated');

CREATE POLICY "Imagens públicas" ON storage.objects FOR SELECT
USING (bucket_id = 'cms-images');

CREATE POLICY "Admins gerenciam imagens" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'cms-images' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 7. Usuário admin inicial
INSERT INTO profiles (email, full_name, institutional_email, role)
VALUES ('admin@faeterj-rio.edu.br', 'Administrador', 'admin@faeterj-rio.edu.br', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 8. Verificação
SELECT 'Database criado com sucesso!' as status;
