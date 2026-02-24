-- =====================================================
-- MINI-CMS FAETERJ-RIO: Debug de Acesso ao Dashboard
-- =====================================================
-- 
-- Execute este SQL para verificar se há problemas
-- de permissão ou dados que impedem o acesso
-- =====================================================

-- Verificar se o usuário está logado e tem permissão
SELECT 
    'VERIFICAÇÃO DE ACESSO' as status,
    au.email,
    p.role,
    p.is_active,
    CASE 
        WHEN p.role = 'admin' THEN '✅ Pode acessar Dashboard'
        WHEN p.role = 'editor' THEN '✅ Pode acessar Dashboard'
        WHEN p.role = 'viewer' THEN '❌ Não pode acessar Dashboard'
        ELSE '❓ Role desconhecido'
    END as acesso_dashboard,
    CASE 
        WHEN p.role = 'admin' THEN '✅ Pode criar posts'
        WHEN p.role = 'editor' THEN '✅ Pode criar posts'
        WHEN p.role = 'viewer' THEN '❌ Não pode criar posts'
        ELSE '❓'
    END as pode_criar_posts
FROM auth.users au
JOIN profiles p ON au.id = p.id
WHERE au.email IN (
    'thalles.24104708360068@faeterj-rio.edu.br', 
    'costa.thalles71@gmail.com',
    'editor@faeterj-rio.edu.br',
    'viewer@faeterj-rio.edu.br'
)
ORDER BY p.role, au.email;

-- Verificar se há posts para testar
SELECT 
    'POSTS EXISTENTES' as status,
    COUNT(*) as total_posts,
    COUNT(CASE WHEN status = 'published' THEN 1 END) as publicados,
    COUNT(CASE WHEN status = 'draft' THEN 1 END) as rascunhos
FROM posts;

-- Verificar configuração do Supabase
SELECT 
    'CONFIGURAÇÃO' as status,
    'RLS Habilitado' as config,
    CASE 
        WHEN rowsecurity = true THEN '✅ Ativo'
        ELSE '❌ Inativo'
    END as status_rls
FROM pg_tables 
WHERE tablename = 'posts'
AND schemaname = 'public';

-- Verificar políticas RLS existentes
SELECT 
    'POLÍTICAS RLS' as status,
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd,
    roles,
    '✅' as ok
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename = 'posts'
ORDER BY policyname;
