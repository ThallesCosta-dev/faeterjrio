-- =====================================================
-- MINI-CMS FAETERJ-RIO: Criar Usuário Admin
-- =====================================================

-- 1. Habilitar extensão pgcrypto (para crypt e gen_salt)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Criar função para inserir usuário admin com privilégios elevados
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
        -- Atualizar senha do usuário existente
        UPDATE auth.users
        SET 
            encrypted_password = crypt('admin', gen_salt('bf')),
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
            updated_at
        ) VALUES (
            new_user_id,
            'thalles.24104708360068@faeterj-rio.edu.br',
            crypt('admin', gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"]}',
            '{"full_name":"Thalles Costa","role":"admin"}',
            NOW(),
            NOW()
        );
    END IF;
    
    RETURN new_user_id;
END;
$$;

-- 3. Executar a função para criar/atualizar o usuário
SELECT create_admin_user() AS user_id;

-- 4. Aguardar trigger criar o perfil, depois atualizar com dados completos
DO $$
BEGIN
    -- Aguardar um momento para o trigger executar
    PERFORM pg_sleep(0.5);
    
    -- Atualizar o perfil com dados completos
    UPDATE profiles
    SET 
        full_name = 'Thalles Costa',
        institutional_email = 'thalles.24104708360068@faeterj-rio.edu.br',
        department = 'TI',
        role = 'admin',
        is_active = true,
        updated_at = NOW()
    WHERE id = (SELECT id FROM auth.users WHERE email = 'thalles.24104708360068@faeterj-rio.edu.br');
    
    -- Se não houve atualização (trigger não criou), criar manualmente
    IF NOT FOUND THEN
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
    END IF;
END $$;

-- 5. Verificar criação
SELECT 
    '✅ Usuário admin criado/atualizado!' AS status,
    au.id,
    au.email,
    au.created_at,
    p.full_name,
    p.role,
    p.is_active,
    p.department
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE au.email = 'thalles.24104708360068@faeterj-rio.edu.br';
