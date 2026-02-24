-- =====================================================
-- MINI-CMS FAETERJ-RIO: Fix Foreign Key Constraint
-- =====================================================
-- 
-- Remove a constraint de chave estrangeira que está bloqueando
-- a criação de profiles antes do usuário existir em auth.users
-- =====================================================

-- 1. Remover a constraint de chave estrangeira
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. Verificar se a constraint foi removida
SELECT 
    'CONSTRAINTS REMOVIDAS' as status,
    constraint_name,
    constraint_type
FROM information_schema.table_constraints 
WHERE table_name = 'profiles' 
AND constraint_type = 'FOREIGN KEY';

-- 3. Verificar todas as constraints da tabela profiles
SELECT 
    'TODAS AS CONSTRAINTS' as info,
    constraint_name,
    constraint_type,
    is_deferrable
FROM information_schema.table_constraints 
WHERE table_name = 'profiles'
ORDER BY constraint_type, constraint_name;

-- 4. Testar inserção sem a constraint
INSERT INTO profiles (
    id,
    full_name,
    institutional_email,
    role,
    is_active,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Teste FK Removida',
    'teste_fk@exemplo.com',
    'viewer',
    true,
    NOW(),
    NOW()
) ON CONFLICT DO NOTHING;

-- 5. Verificar se o teste funcionou
SELECT 
    'TESTE SEM FK' as info,
    COUNT(*) as total_testes,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Inserção sem FK funcionou'
        ELSE '❌ Inserção ainda falha'
    END as resultado
FROM profiles 
WHERE institutional_email = 'teste_fk@exemplo.com';

-- 6. Limpar teste
DELETE FROM profiles WHERE institutional_email = 'teste_fk@exemplo.com';

-- 7. Verificar estrutura final da tabela
SELECT 
    'ESTRUTURA FINAL' as status,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;
