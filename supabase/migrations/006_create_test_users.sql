-- =====================================================
-- MINI-CMS FAETERJ-RIO: Criar Usuários de Teste
-- =====================================================
-- 
-- Cria usuários de teste para cada role
-- Senha: admin123 para todos
-- =====================================================

-- Criar usuário Editor
SELECT create_admin_with_hash(
    'editor@faeterj-rio.edu.br',
    'Editor Teste',
    '111.222.333-44',
    'editor@faeterj-rio.edu.br',
    'editor@faeterj-rio.edu.br',
    '(21) 95555-4444',
    'Comunicação',
    '202500002',
    'CST em Jornalismo'
);

-- Criar usuário Viewer
SELECT create_admin_with_hash(
    'viewer@faeterj-rio.edu.br',
    'Viewer Teste',
    '555.666.777-88',
    'viewer@faeterj-rio.edu.br',
    'viewer@faeterj-rio.edu.br',
    '(21) 96666-7777',
    'Aluno',
    '202500003',
    'CST em ADS'
);

-- Atualizar roles (se necessário)
UPDATE profiles 
SET role = 'editor' 
WHERE id IN (
    SELECT au.id FROM auth.users au 
    WHERE au.email = 'editor@faeterj-rio.edu.br'
);

UPDATE profiles 
SET role = 'viewer' 
WHERE id IN (
    SELECT au.id FROM auth.users au 
    WHERE au.email = 'viewer@faeterj-rio.edu.br'
);

-- Verificar todos os usuários
SELECT 
    'USUÁRIOS CRIADOS' as status,
    au.email,
    p.full_name,
    p.role,
    p.is_active,
    CASE 
        WHEN p.role = 'admin' THEN '👑 Administrador'
        WHEN p.role = 'editor' THEN '✏️ Editor'
        WHEN p.role = 'viewer' THEN '👁️ Visualizador'
        ELSE '❓ Desconhecido'
    END as descricao_role
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
