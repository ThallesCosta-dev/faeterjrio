import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut, LayoutDashboard, FileText, GraduationCap, Users, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRole } from '@/hooks/useRole';
import { Badge } from '@/components/ui/badge';

export default function AdminLayout() {
  const { profile, role, loading, canManageUsers, isAdmin } = useRole();
  const navigate = useNavigate();

  console.log('AdminLayout - Profile:', profile);
  console.log('AdminLayout - Role:', role);
  console.log('AdminLayout - Loading:', loading);

  const handleLogout = async () => {
    const { supabase } = await import('@/lib/supabase');
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    console.log('AdminLayout - Sem profile, redirecionando para login');
    return <Navigate to="/admin/login" replace />;
  }

  // Redirecionar baseado no role
  if (role === 'viewer') {
    console.log('AdminLayout - Role viewer, redirecionando para home');
    return <Navigate to="/" replace />;
  }

  // Redirecionar admin para dashboard se não estiver em página específica
  if (role === 'admin' && window.location.pathname === '/admin') {
    console.log('AdminLayout - Admin redirecionado para dashboard');
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Redirecionar editor para editor se não estiver em página específica
  if (role === 'editor' && window.location.pathname === '/admin') {
    console.log('AdminLayout - Editor redirecionado para editor');
    return <Navigate to="/admin/editor" replace />;
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-primary" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-primary">FAETERJ-Rio CMS</h1>
                  <Badge variant={isAdmin ? "default" : "secondary"} className="text-xs">
                    {isAdmin ? <Shield className="w-3 h-3 mr-1" /> : null}
                    {role === 'admin' ? 'Admin' : role === 'editor' ? 'Editor' : 'Usuário'}
                  </Badge>
                </div>
                <p className="text-xs text-foreground/60">{profile.full_name || profile.institutional_email}</p>
              </div>
            </div>

            <nav className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/dashboard')}
                className={role === 'admin' ? 'bg-primary/10' : 'gap-2'}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
              
              {(role === 'admin' || role === 'editor') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/admin/editor')}
                  className={role === 'editor' ? 'bg-primary/10' : 'gap-2'}
                >
                  <FileText className="w-4 h-4" />
                  Novo Post
                </Button>
              )}
              
              {canManageUsers && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/admin/users')}
                  className="gap-2"
                >
                  <Users className="w-4 h-4" />
                  Usuários
                </Button>
              )}
            </nav>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="hidden sm:flex"
              >
                Ver Site
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-border">
        <div className="container mx-auto px-4 py-2">
          <div className="flex gap-2 overflow-x-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/dashboard')}
              className="gap-2 whitespace-nowrap"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/editor')}
              className="gap-2 whitespace-nowrap"
            >
              <FileText className="w-4 h-4" />
              Novo Post
            </Button>
            {canManageUsers && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/users')}
                className="gap-2 whitespace-nowrap"
              >
                <Users className="w-4 h-4" />
                Usuários
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto px-4 py-8"
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
