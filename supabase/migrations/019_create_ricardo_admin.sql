-- =====================================================
-- MINI-CMS FAETERJ-RIO: Criar Usuário Admin 2
-- =====================================================
-- 
-- Cria o usuário Ricardo Marciano como admin
-- =====================================================

-- Criar usuário Ricardo Marciano
INSERT INTO auth.users (
    id,
    email,
    email_confirmed_at,
    phone,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    'ricardo.marciano@faeterj-rio.edu.br',
    NOW(),
    '(21) 95555-4444',
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'ricardo.marciano@faeterj-rio.edu.br'
);

-- Criar profile correspondente
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
)
SELECT 
    au.id,
    'Ricardo Marciano',
    '111.222.333-44',
    'ricardo.marciano@faeterj-rio.edu.br',
    'ricardo.marciano@faeterj-rio.edu.br',
    '(21) 95555-4444',
    'Administração',
    '202500002',
    'CST em Gestão de TI',
    'admin',
    true,
    NOW(),
    NOW()
FROM auth.users au
WHERE au.email = 'ricardo.marciano@faeterj-rio.edu.br'
ON CONFLICT (id) DO UPDATE 
SET 
    full_name = 'Ricardo Marciano',
    cpf = '111.222.333-44',
    institutional_email = 'ricardo.marciano@faeterj-rio.edu.br',
    personal_email = 'ricardo.marciano@faeterj-rio.edu.br',
    phone = '(21) 95555-4444',
    department = 'Administração',
    registration_number = '202500002',
    course = 'CST em Gestão de TI',
    role = 'admin',
    is_active = true,
    updated_at = NOW();

-- Verificar criação
SELECT 
    'USUÁRIO ADMIN 2' as status,
    au.email,
    p.full_name,
    p.role,
    p.is_active,
    CASE 
        WHEN p.id IS NOT NULL THEN '✅ Criado com sucesso'
        ELSE '❌ Falha na criação'
    END as resultado
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE au.email = 'ricardo.marciano@faeterj-rio.edu.br';
