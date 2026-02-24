-- =====================================================
-- MINI-CMS FAETERJ-RIO: Verificar Conexão e Usuários
-- =====================================================
-- 
-- Execute este SQL para verificar se tudo está funcionando
-- =====================================================

-- Verificar se as tabelas existem
SELECT 
    'TABELAS CRIADAS' as status,
    table_name,
    '✅' as ok
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('posts', 'profiles', 'audit_logs')
ORDER BY table_name;

-- Verificar se os usuários admin existem
SELECT 
    'USUÁRIOS ADMIN' as status,
    au.email,
    p.full_name,
    p.role,
    p.is_active,
    au.created_at,
    CASE 
        WHEN p.role = 'admin' AND p.is_active = true THEN '✅ OK'
        ELSE '❌ PROBLEMA'
    END as status_usuario
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE au.email IN ('thalles.24104708360068@faeterj-rio.edu.br', 'costa.thalles71@gmail.com')
ORDER BY au.email;

-- Verificar se as políticas RLS estão ativas
SELECT 
    'POLÍTICAS RLS' as status,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check,
    '✅' as ok
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('posts', 'profiles', 'audit_logs')
ORDER BY tablename, policyname;

-- Teste de conexão simples
SELECT 
    'CONEXÃO' as status,
    '✅ Banco de dados conectado com sucesso!' as mensagem,
    NOW() as data_hora,
    current_database() as database,
    version() as postgresql_version;

-- Resumo final
SELECT 
    'RESUMO FINAL' as status,
    CASE 
        WHEN (
            SELECT COUNT(*) FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('posts', 'profiles', 'audit_logs')
        ) = 3
        AND (
            SELECT COUNT(*) FROM profiles 
            WHERE role = 'admin' AND is_active = true
        ) = 2
        THEN '✅ TUDO PRONTO PARA USAR!'
        ELSE '❌ PRECISA DE CONFIGURAÇÃO'
    END as resultado;
