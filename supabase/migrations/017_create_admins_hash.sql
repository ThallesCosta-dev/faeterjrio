-- =====================================================
-- MINI-CMS FAETERJ-RIO: Criar Admins com Hash Pré-calculado
-- =====================================================
-- 
-- Este script usa hashes bcrypt pré-calculados para evitar
-- problemas com pgcrypto no Supabase
--
-- Hashes gerados com bcrypt (10 rounds):
-- admin123 = $2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEJH1x3GZNW0K7/0sO
-- =====================================================

-- Função para criar admin com hash fixo
CREATE OR REPLACE FUNCTION create_admin_with_hash(
    p_email TEXT,
    p_full_name TEXT,
    p_cpf TEXT,
    p_institutional_email TEXT,
    p_personal_email TEXT,
    p_phone TEXT,
    p_department TEXT,
    p_registration_number TEXT,
    p_course TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
DECLARE
    v_user_id UUID;
    v_existing_user_id UUID;
BEGIN
    -- Verificar se usuário já existe
    SELECT id INTO v_existing_user_id
    FROM auth.users
    WHERE email = p_email;
    
    IF v_existing_user_id IS NOT NULL THEN
        -- Atualizar usuário existente
        UPDATE auth.users
        SET 
            encrypted_password = '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEJH1x3GZNW0K7/0sO',
            raw_user_meta_data = json_build_object('full_name', p_full_name),
            email_confirmed_at = NOW(),
            updated_at = NOW()
        WHERE id = v_existing_user_id;
        
        v_user_id := v_existing_user_id;
    ELSE
        -- Criar novo usuário
        v_user_id := gen_random_uuid();
        
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
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            v_user_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            p_email,
            '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEJH1x3GZNW0K7/0sO',
            NOW(),
            '{"provider":"email","providers":["email"]}',
            json_build_object('full_name', p_full_name),
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        );
    END IF;
    
    -- Criar/atualizar profile
    INSERT INTO public.profiles (
        id,
        full_name,
        cpf,
        institutional_email,
        personal_email,
        phone,
        department,
        registration_number,
        course,
        role,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        v_user_id,
        p_full_name,
        p_cpf,
        p_institutional_email,
        p_personal_email,
        p_phone,
        p_department,
        p_registration_number,
        p_course,
        'admin',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE 
    SET 
        full_name = p_full_name,
        cpf = p_cpf,
        institutional_email = p_institutional_email,
        personal_email = p_personal_email,
        phone = p_phone,
        department = p_department,
        registration_number = p_registration_number,
        course = p_course,
        role = 'admin',
        is_active = true,
        updated_at = NOW();
    
    RETURN 'Admin criado/atualizado: ' || p_email;
EXCEPTION WHEN OTHERS THEN
    RETURN 'ERRO: ' || SQLERRM;
END;
$$;

-- Criar Admin 1
SELECT create_admin_with_hash(
    'thalles.24104708360068@faeterj-rio.edu.br',
    'Thalles Costa de Souza',
    '123.456.789-00',
    'thalles.24104708360068@faeterj-rio.edu.br',
    'costa.thalles71@gmail.com',
    '(21) 98765-4321',
    'Tecnologia da Informação',
    '24104708360068',
    'CST em Sistemas de Computação'
);

-- Criar Admin 2
SELECT create_admin_with_hash(
    'costa.thalles71@gmail.com',
    'Thalles Costa',
    '987.654.321-00',
    'costa.thalles71@gmail.com',
    'costa.thalles71@gmail.com',
    '(21) 91234-5678',
    'Administração',
    '202500001',
    'CST em Gestão de TI'
);

-- Verificar resultado
SELECT 
    'VERIFICAÇÃO FINAL' as status,
    au.email,
    au.created_at,
    p.full_name,
    p.role,
    p.is_active,
    p.department,
    p.course
FROM auth.users au
JOIN profiles p ON au.id = p.id
WHERE au.email IN ('thalles.24104708360068@faeterj-rio.edu.br', 'costa.thalles71@gmail.com')
ORDER BY au.email;
