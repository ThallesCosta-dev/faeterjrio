# FAETERJ Rio - Portal Institucional

Portal web moderno e completo para a FAETERJ - Faculdade de Educação Tecnológica do Estado do Rio de Janeiro, desenvolvido com React, TypeScript e integração com Supabase.

## 🚀 Visão Geral

Este projeto é um sistema institucional full-stack que inclui:
- **Portal Público**: Site institucional com informações sobre cursos, admission e comunicados
- **Sistema de CMS**: Gerenciador de conteúdo para comunicados e notícias
- **Painel Administrativo**: Interface completa para gestão de conteúdo
- **Sistema de Autenticação**: Login seguro para administradores

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** com TypeScript
- **Vite** como bundler e servidor de desenvolvimento
- **TailwindCSS 3** para estilização
- **React Router 6** para navegação SPA
- **Radix UI** para componentes acessíveis
- **Framer Motion** para animações
- **React Query** para gerenciamento de estado de servidor

### Backend
- **Express.js** para API REST
- **Supabase** como banco de dados e autenticação
- **TypeScript** para type safety

### Ferramentas
- **PNPM** como gerenciador de pacotes
- **Vitest** para testes
- **ESLint + Prettier** para código limpo
- **Vite** para build e desenvolvimento

## 📁 Estrutura do Projeto

```
faeterjrio/
├── client/                     # Frontend React
│   ├── components/
│   │   ├── ui/                # Componentes UI reutilizáveis
│   │   ├── FloatingNavbar.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── pages/                 # Páginas da aplicação
│   │   ├── admin/            # Páginas administrativas
│   │   ├── Index.tsx         # Home
│   │   └── ...
│   ├── hooks/                 # Hooks personalizados
│   ├── lib/                   # Utilitários
│   └── App.tsx               # Entry point com rotas
├── server/                    # Backend Express
│   ├── routes/               # Endpoints da API
│   └── index.ts              # Configuração do servidor
├── shared/                    # Tipos compartilhados
├── supabase/                  # Migrations e schema
├── public/                    # Assets estáticos
└── netlify/                   # Configuração de deploy
```

## 🚀 Começando

### Pré-requisitos
- Node.js 18+
- PNPM (recomendado)
- Conta Supabase

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd faeterjrio
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite .env com suas credenciais do Supabase
```

4. **Configure o Supabase**
- Execute as migrations em `supabase/migrations/`
- Configure o storage bucket `cms-images`
- Crie usuário administrativo

5. **Inicie o desenvolvimento**
```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:8080`

## 🌐 Rotas da Aplicação

### Públicas
- `/` - Página inicial
- `/matriz-ementas` - Matriz de ementas dos cursos
- `/admission` - Informações de admissão
- `/about` - Sobre a instituição
- `/comunicados` - Lista de comunicados
- `/comunicados/:slug` - Detalhes de um comunicado

### Administrativas
- `/admin/login` - Login do administrador
- `/admin/dashboard` - Painel de controle
- `/admin/editor` - Criar/editar comunicados
- `/admin/users` - Gestão de usuários

### Sistema Externo
- `/coruja` - Portal do aluno (redirecionamento)

## 🎨 Features Implementadas

### Portal Institucional
- **Design Responsivo**: Layout adaptável para todos os dispositivos
- **Navegação Intuitiva**: Menu flutuante com navegação suave
- **Carrossel Dinâmico**: Destaque de informações importantes
- **Seções Organizadas**: Cursos, admission, sobre nós

### Sistema de CMS
- **Gerenciamento de Posts**: Criar, editar, excluir comunicados
- **Upload de Imagens**: Integração com Supabase Storage
- **Rich Text Editor**: Editor de texto completo
- **Publicação Programada**: Agendar publicações
- **Categorias e Tags**: Organização de conteúdo

### Painel Administrativo
- **Dashboard Analítico**: Estatísticas de uso
- **Gestão de Usuários**: Controle de acessos
- **Interface Moderna**: UI/UX otimizada
- **Segurança**: Autenticação e autorização

## 🔧 Desenvolvimento

### Scripts Disponíveis
```bash
pnpm dev          # Servidor de desenvolvimento
pnpm build        # Build para produção
pnpm start        # Servidor de produção
pnpm test         # Executar testes
pnpm typecheck    # Verificação de tipos
pnpm format.fix   # Formatar código
```

### Adicionando Novas Páginas

1. **Criar componente** em `client/pages/`
```typescript
// client/pages/NovaPagina.tsx
export default function NovaPagina() {
  return <div>Nova página</div>;
}
```

2. **Adicionar rota** em `client/App.tsx`
```typescript
<Route path="/nova-pagina" element={
  <Layout>
    <NovaPagina />
  </Layout>
} />
```

### Criando Novas APIs

1. **Definir interface** em `shared/api.ts`
2. **Criar handler** em `server/routes/`
3. **Registrar rota** em `server/index.ts`

## 🗄️ Banco de Dados (Supabase)

### Tabelas Principais
- `posts` - Comunicados e notícias
- `profiles` - Perfis de usuários
- `categories` - Categorias de posts

### Storage
- `cms-images` - Bucket para imagens do CMS

### Segurança
- Políticas RLS implementadas
- Autenticação via Supabase Auth
- Controle de acesso granular

## 🚀 Deploy

### Netlify (Recomendado)
```bash
pnpm build
# Deploy automático via Git ou manual
```

### Produção Manual
```bash
pnpm build
pnpm start
```

### Variáveis de Ambiente de Produção
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 🧪 Testes

O projeto usa Vitest para testes:

```bash
pnpm test              # Executar todos os testes
pnpm test --watch      # Modo watch
pnpm test --coverage   # Com cobertura
```

## 📱 Performance

### Otimizações Implementadas
- **Code Splitting**: Divisão automática de código
- **Lazy Loading**: Carregamento sob demanda
- **Image Optimization**: Otimização de imagens
- **Caching Strategy**: Cache inteligente
- **Bundle Analysis**: Análise de bundle

### Métricas
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🔒 Segurança

### Medidas Implementadas
- **CORS Configurado**: Restrição de origens
- **Input Validation**: Validação com Zod
- **SQL Injection Protection**: Via Supabase RLS
- **XSS Prevention**: Sanitização de conteúdo
- **Authentication**: JWT tokens seguros

## 🤝 Contribuição

1. Fork o projeto
2. Crie branch para feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para branch (`git push origin feature/nova-feature`)
5. Abra Pull Request

## 📄 Licença

Este projeto está sob licença MIT - veja o arquivo LICENSE para detalhes.

## 📞 Suporte

Para dúvidas e suporte:
- Email: [contato@faeterj.edu.br]
- Issues: [GitHub Issues]

---

**Desenvolvido com ❤️ para a comunidade FAETERJ Rio**
