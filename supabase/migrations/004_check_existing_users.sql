-- =====================================================
-- MINI-CMS FAETERJ-RIO: Verificar Usuários Existentes
-- =====================================================
-- 
-- Execute este script para ver quais usuários existem
-- e qual o status atual
-- =====================================================

-- Verificar usuários em auth.users
SELECT 
    'AUTH.USERS' as tabela,
    id,
    email,
    created_at,
    email_confirmed_at,
    last_sign_in_at,
    raw_user_meta_data
FROM auth.users 
WHERE email IN ('thalles.24104708360068@faeterj-rio.edu.br', 'costa.thalles71@gmail.com')
ORDER BY email;

-- Verificar profiles correspondentes
SELECT 
    'PROFILES' as tabela,
    p.id,
    p.full_name,
    p.role,
    p.is_active,
    p.created_at,
    p.updated_at,
    au.email
FROM profiles p
JOIN auth.users au ON p.id = au.id
WHERE au.email IN ('thalles.24104708360068@faeterj-rio.edu.br', 'costa.thalles71@gmail.com')
ORDER BY au.email;

-- Verificar estrutura das tabelas
SELECT 
    'ESTRUTURA DA TABELA PROFILES' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Resumo
SELECT 
    'RESUMO' as status,
    COUNT(DISTINCT au.id) as usuarios_auth,
    COUNT(DISTINCT p.id) as profiles_criados,
    COUNT(DISTINCT CASE WHEN p.role = 'admin' THEN p.id END) as admins_existentes
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE au.email IN ('thalles.24104708360068@faeterj-rio.edu.br', 'costa.thalles71@gmail.com');
