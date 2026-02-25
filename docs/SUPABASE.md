# Supabase Documentation

Documentação completa da configuração e uso do Supabase no portal FAETERJ Rio.

## 🎯 Visão Geral

O Supabase é utilizado como Backend as a Service (BaaS), fornecendo banco de dados PostgreSQL, autenticação, storage e APIs REST em uma plataforma unificada.

## 🛠️ Stack Supabase

### Core Services
- **PostgreSQL**: Banco de dados relacional com extensões
- **Authentication**: Sistema de login e gerenciamento de usuários
- **Storage**: File storage para imagens e arquivos
- **Row Level Security (RLS)**: Controle granular de acesso
- **REST API**: APIs automáticas geradas das tabelas

### Development Tools
- **Supabase CLI**: Gerenciamento local e migrations
- **Dashboard**: Interface web de administração
- **Realtime**: Subscrições em tempo real
- **Edge Functions**: Serverless functions

## 📁 Estrutura do Supabase

```
supabase/
└── migrations/
    └── 999_complete_database_setup.sql  # Setup completo do banco
```

## 🗄️ Schema do Banco de Dados

### Tabelas Principais

#### Profiles
Tabela de perfis de usuários do sistema:

```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE,
    full_name TEXT,
    institutional_email TEXT,
    role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Campos**:
- `id`: UUID único do perfil
- `email`: Email principal (único)
- `full_name`: Nome completo do usuário
- `institutional_email`: Email institucional
- `role`: Papel no sistema (`admin`, `editor`, `viewer`)
- `is_active`: Status do usuário
- `created_at`: Data de criação
- `updated_at`: Última atualização

#### Posts
Tabela de comunicados e notícias:

```sql
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT DEFAULT '',
    cover_image TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    author TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Campos**:
- `id`: UUID único do post
- `title`: Título do comunicado
- `slug`: URL amigável (único)
- `content`: Conteúdo do post (HTML/Markdown)
- `cover_image`: URL da imagem de capa
- `status`: Status (`draft`, `published`)
- `author`: Nome do autor
- `published_at`: Data de publicação
- `created_at`: Data de criação
- `updated_at`: Última atualização

### Índices

```sql
-- Performance para queries comuns
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX profiles_email ON profiles(email);
```

### Triggers e Functions

#### Trigger para updated_at
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar às tabelas
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🔐 Segurança e Políticas RLS

### Row Level Security (RLS)

Habilitado para todas as tabelas principais:

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
```

#### Políticas de Profiles

```sql
-- Leitura pública de perfis
CREATE POLICY "Profiles públicos" ON profiles FOR SELECT USING (true);

-- Apenas admins podem gerenciar perfis
CREATE POLICY "Admins gerenciam profiles" ON profiles FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
```

#### Políticas de Posts

```sql
-- Posts publicados são visíveis publicamente
CREATE POLICY "Posts públicos" ON posts FOR SELECT USING (status = 'published');

-- Admins e editors podem gerenciar posts
CREATE POLICY "Admins e editors gerenciam posts" ON posts FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));
```

## 📁 Storage Configuration

### Bucket Setup

```sql
-- Bucket para imagens do CMS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('cms-images', 'cms-images', true, 5242880, 
        ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;
```

**Configurações**:
- **ID**: `cms-images`
- **Público**: `true` (acesso público via URL)
- **Tamanho máximo**: 5MB por arquivo
- **MIME types**: Apenas imagens

### Storage Policies

```sql
-- Upload apenas para usuários autenticados
CREATE POLICY "Upload autenticado" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'cms-images' AND auth.role() = 'authenticated');

-- Leitura pública das imagens
CREATE POLICY "Imagens públicas" ON storage.objects FOR SELECT
USING (bucket_id = 'cms-images');

-- Admins podem gerenciar todas as imagens
CREATE POLICY "Admins gerenciam imagens" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'cms-images' AND 
       EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
```

## 👥 Usuários e Autenticação

### Usuário Admin Inicial

```sql
-- Criar usuário administrador padrão
INSERT INTO profiles (email, full_name, institutional_email, role)
VALUES ('admin@faeterj-rio.edu.br', 'Administrador', 'admin@faeterj-rio.edu.br', 'admin')
ON CONFLICT (email) DO NOTHING;
```

### Sistema de Papéis

#### Admin
- Acesso total ao sistema
- Gerenciamento de usuários
- Configurações do sistema

#### Editor
- Criar e editar posts
- Upload de imagens
- Visualizar analytics

#### Viewer
- Apenas visualização
- Sem permissões de escrita

## 🔌 Integração com Frontend

### Cliente Supabase

```typescript
// client/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
```

### Autenticação

```typescript
// Login
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
}

