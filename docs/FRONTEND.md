# Frontend Documentation

Documentação completa do frontend React do portal FAETERJ Rio.

## 🎯 Visão Geral

O frontend é uma Single Page Application (SPA) moderna construída com React 18, TypeScript e Vite, oferecendo uma experiência de usuário excepcional com performance otimizada.

## 🛠️ Stack Tecnológico

### Core Technologies
- **React 18**: Component-based UI com hooks modernos
- **TypeScript**: Type safety e melhor DX
- **Vite**: Build tool ultra-rápido com HMR
- **React Router 6**: Navegação SPA com lazy loading

### Styling & UI
- **TailwindCSS 3**: Utility-first CSS framework
- **Radix UI**: Componentes acessíveis e customizáveis
- **Framer Motion**: Animações fluidas e micro-interações
- **Lucide React**: Icon library consistente

### State Management
- **React Query**: Server state management e caching
- **React Context**: Global state para tema e autenticação
- **Local State**: useState e hooks personalizados

### Development Tools
- **ESLint**: Code linting e qualidade
- **Prettier**: Code formatting consistente
- **Vitest**: Testing framework rápido
- **TypeScript**: Static type checking

## 📁 Estrutura de Componentes

### Componentes UI (`client/components/ui/`)

Baseado em **shadcn/ui**, oferece componentes reutilizáveis e acessíveis:

#### Principais Componentes
```typescript
// Botões com variantes
<Button variant="default" size="lg">
  Ação Principal
</Button>

// Cards para conteúdo
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>Conteúdo</CardContent>
</Card>

// Diálogos modais
<Dialog>
  <DialogTrigger>Abrir</DialogTrigger>
  <DialogContent>Conteúdo modal</DialogContent>
</Dialog>
```

#### Design System
- **Cores**: Paleta baseada no branding FAETERJ
- **Tipografia**: Fontes customizadas (faeterj-Semibold)
- **Espaçamento**: Sistema consistente com Tailwind
- **Animações**: Transições suaves com Framer Motion

### Componentes de Negócio

#### FloatingNavbar
**Arquivo**: `client/components/FloatingNavbar.tsx`

Navegação principal flutuante com comportamento responsivo:

```typescript
interface FloatingNavbarProps {
  // Sem props - componente autônomo
}

// Features:
- Scroll detection para mudança de estilo
- Menu mobile responsivo
- Links internos e externos
- Logo com cor dinâmica
- CTA button para Portal Coruja
```

**Estado Interno**:
```typescript
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const { scrolled, logoColor } = useLogoColor();
```

**Menu Items**:
```typescript
const menuItems = [
  { label: "Início", href: "/" },
  { label: "Institucional", href: "/about" },
  { label: "Ingresso", href: "/admission" },
  { label: "Ementas", href: "/matriz-ementas" },
  { label: "Central de Atendimento", href: "...", external: true },
  { label: "Estágio", href: "...", external: true },
];
```

#### HeroSection
**Arquivo**: `client/components/HeroSection.tsx`

Seção principal da homepage com design duotone:

```typescript
export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background com grid pattern */}
      <div className="absolute inset-0 duotone-overlay">
        {/* Grid pattern sutil */}
        {/* Gradient circles para profundidade */}
      </div>
      
      {/* Content */}
      <div className="relative container mx-auto">
        {/* Badge, título, descrição, CTA buttons */}
      </div>
    </section>
  );
}
```

**Features**:
- Background duotone com grid pattern
- Gradient circles para profundidade visual
- Layout responsivo
- CTA buttons com links externos
- Texto otimizado para SEO

#### AccessDock
**Arquivo**: `client/components/AccessDock.tsx`

Componente para acesso rápido a serviços principais:

```typescript
interface AccessDockProps {
  // Props para configuração de links
}
```

#### CoursesSection
**Arquivo**: `client/components/CoursesSection.tsx`

Seção de apresentação dos cursos oferecidos:

```typescript
interface CoursesSectionProps {
  // Configuração de cursos e categorias
}
```

## 📄 Sistema de Páginas

### Arquitetura de Rotas

**Arquivo**: `client/App.tsx`

```typescript
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          
          {/* Rotas CMS */}
          <Route path="/comunicados" element={<Layout><ComunicadosPage /></Layout>} />
          
          {/* Rotas Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
```

### Layout System

```typescript
interface LayoutProps {
  children: React.ReactNode;
  hideNavbar?: boolean;
}

const Layout = ({ children, hideNavbar = false }: LayoutProps) => (
  <div className="flex flex-col min-h-screen">
    {!hideNavbar && <FloatingNavbar />}
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);
```

### Páginas Públicas

#### Index (Home)
**Arquivo**: `client/pages/Index.tsx`

Página principal com:
- HeroSection animada
- Carrossel de informações
- AccessDock para acesso rápido
- CoursesSection
- Seções institucionais

#### AboutPage
**Arquivo**: `client/pages/AboutPage.tsx`

Informações institucionais sobre a FAETERJ-Rio.

#### AdmissionPage
**Arquivo**: `client/pages/AdmissionPage.tsx`

Processos de admissão e vestibular.

#### ComunicadosPage
**Arquivo**: `client/pages/ComunicadosPage.tsx`

Lista de comunicados e notícias públicas:
- Grid de cards com posts
- Paginação otimizada
- Filtros por categoria
- Busca integrada

