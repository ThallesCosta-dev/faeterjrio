-- =====================================================
-- MINI-CMS FAETERJ-RIO: Criar Usuário Admin (Versão Simples)
-- =====================================================
-- Execute linha por linha se necessário
-- Email: costa.thalles71@gmail.com | Senha: admin

-- Verificar se extensão pgcrypto existe e habilitar
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Remover função se existir
DROP FUNCTION IF EXISTS create_admin_user();

-- Criar função simples sem lógica complexa
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    uid UUID := gen_random_uuid();
BEGIN
    -- Deletar usuário existente se houver
    DELETE FROM auth.users WHERE email = 'costa.thalles71@gmail.com';
    
    -- Inserir novo usuário com hash bcrypt da senha 'admin'
    -- Hash gerado via: https://bcrypt.online/ (10 rounds)
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        role,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        uid,
        '00000000-0000-0000-0000-000000000000',
        'costa.thalles71@gmail.com',
        '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEJH1x3GZNW0K7/0sO',
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{"full_name":"Thalles Costa"}',
        NOW(),
        NOW(),
        'authenticated',
        '',
        '',
        '',
        ''
    );
    
    RETURN uid;
END;
$$;

-- Executar
SELECT create_admin_user();

-- Aguardar trigger e atualizar perfil
SELECT pg_sleep(1);

-- Inserir/atualizar perfil
INSERT INTO public.profiles (
    id,
    full_name,
    institutional_email,
    department,
    role,
    is_active,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'costa.thalles71@gmail.com'),
    'Thalles Costa',
    'costa.thalles71@gmail.com',
    'TI',
    'admin',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE 
SET 
    full_name = 'Thalles Costa',
    institutional_email = 'costa.thalles71@gmail.com',
    department = 'TI',
    role = 'admin',
    is_active = true,
    updated_at = NOW();

-- Mostrar resultado
SELECT '✅ Admin criado:' as msg, id, email, created_at 
FROM auth.users 
WHERE email = 'costa.thalles71@gmail.com';
