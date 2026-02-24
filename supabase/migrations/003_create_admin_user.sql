-- =====================================================
-- MINI-CMS FAETERJ-RIO: Usuário Admin Inicial
-- =====================================================
-- 
-- IMPORTANTE: Execute este script APÓS criar as tabelas de roles (002_create_roles_system.sql)
-- 
-- Este script cria o usuário admin inicial com as credenciais fornecidas.
-- NOTA: A senha será hasheada automaticamente pelo Supabase Auth.

-- Inserir usuário admin na tabela auth.users (via função segura)
-- Como não podemos inserir diretamente em auth.users, use a API do Supabase ou crie via dashboard

-- Alternativa: Criar via função RPC (se necessário)
-- Ou criar manualmente no dashboard do Supabase Auth

-- Após criar o usuário no Auth, atualizar o perfil para admin:
UPDATE profiles 
SET 
    role = 'admin',
    full_name = 'Thalles Costa',
    institutional_email = 'thalles.24104708360068@faeterj-rio.edu.br',
    is_active = true
WHERE institutional_email = 'thalles.24104708360068@faeterj-rio.edu.br';

-- Instruções para criar o usuário:
-- 1. Acesse o Dashboard do Supabase
-- 2. Vá em Authentication → Users
-- 3. Clique em "Invite user" ou "Add user"
-- 4. Email: thalles.24104708360068@faeterj-rio.edu.br
-- 5. Senha: admin
-- 6. Clique em Create user
-- 7. O trigger handle_new_user criará automaticamente o perfil
-- 8. Execute o UPDATE acima para garantir que o role seja 'admin'
