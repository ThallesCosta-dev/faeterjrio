-- =====================================================
-- MINI-CMS FAETERJ-RIO: Criar Usuário Admin
-- =====================================================
-- Email: costa.thalles71@gmail.com
-- Senha: admin

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
BEGIN
    -- Verificar se usuário já existe
    SELECT id INTO existing_user_id
    FROM auth.users
    WHERE email = 'costa.thalles71@gmail.com';
    
    IF existing_user_id IS NOT NULL THEN
        -- Atualizar usuário existente
        UPDATE auth.users
        SET 
            encrypted_password = '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEJH1x3GZNW0K7/0sO',
            raw_user_meta_data = '{"full_name":"Thalles Costa","role":"admin"}',
            email_confirmed_at = NOW(),
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
            recovery_token
        ) VALUES (
            new_user_id,
            'costa.thalles71@gmail.com',
            '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEJH1x3GZNW0K7/0sO',
            NOW(),
            '{"provider":"email","providers":["email"]}',
            '{"full_name":"Thalles Costa","role":"admin"}',
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        );
    END IF;
    
    RETURN new_user_id;
END;
$$;

-- 2. Executar a função
SELECT create_admin_user() AS user_id;

-- 3. Criar/atualizar perfil
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
    'costa.thalles71@gmail.com',
    'TI',
    'admin',
    true,
    NOW(),
    NOW()
FROM auth.users au
WHERE au.email = 'costa.thalles71@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET 
    full_name = 'Thalles Costa',
    institutional_email = 'costa.thalles71@gmail.com',
    department = 'TI',
    role = 'admin',
    is_active = true,
    updated_at = NOW();

-- 4. Verificar resultado
SELECT 
    CASE 
        WHEN au.id IS NOT NULL THEN '✅ SUCESSO: Usuário admin criado!'
        ELSE '❌ ERRO: Usuário não foi criado'
    END AS resultado,
    au.id,
    au.email,
    au.created_at,
    p.full_name,
    p.role,
    p.is_active
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE au.email = 'costa.thalles71@gmail.com';
