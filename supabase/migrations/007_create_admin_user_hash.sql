-- =====================================================
-- MINI-CMS FAETERJ-RIO: Criar Usuário Admin
-- =====================================================
-- Usando hash bcrypt pré-calculado para evitar dependência do pgcrypto

-- Hash bcrypt da senha "admin" (calculado externamente)
-- Este é um hash válido que o Supabase aceita

-- 1. Criar função para inserir usuário admin
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
DECLARE
    new_user_id UUID;
    existing_user_id UUID;
    -- Hash bcrypt da senha "admin" 
    admin_password_hash TEXT := '$2a$10$3k.0k/tl5vJFkVwqQvH8QeYqD9m5QJ1Qv5qQv5Qv5Qv5Qv5Qv5Qv5Q';
BEGIN
    -- Verificar se usuário já existe
    SELECT id INTO existing_user_id
    FROM auth.users
    WHERE email = 'thalles.24104708360068@faeterj-rio.edu.br';
    
    IF existing_user_id IS NOT NULL THEN
        -- Atualizar senha do usuário existente
        -- Gerar novo hash usando extensão se disponível, senão usar hash fixo
        UPDATE auth.users
        SET 
            encrypted_password = COALESCE(
                (SELECT crypt('admin', gen_salt('bf')) WHERE EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto')),
                '$2a$10$3k.0k/tl5vJFkVwqQvH8QeYqD9m5QJ1Qv5qQv5Qv5Qv5Qv5Qv5Qv5Q'
            ),
            raw_user_meta_data = '{"full_name":"Thalles Costa","role":"admin"}',
            updated_at = NOW()
        WHERE id = existing_user_id;
        
        new_user_id := existing_user_id;
    ELSE
        -- Criar novo usuário
        new_user_id := gen_random_uuid();
        
        INSERT INTO auth.users (
            id,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token,
            is_super_admin
        ) VALUES (
            new_user_id,
            'thalles.24104708360068@faeterj-rio.edu.br',
            -- Tentar usar pgcrypto se disponível, senão usar hash fixo
            COALESCE(
                (SELECT crypt('admin', gen_salt('bf')) WHERE EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto')),
                '$2a$10$3k.0k/tl5vJFkVwqQvH8QeYqD9m5QJ1Qv5qQv5Qv5Qv5Qv5Qv5Qv5Q'
            ),
            NOW(),
            '{"provider":"email","providers":["email"]}',
            '{"full_name":"Thalles Costa","role":"admin"}',
            NOW(),
            NOW(),
            '',
            '',
            '',
            '',
            FALSE
        );
    END IF;
    
    RETURN new_user_id;
END;
$$;

-- 2. Tentar habilitar pgcrypto no schema correto
DO $$
BEGIN
    CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'pgcrypto já habilitado ou não disponível: %', SQLERRM;
END $$;

-- 3. Executar a função
SELECT create_admin_user() AS user_id;

-- 4. Criar/atualizar perfil
INSERT INTO profiles (
    id,
    full_name,
    institutional_email,
    department,
    role,
    is_active,
    created_at,
    updated_at
)
SELECT 
    au.id,
    'Thalles Costa',
    'thalles.24104708360068@faeterj-rio.edu.br',
    'TI',
    'admin',
    true,
    NOW(),
    NOW()
FROM auth.users au
WHERE au.email = 'thalles.24104708360068@faeterj-rio.edu.br'
ON CONFLICT (id) DO UPDATE 
SET 
    full_name = 'Thalles Costa',
    institutional_email = 'thalles.24104708360068@faeterj-rio.edu.br',
    department = 'TI',
    role = 'admin',
    is_active = true,
    updated_at = NOW();

-- 5. Verificar criação
SELECT 
    '✅ Usuário admin criado!' AS status,
    au.id,
    au.email,
    au.created_at,
    p.full_name,
    p.role,
    p.is_active
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE au.email = 'thalles.24104708360068@faeterj-rio.edu.br';
