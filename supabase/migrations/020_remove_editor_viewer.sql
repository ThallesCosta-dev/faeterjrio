-- =====================================================
-- MINI-CMS FAETERJ-RIO: Remover Editor e Viewer
-- =====================================================
-- 
-- Remove os usuários editor e viewer do sistema
-- =====================================================

-- Remover profiles do editor e viewer
DELETE FROM public.profiles 
WHERE institutional_email IN (
    'editor@faeterj-rio.edu.br',
    'viewer@faeterj-rio.edu.br'
);

-- Remover usuários do auth
DELETE FROM auth.users 
WHERE email IN (
    'editor@faeterj-rio.edu.br',
    'viewer@faeterj-rio.edu.br'
);

-- Verificar remoção
SELECT 
    'USUÁRIOS REMOVIDOS' as status,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Editor e Viewer removidos com sucesso'
        ELSE '❌ Ainda existem usuários não autorizados'
    END as resultado,
    COUNT(*) as usuarios_restantes
FROM auth.users 
WHERE email IN (
    'editor@faeterj-rio.edu.br',
    'viewer@faeterj-rio.edu.br'
);

-- Mostrar usuários restantes
SELECT 
    'USUÁRIOS RESTANTES' as status,
    email,
    email_confirmed_at,
    created_at
FROM auth.users 
ORDER BY created_at;
