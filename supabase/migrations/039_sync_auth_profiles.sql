-- =====================================================
-- MINI-CMS FAETERJ-RIO: Sync Auth and Profiles
-- =====================================================
-- 
-- Remove profiles órfãos e sincroniza auth.users com profiles
-- =====================================================

-- 1. Identificar profiles sem usuário auth correspondente
SELECT 
    'PROFILES ÓRFÃOS' as info,
    p.id,
    p.full_name,
    p.institutional_email,
    p.created_at as profile_created_at,
    '❌ Profile sem usuário auth' as status
FROM public.profiles p
LEFT JOIN auth.users au ON p.id = au.id
WHERE au.id IS NULL
ORDER BY p.created_at DESC;

-- 2. Remover profiles órfãos (exceto se for importante manter)
-- Comentado por segurança - apenas para visualização
-- DELETE FROM public.profiles 
-- WHERE id IN (
--     SELECT p.id 
--     FROM public.profiles p
--     LEFT JOIN auth.users au ON p.id = au.id
--     WHERE au.id IS NULL
-- );

-- 3. Em vez de deletar, vamos marcar como inativos os profiles órfãos
UPDATE public.profiles 
SET is_active = false, updated_at = NOW()
WHERE id IN (
    SELECT p.id 
    FROM public.profiles p
    LEFT JOIN auth.users au ON p.id = au.id
    WHERE au.id IS NULL
);

-- 4. Verificar resultado da limpeza
SELECT 
    'LIMPEZA DE ÓRFÃOS' as status,
    COUNT(*) as profiles_orfaos_desativados,
    '✅ Profiles órfãos desativados' as resultado
FROM public.profiles 
WHERE id IN (
    SELECT p.id 
    FROM public.profiles p
    LEFT JOIN auth.users au ON p.id = au.id
    WHERE au.id IS NULL
)
AND is_active = false;

-- 5. Verificar sincronização final
SELECT 
    'SINCRONIZAÇÃO FINAL' as info,
    (SELECT COUNT(*) FROM auth.users) as total_auth,
    (SELECT COUNT(*) FROM public.profiles WHERE is_active = true) as profiles_ativos,
    (SELECT COUNT(*) FROM public.profiles) as total_profiles,
    CASE 
        WHEN (SELECT COUNT(*) FROM auth.users) = (SELECT COUNT(*) FROM public.profiles WHERE is_active = true) 
        THEN '✅ Sistema sincronizado'
        ELSE '❌ Ainda há inconsistências'
    END as resultado_final;

-- 6. Listar usuários ativos para verificação
SELECT 
    'USUÁRIOS ATIVOS' as info,
    au.id,
    au.email,
    au.email_confirmed_at,
    p.full_name,
    p.role,
    p.is_active,
    CASE 
        WHEN p.id IS NOT NULL THEN '✅ Com profile'
        ELSE '❌ Sem profile'
    END as status_profile
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE au.email_confirmed_at IS NOT NULL OR p.id IS NOT NULL
ORDER BY au.created_at DESC;
