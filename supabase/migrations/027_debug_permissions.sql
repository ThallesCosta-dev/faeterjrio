-- =====================================================
-- MINI-CMS FAETERJ-RIO: Debug Permissions
-- =====================================================
-- 
-- Script para diagnosticar problemas de permissão
-- Execute este script no SQL Editor do Supabase para debug
-- =====================================================

-- 1. Verificar todos os usuários e seus roles
SELECT 
    'USUÁRIOS CADASTRADOS' as info,
    p.id,
    p.full_name,
    p.institutional_email,
    p.role,
    p.is_active,
    au.email as auth_email,
    au.created_at as auth_created_at
FROM profiles p
LEFT JOIN auth.users au ON p.id = au.id
ORDER BY p.role, p.full_name;

-- 2. Verificar políticas da tabela profiles
SELECT 
    'POLÍTICAS DA TABELA PROFILES' as info,
    policyname,
    permissive,
    cmd as command,
    roles,
    qual as condition,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY cmd, policyname;

-- 3. Verificar se RLS está ativo
SELECT 
    'STATUS RLS' as info,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'profiles';

-- 4. Testar permissão do usuário atual
SELECT 
    'PERMISSÕES DO USUÁRIO ATUAL' as info,
    auth.uid() as current_user_id,
    p.role as user_role,
    p.full_name as user_name,
    CASE 
        WHEN p.role = 'admin' THEN '✅ Tem permissão para gerenciar usuários'
        WHEN p.role = 'editor' THEN '⚠️ Editor: pode gerenciar posts, mas não usuários'
        WHEN p.role = 'viewer' THEN '⚠️ Viewer: apenas visualização'
        ELSE '❌ Role não reconhecido'
    END as permission_level
FROM profiles p
WHERE p.id = auth.uid();

-- 5. Verificar se há alguma política que bloqueia UPDATE/DELETE
SELECT 
    'ANÁLISE DE POLÍTICAS' as info,
    policyname,
    cmd,
    CASE 
        WHEN cmd IN ('UPDATE', 'DELETE') AND 
             qual LIKE '%admin%' THEN 
             '✅ Política correta para ' || cmd
        WHEN cmd IN ('UPDATE', 'DELETE') AND 
             qual NOT LIKE '%admin%' THEN 
             '❌ Política pode estar bloqueando ' || cmd
        ELSE 'ℹ️ Política para ' || cmd
    END as analysis
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY cmd;

-- 6. Verificar se o problema está na tabela auth.users
SELECT 
    'TABELA AUTH.USERS' as info,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('users', 'auth.users')
UNION ALL
SELECT 
    'POLÍTICAS AUTH.USERS' as info,
    policyname::text,
    cmd::text
FROM pg_policies 
WHERE tablename = 'users';
