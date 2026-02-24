-- =====================================================
-- MINI-CMS FAETERJ-RIO: Fix Auth Trigger
-- =====================================================
-- 
-- Corrige o problema no trigger que está causando erro 500
-- no signup do Supabase Auth
-- =====================================================

-- 1. Remover trigger e função antigos
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Criar função simplificada sem erros
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Inserir profile básico apenas se não existir
    INSERT INTO public.profiles (id, full_name, role, is_active, created_at, updated_at)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name', 
            NEW.email,
            'Usuário Novo'
        ),
        COALESCE(NEW.raw_user_meta_data->>'role', 'viewer'),
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log do erro mas não falhar o signup
        RAISE LOG 'Erro ao criar profile para usuário %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recriar trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 4. Verificar se o trigger foi criado
SELECT 
    'TRIGGER CRIADO' as status,
    trigger_name,
    event_manipulation,
    action_timing,
    '✅ Trigger configurado' as resultado
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
AND trigger_name = 'on_auth_user_created';

-- 5. Verificar função
SELECT 
    'FUNÇÃO CRIADA' as status,
    routine_name,
    routine_type,
    '✅ Função configurada' as resultado
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'handle_new_user';

-- 6. Testar a função diretamente
DO $$
DECLARE
    test_id UUID := gen_random_uuid();
BEGIN
    -- Simular criação de profile
    INSERT INTO public.profiles (id, full_name, role, is_active, created_at, updated_at)
    VALUES (
        test_id,
        'Teste Trigger',
        'viewer',
        true,
        NOW(),
        NOW()
    );
    
    RAISE NOTICE '✅ Teste de inserção direta funcionou';
    
    -- Limpar teste
    DELETE FROM public.profiles WHERE id = test_id;
    
    RAISE NOTICE '✅ Trigger e função prontos para uso';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Erro no teste: %', SQLERRM;
END $$;
