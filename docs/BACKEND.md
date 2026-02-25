# Backend Documentation

Documentação completa do backend Express.js do portal FAETERJ Rio.

## 🎯 Visão Geral

Backend construído com Express.js e TypeScript, fornecendo APIs RESTful para o portal institucional. Integrado com Supabase para persistência de dados e autenticação.

## 🛠️ Stack Tecnológico

### Core Technologies
- **Express.js**: Framework web minimalista e flexível
- **TypeScript**: Type safety e melhor desenvolvimento
- **Node.js**: Runtime environment
- **Supabase**: Backend as a Service (banco + auth)

### Development Tools
- **Vite**: Build tool para server-side code
- **tsx**: TypeScript executor para desenvolvimento
- **dotenv**: Gestão de variáveis de ambiente
- **cors**: Cross-Origin Resource Sharing

### Validation & Security
- **Zod**: Schema validation
- **Express middleware**: Security headers e parsing
- **Supabase RLS**: Row Level Security

## 📁 Estrutura do Backend

```
server/
├── index.ts              # Configuração principal do servidor
├── node-build.ts         # Build configuration para produção
└── routes/               # Endpoints da API
    └── demo.ts           # Rota de exemplo
```

## 🚀 Configuração do Servidor

### Server Setup (`server/index.ts`)

```typescript
import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  return app;
}
```

### Middleware Configuration

#### CORS Setup
```typescript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://faeterj-rio.edu.br'] 
    : ['http://localhost:8080'],
  credentials: true,
}));
```

#### Security Headers
```typescript
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
}));
```

#### Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
});

app.use('/api/', limiter);
```

## 🛣️ Sistema de Rotas

### Estrutura de Rotas

```typescript
// Padrão para novas rotas
import { RequestHandler } from "express";
import { z } from "zod";
import { ResponseType } from "@shared/api";

// Schema de validação
const RequestSchema = z.object({
  param1: z.string(),
  param2: z.number().optional(),
});

export const handleRoute: RequestHandler = async (req, res) => {
  try {
    // Validação de input
    const validated = RequestSchema.parse(req.body);
    
    // Lógica de negócio
    const result = await businessLogic(validated);
    
    // Response tipado
    const response: ResponseType = {
      success: true,
      data: result,
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};
```

### Rotas Existentes

#### `/api/ping`
**Método**: GET
**Descrição**: Health check endpoint

```typescript
app.get("/api/ping", (_req, res) => {
  const ping = process.env.PING_MESSAGE ?? "ping";
  res.json({ message: ping });
});
```

**Response**:
```json
{
  "message": "ping"
}
```

#### `/api/demo`
**Método**: GET
**Descrição**: Endpoint de exemplo

```typescript
// server/routes/demo.ts
import { RequestHandler } from "express";
import { DemoResponse } from "@shared/api";

export const handleDemo: RequestHandler = (req, res) => {
  const response: DemoResponse = {
    message: "Hello from Express server",
  };
  res.status(200).json(response);
};
```

**Response**:
```json
{
  "message": "Hello from Express server"
}
```

## 🔌 Integração com Supabase

### Cliente Supabase

```typescript
// server/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
```

### Exemplo de Rota com Supabase

```typescript
// server/routes/posts.ts
import { RequestHandler } from "express";
import { z } from "zod";
import { supabase } from "../lib/supabase";
import { PostResponse } from "@shared/api";

const CreatePostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  category_id: z.number(),
  published: z.boolean().default(false),
});

