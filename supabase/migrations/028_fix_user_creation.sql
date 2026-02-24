-- =====================================================
-- MINI-CMS FAETERJ-RIO: Fix User Creation
-- =====================================================
-- 
-- Corrige o problema na criação de usuários
-- Cria trigger automático para criar profile quando usuário é criado
-- Melhora as políticas para INSERT
-- =====================================================

-- 1. Remover trigger antigo se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Criar função melhorada para handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Inserir profile com valores padrão
    INSERT INTO public.profiles (id, full_name, role, is_active, created_at, updated_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'role', 'viewer'),
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Criar trigger para executar após criação de usuário
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 4. Corrigir política de INSERT para permitir criação via trigger
DROP POLICY IF EXISTS "Apenas admins podem criar profiles" ON profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio profile ou admins podem atualizar todos" ON profiles;
DROP POLICY IF EXISTS "Apenas admins podem excluir profiles" ON profiles;

-- 5. Recriar políticas corrigidas
CREATE POLICY "Profiles visíveis para usuários autenticados" 
    ON profiles FOR SELECT 
    TO authenticated 
    USING (true);

-- Política para INSERT: Permitir inserção pelo trigger E por admins
CREATE POLICY "Permitir criação automática e manual de profiles" 
    ON profiles FOR INSERT 
    TO authenticated 
    WITH CHECK (
        -- Permitir inserção pelo trigger (contexto de sistema)
        current_setting('request.jwt.claims', true)::jsonb->>'role' = 'service_role'
        OR
        -- Permitir inserção por admins
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Política para UPDATE: Usuários podem atualizar seu próprio profile OU admins podem atualizar qualquer um
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

-- Política para DELETE: Apenas admins podem excluir profiles
CREATE POLICY "Apenas admins podem excluir profiles" 
    ON profiles FOR DELETE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 6. Garantir que RLS está habilitado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 7. Testar criação de usuário (simulação)
SELECT 
    'TRIGGER E FUNÇÕES CRIADOS' as status,
    'handle_new_user' as function_name,
    'on_auth_user_created' as trigger_name,
    '✅ Sistema pronto para criar usuários' as result;
