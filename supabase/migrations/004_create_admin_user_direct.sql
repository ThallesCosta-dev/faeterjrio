-- =====================================================
-- MINI-CMS FAETERJ-RIO: Criar Usuário Admin via SQL
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Isso criará o usuário admin diretamente no banco

-- Desativar RLS temporariamente para inserção (reativar no final)
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;

-- Inserir usuário admin na tabela auth.users
-- O Supabase usa bcrypt para hash de senha
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    gen_random_uuid(),                                    -- id
    'thalles.24104708360068@faeterj-rio.edu.br',         -- email
    crypt('admin', gen_salt('bf')),                       -- encrypted_password (bcrypt)
    NOW(),                                                -- email_confirmed_at
    '{"provider":"email","providers":["email"]}',       -- raw_app_meta_data
    '{"full_name":"Thalles Costa","role":"admin"}',       -- raw_user_meta_data
    NOW(),                                                -- created_at
    NOW(),                                                -- updated_at
    '',                                                   -- confirmation_token
    '',                                                   -- email_change
    '',                                                   -- email_change_token_new
    ''                                                    -- recovery_token
)
ON CONFLICT (email) DO UPDATE 
SET 
    encrypted_password = crypt('admin', gen_salt('bf')),
    raw_user_meta_data = '{"full_name":"Thalles Costa","role":"admin"}',
    updated_at = NOW()
RETURNING id;

-- Reativar RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Atualizar ou criar o perfil do admin na tabela profiles
INSERT INTO profiles (
    id,
    full_name,
    cpf,
    institutional_email,
    department,
    phone,
    role,
    is_active,
    created_at,
    updated_at
)
SELECT 
    au.id,
    'Thalles Costa',
    NULL,  -- CPF pode ser adicionado depois
    'thalles.24104708360068@faeterj-rio.edu.br',
    'TI',
    NULL,  -- Telefone pode ser adicionado depois
    'admin',
    true,
    NOW(),
    NOW()
FROM auth.users au
WHERE au.email = 'thalles.24104708360068@faeterj-rio.edu.br'
ON CONFLICT (id) DO UPDATE 
SET 
    full_name = 'Thalles Costa',
    institutional_email = 'thalles.24104708360068@faeterj-rio.edu.br',
    department = 'TI',
    role = 'admin',
    is_active = true,
    updated_at = NOW();

-- Verificar se o usuário foi criado
SELECT 
    au.id,
    au.email,
    au.created_at,
    p.full_name,
    p.role,
    p.is_active
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE au.email = 'thalles.24104708360068@faeterj-rio.edu.br';