export const createPost: RequestHandler = async (req, res) => {
  try {
    const validated = CreatePostSchema.parse(req.body);
    
    const { data, error } = await supabase
      .from('posts')
      .insert([{
        ...validated,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    const response: PostResponse = {
      success: true,
      data,
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create post',
    });
  }
};
```

## 📝 Shared Types

### API Interfaces (`shared/api.ts`)

```typescript
/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Post related types
 */
export interface Post {
  id: string;
  title: string;
  content: string;
  category_id: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostResponse {
  success: boolean;
  data?: Post;
  error?: string;
}

export interface PostsListResponse {
  success: boolean;
  data: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

/**
 * User related types
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}
```

## 🔒 Autenticação e Autorização

### Middleware de Autenticação

```typescript
// server/middleware/auth.ts
import { RequestHandler } from "express";
import { supabase } from "../lib/supabase";

export const authenticate: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};
```

### Middleware de Autorização

```typescript
// server/middleware/authorization.ts
import { RequestHandler } from "express";

export const authorize = (roles: string[]): RequestHandler => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};
```

### Uso em Rotas

```typescript
// Proteger rota com autenticação
app.post('/api/posts', authenticate, createPost);

// Proteger rota com autorização específica
app.delete('/api/posts/:id', 
  authenticate, 
  authorize(['admin']), 
  deletePost
);
```

## 🛡️ Error Handling

### Global Error Handler

```typescript
// server/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
  
  res.status(statusCode).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : message,
  });
};
```

### Custom Error Classes

```typescript
// server/utils/errors.ts
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}
```

## 📊 Logging e Monitoramento

### Logger Configuration

```typescript
// server/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### Request Logging Middleware

```typescript
// server/middleware/requestLogger.ts
import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const requestLogger: RequestHandler = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    });
  });
  
  next();
};
```

## 🚀 Performance Optimization

### Caching Strategy

```typescript
// server/middleware/cache.ts
import { RequestHandler } from "express";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes

export const cacheMiddleware = (duration: number = 300): RequestHandler => {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cached = cache.get(key);
    
    if (cached) {
      return res.json(cached);
    }
    
    // Override res.json to cache response
    const originalJson = res.json;
    res.json = function(data) {
      cache.set(key, data, duration);
      return originalJson.call(this, data);
    };
    
    next();
  };
};
```

### Database Connection Pooling

```typescript
// server/lib/database.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const query = (text: string, params?: any[]) => {
  const start = Date.now();
  
  return pool.query(text, params)
    .then(res => {
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: res.rowCount });
      return res;
    })
    .catch(err => {
      console.error('Database query error', { text, error: err.message });
      throw err;
    });
};
```

## 🧪 Testing Strategy

### Unit Tests

```typescript
// server/routes/__tests__/demo.test.ts
import request from 'supertest';
import { createServer } from '../index';

const app = createServer();

describe('API Routes', () => {
  describe('GET /api/ping', () => {
    it('should return ping message', async () => {
      const response = await request(app)
        .get('/api/ping')
        .expect(200);
      
      expect(response.body).toEqual({
        message: 'ping'
      });
    });
  });
  
  describe('GET /api/demo', () => {
    it('should return demo message', async () => {
      const response = await request(app)
        .get('/api/demo')
        .expect(200);
      
      expect(response.body).toEqual({
        message: 'Hello from Express server'
      });
    });
  });
});
```

### Integration Tests

```typescript
// server/__tests__/integration.test.ts
import request from 'supertest';
import { createServer } from '../index';
import { supabase } from '../lib/supabase';

const app = createServer();

describe('Integration Tests', () => {
  beforeEach(async () => {
    // Setup test data
    await supabase.from('posts').delete().neq('id', 'test');
  });
  
  afterEach(async () => {
    // Cleanup test data
    await supabase.from('posts').delete().neq('id', 'test');
  });
  
  it('should create and retrieve post', async () => {
    // Create post
    const createResponse = await request(app)
      .post('/api/posts')
      .send({
        title: 'Test Post',
        content: 'Test content',
        category_id: 1,
        published: true,
      })
      .expect(201);
    
    expect(createResponse.body.success).toBe(true);
    
    // Retrieve post
    const getResponse = await request(app)
      .get(`/api/posts/${createResponse.body.data.id}`)
      .expect(200);
    
    expect(getResponse.body.data.title).toBe('Test Post');
  });
});
```

## 🚀 Deployment

### Production Build

```typescript
// server/node-build.ts
import { createServer } from './index';

const app = createServer();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Environment Variables

```bash
# .env
NODE_ENV=production
PORT=3000

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Security
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=https://faeterj-rio.edu.br

# Logging
LOG_LEVEL=info

# Database (if using direct connection)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

### Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build:server

EXPOSE 3000

CMD ["npm", "start"]
```

### Health Check

```typescript
// server/routes/health.ts
import { RequestHandler } from "express";
import { supabase } from "../lib/supabase";

export const healthCheck: RequestHandler = async (req, res) => {
  try {
    // Check database connection
    const { error } = await supabase.from('posts').select('count').single();
    
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: error ? 'error' : 'connected',
      memory: process.memoryUsage(),
    };
    
    res.status(error ? 503 : 200).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    });
  }
};
```

---

Esta documentação cobre todos os aspectos do backend Express.js, garantindo uma base sólida e escalável para o portal FAETERJ Rio.
