-- =====================================================
-- MINI-CMS FAETERJ-RIO: Criar Admin - ÚLTIMA TENTATIVA
-- =====================================================
-- Se este SQL falhar, use o método manual abaixo
-- 
-- EMAIL: costa.thalles71@gmail.com
-- SENHA: admin
-- ROLE: admin

-- ============================================
-- TENTATIVA 1: Criar via função RPC
-- ============================================

-- Criar função segura
CREATE OR REPLACE FUNCTION create_admin_v2()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
DECLARE
    new_id UUID := gen_random_uuid();
BEGIN
    -- Remover existente
    DELETE FROM auth.users WHERE email = 'costa.thalles71@gmail.com';
    
    -- Inserir com hash bcrypt da senha 'admin'
    -- Hash válido gerado externamente
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
        new_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'costa.thalles71@gmail.com',
        '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEJH1x3GZNW0K7/0sO',
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{"full_name":"Thalles Costa"}',
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    );
    
    RETURN new_id::TEXT;
EXCEPTION WHEN OTHERS THEN
    RETURN 'ERRO: ' || SQLERRM;
END;
$$;

-- Executar e mostrar resultado
SELECT 
    CASE 
        WHEN uuid_or_null(create_admin_v2()) IS NOT NULL THEN '✅ USUÁRIO CRIADO COM SUCESSO!'
        ELSE '❌ FALHA: ' || create_admin_v2()
    END AS resultado;

-- ============================================
-- TENTATIVA 2: Criar/Atualizar Profile
-- ============================================

-- Inserir profile
INSERT INTO public.profiles (
    id, full_name, institutional_email, department, 
    role, is_active, created_at, updated_at
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

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================
SELECT 
    COALESCE(
        (SELECT '✅ ADMIN PRONTO! Login: costa.thalles71@gmail.com / admin'
         FROM auth.users WHERE email = 'costa.thalles71@gmail.com'),
        '❌ FALHOU - Use método manual abaixo ⬇️'
    ) AS status;

-- ============================================
-- MÉTODO MANUAL (se SQL falhar)
-- ============================================
-- 
-- 1. Acesse: https://app.supabase.com/project/_/auth/users
-- 2. Clique: "Add user" ou "New user"
-- 3. Preencha:
--    Email: costa.thalles71@gmail.com
--    Password: admin
-- 4. Clique: "Create user"
-- 5. Execute no SQL Editor:
--
--    UPDATE profiles 
--    SET role = 'admin', 
--        full_name = 'Thalles Costa',
--        department = 'TI',
--        is_active = true
--    WHERE id = (SELECT id FROM auth.users WHERE email = 'costa.thalles71@gmail.com');
--
--    INSERT INTO profiles (id, full_name, institutional_email, department, role, is_active, created_at, updated_at)
--    SELECT id, 'Thalles Costa', 'costa.thalles71@gmail.com', 'TI', 'admin', true, NOW(), NOW()
--    FROM auth.users 
--    WHERE email = 'costa.thalles71@gmail.com'
--    ON CONFLICT (id) DO UPDATE SET role = 'admin', full_name = 'Thalles Costa', is_active = true;
--
