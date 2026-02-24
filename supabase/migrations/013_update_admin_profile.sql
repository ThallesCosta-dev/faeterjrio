-- =====================================================
-- MINI-CMS FAETERJ-RIO: Atualizar Perfil do Admin
-- =====================================================
-- 
-- INSTRUÇÕES PARA CRIAR O ADMIN:
--
-- PASSO 1: Criar usuário pelo Dashboard do Supabase
-- 1. Acesse: https://app.supabase.com/project/_/auth/users
--    (substitua _ pelo seu project_id)
-- 2. Clique em "Add user" ou "New user" (botão no canto direito)
-- 3. Preencha:
--    - Email: costa.thalles71@gmail.com
--    - Password: admin
-- 4. Clique em "Create user"
--
-- PASSO 2: Após criar o usuário, execute este SQL abaixo
-- para definir o perfil como admin:
--

-- Atualizar perfil existente ou criar novo
INSERT INTO public.profiles (
    id,
    full_name,
    institutional_email,
    department,
    phone,
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
    NULL,
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

-- Verificar se funcionou
SELECT 
    CASE 
        WHEN p.role = 'admin' THEN '✅ SUCESSO! Admin configurado corretamente.'
        ELSE '❌ ATENÇÃO: Profile não foi atualizado'
    END AS resultado,
    au.email,
    p.full_name,
    p.role,
    p.is_active
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE au.email = 'costa.thalles71@gmail.com';
