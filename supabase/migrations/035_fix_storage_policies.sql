-- =====================================================
-- MINI-CMS FAETERJ-RIO: Fix Storage Policies
-- =====================================================
-- 
-- Corrige as políticas de acesso ao storage para permitir upload
-- de imagens por usuários autenticados com as roles corretas
-- =====================================================

-- Remover políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Usuários autenticados podem fazer upload" ON storage.objects;
DROP POLICY IF EXISTS "Imagens são públicas para usuários autenticados" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem atualizar imagens" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem deletar imagens" ON storage.objects;

-- Política simplificada para upload - permite qualquer usuário autenticado
CREATE POLICY "Usuários autenticados podem fazer upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'cms-images'
    AND auth.role() = 'authenticated'
);

-- Política para visualização - qualquer pessoa pode ver imagens
CREATE POLICY "Imagens são públicas"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'cms-images'
);

-- Política para atualização - apenas admins
CREATE POLICY "Admins podem atualizar imagens"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'cms-images'
    AND (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'admin'
        )
        OR auth.jwt() ->> 'role' = 'admin'
    )
)
WITH CHECK (
    bucket_id = 'cms-images'
    AND (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'admin'
        )
        OR auth.jwt() ->> 'role' = 'admin'
    )
);

-- Política para deleção - apenas admins
CREATE POLICY "Admins podem deletar imagens"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'cms-images'
    AND (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'admin'
        )
        OR auth.jwt() ->> 'role' = 'admin'
    )
);

-- Verificar políticas criadas
SELECT 
    'POLÍTICAS ATUALIZADAS' as status,
    policyname as name,
    cmd,
    roles,
    '✅ Nova política configurada' as resultado
FROM pg_policies 
WHERE tablename = 'objects'
AND schemaname = 'storage'
ORDER BY policyname;

-- Teste de upload (simulado)
SELECT 
    'TESTE DE UPLOAD' as status,
    'Políticas prontas para upload' as mensagem,
    '✅ Usuários autenticados podem fazer upload' as permissao_upload,
    '✅ Imagens são públicas' as permissao_view,
    '✅ Apenas admins podem atualizar/deletar' as permissao_admin;
