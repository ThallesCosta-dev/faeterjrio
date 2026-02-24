-- =====================================================
-- MINI-CMS FAETERJ-RIO: SQL para Atualizar Profiles
-- =====================================================
-- 
-- Execute este SQL APÓS criar os usuários no Dashboard
-- =====================================================

-- Atualizar profile do Admin 1
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
    'Thalles Costa de Souza',
    '123.456.789-00',
    'thalles.24104708360068@faeterj-rio.edu.br',
    'costa.thalles71@gmail.com',
    '(21) 98765-4321',
    'Tecnologia da Informação',
    '24104708360068',
    'CST em Sistemas de Computação',
    'admin',
    true,
    NOW(),
    NOW()
FROM auth.users au
WHERE au.email = 'thalles.24104708360068@faeterj-rio.edu.br'
ON CONFLICT (id) DO UPDATE 
SET 
    full_name = 'Thalles Costa',
    cpf = '114.861.817-16',
    institutional_email = 'thalles.24104708360068@faeterj-rio.edu.br',
    personal_email = 'costa.thalles71@gmail.com',
    phone = '(21) 99681-8038',
    department = 'Tecnologia da Informação',
    registration_number = '24104708360068',
    course = 'CST em Sistemas de Computação',
    role = 'admin',
    is_active = true,
    updated_at = NOW();

-- Atualizar profile do Admin 2
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

-- Verificar resultado
SELECT 
    CASE 
        WHEN COUNT(*) = 2 THEN '✅ AMBOS ADMINS CONFIGURADOS COM SUCESSO!'
        ELSE '❌ FALHA NA CONFIGURAÇÃO'
    END as resultado,
    COUNT(*) as total_admins
FROM profiles 
WHERE role = 'admin'
AND is_active = true;

-- Mostrar detalhes
SELECT 
    au.email,
    p.full_name,
    p.role,
    p.department,
    p.course,
    p.is_active
FROM auth.users au
JOIN profiles p ON au.id = p.id
WHERE p.role = 'admin'
ORDER BY p.full_name;
