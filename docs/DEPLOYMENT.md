# Deployment Documentation

Guia completo de deploy do portal FAETERJ Rio em diferentes ambientes.

## 🎯 Visão Geral

O projeto foi projetado para deploy em múltiplas plataformas, com configurações otimizadas para produção, staging e desenvolvimento.

## 🚀 Plataformas Suportadas

### 1. Netlify (Recomendado)
- **Vantagens**: CI/CD integrado, serverless functions, CDN global
- **Ideal para**: Produção principal
- **Custo**: Gratuito com limites generosos

### 2. Vercel
- **Vantagens**: Integração com Next.js, analytics integrado
- **Ideal para**: Alternativa ao Netlify
- **Custo**: Gratuito com limites

### 3. Docker
- **Vantagens**: Portabilidade, controle total
- **Ideal para**: On-premise ou cloud própria
- **Custo**: Variável

### 4. Traditional VPS
- **Vantagens**: Controle completo, custo baixo
- **Ideal para**: Deploy manual
- **Custo**: Baixo

## 🌐 Netlify Deployment

### Configuração Principal

**Arquivo**: `netlify.toml`

```toml
[build]
  command = "npm run build:client"
  functions = "netlify/functions"
  publish = "dist/spa"

[functions]
  external_node_modules = ["express"]
  node_bundler = "esbuild"
  
# API redirects para serverless functions
[[redirects]]
  force = true
  from = "/api/*"
  status = 200
  to = "/.netlify/functions/api/:splat"

# SPA fallback
[[redirects]]
  force = true
  from = "/*"
  status = 200
  to = "/index.html"
```

### Serverless Functions

**Arquivo**: `netlify/functions/api.ts`

```typescript
import { createServer } from "../../server/node-build";
import serverless from "serverless-http";

const server = createServer();
export const handler = serverless(server);
```

### Environment Variables no Netlify

1. **Dashboard**: Site settings > Environment variables
2. **CLI**: `netlify env:set VAR_NAME value`
3. **Variáveis necessárias**:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   NODE_ENV=production
   ```

### Deploy Process

```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Linkar projeto
netlify link

# 4. Deploy
netlify deploy --prod

