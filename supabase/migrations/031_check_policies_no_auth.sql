-- =====================================================
-- MINI-CMS FAETERJ-RIO: Check Policies Without Auth
-- =====================================================
-- 
-- Verifica as políticas sem depender de usuário autenticado
-- Cria política que permite operações para teste
-- =====================================================

-- 1. Verificar políticas atuais
SELECT 
    'POLÍTICAS ATUAIS' as status,
    policyname,
    permissive,
    cmd,
    roles,
    qual as condition,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY cmd, policyname;

-- 2. Verificar se RLS está habilitado
SELECT 
    'STATUS RLS' as info,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'profiles';

-- 3. Remover política existente se houver
DROP POLICY IF EXISTS "Permitir todas as operações para usuários autenticados" ON profiles;

-- 4. Criar política mais permissiva para teste
CREATE POLICY "Permitir operações para teste" 
    ON profiles FOR ALL 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

-- 5. Verificar se a política foi criada
SELECT 
    'POLÍTICA CRIADA' as status,
    policyname,
    cmd,
    '✅ Política de teste criada com sucesso' as result
FROM pg_policies 
WHERE tablename = 'profiles' AND policyname = 'Permitir operações para teste';

-- 6. Listar todos os usuários para verificar
SELECT 
    'USUÁRIOS NA TABELA PROFILES' as info,
    id,
    full_name,
    institutional_email,
    role,
    is_active,
    created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 10;

-- 7. Verificar estrutura da tabela
SELECT 
    'ESTRUTURA DA TABELA PROFILES' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;
