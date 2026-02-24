-- =====================================================
-- MINI-CMS FAETERJ-RIO: Debug User Creation
-- =====================================================
-- 
-- Diagnóstico simples do problema de criação de usuário
-- =====================================================

-- 1. Verificar se o problema ainda é de permissão
SELECT 
    'PERMISSÕES ATUAIS' as status,
    policyname,
    cmd,
    CASE 
        WHEN cmd = 'INSERT' THEN '✅ Política de INSERT existe'
        WHEN cmd = 'UPDATE' THEN '✅ Política de UPDATE existe'
        WHEN cmd = 'SELECT' THEN '✅ Política de SELECT existe'
        ELSE 'ℹ️ Política para ' || cmd
    END as analise
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY cmd;

-- 2. Verificar constraints FK
SELECT 
    'CONSTRAINTS FK' as status,
    COUNT(*) as total_fk,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Sem FK bloqueando'
        ELSE '❌ Ainda há ' || COUNT(*) || ' FK'
    END as resultado
FROM information_schema.table_constraints 
WHERE table_name = 'profiles' 
AND constraint_type = 'FOREIGN KEY';

-- 3. Teste simples de INSERT
DO $$
BEGIN
    -- Tentar inserir um profile simples
    INSERT INTO profiles (
        id,
        full_name,
        role,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(),
        'Teste Simples',
        'viewer',
        true,
        NOW(),
        NOW()
    );
    
    RAISE NOTICE '✅ INSERT simples funcionou!';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Erro no INSERT simples: %', SQLERRM;
END $$;

-- 4. Verificar trigger
SELECT 
    'TRIGGERS' as status,
    trigger_name,
    event_manipulation,
    action_timing,
    CASE 
        WHEN trigger_name = 'on_auth_user_created' THEN '✅ Trigger de criação existe'
        ELSE 'ℹ️ Outro trigger: ' || trigger_name
    END as analise
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
OR event_object_table = 'auth.users';

-- 5. Verificar função do trigger
SELECT 
    'FUNÇÕES' as status,
    routine_name,
    routine_type,
    CASE 
        WHEN routine_name = 'handle_new_user' THEN '✅ Função do trigger existe'
        ELSE 'ℹ️ Outra função: ' || routine_name
    END as analise
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%user%';