# Ou deploy automático via Git integration
```

### Continuous Deployment

1. **Conectar repositório** no dashboard Netlify
2. **Configurar build command**: `npm run build:client`
3. **Publish directory**: `dist/spa`
4. **Functions directory**: `netlify/functions`

### Performance Optimizations

```toml
[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## 🚀 Vercel Deployment

### Configuração

**Arquivo**: `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/spa"
      }
    },
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/spa/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Build Command

```json
{
  "scripts": {
    "vercel-build": "npm run build:client"
  }
}
```

### Deploy via Vercel CLI

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Linkar projeto
vercel link
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build application
COPY . .
RUN pnpm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install production dependencies only
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/shared ./shared

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

CMD ["node", "dist/server/node-build.mjs"]
```

### Docker Compose

**Arquivo**: `docker-compose.yml`

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - VITE_SUPABASE_URL=${SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
```

### Nginx Configuration

**Arquivo**: `nginx.conf`

```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name faeterj-rio.edu.br;

        # Redirect to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name faeterj-rio.edu.br;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";

        # Static files
        location /assets/ {
            root /app/dist/spa;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # API routes
        location /api/ {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # SPA fallback
        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### Docker Commands

```bash
# Build image
docker build -t faeterj-rio .

# Run container
docker run -p 3000:3000 \
  -e VITE_SUPABASE_URL=$SUPABASE_URL \
  -e VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY \
  faeterj-rio

# With Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Update
docker-compose pull && docker-compose up -d
```

## 🖥️ VPS Deployment

### System Requirements

- **OS**: Ubuntu 20.04+ / CentOS 8+
- **RAM**: Mínimo 2GB, recomendado 4GB
- **Storage**: Mínimo 20GB SSD
- **CPU**: Mínimo 2 vCPUs

### Setup Script

**Arquivo**: `deploy/setup.sh`

```bash
#!/bin/bash

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install PNPM
npm install -g pnpm

# Clone repository
git clone https://github.com/your-org/faeterjrio.git
cd faeterjrio

# Install dependencies
pnpm install

# Build application
pnpm build

# Setup environment
cp .env.example .env
# Edit .env with your values

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### PM2 Configuration

**Arquivo**: `ecosystem.config.js`

```javascript
module.exports = {
  apps: [
    {
      name: 'faeterj-rio',
      script: 'dist/server/node-build.mjs',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024'
    }
  ]
};
```

### Systemd Service

**Arquivo**: `/etc/systemd/system/faeterj-rio.service`

```ini
[Unit]
Description=FAETERJ Rio Portal
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/faeterjrio
ExecStart=/usr/bin/node dist/server/node-build.mjs
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

### Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install nginx

# Create site config
sudo nano /etc/nginx/sites-available/faeterj-rio
```

**Arquivo**: `/etc/nginx/sites-available/faeterj-rio`

```nginx
server {
    listen 80;
    server_name faeterj-rio.edu.br;

    # Security
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # Static files
    location /assets/ {
        alias /var/www/faeterjrio/dist/spa/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # SPA fallback
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/faeterj-rio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔧 Environment Configuration

### Production Environment Variables

```bash
# .env.production
NODE_ENV=production
PORT=3000

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Security
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=https://faeterj-rio.edu.br

# Analytics (optional)
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
SENTRY_DSN=your-sentry-dsn

# Performance
CACHE_TTL=3600
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

### Staging Environment

```bash
# .env.staging
NODE_ENV=staging
PORT=3001

# Supabase staging
VITE_SUPABASE_URL=https://staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=staging-anon-key

# Debug
DEBUG=true
LOG_LEVEL=debug
```

## 📊 Monitoring e Logging

### Application Monitoring

```typescript
// server/monitoring.ts
import { createPrometheusMetrics } from 'prom-client';

export const httpRequestDuration = new createPrometheusMetrics.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

export const httpRequestTotal = new createPrometheusMetrics.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});
```

### Health Check Endpoint

```typescript
// server/routes/health.ts
export const healthCheck: RequestHandler = async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version,
  };

  // Check database
  try {
    const { error } = await supabase.from('posts').select('count').single();
    health.database = error ? 'error' : 'connected';
  } catch (error) {
    health.database = 'error';
  }

  const statusCode = health.database === 'error' ? 503 : 200;
  res.status(statusCode).json(health);
};
```

### Error Tracking (Sentry)

```typescript
// client/lib/sentry.ts
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions

**Arquivo**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run tests
        run: pnpm test
      
      - name: Type check
        run: pnpm typecheck

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist/spa
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### Deploy Script

**Arquivo**: `scripts/deploy.sh`

```bash
#!/bin/bash

set -e

echo "🚀 Starting deployment..."

# Check if we're on main branch
if [ "$(git branch --show-current)" != "main" ]; then
  echo "❌ Not on main branch. Aborting."
  exit 1
fi

# Pull latest changes
git pull origin main

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build application
pnpm build

# Deploy to Netlify
netlify deploy --prod

echo "✅ Deployment completed successfully!"
```

## 🔒 Security Considerations

### SSL/TLS Configuration

```bash
# Let's Encrypt for VPS
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d faeterj-rio.edu.br
sudo systemctl enable certbot.timer
```

### Firewall Setup

```bash
# UFW configuration
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Security Headers

```typescript
// server/middleware/security.ts
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));
```

## 📈 Performance Optimization

### Build Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog'],
        },
      },
    },
    minify: 'terser',
    sourcemap: false,
  },
});
```

### Caching Strategy

```typescript
// Cache configuration
app.use(express.static('dist/spa', {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
  etag: true,
  lastModified: true,
}));
```

---

Este guia cobre todos os aspectos de deploy do portal FAETERJ Rio, garantindo implantação segura e performática em múltiplas plataformas.
