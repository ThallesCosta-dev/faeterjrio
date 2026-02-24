-- =====================================================
-- MINI-CMS FAETERJ-RIO: RESET TOTAL E SETUP COMPLETO
-- =====================================================
-- Este script:
-- 1. Remove todas as tabelas existentes
-- 2. Recria a estrutura completa
-- 3. Cria dois usuários admin com dados mock
--
-- SENHA PARA AMBOS: admin123 (6+ caracteres)
-- =====================================================

-- ============================================
-- PARTE 1: LIMPAR TUDO (DROP EVERYTHING)
-- ============================================

-- Desativar RLS temporariamente para limpeza
ALTER TABLE IF EXISTS audit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;

-- Dropar tabelas
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Dropar funções
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS create_admin_user() CASCADE;
DROP FUNCTION IF EXISTS setup_admin_account() CASCADE;
DROP FUNCTION IF EXISTS create_admin_v2() CASCADE;

-- Dropar tipos
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS post_status CASCADE;

-- ============================================
-- PARTE 2: CRIAR TIPOS ENUM
-- ============================================

CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer');
CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');

-- ============================================
-- PARTE 3: CRIAR TABELAS
-- ============================================

-- Tabela posts
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    author TEXT NOT NULL,
    status post_status DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela profiles (perfil de usuários)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    cpf TEXT,
    institutional_email TEXT,
    personal_email TEXT,
    phone TEXT,
    department TEXT,
    registration_number TEXT,
    course TEXT,
    role user_role DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela audit_logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PARTE 4: INDEXES E TRIGGERS
-- ============================================

-- Indexes para posts
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_slug ON posts(slug);

-- Indexes para profiles
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_is_active ON profiles(is_active);

-- Indexes para audit_logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para criar profile automaticamente
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role, is_active)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'viewer')::user_role,
        true
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger no auth.users (se tiver permissão)
-- Nota: Isso pode falhar sem superuser, então é opcional
DO $$
BEGIN
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW
        EXECUTE FUNCTION handle_new_user();
EXCEPTION WHEN insufficient_privilege THEN
    RAISE NOTICE 'Sem permissão para criar trigger em auth.users - profile precisará ser criado manualmente';
END $$;

-- ============================================
-- PARTE 5: ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para posts
CREATE POLICY "Posts são visíveis publicamente quando publicados" 
    ON posts FOR SELECT 
    USING (status = 'published');

CREATE POLICY "Usuários autenticados podem ver todos os posts" 
    ON posts FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Usuários autenticados podem criar posts" 
    ON posts FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar posts" 
    ON posts FOR UPDATE 
    TO authenticated 
    USING (true);

CREATE POLICY "Usuários autenticados podem deletar posts" 
    ON posts FOR DELETE 
    TO authenticated 
    USING (true);

-- Políticas para profiles
CREATE POLICY "Profiles são visíveis para usuários autenticados" 
    ON profiles FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Usuários podem atualizar seu próprio profile" 
    ON profiles FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = id);

CREATE POLICY "Admins podem gerenciar todos os profiles" 
    ON profiles FOR ALL 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Políticas para audit_logs
CREATE POLICY "Apenas admins podem ver audit_logs" 
    ON audit_logs FOR SELECT 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================
-- PARTE 6: CRIAR USUÁRIOS ADMIN (VIA API DO SUPABASE)
-- ============================================
-- NOTA: Como não podemos inserir diretamente em auth.users,
-- você deve executar os comandos abaixo via API ou Dashboard
--
-- ALTERNATIVA: Use a página /admin/setup após rodar este SQL
--
-- OU crie pelo Dashboard:
-- 1. Authentication > Users > Add User
-- 2. Email: thalles.24104708360068@faeterj-rio.edu.br
--    Password: admin123
-- 3. Email: costa.thalles71@gmail.com
--    Password: admin123
-- 4. Depois execute o SQL abaixo para atualizar os profiles:

-- ============================================
-- PARTE 7: SQL PARA ATUALIZAR PROFILES APÓS CRIAR USUÁRIOS
-- ============================================

-- Atualizar profile do primeiro admin
INSERT INTO profiles (
    id, full_name, cpf, institutional_email, personal_email,
    phone, department, registration_number, course, role, is_active
)
SELECT 
    au.id,
    'Thalles Costa de Souza',
    '123.456.789-00',
    'thalles.24104708360068@faeterj-rio.edu.br',
    'costa.thalles71@gmail.com',
    '(21) 98765-4321',
    'Tecnologia da Informação',
    '24104708360068',
    'CST em Sistemas de Computação',
    'admin',
    true
FROM auth.users au
WHERE au.email = 'thalles.24104708360068@faeterj-rio.edu.br'
ON CONFLICT (id) DO UPDATE 
SET 
    full_name = 'Thalles Costa de Souza',
    cpf = '123.456.789-00',
    institutional_email = 'thalles.24104708360068@faeterj-rio.edu.br',
    personal_email = 'costa.thalles71@gmail.com',
    phone = '(21) 98765-4321',
    department = 'Tecnologia da Informação',
    registration_number = '24104708360068',
    course = 'CST em Sistemas de Computação',
    role = 'admin',
    is_active = true,
    updated_at = NOW();

-- Atualizar profile do segundo admin
INSERT INTO profiles (
    id, full_name, cpf, institutional_email, personal_email,
    phone, department, registration_number, course, role, is_active
)
SELECT 
    au.id,
    'Thalles Costa',
    '987.654.321-00',
    'costa.thalles71@gmail.com',
    'costa.thalles71@gmail.com',
    '(21) 91234-5678',
    'Administração',
    '202500001',
    'CST em Gestão',
    'admin',
    true
FROM auth.users au
WHERE au.email = 'costa.thalles71@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET 
    full_name = 'Thalles Costa',
    cpf = '987.654.321-00',
    institutional_email = 'costa.thalles71@gmail.com',
    personal_email = 'costa.thalles71@gmail.com',
    phone = '(21) 91234-5678',
    department = 'Administração',
    registration_number = '202500001',
    course = 'CST em Gestão',
    role = 'admin',
    is_active = true,
    updated_at = NOW();

-- ============================================
-- PARTE 8: VERIFICAÇÃO
-- ============================================

SELECT 
    'DATABASE RECRIADA COM SUCESSO!' as status,
    'Execute /admin/setup ou crie usuários no Dashboard' as proximo_passo;

-- Ver estrutura criada
SELECT 
    table_name,
    'CRIADA' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('posts', 'profiles', 'audit_logs')
ORDER BY table_name;
