import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FloatingNavbar } from "./components/FloatingNavbar";
import { Footer } from "./components/Footer";
import { PlaceholderPage } from "./components/PlaceholderPage";
import Index from "./pages/Index";
import MatrizEmentas from "./pages/MatrizEmentas";
import AdmissionPage from "./pages/AdmissionPage";
import AboutPage from "./pages/AboutPage";
import LoginCoruja from "./pages/LoginCoruja";
import NotFound from "./pages/NotFound";
import ComunicadosPage from "./pages/ComunicadosPage";
import PostDetailPage from "./pages/PostDetailPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEditor from "./pages/admin/AdminEditor";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSetup from "./pages/admin/AdminSetup";

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
          <Route
            path="/admission"
            element={
              <Layout>
                <AdmissionPage />
              </Layout>
            }
          />
          <Route
            path="/coruja"
            element={
              <Layout hideNavbar={true}>
                <LoginCoruja />
              </Layout>
            }
          />
          <Route
            path="/about"
            element={
              <Layout>
                <AboutPage />
              </Layout>
            }
          />
          <Route
            path="/courses"
            element={
              <Layout>
                <PlaceholderPage
                  title="Nossos Cursos"
                  description="Explore toda a gama de programas educacionais que oferecemos."
                />
              </Layout>
            }
          />
          <Route
            path="/contact"
            element={
              <Layout>
                <PlaceholderPage
                  title="Entre em Contato"
                  description="Fale conosco para informações adicionais ou dúvidas."
                />
              </Layout>
            }
          />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
