-- =====================================================
-- MINI-CMS FAETERJ-RIO: Verificar Login e Redirecionamento
-- =====================================================
-- 
-- Execute este SQL para verificar se os usuários admin
-- estão corretamente configurados para login
-- =====================================================

-- Verificar usuários em auth.users
SELECT 
    'VERIFICAÇÃO DE USUÁRIOS AUTH' as status,
    au.id,
    au.email,
    au.email_confirmed_at,
    au.last_sign_in_at,
    au.created_at,
    CASE 
        WHEN au.email_confirmed_at IS NOT NULL THEN '✅ Email confirmado'
        ELSE '❌ Email não confirmado'
    END as email_status,
    CASE 
        WHEN au.last_sign_in_at IS NOT NULL THEN '✅ Já fez login'
        ELSE '❌ Nunca fez login'
    END as login_status
FROM auth.users au
WHERE au.email IN ('thalles.24104708360068@faeterj-rio.edu.br', 'costa.thalles71@gmail.com')
ORDER BY au.email;

-- Verificar profiles correspondentes
SELECT 
    'VERIFICAÇÃO DE PROFILES' as status,
    p.id,
    p.full_name,
    p.role,
    p.is_active,
    p.created_at,
    p.updated_at,
    au.email,
    CASE 
        WHEN p.role = 'admin' AND p.is_active = true THEN '✅ Admin ativo'
        WHEN p.role = 'admin' AND p.is_active = false THEN '❌ Admin inativo'
        ELSE '❌ Não é admin'
    END as profile_status
FROM profiles p
JOIN auth.users au ON p.id = au.id
WHERE au.email IN ('thalles.24104708360068@faeterj-rio.edu.br', 'costa.thalles71@gmail.com')
ORDER BY au.email;

-- Verificar se as senhas estão corretas (hash)
SELECT 
    'VERIFICAÇÃO DE SENHAS' as status,
    au.email,
    LEFT(au.encrypted_password, 60) as hash_inicio,
    '$2a$10$N9qo8uLOickgx2ZMRZoMy' as hash_esperado,
    CASE 
        WHEN au.encrypted_password LIKE '$2a$10$N9qo8uLOickgx2ZMRZoMy%' THEN '✅ Senha correta (admin123)'
        ELSE '❌ Senha incorreta'
    END as senha_status
FROM auth.users au
WHERE au.email IN ('thalles.24104708360068@faeterj-rio.edu.br', 'costa.thalles71@gmail.com')
ORDER BY au.email;

-- Testar se o usuário pode fazer login (simulação)
SELECT 
    'TESTE DE LOGIN (SIMULAÇÃO)' as status,
    au.email,
    CASE 
        WHEN au.email_confirmed_at IS NOT NULL 
        AND EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = au.id 
            AND p.role = 'admin' 
            AND p.is_active = true
        )
        THEN '✅ PODE FAZER LOGIN'
        ELSE '❌ NÃO PODE FAZER LOGIN'
    END as pode_login,
    CASE 
        WHEN au.email_confirmed_at IS NULL THEN 'Email não confirmado'
        WHEN NOT EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = au.id 
            AND p.role = 'admin' 
            AND p.is_active = true
        ) THEN 'Profile não é admin ou está inativo'
        ELSE 'Tudo OK para login'
    END as motivo
FROM auth.users au
WHERE au.email IN ('thalles.24104708360068@faeterj-rio.edu.br', 'costa.thalles71@gmail.com')
ORDER BY au.email;
