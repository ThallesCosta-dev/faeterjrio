-- Migration: Promover Ricardo Marciano para admin
-- Atualiza apenas o perfil com o email especificado

UPDATE profiles
SET role = 'admin'
WHERE institutional_email = 'ricardo.marciano@faeterj-rio.edu.br';

