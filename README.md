 FAETERJ-Rio - Novo Portal Institucional & CMS

Este repositório contém o código-fonte do **novo site institucional da FAETERJ-Rio**, desenvolvido com abordagem **mobile-first** e incluindo um **CMS integrado** para permitir que a secretaria gerencie comunicados, notícias e conteúdos de forma autônoma.

## Objetivo do Projeto

Modernizar a presença digital da instituição, oferecendo:
- Navegação rápida e responsiva
- Atualização de conteúdos sem necessidade de programadores
- Painel administrativo simples e seguro
- Consumo de dados em tempo real no frontend

## Tecnologias Utilizadas

| Camada            | Tecnologia                          | Finalidade                              |
|-------------------|-------------------------------------|-----------------------------------------|
| Frontend          | React + Vite                        | Interface moderna e rápida              |
| Backend / Banco   | Supabase (PostgreSQL + Auth)        | Banco de dados, autenticação e API      |
| Hospedagem (Teste)| Netlify                             | Deploy contínuo e ambiente de homologação |
| Hospedagem (Prod) | HostGator (cPanel)                  | Ambiente oficial FAETEC                 |
| Roteamento        | React Router DOM                    | Navegação SPA                           |

##  Arquitetura do CMS

- Autenticação restrita via **Supabase Auth**
- Tabelas relacionais no PostgreSQL para comunicados, autores, datas e categorias
- Painel administrativo com operações **CRUD** completo
- Consumo de dados em tempo real no site público (via Supabase client)

## Como rodar localmente

### Pré-requisitos

- Node.js (recomendado: v18 ou superior)
- Conta no Supabase com projeto criado

### Passo a passo

1. Clone o repositório

```bash
git clone https://github.com/ThallesCosta-dev/faeterjrio.git
cd faeterjrio
```

2. Instale as dependências

```bash
npm install
```

3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://sua-url.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em:
→ http://localhost:5173

## Deploy

### Opção 1 – Homologação (Netlify)

1. Conecte o repositório ao Netlify
2. Configurações de build:
   - Build command: `npm run build`
   - Publish directory: `dist`

3. Adicione as variáveis de ambiente no painel do Netlify:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

4. Crie arquivo `public/_redirects` com:

```
/*    /index.html   200
```

### Opção 2 – Produção (HostGator / cPanel)

1. Gere a build localmente:

```bash
npm run build
```

2. Compacte a pasta `dist`
3. No cPanel → Gerenciador de Arquivos → vá para `public_html`
4. Faça upload e extraia o conteúdo da pasta `dist`
5. Crie/edite arquivo `.htaccess` na raiz com:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

## Licença

MIT License – sinta-se à vontade para estudar e adaptar (mantendo os créditos quando possível).

---

Feito com 💙 para a comunidade FAETEC  
Desenvolvido por Thalles Costa • 2026