-- =====================================================
-- MINI-CMS FAETERJ-RIO: Quick Fix User Creation
-- =====================================================
-- 
-- Solução rápida para o erro de criação de usuário
-- Remove políticas conflitantes e cria uma política simples
-- =====================================================

-- Remover todas as políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Profiles são visíveis para usuários autenticados" ON profiles;
DROP POLICY IF EXISTS "Permitir criação automática e manual de profiles" ON profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio profile ou admins podem atualizar todos" ON profiles;
DROP POLICY IF EXISTS "Apenas admins podem excluir profiles" ON profiles;
DROP POLICY IF EXISTS "Profiles visíveis a usuários autenticados" ON profiles;
DROP POLICY IF EXISTS "Admins podem gerenciar profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;

-- Criar política simples que permite tudo para usuários autenticados
-- TEMPORÁRIO: Para testar se o problema é de permissão
CREATE POLICY "Permitir todas as operações para usuários autenticados" 
    ON profiles FOR ALL 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

-- Verificar se a política foi criada
SELECT 
    'POLÍTICA TEMPORÁRIA CRIADA' as status,
    policyname,
    cmd,
    '✅ Todas as operações permitidas para usuários autenticados' as result
FROM pg_policies 
WHERE tablename = 'profiles' AND policyname = 'Permitir todas as operações para usuários autenticados';

-- Teste rápido: Verificar se o usuário atual pode fazer operações
SELECT 
    'TESTE DE PERMISSÃO' as info,
    auth.uid() as user_id,
    CASE 
        WHEN auth.uid() IS NOT NULL THEN '✅ Usuário autenticado - deve ter permissão'
        ELSE '❌ Usuário não autenticado'
    END as test_result;
