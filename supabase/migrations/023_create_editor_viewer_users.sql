-- =====================================================
-- MINI-CMS FAETERJ-RIO: Criar Usuários Editor e Viewer
-- =====================================================
-- 
-- Cria os usuários editor e viewer do zero
-- =====================================================

-- Criar usuário Editor
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
    'editor@faeterj-rio.edu.br',
    NOW(),
    '(21) 97777-5555',
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'editor@faeterj-rio.edu.br'
);

-- Criar profile do Editor
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
    'Coordenação Teste',
    '222.333.444-55',
    'editor@faeterj-rio.edu.br',
    'editor@faeterj-rio.edu.br',
    '(21) 97777-5555',
    'Coordenação',
    '202500003',
    'Coordenação de Cursos',
    'editor',
    true,
    NOW(),
    NOW()
FROM auth.users au
WHERE au.email = 'editor@faeterj-rio.edu.br'
ON CONFLICT (id) DO UPDATE 
SET 
    full_name = 'Coordenação Teste',
    cpf = '222.333.444-55',
    institutional_email = 'editor@faeterj-rio.edu.br',
    personal_email = 'editor@faeterj-rio.edu.br',
    phone = '(21) 97777-5555',
    department = 'Coordenação',
    registration_number = '202500003',
    course = 'Coordenação de Cursos',
    role = 'editor',
    is_active = true,
    updated_at = NOW();

-- Criar usuário Viewer
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
    'viewer@faeterj-rio.edu.br',
    NOW(),
    '(21) 98888-6666',
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'viewer@faeterj-rio.edu.br'
);

-- Criar profile do Viewer
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
    'Direção Teste',
    '333.444.555-66',
    'viewer@faeterj-rio.edu.br',
    'viewer@faeterj-rio.edu.br',
    '(21) 98888-6666',
    'Direção',
    '202500004',
    'Direção Geral',
    'viewer',
    true,
    NOW(),
    NOW()
FROM auth.users au
WHERE au.email = 'viewer@faeterj-rio.edu.br'
ON CONFLICT (id) DO UPDATE 
SET 
    full_name = 'Direção Teste',
    cpf = '333.444.555-66',
    institutional_email = 'viewer@faeterj-rio.edu.br',
    personal_email = 'viewer@faeterj-rio.edu.br',
    phone = '(21) 98888-6666',
    department = 'Direção',
    registration_number = '202500004',
    course = 'Direção Geral',
    role = 'viewer',
    is_active = true,
    updated_at = NOW();

-- Verificar criação dos usuários
SELECT 
    'USUÁRIOS CRIADOS' as status,
    au.email,
    p.full_name,
    p.role,
    p.department,
    p.course,
    p.is_active,
    CASE 
        WHEN p.id IS NOT NULL THEN '✅ Criado com sucesso'
        ELSE '❌ Falha na criação'
    END as resultado
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE au.email IN (
    'editor@faeterj-rio.edu.br',
    'viewer@faeterj-rio.edu.br'
)
ORDER BY p.role;

-- Resumo de todos os usuários por role
SELECT 
    'RESUMO DE USUÁRIOS POR ROLE' as status,
    p.role,
    COUNT(*) as quantidade,
    STRING_AGG(p.full_name, ', ') as usuarios,
    CASE 
        WHEN p.role = 'admin' THEN '🔑 Acesso total'
        WHEN p.role = 'editor' THEN '📋 Coordenação - Pode criar/editar posts'
        WHEN p.role = 'viewer' THEN '🏢 Direção - Apenas visualizar'
        ELSE '❓ Role desconhecida'
    END as descricao
FROM profiles p
WHERE p.is_active = true
GROUP BY p.role
ORDER BY 
    CASE p.role
        WHEN 'admin' THEN 1
        WHEN 'editor' THEN 2
        WHEN 'viewer' THEN 3
        ELSE 4
    END;
