import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRole } from '@/hooks/useRole';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  const { profile, role, loading, canManageUsers } = useRole();
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

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar
        profile={profile}
        role={role}
        canManageUsers={canManageUsers}
        onLogout={handleLogout}
      />

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
