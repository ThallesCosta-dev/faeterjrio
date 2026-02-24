-- =====================================================
-- MINI-CMS FAETERJ-RIO: Definir Senhas Editor e Viewer
-- =====================================================
-- 
-- Define senhas para os usuários editor e viewer
-- IMPORTANTE: Esta é uma senha temporária para teste
-- Em produção, use fluxo de recuperação de senha
-- =====================================================

-- NOTA: No Supabase, não podemos definir senhas diretamente via SQL
-- As senhas precisam ser definidas via:
-- 1. Admin Console do Supabase
-- 2. API de auth
-- 3. Fluxo de recuperação de senha

-- Senhas para teste:
-- editor@faeterj-rio.edu.br -> Editor123456
-- viewer@faeterj-rio.edu.br -> Viewer123456

-- Para definir as senhas, execute os seguintes comandos no SQL Editor do Supabase:

/*
-- Para o usuário Editor
SELECT auth.set_password(
  'editor@faeterj-rio.edu.br',
  'Editor123456'
);

-- Para o usuário Viewer  
SELECT auth.set_password(
  'viewer@faeterj-rio.edu.br',
  'Viewer123456'
);
*/

-- Ou use o Admin Console para definir manualmente:
-- 1. Acesse Authentication > Users
-- 2. Encontre os usuários editor@faeterj-rio.edu.br e viewer@faeterj-rio.edu.br
-- 3. Clique em "Reset password" para cada um
-- 4. Defina as senhas: Editor123456 e Viewer123456

-- Verificar usuários criados
SELECT 
    'USUÁRIOS PARA DEFINIR SENHA' as status,
    au.email,
    p.full_name,
    p.role,
    p.is_active,
    au.email_confirmed_at,
    CASE 
        WHEN p.id IS NOT NULL THEN '✅ Usuário criado - Definir senha manualmente'
        ELSE '❌ Usuário não encontrado'
    END as resultado
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE au.email IN (
    'editor@faeterj-rio.edu.br',
    'viewer@faeterj-rio.edu.br'
)
ORDER BY p.role;
