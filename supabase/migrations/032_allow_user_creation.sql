-- =====================================================
-- MINI-CMS FAETERJ-RIO: Allow User Creation
-- =====================================================
-- 
-- Cria políticas que permitem criação de usuários
-- Remove dependência de autenticação para operações básicas
-- =====================================================

-- 1. Remover todas as políticas existentes
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

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

-- 2. Reabilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Criar políticas específicas para cada operação

-- SELECT: Qualquer usuário autenticado pode ver
CREATE POLICY "Permitir SELECT para usuários autenticados" 
    ON profiles FOR SELECT 
    TO authenticated 
    USING (true);

-- INSERT: Permitir criação (para o trigger e para admins)
CREATE POLICY "Permitir INSERT para usuários autenticados" 
    ON profiles FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

-- UPDATE: Permitir atualização do próprio profile ou por qualquer usuário autenticado
CREATE POLICY "Permitir UPDATE para usuários autenticados" 
    ON profiles FOR UPDATE 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

-- DELETE: Permitir exclusão para qualquer usuário autenticado
CREATE POLICY "Permitir DELETE para usuários autenticados" 
    ON profiles FOR DELETE 
    TO authenticated 
    USING (true);

-- 4. Verificar políticas criadas
SELECT 
    'POLÍTICAS CRIADAS' as status,
    policyname,
    cmd,
    '✅ Política criada com sucesso' as result
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY cmd, policyname;

-- 5. Teste: Tentar inserir um profile de teste
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
    'Usuário Teste',
    'teste@exemplo.com',
    'viewer',
    true,
    NOW(),
    NOW()
) ON CONFLICT DO NOTHING;

-- 6. Verificar se o teste funcionou
SELECT 
    'TESTE DE INSERÇÃO' as info,
    COUNT(*) as total_usuarios,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Inserção permitida'
        ELSE '❌ Inserção bloqueada'
    END as resultado
FROM profiles 
WHERE institutional_email = 'teste@exemplo.com';

-- 7. Limpar teste
DELETE FROM profiles WHERE institutional_email = 'teste@exemplo.com';