// Registro
export async function signUp(email: string, password: string, metadata: any) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  
  return { data, error };
}

// Logout
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}
```

### Operações de Database

#### Posts

```typescript
// Buscar posts publicados
export async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  
  return { data, error };
}

// Criar post
export async function createPost(post: Partial<Post>) {
  const { data, error } = await supabase
    .from('posts')
    .insert([post])
    .select()
    .single();
  
  return { data, error };
}

// Atualizar post
export async function updatePost(id: string, updates: Partial<Post>) {
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
}
```

#### Storage

```typescript
// Upload de imagem
export async function uploadImage(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from('cms-images')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
  
  return { data, error };
}

// Obter URL pública
export function getPublicUrl(path: string) {
  const { data } = supabase.storage
    .from('cms-images')
    .getPublicUrl(path);
  
  return data.publicUrl;
}

// Deletar imagem
export async function deleteImage(path: string) {
  const { error } = await supabase.storage
    .from('cms-images')
    .remove([path]);
  
  return { error };
}
```

## 🔧 Configuração Local

### Supabase CLI

```bash
# Instalar CLI
npm install -g supabase

# Inicializar projeto
supabase init

# Start local development
supabase start

# Aplicar migrations
supabase db push

# Gerar types
supabase gen types typescript --local > types/supabase.ts
```

### Environment Variables

```bash
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Para backend
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 🚀 Setup Inicial

### 1. Criar Projeto Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie novo projeto
3. Anote as credenciais

### 2. Executar Migration

```sql
-- Execute o arquivo 999_complete_database_setup.sql
-- Via dashboard ou CLI
```

### 3. Configurar Storage

1. No dashboard, vá para Storage
2. Verifique bucket `cms-images`
3. Configure políticas se necessário

### 4. Criar Usuários

1. Em Authentication > Users
2. Crie usuário admin
3. Defina senha inicial

## 📊 Monitoramento e Analytics

### Database Analytics

```sql
-- Queries úteis para monitoramento

-- Posts por status
SELECT status, COUNT(*) as count 
FROM posts 
GROUP BY status;

-- Usuários por papel
SELECT role, COUNT(*) as count 
FROM profiles 
GROUP BY role;

-- Posts recentes
SELECT title, created_at, status 
FROM posts 
ORDER BY created_at DESC 
LIMIT 10;
```

### Performance Monitoring

```sql
-- Verificar queries lentas
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;

-- Tamanho das tabelas
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public';
```

## 🔒 Backup e Recovery

### Automated Backups

O Supabase oferece backups automáticos:
- **Daily backups**: Retenção de 30 dias
- **Point-in-time recovery**: Até 7 dias
- **Manual backups**: Sob demanda

### Manual Backup

```bash
# Via CLI
supabase db dump --data-only > backup.sql

# Via dashboard
# Settings > Database > Backups
```

### Restore Process

```bash
# Restore from backup
supabase db reset
supabase db push
```

## 🧪 Testing Strategy

### Test Database

```typescript
// setup/test-db.ts
import { createClient } from '@supabase/supabase-js';

const testSupabase = createClient(
  process.env.SUPABASE_TEST_URL!,
  process.env.SUPABASE_TEST_ANON_KEY!
);

export { testSupabase };
```

### Test Data Setup

```sql
-- test-data.sql
INSERT INTO profiles (email, full_name, role) VALUES
  ('test@example.com', 'Test User', 'editor'),
  ('admin@test.com', 'Test Admin', 'admin');

INSERT INTO posts (title, slug, content, status, author) VALUES
  ('Test Post', 'test-post', 'Test content', 'published', 'Test User');
```

## 🚀 Production Considerations

### Security

1. **RLS Policies**: Sempre habilitado
2. **API Keys**: Nunca expor service role key no frontend
3. **Connection Pooling**: Configurar pooling para alta carga
4. **SSL**: Sempre usar HTTPS

### Performance

1. **Índices**: Otimizar queries comuns
2. **Caching**: Implementar cache onde aplicável
3. **Connection Limits**: Configurar limites apropriados
4. **Monitoring**: Monitorar performance continuamente

### Scaling

1. **Read Replicas**: Para leituras pesadas
2. **Edge Functions**: Para lógica serverless
3. **CDN**: Para assets estáticos
4. **Database Scaling**: Planejar crescimento

---

Esta documentação cobre todos os aspectos do Supabase no projeto FAETERJ Rio, garantindo configuração correta e uso eficiente da plataforma.
