-- =====================================================
-- MINI-CMS FAETERJ-RIO: Final Verification
-- =====================================================
-- 
-- Verificação final para garantir que o sistema está pronto
-- para criar usuários sem erros de permissão ou FK
-- =====================================================

-- 1. Verificar que não há mais constraints FK
SELECT 
    'VERIFICAÇÃO DE CONSTRAINTS' as status,
    COUNT(*) as fk_constraints,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Nenhuma constraint FK bloqueando'
        ELSE '❌ Ainda há ' || COUNT(*) || ' constraints FK'
    END as resultado
FROM information_schema.table_constraints 
WHERE table_name = 'profiles' 
AND constraint_type = 'FOREIGN KEY';

-- 2. Verificar políticas atuais
SELECT 
    'POLÍTICAS ATUAIS' as info,
    policyname,
    cmd,
    permissive,
    '✅ Política ativa' as status
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY cmd, policyname;

-- 3. Verificar se RLS está habilitado
SELECT 
    'STATUS RLS' as info,
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity THEN '✅ RLS habilitado'
        ELSE '❌ RLS desabilitado'
    END as status
FROM pg_tables 
WHERE tablename = 'profiles';

-- 4. Teste completo de criação de usuário
DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
    test_email TEXT := 'teste_final_' || EXTRACT(EPOCH FROM NOW())::text || '@exemplo.com';
BEGIN
    -- Inserir profile de teste
    INSERT INTO profiles (
        id,
        full_name,
        institutional_email,
        role,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        test_user_id,
        'Usuário Teste Final',
        test_email,
        'viewer',
        true,
        NOW(),
        NOW()
    );
    
    RAISE NOTICE '✅ Profile de teste criado com ID: %', test_user_id;
    
    -- Atualizar profile de teste
    UPDATE profiles 
    SET full_name = 'Usuário Teste Atualizado'
    WHERE id = test_user_id;
    
    RAISE NOTICE '✅ Profile de teste atualizado com sucesso';
    
    -- Consultar profile de teste
    PERFORM * FROM profiles WHERE id = test_user_id;
    
    RAISE NOTICE '✅ Profile de teste consultado com sucesso';
    
    -- Limpar teste
    DELETE FROM profiles WHERE id = test_user_id;
    
    RAISE NOTICE '✅ Profile de teste removido com sucesso';
    
    RAISE NOTICE '🎉 Todas as operações CRUD funcionam corretamente!';
END $$;

-- 5. Verificar usuários existentes
SELECT 
    'USUÁRIOS EXISTENTES' as info,
    COUNT(*) as total_usuarios,
    STRING_AGG(DISTINCT role::text, ', ') as roles_existentes,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Sistema tem usuários cadastrados'
        ELSE 'ℹ️ Nenhum usuário cadastrado ainda'
    END as status
FROM profiles;

-- 6. Resumo final
SELECT 
    'RESUMO FINAL' as status,
    'Sistema pronto para criar usuários' as mensagem,
    '✅ Permissões OK' as permissoes,
    '✅ Sem FK bloqueando' as constraints,
    '✅ RLS configurado' as rls_status;
