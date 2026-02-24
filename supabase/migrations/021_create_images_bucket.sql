-- =====================================================
-- MINI-CMS FAETERJ-RIO: Criar Bucket de Imagens
-- =====================================================
-- 
-- Cria bucket para armazenar imagens do sistema
-- Nome recomendado: cms-images
-- =====================================================

-- Criar bucket para imagens
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'cms-images',
    'cms-images',
    true, -- público para acesso direto via URL
    5242880, -- 5MB por arquivo
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Criar políticas de acesso para o bucket
-- 1. Usuários autenticados podem fazer upload
CREATE POLICY "Usuários autenticados podem fazer upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'cms-images'
    AND (
        -- Admins podem fazer upload de qualquer imagem
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'admin'
        )
        OR
        -- Editors podem fazer upload
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'editor'
        )
    )
);

-- 2. Usuários autenticados podem visualizar imagens
CREATE POLICY "Imagens são públicas para usuários autenticados"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'cms-images'
);

-- 3. Admins podem atualizar imagens
CREATE POLICY "Admins podem atualizar imagens"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'cms-images'
    AND EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
)
WITH CHECK (
    bucket_id = 'cms-images'
    AND EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

-- 4. Admins podem deletar imagens
CREATE POLICY "Admins podem deletar imagens"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'cms-images'
    AND EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

-- Verificar criação do bucket
SELECT 
    'BUCKET CRIADO' as status,
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types,
    '✅ Bucket cms-images criado com sucesso' as resultado
FROM storage.buckets 
WHERE id = 'cms-images';

-- Mostrar políticas criadas
SELECT 
    'POLÍTICAS CRIADAS' as status,
    name,
    cmd,
    roles,
    '✅ Política configurada' as resultado
FROM pg_policies 
WHERE tablename = 'objects'
AND schemaname = 'storage'
ORDER BY name;
