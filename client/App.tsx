import "./global.css";



import { Component, Suspense, lazy } from "react";

import type { ErrorInfo, ReactNode } from "react";

import { Loader2 } from "lucide-react";

import { Toaster } from "@/components/ui/toaster";

import { createRoot } from "react-dom/client";

import { Toaster as Sonner } from "@/components/ui/sonner";

import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { FloatingNavbar } from "./components/FloatingNavbar";

import { Footer } from "./components/Footer";

import { PlaceholderPage } from "./components/PlaceholderPage";

import Index from "./pages/Index";

import MatrizEmentas from "./pages/MatrizEmentas";

import AdmissionPage from "./pages/AdmissionPage";

import AboutPage from "./pages/AboutPage";

import GradeDeHorarios from "./pages/GradeDeHorarios";

import LoginCoruja from "./pages/LoginCoruja";

import NotFound from "./pages/NotFound";

import ComunicadosPage from "./pages/ComunicadosPage";

import PostDetailPage from "./pages/PostDetailPage";



// Recarrega a página uma vez quando um chunk falha ao carregar (ex: build novo
// no servidor invalidou os arquivos com hash antigos que o navegador tinha em cache)
const lazyWithRetry = (factory: () => Promise<{ default: React.ComponentType<any> }>) =>
  lazy(async () => {
    try {
      const module = await factory();
      sessionStorage.removeItem("chunk-reload");
      return module;
    } catch (error) {
      if (!sessionStorage.getItem("chunk-reload")) {
        sessionStorage.setItem("chunk-reload", "1");
        window.location.reload();
        return new Promise(() => {}) as never;
      }
      throw error;
    }
  });

const AdminLogin = lazyWithRetry(() => import("./pages/admin/AdminLogin"));

const AdminLayout = lazyWithRetry(() => import("./pages/admin/AdminLayout"));

const AdminDashboard = lazyWithRetry(() => import("./pages/admin/AdminDashboard"));

const AdminEditor = lazyWithRetry(() => import("./pages/admin/AdminEditor"));

const AdminUsers = lazyWithRetry(() => import("./pages/admin/AdminUsers"));

const AdminSetup = lazyWithRetry(() => import("./pages/admin/AdminSetup"));

const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-3">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
    <p className="text-sm text-foreground/60">Carregando...</p>
  </div>
);

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Erro não tratado na aplicação:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 text-center">
          <h1 className="text-2xl font-bold">Algo deu errado</h1>
          <p className="text-foreground/60 max-w-md">
            Ocorreu um erro inesperado ao carregar a página. Tente recarregar.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Recarregar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}



const queryClient = new QueryClient();



const Layout = ({

  children,

  hideNavbar = false,

}: {

  children: React.ReactNode;

  hideNavbar?: boolean;

}) => (

  <div className="flex flex-col min-h-screen">

    {!hideNavbar && <FloatingNavbar />}

    <main className="flex-1">{children}</main>

    <Footer />

  </div>

);



const App = () => (

  <QueryClientProvider client={queryClient}>

    <TooltipProvider>

      <Toaster />

      <Sonner />

      <BrowserRouter>

        <ErrorBoundary>

        <Suspense fallback={<PageLoader />}>

          <Routes>

          <Route

            path="/"

            element={

              <Layout>

                <Index />

              </Layout>

            }

          />

          <Route

            path="/matriz-ementas"

            element={

              <Layout>

                <MatrizEmentas />

              </Layout>

            }

          />

          <Route path="/matriz-ementas.html" element={<Navigate to="/matriz-ementas" replace />} />

          <Route

            path="/grade-de-horarios"

            element={

              <Layout>

                <GradeDeHorarios />

              </Layout>

            }

          />

          <Route

            path="/admissao"

            element={

              <Layout>

                <AdmissionPage />

              </Layout>

            }

          />

          <Route path="/admission" element={<Navigate to="/admissao" replace />} />

          <Route

            path="/coruja"

            element={

              <Layout hideNavbar={true}>

                <LoginCoruja />

              </Layout>

            }

          />

          <Route

            path="/sobre"

            element={

              <Layout>

                <AboutPage />

              </Layout>

            }

          />

          <Route path="/about" element={<Navigate to="/sobre" replace />} />

          <Route

            path="/cursos"

            element={

              <Layout>

                <PlaceholderPage

                  title="Nossos Cursos"

                  description="Explore toda a gama de programas educacionais que oferecemos."

                />

              </Layout>

            }

          />

          <Route path="/courses" element={<Navigate to="/cursos" replace />} />

          <Route

            path="/contato"

            element={

              <Layout>

                <PlaceholderPage

                  title="Entre em Contato"

                  description="Fale conosco para informações adicionais ou dúvidas."

                />

              </Layout>

            }

          />

          <Route path="/contact" element={<Navigate to="/contato" replace />} />

          {/* CMS - Public Routes */}

          <Route

            path="/comunicados"

            element={

              <Layout>

                <ComunicadosPage />

              </Layout>

            }

          />

          <Route

            path="/comunicados/:slug"

            element={

              <Layout>

                <PostDetailPage />

              </Layout>

            }

          />

          {/* CMS - Admin Routes */}

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/admin/setup" element={<AdminSetup />} />

          <Route path="/admin" element={<AdminLayout />}>

            <Route path="dashboard" element={<AdminDashboard />} />

            <Route path="editor" element={<AdminEditor />} />

            <Route path="users" element={<AdminUsers />} />

          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}

          <Route

            path="*"

            element={

              <Layout>

                <NotFound />

              </Layout>

            }

          />

          </Routes>

        </Suspense>

        </ErrorBoundary>

      </BrowserRouter>

    </TooltipProvider>

  </QueryClientProvider>

);



createRoot(document.getElementById("root")!).render(<App />);

