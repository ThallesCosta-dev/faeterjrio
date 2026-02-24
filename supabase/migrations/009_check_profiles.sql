-- =====================================================
-- MINI-CMS FAETERJ-RIO: Verificar Profiles
-- =====================================================
-- 
-- Verifica se os profiles foram criados corretamente
-- =====================================================

-- Verificar todos os usuários e seus profiles
SELECT 
    'USUÁRIOS vs PROFILES' as status,
    au.id,
    au.email,
    au.created_at as user_created,
    p.id as profile_id,
    p.full_name,
    p.role,
    p.created_at as profile_created,
    CASE 
        WHEN p.id IS NOT NULL THEN '✅ Profile OK'
        ELSE '❌ Profile FALTANTE'
    END as status_profile
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE au.email IN (
    'thalles.24104708360068@faeterj-rio.edu.br', 
    'costa.thalles71@gmail.com',
    'editor@faeterj-rio.edu.br',
    'viewer@faeterj-rio.edu.br'
)
ORDER BY au.email;

-- Verificar se há profiles sem usuário correspondente
SELECT 
    'PROFILES ÓRFÃOS' as status,
    p.id,
    p.full_name,
    p.role,
    p.created_at,
    '❓ Sem usuário auth correspondente' as status_orfao
FROM profiles p
LEFT JOIN auth.users au ON p.id = au.id
WHERE au.id IS NULL;

-- Contar profiles por role
SELECT 
    'RESUMO DE ROLES' as status,
    role,
    COUNT(*) as quantidade,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅'
        ELSE '❌'
    END as ok
FROM profiles 
GROUP BY role
ORDER BY role;
