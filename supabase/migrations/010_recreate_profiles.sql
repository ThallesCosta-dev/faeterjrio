-- =====================================================
-- MINI-CMS FAETERJ-RIO: Recriar Profiles Manualmente
-- =====================================================
-- 
-- Se os profiles não foram criados automaticamente,
-- este script cria manualmente
-- =====================================================

-- Recriar profile Admin 1
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
AND NOT EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = au.id
)
ON CONFLICT (id) DO UPDATE 
SET 
    full_name = 'Thalles Costa de Souza',
    cpf = '123.456.789-00',
    institutional_email = 'thalles.24104708360068@faeterj-rio.edu.br',
    personal_email = 'costa.thalles71@gmail.com',
    phone = '(21) 98765-4321',
    department = 'Tecnologia da Informação',
    registration_number = '24104708360068',
    course = 'CST em Sistemas de Computação',
    role = 'admin',
    is_active = true,
    updated_at = NOW();

-- Recriar profile Admin 2
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
    'Thalles Costa',
    '987.654.321-00',
    'costa.thalles71@gmail.com',
    'costa.thalles71@gmail.com',
    '(21) 91234-5678',
    'Administração',
    '202500001',
    'CST em Gestão de TI',
    'admin',
    true,
    NOW(),
    NOW()
FROM auth.users au
WHERE au.email = 'costa.thalles71@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = au.id
)
ON CONFLICT (id) DO UPDATE 
SET 
    full_name = 'Thalles Costa',
    cpf = '987.654.321-00',
    institutional_email = 'costa.thalles71@gmail.com',
    personal_email = 'costa.thalles71@gmail.com',
    phone = '(21) 91234-5678',
    department = 'Administração',
    registration_number = '202500001',
    course = 'CST em Gestão de TI',
    role = 'admin',
    is_active = true,
    updated_at = NOW();

-- Recriar profile Editor
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
    'Editor Teste',
    '111.222.333-44',
    'editor@faeterj-rio.edu.br',
    'editor@faeterj-rio.edu.br',
    '(21) 95555-4444',
    'Comunicação',
    '202500002',
    'CST em Jornalismo',
    'editor',
    true,
    NOW(),
    NOW()
FROM auth.users au
WHERE au.email = 'editor@faeterj-rio.edu.br'
AND NOT EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = au.id
)
ON CONFLICT (id) DO UPDATE 
SET 
    full_name = 'Editor Teste',
    cpf = '111.222.333-44',
    institutional_email = 'editor@faeterj-rio.edu.br',
    personal_email = 'editor@faeterj-rio.edu.br',
    phone = '(21) 95555-4444',
    department = 'Comunicação',
    registration_number = '202500002',
    course = 'CST em Jornalismo',
    role = 'editor',
    is_active = true,
    updated_at = NOW();

-- Recriar profile Viewer
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
    'Viewer Teste',
    '555.666.777-88',
    'viewer@faeterj-rio.edu.br',
    'viewer@faeterj-rio.edu.br',
    '(21) 96666-7777',
    'Aluno',
    '202500003',
    'CST em ADS',
    'viewer',
    true,
    NOW(),
    NOW()
FROM auth.users au
WHERE au.email = 'viewer@faeterj-rio.edu.br'
AND NOT EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = au.id
)
ON CONFLICT (id) DO UPDATE 
SET 
    full_name = 'Viewer Teste',
    cpf = '555.666.777-88',
    institutional_email = 'viewer@faeterj-rio.edu.br',
    personal_email = 'viewer@faeterj-rio.edu.br',
    phone = '(21) 96666-7777',
    department = 'Aluno',
    registration_number = '202500003',
    course = 'CST em ADS',
    role = 'viewer',
    is_active = true,
    updated_at = NOW();

-- Verificar resultado final
SELECT 
    'PROFILES RECONSTRUÍDOS' as status,
    au.email,
    p.full_name,
    p.role,
    p.is_active,
    '✅' as ok
FROM auth.users au
JOIN profiles p ON au.id = p.id
WHERE au.email IN (
    'thalles.24104708360068@faeterj-rio.edu.br', 
    'costa.thalles71@gmail.com',
    'editor@faeterj-rio.edu.br',
    'viewer@faeterj-rio.edu.br'
)
ORDER BY 
    CASE p.role 
        WHEN 'admin' THEN 1 
        WHEN 'editor' THEN 2 
        WHEN 'viewer' THEN 3 
        ELSE 4 
    END;
