-- =====================================================
-- MINI-CMS FAETERJ-RIO: Fix User Listing
-- =====================================================
-- 
-- Verifica e corrige problemas na listagem de usuários
-- Garante que todos os auth.users tenham profile
-- =====================================================

-- 1. Verificar diferença entre auth.users e profiles
SELECT 
    'COMPARAÇÃO AUTH vs PROFILES' as info,
    (SELECT COUNT(*) FROM auth.users) as total_auth_users,
    (SELECT COUNT(*) FROM public.profiles) as total_profiles,
    (SELECT COUNT(*) FROM auth.users) - (SELECT COUNT(*) FROM public.profiles) as diferenca,
    CASE 
        WHEN (SELECT COUNT(*) FROM auth.users) = (SELECT COUNT(*) FROM public.profiles) 
        THEN '✅ Todos os usuários têm profile'
        ELSE '❌ Há usuários sem profile'
    END as status;

-- 2. Listar usuários auth sem profile
SELECT 
    'USUÁRIOS SEM PROFILE' as info,
    au.id,
    au.email,
    au.created_at as auth_created_at,
    '❌ Sem profile correspondente' as status
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ORDER BY au.created_at DESC;

-- 3. Criar profiles para usuários que não têm
INSERT INTO public.profiles (
    id,
    full_name,
    institutional_email,
    role,
    is_active,
    created_at,
    updated_at
)
SELECT 
    au.id,
    COALESCE(au.raw_user_meta_data->>'full_name', au.email, 'Usuário Sem Nome'),
    au.email,
    COALESCE(au.raw_user_meta_data->>'role', 'viewer')::user_role,
    true,
    COALESCE(au.email_confirmed_at, au.created_at, NOW()),
    NOW()
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 4. Verificar resultado da criação
SELECT 
    'PROFILES CRIADOS' as status,
    COUNT(*) as profiles_criados,
    '✅ Profiles criados para usuários sem profile' as resultado
FROM public.profiles p
WHERE p.id IN (
    SELECT au.id 
    FROM auth.users au 
    LEFT JOIN public.profiles p2 ON au.id = p2.id 
    WHERE p2.id IS NULL
);

-- 5. Atualizar profiles com email confirmado
UPDATE public.profiles 
SET is_active = true 
WHERE id IN (
    SELECT au.id 
    FROM auth.users au 
    WHERE au.email_confirmed_at IS NOT NULL
);

-- 6. Verificação final
SELECT 
    'VERIFICAÇÃO FINAL' as info,
    (SELECT COUNT(*) FROM auth.users) as total_auth,
    (SELECT COUNT(*) FROM public.profiles) as total_profiles,
    (SELECT COUNT(*) FROM public.profiles WHERE is_active = true) as ativos,
    CASE 
        WHEN (SELECT COUNT(*) FROM auth.users) = (SELECT COUNT(*) FROM public.profiles) 
        THEN '✅ Sistema sincronizado'
        ELSE '❌ Ainda há inconsistências'
    END as resultado_final;
