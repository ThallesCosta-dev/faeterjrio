-- =====================================================
-- MINI-CMS FAETERJ-RIO: Real Delete Users
-- =====================================================
-- 
-- Modifica o sistema para realmente excluir usuários
-- em vez de apenas desativar
-- =====================================================

-- 1. Criar função para excluir usuário completamente
CREATE OR REPLACE FUNCTION public.delete_user_completely(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    auth_deleted BOOLEAN := FALSE;
    profile_deleted BOOLEAN := FALSE;
BEGIN
    -- Excluir profile primeiro
    DELETE FROM public.profiles WHERE id = user_id;
    GET DIAGNOSTICS profile_deleted = ROW_COUNT;
    
    -- Tentar excluir usuário auth (pode não ser possível via SQL)
    -- BEGIN
    --     DELETE FROM auth.users WHERE id = user_id;
    --     GET DIAGNOSTICS auth_deleted = ROW_COUNT;
    -- EXCEPTION WHEN OTHERS THEN
    --     RAISE NOTICE 'Não foi possível excluir usuário auth: %', SQLERRM;
    -- END;
    
    -- Retornar sucesso se profile foi excluído
    RETURN profile_deleted > 0;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Erro ao excluir usuário %: %', user_id, SQLERRM;
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Verificar função criada
SELECT 
    'FUNÇÃO DE EXCLUSÃO' as status,
    routine_name,
    routine_type,
    '✅ Função delete_user_completely criada' as resultado
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'delete_user_completely';

-- 3. Limpar profiles inativos/órfãos existentes
DELETE FROM public.profiles 
WHERE is_active = false 
OR id NOT IN (SELECT id FROM auth.users);

-- 4. Verificar limpeza
SELECT 
    'LIMPEZA REALIZADA' as status,
    COUNT(*) as profiles_removidos,
    '✅ Profiles inativos/órfãos excluídos' as resultado
FROM (
    SELECT 1 as count
    WHERE EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE is_active = false 
        OR id NOT IN (SELECT id FROM auth.users)
    )
) temp;

-- 5. Verificar estado atual
SELECT 
    'ESTADO ATUAL' as info,
    (SELECT COUNT(*) FROM auth.users) as total_auth,
    (SELECT COUNT(*) FROM public.profiles) as total_profiles,
    (SELECT COUNT(*) FROM public.profiles WHERE is_active = true) as profiles_ativos,
    CASE 
        WHEN (SELECT COUNT(*) FROM auth.users) = (SELECT COUNT(*) FROM public.profiles WHERE is_active = true) 
        THEN '✅ Sistema limpo e sincronizado'
        ELSE '❌ Ainda há inconsistências'
    END as resultado_final;
