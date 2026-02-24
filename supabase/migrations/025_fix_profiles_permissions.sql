-- =====================================================
-- MINI-CMS FAETERJ-RIO: Fix Permissions Issue
-- =====================================================
-- 
-- Corrige o problema de permissão ao atualizar/excluir usuários
-- Adiciona políticas mais claras para operações de UPDATE/DELETE
-- =====================================================

-- Primeiro, remover políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Profiles são visíveis para usuários autenticados" ON profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio profile" ON profiles;
DROP POLICY IF EXISTS "Admins podem gerenciar todos os profiles" ON profiles;
DROP POLICY IF EXISTS "Profiles visíveis a usuários autenticados" ON profiles;
DROP POLICY IF EXISTS "Admins podem gerenciar profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;

-- Criar políticas mais claras e específicas

-- 1. Política para SELECT: Usuários autenticados podem ver profiles
CREATE POLICY "Profiles visíveis para usuários autenticados" 
    ON profiles FOR SELECT 
    TO authenticated 
    USING (true);

-- 2. Política para INSERT: Apenas admins podem criar novos profiles
CREATE POLICY "Apenas admins podem criar profiles" 
    ON profiles FOR INSERT 
    TO authenticated 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 3. Política para UPDATE: Usuários podem atualizar seu próprio profile OU admins podem atualizar qualquer um
CREATE POLICY "Usuários podem atualizar seu próprio profile ou admins podem atualizar todos" 
    ON profiles FOR UPDATE 
    TO authenticated 
    USING (
        auth.uid() = id OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 4. Política para DELETE: Apenas admins podem excluir profiles
CREATE POLICY "Apenas admins podem excluir profiles" 
    ON profiles FOR DELETE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Verificar se as políticas foram criadas corretamente
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Teste rápido para verificar permissões
SELECT 
    'POLÍTICAS CRIADAS COM SUCESSO' as status,
    COUNT(*) as total_policies,
    STRING_AGG(policyname, ', ') as policies
FROM pg_policies 
WHERE tablename = 'profiles';
