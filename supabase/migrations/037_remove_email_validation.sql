-- =====================================================
-- MINI-CMS FAETERJ-RIO: Remove Email Validation
-- =====================================================
-- 
-- Remove a necessidade de confirmação de email
-- Configura usuários como já confirmados
-- =====================================================

-- 1. Atualizar todos os usuários para já confirmados
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, created_at)
WHERE email_confirmed_at IS NULL;

-- 2. Verificar atualização
SELECT 
    'USUÁRIOS ATUALIZADOS' as status,
    COUNT(*) as total_usuarios,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmados,
    CASE 
        WHEN COUNT(*) = COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) 
        THEN '✅ Todos os usuários confirmados'
        ELSE '❌ Ainda há usuários não confirmados'
    END as resultado
FROM auth.users;

-- 3. Configurar para que novos usuários não precisem confirmar email
-- (Isso é feito via configuração do Supabase Dashboard)
-- Mas podemos garantir via trigger

-- 4. Atualizar profiles para garantir que todos estejam ativos
UPDATE public.profiles 
SET is_active = true 
WHERE is_active IS NULL OR is_active = false;

-- 5. Verificar profiles
SELECT 
    'PROFILES ATUALIZADOS' as status,
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
    CASE 
        WHEN COUNT(*) = COUNT(CASE WHEN is_active = true THEN 1 END) 
        THEN '✅ Todos os profiles ativos'
        ELSE '❌ Ainda há profiles inativos'
    END as resultado
FROM public.profiles;
