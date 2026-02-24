-- =====================================================
-- MINI-CMS FAETERJ-RIO: Verificar Profile do Admin
-- =====================================================
-- 
-- Verifica exatamente qual profile está sendo retornado
-- para o usuário admin
-- =====================================================

-- Verificar profile específico do admin
SELECT 
    'PROFILE ADMIN DETALHADO' as status,
    au.id,
    au.email,
    p.id as profile_id,
    p.full_name,
    p.role,
    p.is_active,
    p.created_at as profile_created,
    au.created_at as user_created,
    CASE 
        WHEN p.id IS NULL THEN '❌ Profile NÃO encontrado'
        WHEN p.role = 'admin' THEN '✅ Profile admin OK'
        WHEN p.role = 'editor' THEN '✅ Profile editor OK'
        WHEN p.role = 'viewer' THEN '✅ Profile viewer OK'
        ELSE '❓ Role desconhecido'
    END as status_profile,
    CASE 
        WHEN p.is_active = true THEN '✅ Ativo'
        ELSE '❌ Inativo'
    END as status_ativo
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE au.email = 'thalles.24104708360068@faeterj-rio.edu.br';

-- Testar permissões manualmente
SELECT 
    'PERMISSÕES ESPERADAS' as status,
    'admin' as role_testado,
    'canCreatePosts' as permissao,
    true as valor_esperado,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM profiles p 
            JOIN auth.users au ON p.id = au.id
            WHERE au.email = 'thalles.24104708360068@faeterj-rio.edu.br'
            AND p.role = 'admin'
        ) THEN true
        ELSE false
    END as valor_real;

-- Verificar ROLE_PERMISSIONS no frontend (simulação)
SELECT 
    'SIMULAÇÃO FRONTEND' as status,
    'admin' as role,
    'canCreatePosts' as permissao,
    'true' as esperado_no_frontend;
