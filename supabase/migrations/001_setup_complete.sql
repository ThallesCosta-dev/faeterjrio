-- =====================================================
-- MINI-CMS FAETERJ-RIO: Setup Completo para Novo Projeto
-- =====================================================
-- 
-- Execute este SQL no novo projeto Supabase
-- URL: https://jjsyutdikbknlnudgwsx.supabase.co
-- =====================================================

-- Criar tipos enum
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer');
CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');

-- Criar tabela posts
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

-- Criar tabela profiles
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

-- Criar tabela audit_logs
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

-- Indexes
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_is_active ON profiles(is_active);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Função para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
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

-- RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas posts
CREATE POLICY "Posts são visíveis publicamente quando publicados" 
    ON posts FOR SELECT 
    USING (status = 'published');

CREATE POLICY "Usuários autenticados podem ver todos os posts" 
    ON posts FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Usuários autenticados podem gerenciar posts" 
    ON posts FOR ALL 
    TO authenticated 
    USING (true);

-- Políticas profiles
CREATE POLICY "Profiles são visíveis para usuários autenticados" 
    ON profiles FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Admins podem gerenciar todos os profiles" 
    ON profiles FOR ALL 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Políticas audit_logs
CREATE POLICY "Apenas admins podem ver audit_logs" 
    ON audit_logs FOR SELECT 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Criar admins com hash pré-calculado
CREATE OR REPLACE FUNCTION create_admin_with_hash(
    p_email TEXT,
    p_full_name TEXT,
    p_cpf TEXT,
    p_institutional_email TEXT,
    p_personal_email TEXT,
    p_phone TEXT,
    p_department TEXT,
    p_registration_number TEXT,
    p_course TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
DECLARE
    v_user_id UUID;
    v_existing_user_id UUID;
BEGIN
    -- Verificar se usuário já existe
    SELECT id INTO v_existing_user_id
    FROM auth.users
    WHERE email = p_email;
    
    IF v_existing_user_id IS NOT NULL THEN
        -- Atualizar usuário existente
        UPDATE auth.users
        SET 
            encrypted_password = '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEJH1x3GZNW0K7/0sO',
            raw_user_meta_data = json_build_object('full_name', p_full_name),
            email_confirmed_at = NOW(),
            updated_at = NOW()
        WHERE id = v_existing_user_id;
        
        v_user_id := v_existing_user_id;
    ELSE
        -- Criar novo usuário
        v_user_id := gen_random_uuid();
        
        INSERT INTO auth.users (
            id,
            instance_id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            v_user_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            p_email,
            '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEJH1x3GZNW0K7/0sO',
            NOW(),
            '{"provider":"email","providers":["email"]}',
            json_build_object('full_name', p_full_name),
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        );
    END IF;
    
    -- Criar/atualizar profile
    INSERT INTO public.profiles (
        id,
        full_name,
        cpf,
        institutional_email,
        personal_email,
        phone,
        department,
        registration_number,
        course,
        role,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        v_user_id,
        p_full_name,
        p_cpf,
        p_institutional_email,
        p_personal_email,
        p_phone,
        p_department,
        p_registration_number,
        p_course,
        'admin',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE 
    SET 
        full_name = p_full_name,
        cpf = p_cpf,
        institutional_email = p_institutional_email,
        personal_email = p_personal_email,
        phone = p_phone,
        department = p_department,
        registration_number = p_registration_number,
        course = p_course,
        role = 'admin',
        is_active = true,
        updated_at = NOW();
    
    RETURN 'Admin criado/atualizado: ' || p_email;
EXCEPTION WHEN OTHERS THEN
    RETURN 'ERRO: ' || SQLERRM;
END;
$$;

-- Criar Admin 1
SELECT create_admin_with_hash(
    'thalles.24104708360068@faeterj-rio.edu.br',
    'Thalles Costa de Souza',
    '123.456.789-00',
    'thalles.24104708360068@faeterj-rio.edu.br',
    'costa.thalles71@gmail.com',
    '(21) 98765-4321',
    'Tecnologia da Informação',
    '24104708360068',
    'CST em Sistemas de Computação'
);

-- Criar Admin 2
SELECT create_admin_with_hash(
    'costa.thalles71@gmail.com',
    'Thalles Costa',
    '987.654.321-00',
    'costa.thalles71@gmail.com',
    'costa.thalles71@gmail.com',
    '(21) 91234-5678',
    'Administração',
    '202500001',
    'CST em Gestão de TI'
);

-- Verificação final
SELECT 
    '✅ SETUP COMPLETO!' as status,
    COUNT(*) as total_admins
FROM profiles 
WHERE role = 'admin'
AND is_active = true;
