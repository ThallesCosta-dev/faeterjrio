-- =====================================================
-- MINI-CMS FAETERJ-RIO: Ensure RLS Enabled
-- =====================================================
-- 
-- Garante que RLS esteja habilitado na tabela profiles
-- e verifica o estado atual das permissões
-- =====================================================

-- Habilitar RLS na tabela profiles (se não estiver)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Verificar se RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'profiles';

-- Verificar políticas atuais
SELECT 
    'POLÍTICAS ATUAIS' as info,
    policyname,
    permissive,
    cmd,
    roles
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY cmd, policyname;

-- Verificar usuário atual e seu role (para debug)
SELECT 
    'USUÁRIO ATUAL' as info,
    auth.uid() as user_id,
    p.role,
    p.full_name,
    p.is_active
FROM profiles p
WHERE p.id = auth.uid();

-- Teste de permissão: Verificar se usuário atual pode gerenciar profiles
SELECT 
    'TESTE DE PERMISSÃO' as info,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        ) THEN '✅ Usuário atual pode gerenciar profiles'
        ELSE '❌ Usuário atual NÃO pode gerenciar profiles'
    END as permission_status;
