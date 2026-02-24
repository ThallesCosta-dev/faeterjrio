-- =====================================================
-- MINI-CMS FAETERJ-RIO: Corrigir Recursão RLS
-- =====================================================
-- 
-- Remove políticas que causam recursão infinita
-- e cria políticas simplificadas
-- =====================================================

-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "Posts são visíveis publicamente quando publicados" ON posts;
DROP POLICY IF EXISTS "Usuários autenticados podem ver todos os posts" ON posts;
DROP POLICY IF EXISTS "Usuários autenticados podem gerenciar posts" ON posts;
DROP POLICY IF EXISTS "Profiles são visíveis para usuários autenticados" ON profiles;
DROP POLICY IF EXISTS "Admins podem gerenciar todos os profiles" ON profiles;
DROP POLICY IF EXISTS "Apenas admins podem ver audit_logs" ON audit_logs;

-- Criar políticas simplificadas para posts
CREATE POLICY "Posts públicos visíveis a todos" 
    ON posts FOR SELECT 
    USING (status = 'published');

CREATE POLICY "Usuários autenticados podem gerenciar posts" 
    ON posts FOR ALL 
    TO authenticated 
    USING (true);

-- Criar políticas simplificadas para profiles
CREATE POLICY "Profiles visíveis a usuários autenticados" 
    ON profiles FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Admins podem gerenciar profiles" 
    ON profiles FOR ALL 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND email IN (
                'thalles.24104708360068@faeterj-rio.edu.br',
                'costa.thalles71@gmail.com',
                'editor@faeterj-rio.edu.br',
                'viewer@faeterj-rio.edu.br'
            )
        )
    );

-- Criar políticas para audit_logs
CREATE POLICY "Admins podem ver audit_logs" 
    ON audit_logs FOR SELECT 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND email IN (
                'thalles.24104708360068@faeterj-rio.edu.br',
                'costa.thalles71@gmail.com',
                'editor@faeterj-rio.edu.br',
                'viewer@faeterj-rio.edu.br'
            )
        )
    );

-- Verificar políticas criadas
SELECT 
    'POLÍTICAS RECONSTRUÍDAS' as status,
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd,
    roles,
    '✅' as ok
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
