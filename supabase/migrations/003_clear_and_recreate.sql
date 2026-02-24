-- =====================================================
-- MINI-CMS FAETERJ-RIO: Limpar e Recriar Admins
-- =====================================================
-- 
-- Use este script APENAS se os usuários admin existirem
-- mas com senhas incorretas
-- =====================================================

-- Deletar profiles existentes (se houver)
DELETE FROM profiles 
WHERE id IN (
    SELECT au.id 
    FROM auth.users au 
    WHERE au.email IN ('thalles.24104708360068@faeterj-rio.edu.br', 'costa.thalles71@gmail.com')
);

-- Deletar usuários auth (se houver)
DELETE FROM auth.users 
WHERE email IN ('thalles.24104708360068@faeterj-rio.edu.br', 'costa.thalles71@gmail.com');

-- Confirmar deleção
SELECT 
    'USUÁRIOS DELETADOS' as status,
    COUNT(*) as deletados
FROM auth.users 
WHERE email IN ('thalles.24104708360068@faeterj-rio.edu.br', 'costa.thalles71@gmail.com');

-- Agora recriar com hash correto
SELECT 'REINICIANDO CRIAÇÃO...' as proximo_passo;
