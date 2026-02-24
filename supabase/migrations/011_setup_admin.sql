-- =====================================================
-- MINI-CMS FAETERJ-RIO: Setup Admin Via RPC
-- =====================================================
-- Email: costa.thalles71@gmail.com
-- Senha: admin
-- 
-- IMPORTANTE: Execute este SQL no Editor do Supabase
-- com uma conta que tenha privilégios de superusuário
-- ou service_role

-- Se falhar, use alternativa manual no Dashboard:
-- 1. Authentication > Users > Add User
-- 2. Email: costa.thalles71@gmail.com
-- 3. Senha: admin
-- 4. Após criar, execute a parte do profile abaixo

-- ============================================
-- PARTE 1: Criar usuário (se tiver permissão)
-- ============================================

-- Tentar criar função que cria usuário
CREATE OR REPLACE FUNCTION setup_admin_account()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Verificar se já existe
    SELECT id INTO v_user_id 
    FROM auth.users 
    WHERE email = 'costa.thalles71@gmail.com';
    
    IF v_user_id IS NULL THEN
        -- Inserir usuário (pode falhar sem permissões adequadas)
        BEGIN
            INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data)
            VALUES (
                gen_random_uuid(),
                'costa.thalles71@gmail.com',
                '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEJH1x3GZNW0K7/0sO',
                NOW(),
                NOW(),
                NOW(),
                '{"provider":"email"}'
            )
            RETURNING id INTO v_user_id;
            
            RETURN 'Usuário criado: ' || v_user_id::TEXT;
        EXCEPTION WHEN insufficient_privilege THEN
            RETURN 'ERRO: Sem permissão para criar usuário. Use o Dashboard do Supabase.';
        END;
    ELSE
        RETURN 'Usuário já existe: ' || v_user_id::TEXT;
    END IF;
END;
$$;

-- Executar
SELECT setup_admin_account();

-- ============================================
-- PARTE 2: Criar/Atualizar Profile (sempre executar)
-- ============================================

-- Garantir que o profile exista
INSERT INTO public.profiles (id, full_name, institutional_email, department, role, is_active, created_at, updated_at)
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
-- PARTE 3: Verificar resultado
-- ============================================
SELECT 
    CASE 
        WHEN au.id IS NOT NULL AND p.role = 'admin' THEN '✅ CONFIGURADO: Faça login com costa.thalles71@gmail.com / admin'
        WHEN au.id IS NOT NULL THEN '⚠️ USUÁRIO EXISTE mas sem profile admin'
        ELSE '❌ USUÁRIO NÃO EXISTE - Crie manualmente no Dashboard: Authentication > Users'
    END AS status,
    au.id,
    au.email,
    p.full_name,
    p.role,
    p.is_active
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE au.email = 'costa.thalles71@gmail.com'
UNION ALL
SELECT 
    'ℹ️ Instrução manual: Vá em Authentication > Users > Add User' AS status,
    NULL, 'costa.thalles71@gmail.com', 'Thalles Costa', 'admin', true
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'costa.thalles71@gmail.com');