```typescript
interface ComunicadosPageProps {
  // Sem props - busca dados via API
}

// Features:
- Listagem de posts do Supabase
- Paginação infinita
- Filtros dinâmicos
- Loading states
- Error handling
```

### Sistema Administrativo

#### AdminLayout
**Arquivo**: `client/pages/admin/AdminLayout.tsx`

Layout dedicado para área administrativa:

```typescript
interface AdminLayoutProps {
  children: React.ReactNode;
}

// Features:
- Sidebar navigation
- Header com user menu
- Protected routes
- Responsive design
```

#### AdminDashboard
**Arquivo**: `client/pages/admin/AdminDashboard.tsx`

Painel de controle com:
- Estatísticas em tempo real
- Gráficos e métricas
- Ações rápidas
- Recent activity

#### AdminEditor
**Arquivo**: `client/pages/admin/AdminEditor.tsx`

Editor completo para posts:
- Rich text editor
- Upload de imagens
- Preview em tempo real
- Autosave
- SEO metadata

```typescript
interface AdminEditorProps {
  // ID opcional para edição
  id?: string;
}

// Features:
- Criar/editar posts
- Upload de imagens para Supabase Storage
- Rich text com toolbar
- Categories e tags
- Programação de publicação
- Preview mode
```

## 🎣 Hooks Personalizados

### useLogoColor
**Arquivo**: `client/hooks/useLogoColor.ts`

Hook para detectar scroll e ajustar cores do logo:

```typescript
interface UseLogoColorReturn {
  scrolled: boolean;
  logoColor: string;
}

export function useLogoColor(): UseLogoColorReturn {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return {
    scrolled,
    logoColor: scrolled ? '#primary' : '#ffffff'
  };
}
```

### useToast
**Arquivo**: `client/hooks/use-toast.ts**

Sistema de notificações toast:

```typescript
interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const toast = (props: Omit<Toast, 'id'>) => {
    const id = generateId();
    setToasts(prev => [...prev, { ...props, id }]);
  };
  
  return { toast, toasts };
}
```

### useMobile
**Arquivo**: `client/hooks/use-mobile.tsx`

Hook para detecção de dispositivos móveis:

```typescript
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return isMobile;
}
```

## 🎨 Sistema de Estilos

### TailwindCSS Configuration

**Arquivo**: `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./client/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        primary: 'hsl(var(--primary))',
        // Cores customizadas FAETERJ
        faeterj: {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        faeterj: ['faeterj-Semibold', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
```

### CSS Custom Properties

**Arquivo**: `client/global.css`

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --border: 214.3 31.8% 91.4%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}

/* Duotone effect */
.duotone-overlay {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
}

/* Grid pattern */
.grid-pattern {
  background-image: 
    linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.1) 25%, ...);
}
```

## 🔄 State Management

### React Query Configuration

```typescript
// client/lib/react-query.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});
```

### Exemplo de Uso

```typescript
// Hook para buscar posts
export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

// No componente
function PostsList() {
  const { data: posts, isLoading, error } = usePosts();
  
  if (isLoading) return <PostsSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      {posts?.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

## 🎯 Performance Optimization

### Code Splitting

```typescript
// Lazy loading de componentes
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminEditor = lazy(() => import('./pages/admin/AdminEditor'));

// No router
<Suspense fallback={<LoadingSpinner />}>
  <Route path="dashboard" element={<AdminDashboard />} />
</Suspense>
```

### Image Optimization

```typescript
// Componente de imagem otimizada
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height 
}: OptimizedImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className="object-cover"
    />
  );
}
```

### Bundle Analysis

```bash
# Analisar bundle size
pnpm build -- --analyze

# Resultado esperado:
- Main bundle: < 200KB gzipped
- Vendor chunks: separados
- Total: < 500KB initial load
```

## 🧪 Testing Strategy

### Component Testing

```typescript
// client/components/__tests__/FloatingNavbar.test.tsx
import { render, screen } from '@testing-library/react';
import { FloatingNavbar } from '../FloatingNavbar';

describe('FloatingNavbar', () => {
  it('renders logo and navigation items', () => {
    render(<FloatingNavbar />);
    
    expect(screen.getByAltText('FAETERJ Logo')).toBeInTheDocument();
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Portal Coruja')).toBeInTheDocument();
  });
  
  it('toggles mobile menu', () => {
    render(<FloatingNavbar />);
    
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(menuButton);
    
    expect(screen.getByText('Institucional')).toBeInTheDocument();
  });
});
```

### Integration Testing

```typescript
// client/pages/__tests__/ComunicadosPage.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { ComunicadosPage } from '../ComunicadosPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe('ComunicadosPage', () => {
  it('displays posts list', async () => {
    const queryClient = createTestQueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <ComunicadosPage />
      </QueryClientProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Comunicados')).toBeInTheDocument();
    });
  });
});
```

## 🚀 Deployment Considerations

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
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-button'],
        },
      },
    },
  },
});
```

### Environment Variables

```typescript
// client/env.ts
export const env = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  VITE_API_URL: import.meta.env.VITE_API_URL,
};
```

### Production Checklist

- [ ] Minificação de CSS e JS
- [ ] Image optimization
- [ ] Service Worker para cache
- [ ] Meta tags SEO
- [ ] Analytics integration
- [ ] Error monitoring
- [ ] Performance monitoring

---

Esta documentação cobre todos os aspectos do frontend React, garantindo manutenibilidade e escalabilidade do portal FAETERJ Rio.
