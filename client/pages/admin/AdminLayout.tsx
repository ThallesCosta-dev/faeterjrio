import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, LogOut, LayoutDashboard, FileText, GraduationCap, Users, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRole } from '@/hooks/useRole';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminLayout() {
  const { profile, role, loading, canManageUsers, isAdmin } = useRole();
  const navigate = useNavigate();
  const location = useLocation();

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
  if (loading || !role) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (role === 'viewer') {
    return <Navigate to="/" replace />;
  }

  // Redirecionar baseado no path atual
  const currentPath = window.location.pathname;
  
  if (role === 'admin' && currentPath === '/admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (role === 'editor' && currentPath === '/admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col overflow-y-auto">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8" />
            <div>
              <h1 className="font-bold text-white">FAETERJ-Rio CMS</h1>
              <p className="text-xs text-white/60">Content Management</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {profile?.full_name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{profile?.full_name || 'Admin'}</p>
              <Badge variant={isAdmin ? "default" : "secondary"} className="text-xs mt-1">
                {role === 'admin' ? 'Admin' : role === 'editor' ? 'Editor' : 'Usuário'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavButton
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Dashboard"
            onClick={() => navigate('/admin/dashboard')}
            active={isActive('/admin/dashboard')}
          />

          {(role === 'admin' || role === 'editor') && (
            <NavButton
              icon={<FileText className="w-5 h-5" />}
              label="Novo Post"
              onClick={() => navigate('/admin/editor')}
              active={isActive('/admin/editor')}
            />
          )}

          {canManageUsers && (
            <NavButton
              icon={<Users className="w-5 h-5" />}
              label="Usuários"
              onClick={() => navigate('/admin/users')}
              active={isActive('/admin/users')}
            />
          )}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <Button
            onClick={handleLogout}
            className="w-full gap-2 bg-white/10 hover:bg-white/20 text-white"
            variant="ghost"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto"
        >
          <div className="p-8">
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
}

function NavButton({
  icon,
  label,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
        active
          ? 'bg-primary text-white'
          : 'text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
