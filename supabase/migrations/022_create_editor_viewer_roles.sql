-- =====================================================
-- MINI-CMS FAETERJ-RIO: Atualizar Roles para Coordenação e Direção
-- =====================================================
-- 
-- Atualiza usuários existentes para roles de coordenação e direção
-- =====================================================

-- Atualizar usuário Editor para Coordenação
UPDATE public.profiles
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
    updated_at = NOW()
WHERE institutional_email = 'editor@faeterj-rio.edu.br';

-- Atualizar usuário Viewer para Direção
UPDATE public.profiles
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
    updated_at = NOW()
WHERE institutional_email = 'viewer@faeterj-rio.edu.br';

-- Verificar atualização dos usuários
SELECT 
    'USUÁRIOS ATUALIZADOS' as status,
    au.email,
    p.full_name,
    p.role,
    p.department,
    p.course,
    p.is_active,
    CASE 
        WHEN p.id IS NOT NULL THEN '✅ Atualizado com sucesso'
        ELSE '❌ Falha na atualização'
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
