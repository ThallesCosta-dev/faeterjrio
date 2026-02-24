-- =====================================================
-- MINI-CMS FAETERJ-RIO: Safe Policy Fix
-- =====================================================
-- 
-- Remove todas as políticas de forma segura e cria uma política temporária
-- =====================================================

-- 1. Desabilitar RLS temporariamente para remover todas as políticas
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 2. Remover todas as políticas (não dará erro se não existirem)
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'profiles'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(policy_record.policyname) || ' ON profiles';
        RAISE NOTICE 'Política removida: %', policy_record.policyname;
    END LOOP;
END $$;

-- 3. Reabilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Criar política temporária simples
CREATE POLICY "Permitir todas as operações para usuários autenticados" 
    ON profiles FOR ALL 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

-- 5. Verificar resultado
SELECT 
    'POLÍTICAS APLICADAS' as status,
    COUNT(*) as total_policies,
    STRING_AGG(policyname, ', ') as policy_names
FROM pg_policies 
WHERE tablename = 'profiles';

-- 6. Teste de permissão
SELECT 
    'TESTE' as info,
    auth.uid() as current_user,
    CASE 
        WHEN auth.uid() IS NOT NULL THEN '✅ Usuário autenticado'
        ELSE '❌ Usuário não autenticado'
    END as auth_status;
