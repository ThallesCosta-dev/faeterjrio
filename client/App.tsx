import "./global.css";



import { Suspense, lazy } from "react";

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



const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));

const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

const AdminEditor = lazy(() => import("./pages/admin/AdminEditor"));

const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));

const AdminSetup = lazy(() => import("./pages/admin/AdminSetup"));



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

        <Suspense fallback={<div className="min-h-screen" />}>

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

      </BrowserRouter>

    </TooltipProvider>

  </QueryClientProvider>

);



createRoot(document.getElementById("root")!).render(<App />);

