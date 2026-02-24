-- =====================================================
-- MINI-CMS FAETERJ-RIO: Criar Admins Manualmente
-- =====================================================
-- 
-- INSTRUÇÕES:
-- 1. Execute o SQL abaixo no Editor do Supabase
-- 2. Se der erro de permissão, use o método manual do Dashboard
--
-- SENHA PARA AMBOS: admin123
-- =====================================================

-- Habilitar pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Função para criar admin (se tiver permissão)
CREATE OR REPLACE FUNCTION create_admin_manual(
    p_email TEXT,
    p_password TEXT,
    p_full_name TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Gerar hash bcrypt
    v_user_id := gen_random_uuid();
    
    -- Tentar inserir em auth.users
    INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at
    ) VALUES (
        v_user_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        p_email,
        crypt(p_password, gen_salt('bf')),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        json_build_object('full_name', p_full_name),
        NOW(),
        NOW()
    );
    
    -- Criar profile
    INSERT INTO public.profiles (
        id, full_name, institutional_email, role, is_active, created_at, updated_at
    ) VALUES (
        v_user_id, p_full_name, p_email, 'admin', true, NOW(), NOW()
    );
    
    RETURN 'Admin criado: ' || p_email;
EXCEPTION WHEN insufficient_privilege THEN
    RETURN 'ERRO: Sem permissão. Use método manual.';
END;
$$;

-- Tentar criar Admin 1
SELECT create_admin_manual(
    'thalles.24104708360068@faeterj-rio.edu.br',
    'admin123',
    'Thalles Costa de Souza'
);

-- Tentar criar Admin 2
SELECT create_admin_manual(
    'costa.thalles71@gmail.com',
    'admin123',
    'Thalles Costa'
);

-- Se funcionou, atualizar profiles com dados completos
UPDATE profiles SET 
    cpf = '123.456.789-00',
    personal_email = 'costa.thalles71@gmail.com',
    phone = '(21) 98765-4321',
    department = 'Tecnologia da Informação',
    registration_number = '24104708360068',
    course = 'CST em Sistemas de Computação'
WHERE institutional_email = 'thalles.24104708360068@faeterj-rio.edu.br';

UPDATE profiles SET 
    cpf = '987.654.321-00',
    phone = '(21) 91234-5678',
    department = 'Administração',
    registration_number = '202500001',
    course = 'CST em Gestão de TI'
WHERE institutional_email = 'costa.thalles71@gmail.com';

-- Verificar
SELECT 
    CASE 
        WHEN COUNT(*) = 2 THEN '✅ AMBOS ADMINS CRIADOS COM SUCESSO!'
        ELSE '❌ FALHA - Use método manual'
    END as resultado,
    COUNT(*) as total_admins
FROM profiles 
WHERE role = 'admin'
AND is_active = true;
