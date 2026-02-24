-- =====================================================
-- MINI-CMS FAETERJ-RIO: Criar Usuário Admin
-- =====================================================

-- Solução alternativa: Inserir com hash bcrypt pré-calculado válido
-- Hash: $2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEJH1x3GZNW0K7/0sO (senha: admin)

-- 1. Criar função
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
    WHERE email = 'thalles.24104708360068@faeterj-rio.edu.br';
    
    IF existing_user_id IS NOT NULL THEN
        -- Atualizar senha com hash bcrypt válido
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
            'thalles.24104708360068@faeterj-rio.edu.br',
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

-- 2. Executar
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

-- 4. Verificar
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
